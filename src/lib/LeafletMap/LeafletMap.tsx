/* eslint-disable no-alert */
import {MapContainer, TileLayer} from 'react-leaflet'
import React, {ReactNode, useEffect, useState} from 'react'
import Leaflet from 'leaflet'

import './index.css'

import 'leaflet.offline'
import 'leaflet.locatecontrol'
import 'leaflet-heat-local'

import {MakeTileLayerOffline} from '../functions/'
import {IHeatPoint, ILeafletMapProps, IPosition} from "./index.types";
import CheckpointMarker from "../CheckpointMarker";

const DEFAULT_MAP_ZOOM = 16

function LeafletMap({
                      currentPosition,
                      checkpoints,
                      checkpointIconUrl,
                      parentWindow,
                      heatPoints,
                      maxMapZoom = DEFAULT_MAP_ZOOM
                    }: ILeafletMapProps) {
  const thisWindow: Window = parentWindow || window

  const [_map, _setMap] = useState<Leaflet.Map>()
  const [_userPosition, _setUserPosition] = useState<IPosition | undefined>(currentPosition)

  const [_existsMapControls, _setExistsMapControls] = useState<boolean>()

  const [_mapPolyline, _setMapPolyline] = useState<Leaflet.Polyline<any, any> | undefined>()
  const [_polylines, _setPolylines] = useState<IPosition[][]>([])

  const [_progressSaveMap, _setProgressSaveMap] = useState(0)
  const [_totalLayersToSave, _setTotalLayersToSave] = useState(0)
  const [_heatPoints, _setHeatPoints] = useState<IHeatPoint[]>(heatPoints || [])
  const [_accuracy, _setAccuracy] = useState<number>()


  function navigateToPosition(position = _userPosition, zoomLevel = DEFAULT_MAP_ZOOM): void {
    if (position) _map?.setView(position, zoomLevel)
  }

  function verifyPolylineExists(destiny: IPosition): boolean {
    if (!_userPosition) return false

    const existsPolyline = _polylines.find(p =>
      p.find(p2 => String(p2.lng) === String(destiny.lng) && String(p2.lat) === String(destiny.lat))
    )

    return !!existsPolyline
  }

  let heatLayer: any

  function addHeatLayer() {
    // @ts-ignore
    heatLayer = Leaflet.heatLayer(_heatPoints, {radius: 50, blur: 25}).addTo(_map)
  }

  function handleSetHeatPoints(heatPoints: IHeatPoint[]) {
    heatLayer?.setLatLngs(heatPoints)

    _setHeatPoints(heatPoints)
  }

  function handleAddPolyline(destiny: IPosition): void {
    if (!_map) return

    const existsPolyline = verifyPolylineExists(destiny)

    if (existsPolyline || !_userPosition) return

    if (_mapPolyline) {
      _mapPolyline.setLatLngs([[destiny, _userPosition]])

      _map.fitBounds(_mapPolyline.getBounds())
    } else {
      const polyline = Leaflet.polyline([[destiny, _userPosition]], {color: 'red'})

      polyline.addTo(_map)

      _setMapPolyline(polyline)
      _map.fitBounds(polyline.getBounds())
    }

    _setPolylines([[destiny, _userPosition]])
  }

  function handleRemovePolyline() {
    if (!_map) return

    _mapPolyline?.setLatLngs([])

    _setPolylines([])
  }

  const calibrateGpsTutorial = () => {
    return <>
       <span id="calibrate-gps-message">
          A precisão do GPS está muito baixa, por favor, tente calibrar o GPS do seu dispositivo.
        </span>
      <img id="calibrate-gps-image" src="https://i.imgur.com/yEu6fEF.gif" alt="calibrar gps"/>
    </>
  }

  const renderCheckpoints = () => {
    return (
      checkpoints.length > 0 &&
      checkpoints.map(marker => (
        <CheckpointMarker
          key={marker.id}
          marker={marker}
          positionToCompare={_userPosition}
          iconUrl={checkpointIconUrl}
          onClick={() => handleAddPolyline(marker.position)}
          greenCheckpoint={marker.alreadyCollected}
          checkPointDetails={() => {
            return (
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
                  <button type="button" onClick={() => handleRemovePolyline()}>
                    Excluir rota
                  </button>
                )}
              </>
            )
          }}
        />
      ))
    )
  }

  const renderMap = (...children: ReactNode[]) => {
    useEffect(() => {
      if (!_userPosition) {
        thisWindow.navigator.geolocation.getCurrentPosition(position => _setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }))
      }

      navigator.geolocation.watchPosition(a => {
        _setAccuracy(Math.floor(a.coords.accuracy))
      })
    }, [])

    useEffect(() => {
      if (_progressSaveMap >= _totalLayersToSave) {
        _setProgressSaveMap(0)
        _setTotalLayersToSave(0)
      }
    }, [_progressSaveMap])

    useEffect(() => {
      if (_map && !_existsMapControls) {
        addOfflineMapControls()
        addUserLocationHandler()
        addHeatLayer()
      }

      return () => {
        _setExistsMapControls(false)
      }
    }, [_map])

    return (
      _userPosition && (
        <MapContainer id="map" center={_userPosition} zoom={13} maxZoom={maxMapZoom} ref={_setMap}
                      scrollWheelZoom={true}>
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

        _setUserPosition(currentPosition)
      })
    else thisWindow.alert('Seu dispositivo não tem suporte a geolocalização')
  }

  function addOfflineMapControls(): void {
    if (!_map || _existsMapControls) return

    const tileLayerOffline = MakeTileLayerOffline({leaflet: Leaflet, map: _map})

    tileLayerOffline?.on('savestart', e => {
      _setTotalLayersToSave(e.lengthToBeSaved)
    })

    tileLayerOffline?.on('savetileend', () => {
      _setProgressSaveMap(currentProgress => currentProgress + 1)
    })

    _setExistsMapControls(true)
  }

  function offlineMapControls() {
    return {
      saveCurrentMapView: () => {
        const a = document.getElementsByClassName('savetiles')

        ;(a[1] as any)?.click()
      },
      deleteCurrentMapView: () => {
        const b = document.getElementsByClassName('rmtiles')

        ;(b[0] as any)?.click()

        _setTotalLayersToSave(0)
      },
      toggleUserLocation: () => {
        const b = document.getElementsByClassName('leaflet-control-locate-location-arrow')

        ;(b[0] as any)?.click()
      }
    }
  }

  function resetHeatLayerRender() {
    const elements = document.getElementsByClassName('leaflet-pane leaflet-overlay-pane')

    ;(elements?.[0] as any)?.click()
  }

  function addUserLocationHandler(): void {
    if (!_map) return

    Leaflet.control
      .locate({
        strings: {
          popup: ({distance}: { distance: number; unit: number }) => `você está a ${distance} metros deste ponto.`,
        },
      })
      .addTo(_map)

    _map.on('locationfound', e => {
      _setUserPosition(e.latlng)
    })

    _map.on('click', (e: any) => {
      if (e?.originalEvent?.pointerType !== '') return

      handleSetHeatPoints(heatPoints)
    })

  }

  return {
    renderMap,
    setMapViewOnUserLocation,
    navigateToPosition,
    resetHeatLayerRender,
    setHeatPoints: handleSetHeatPoints,
    heatPoints: _heatPoints,
    heatLayer,
    progressSaveMap: _progressSaveMap,
    totalLayersToSave: _totalLayersToSave,
    userPosition: _userPosition,
    map: _map,
    offlineMapControls,
    calibrateGpsTutorial,
    accuracy: _accuracy,
  }
}

export default LeafletMap
