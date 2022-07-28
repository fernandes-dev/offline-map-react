import Leaflet, {Map} from "leaflet";

export interface IMakeTileLayerOfflineProps {
  leaflet: typeof Leaflet
  map: Map
}
