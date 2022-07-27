import React from "react";
import Leaflet, {LatLng} from "leaflet";

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
  positionState: {
    position: IPosition | undefined
    setPosition: React.Dispatch<React.SetStateAction<IPosition | undefined>>
  }
  checkpointState: {
    checkpoints: ICheckpoint[]
    // setCheckpoints: React.Dispatch<React.SetStateAction<ICheckpoint[]>>
  }
  mapPolylineState: {
    mapPolyline: Leaflet.Polyline<any, any> | undefined
    setMapPolyline: React.Dispatch<React.SetStateAction<Leaflet.Polyline<any, any> | undefined>>
  }
  polylineState: {
    polylines: IPosition[][]
    setPolylines: React.Dispatch<React.SetStateAction<IPosition[][]>>
  }
  progressSaveMapState: {
    setProgressSaveMap: React.Dispatch<React.SetStateAction<number>>
  }
  totalLayerToSaveState: {
    setTotalLayersToSave: React.Dispatch<React.SetStateAction<number>>
  }
  mapState: {
    map: Leaflet.Map
    setMap: React.Dispatch<React.SetStateAction<Leaflet.Map>>
  }
  existsMapControlsState: {
    existsMapControls: boolean
    setExistsMapControls: React.Dispatch<React.SetStateAction<boolean>>
  }
}
