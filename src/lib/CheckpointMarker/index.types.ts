import {ReactNode} from "react";
import {ICheckpoint, ICoords} from "../LeafletMap/index.types";

export interface ICheckpointMarkerProps {
  marker: ICheckpoint
  checkPointDetails?: (distanceInMeters: number) => ReactNode
  positionToCompare?: ICoords
  iconUrl?: string | undefined | null
  onClick?: (distanceInMeters: number) => void
}
