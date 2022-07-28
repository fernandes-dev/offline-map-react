import {ReactNode} from "react";
import {ICheckpoint, ICoords} from "../LeafletMap/index.types";

export interface ICheckpointMarkerProps {
  marker: ICheckpoint
  checkPointDetails?: ReactNode
  positionToCompare?: ICoords
  iconUrl?: string | undefined | null
}
