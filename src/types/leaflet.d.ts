/* eslint-disable no-unused-vars */
declare namespace L {
  export interface OfflineTile {
    createdAt: number
    key: string
    url: string
    urlTemplate: string
    x: number
    y: number
    z: number
  }

  export interface OfflineLayer {
    lengthLoaded: number
    lengthSaved: number
    lengthToBeSaved: number
    storagesize: number
    _tilesforSave: OfflineTile[]
  }

  export interface SaveTileEnd {
    lengthLoaded: number
    lengthSaved: number
    lengthToBeSaved: number
    type: 'savetileend'
    _tilesforSave: OfflineTile[]
  }

  export interface CustomLayer {
    addTo(map: L.Map): void
  }

  export interface tileLayerOffline extends CustomLayer {
    on(event: 'savetileend' | 'savestart', callback: (e: SaveTileEnd) => void)
  }

  export interface Layer {
    _tilesforSave: number[]
  }

  declare namespace tileLayer {
    export function offline(...args): tileLayerOffline
  }

  declare namespace control {
    export function savetiles(
      arg1: tileLayerOffline,
      arg2: {
        zoomlevels: number[]
        confirm: (l: OfflineLayer, c: () => void) => void
        confirmRemoval: (l: OfflineLayer, c: () => void) => void
        saveText: string
        rmText: string
      }
    ): tileLayerOffline

    export function locate(...args): CustomLayer
  }
}
