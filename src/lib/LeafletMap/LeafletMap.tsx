/* eslint-disable no-alert */
import {MapContainer, TileLayer} from 'react-leaflet'
import React from 'react'
import Leaflet from 'leaflet'

import 'leaflet.offline'
import 'leaflet.locatecontrol'
import 'leaflet.webgl-temperature-map'
// import '../../externals/LeafletHeat/LeafletHeat.js'

import {MakeTileLayerOffline} from '../functions/TileLayerOffline'
import {ILeafletMapProps, IPosition} from "./index.types";
import CheckpointMarker from "../CheckpointMarker";

function LeafletMap({
                      positionState: {position, setPosition},
                      checkpointState: {checkpoints},
                      mapPolylineState: {mapPolyline, setMapPolyline},
                      polylineState: {polylines, setPolylines},
                      progressSaveMapState: {setProgressSaveMap},
                      totalLayerToSaveState: {setTotalLayersToSave,},
                      mapState: {map, setMap},
                      existsMapControlsState: {existsMapControls, setExistsMapControls}
                    }: ILeafletMapProps) {

  function navigatoTePosition(data: IPosition, zoomLevel?: number): void {
    if (data) map?.setView(data, zoomLevel || map.getZoom())
  }

  function verifyPolylineExists(destiny: IPosition): boolean {
    if (!position) return false

    const existsPolyline = polylines.find(p =>
      p.find(p2 => String(p2.lng) === String(destiny.lng) && String(p2.lat) === String(destiny.lat))
    )

    return !!existsPolyline
  }

  function handleAddPolyline(destiny: IPosition): void {
    if (!map) return

    const existsPolyline = verifyPolylineExists(destiny)

    if (existsPolyline || !position) return

    if (mapPolyline) {
      mapPolyline.setLatLngs([...polylines, [destiny, position]])

      map.fitBounds(mapPolyline.getBounds())
    } else {
      const polyline = Leaflet.polyline([...polylines, [destiny, position]], {color: 'red'})

      polyline.addTo(map)

      setMapPolyline(polyline)
      map.fitBounds(polyline.getBounds())
    }

    setPolylines([...polylines, [destiny, position]])
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
          positionToCompare={position}
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

  const renderMap = () => {
    return (
      position && (
        <MapContainer id="map" center={position} zoom={13} ref={setMap} scrollWheelZoom={false}>
          <TileLayer
            id="mapbox/streets-v11"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {renderCheckpoints()}
        </MapContainer>
      )
    )
  }

  function setMapViewOnUserLocation(): void {
    if (window.navigator.geolocation)
      navigator.geolocation.getCurrentPosition(e => {
        const currentPosition = {lng: e.coords.longitude, lat: e.coords.latitude}

        setPosition(currentPosition)
      })
    else window.alert('Seu dispositivo não tem suporte a geolocalização')
  }

  function addOfflineMapControls(): void {
    if (map && !existsMapControls) {
      const tileLayerOffline = MakeTileLayerOffline({leaflet: Leaflet, map})

      tileLayerOffline?.on('savestart', e => {
        setTotalLayersToSave(e.lengthToBeSaved)
      })

      tileLayerOffline?.on('savetileend', () => {
        setProgressSaveMap(currentProgress => currentProgress + 1)
      })

      const points = [
        ...checkpoints.map(c => {
          return [Number(c?.position.lat), Number(c?.position.lng), 50]
        }),
      ]

      // @ts-ignore
      Leaflet.heatLayer(points, {radius: 50}).addTo(map)

      setExistsMapControls(true)
    }
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
      setPosition(e.latlng)
    })
  }

  return {renderMap, setMapViewOnUserLocation, navigatoTePosition, addOfflineMapControls, addUserLocationHandler}
}

export default LeafletMap
