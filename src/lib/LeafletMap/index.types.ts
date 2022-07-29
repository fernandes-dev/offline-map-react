import {LatLng} from "leaflet";

export interface ICoords {
  lat: number
  lng: number
}

export interface ICheckpoint {
  id: number
  position: Pick<LatLng, 'lat' | 'lng'>
  text?: string
}

export type IPosition = Pick<LatLng, 'lat' | 'lng'>

export interface ILeafletMapProps {
  currentPosition?: IPosition | undefined
  checkpoints: ICheckpoint[]
  checkpointIconUrl?: string | null | undefined
  parentWindow?: Window
}

export interface IHeatPoint {
  lat: number
  lng: number
  intensity: number
}
