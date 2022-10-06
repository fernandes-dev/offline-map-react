/* eslint-disable no-alert */
import {MapContainer, TileLayer} from 'react-leaflet'
import React, {ReactNode, useEffect, useState} from 'react'
import Leaflet from 'leaflet'

import 'leaflet.offline'
import 'leaflet.locatecontrol'
import 'leaflet-heat-local'

import {MakeTileLayerOffline} from '../functions/'
import {IHeatPoint, ILeafletMapProps, IPosition} from "./index.types";
import CheckpointMarker from "../CheckpointMarker";

function LeafletMap({currentPosition, checkpoints, checkpointIconUrl, parentWindow, heatPoints: heatPointsProp}: ILeafletMapProps) {
  const thisWindow: Window = parentWindow || window

  const [map, setMap] = useState<Leaflet.Map>()
  const [userPosition, setUserPosition] = useState<IPosition | undefined>(currentPosition)

  const [existsMapControls, setExistsMapControls] = useState<boolean>()

  const [mapPolyline, setMapPolyline] = useState<Leaflet.Polyline<any, any> | undefined>()
  const [polylines, setPolylines] = useState<IPosition[][]>([])

  const [progressSaveMap, setProgressSaveMap] = useState(0)
  const [totalLayersToSave, setTotalLayersToSave] = useState(0)
  const [heatPoints, setHeatPoints] = useState<IHeatPoint[]>(heatPointsProp || [])


  function navigateToPosition(data: IPosition, zoomLevel?: number): void {
    if (data) map?.setView(data, zoomLevel || map.getZoom())
  }

  function verifyPolylineExists(destiny: IPosition): boolean {
    if (!userPosition) return false

    const existsPolyline = polylines.find(p =>
      p.find(p2 => String(p2.lng) === String(destiny.lng) && String(p2.lat) === String(destiny.lat))
    )

    return !!existsPolyline
  }

  let heatLayer: any

  function addHeatLayer() {
    // @ts-ignore
    heatLayer = Leaflet.heatLayer(heatPoints, {radius: 50, blur: 25}).addTo(map)
  }

  function addHeatPoints(heatPoints: IHeatPoint[]) {
    heatLayer?.setLatLngs(heatPoints)

    setHeatPoints(heatPoints)
  }

  function handleAddPolyline(destiny: IPosition): void {
    if (!map) return

    const existsPolyline = verifyPolylineExists(destiny)

    if (existsPolyline || !userPosition) return

    if (mapPolyline) {
      mapPolyline.setLatLngs([...polylines, [destiny, userPosition]])

      map.fitBounds(mapPolyline.getBounds())
    } else {
      const polyline = Leaflet.polyline([...polylines, [destiny, userPosition]], {color: 'red'})

      polyline.addTo(map)

      setMapPolyline(polyline)
      map.fitBounds(polyline.getBounds())
    }

    setPolylines([...polylines, [destiny, userPosition]])
  }

  function handleRemovePolyline(destiny: IPosition) {
    if (!map) return

    const polygonIndex = polylines.findIndex(p =>
      p.find(p2 => String(p2.lng) === String(destiny.lng) && String(p2.lat) === String(destiny.lat))
    )

    const newPolylines = [...polylines]
    newPolylines.splice(polygonIndex, 1)

    mapPolyline?.setLatLngs(newPolylines)

    setPolylines(newPolylines)
  }

  const renderCheckpoints = () => {
    return (
      checkpoints.length > 0 &&
      checkpoints.map(marker => (
        <CheckpointMarker
          key={marker.id}
          marker={marker}
          positionToCompare={userPosition}
          iconUrl={checkpointIconUrl}
          checkPointDetails={
            <>
              <h3>{marker.text}</h3>
              <div>
                <b>Coordenadas</b>
              </div>
              <div>latitude: {marker.position.lat}</div>
              <div>longitude: {marker.position.lng}</div>
              {!verifyPolylineExists(marker.position) ? (
                <button type="button" onClick={() => handleAddPolyline(marker.position)}>
                  Marcar rota
                </button>
              ) : (
                <button type="button" onClick={() => handleRemovePolyline(marker.position)}>
                  Excluir rota
                </button>
              )}
            </>
          }
        />
      ))
    )
  }

  const renderMap = (...children: ReactNode[]) => {
    useEffect(() => {
      if (!userPosition) {
        thisWindow.navigator.geolocation.getCurrentPosition(position => setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }))
      }
    }, [])

    useEffect(() => {
      if (map && !existsMapControls) {
        addOfflineMapControls()
        addUserLocationHandler()
        addHeatLayer()
      }

      return () => {
        setExistsMapControls(false)
      }
    }, [map])

    return (
      userPosition && (
        <MapContainer id="map" center={userPosition} zoom={13} ref={setMap} scrollWheelZoom={true}>
          <TileLayer
            id="mapbox/streets-v11"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {children?.length > 0 && children}
          {renderCheckpoints()}
        </MapContainer>
      )
    )
  }

  function setMapViewOnUserLocation(): void {
    if (thisWindow.navigator.geolocation)
      thisWindow.navigator.geolocation.getCurrentPosition(e => {
        const currentPosition = {lng: e.coords.longitude, lat: e.coords.latitude}

        setUserPosition(currentPosition)
      })
    else thisWindow.alert('Seu dispositivo não tem suporte a geolocalização')
  }

  function addOfflineMapControls(): void {
    if (!map || existsMapControls) return

    const tileLayerOffline = MakeTileLayerOffline({leaflet: Leaflet, map})

    tileLayerOffline?.on('savestart', e => {
      setTotalLayersToSave(e.lengthToBeSaved)
    })

    tileLayerOffline?.on('savetileend', () => {
      setProgressSaveMap(currentProgress => currentProgress + 1)
    })

    setExistsMapControls(true)
  }

  function addUserLocationHandler(): void {
    if (!map) return

    Leaflet.control
      .locate({
        strings: {
          popup: ({distance}: { distance: number; unit: number }) => `você está a ${distance} metros deste ponto.`,
        },
      })
      .addTo(map)

    map.on('locationfound', e => {
      setUserPosition(e.latlng)
    })
  }

  return {
    renderMap,
    setMapViewOnUserLocation,
    navigateToPosition,
    addHeatPoints,
    heatPoints,
    heatLayer,
    progressSaveMap,
    totalLayersToSave,
    userPosition,
    map
  }
}

export default LeafletMap
