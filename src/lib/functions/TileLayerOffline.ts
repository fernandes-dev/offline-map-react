import Leaflet from 'leaflet'
import {IMakeTileLayerOfflineProps} from "./index.types";

export default function MakeTileLayerOffline({map,leaflet,}: IMakeTileLayerOfflineProps): Leaflet.tileLayerOffline | undefined {
  if (!leaflet.tileLayer?.offline) return undefined

  const tileLayerOffline = leaflet.tileLayer?.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 13,
  })

  tileLayerOffline.addTo(map)

  const controlSaveTiles = leaflet.control.savetiles(tileLayerOffline, {
    zoomlevels: [13, 14, 15, 16],
    confirm(layer, succescallback) {
      // eslint-disable-next-line no-alert
      if (window.confirm(`Salvar ${layer._tilesforSave.length} blocos do mapa`)) {
        succescallback()
      }
    },
    confirmRemoval(_, successCallback) {
      // eslint-disable-next-line no-alert
      if (window.confirm('Deseja remover o mapa da memória do seu dispositivo?')) {
        successCallback()
      }
    },
    saveText: 'salvar',
    rmText: 'excluir',
  })

  controlSaveTiles.addTo(map!)

  return tileLayerOffline
}
