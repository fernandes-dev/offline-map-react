import {LatLng} from "leaflet";

export interface ICoords {
  lat: number
  lng: number
}

export interface ICheckpoint {
  id: number
  position: Pick<LatLng, 'lat' | 'lng'>
  text?: string
  alreadyCollected?: boolean
}

export type IPosition = Pick<LatLng, 'lat' | 'lng'>

export type IHeatPoint = [number, number, number]

export interface ILeafletMapProps {
  currentPosition?: IPosition | undefined
  checkpoints: ICheckpoint[]
  heatPoints?: IHeatPoint[] | undefined
  checkpointIconUrl?: string | null | undefined
  parentWindow?: Window
  maxMapZoom?: number
}
