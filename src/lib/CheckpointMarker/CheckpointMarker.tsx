import {Marker, Popup} from 'react-leaflet'
import React from 'react'
import {Icon} from 'leaflet'
import {CalculateDistanceBetweenCoords} from '../functions/CalculateDistanceBetweenCoords'
import {ICheckpointMarkerProps} from "./index.types";

function CheckpointMarker({marker, checkPointDetails, positionToCompare}: ICheckpointMarkerProps) {
  const distanceInMeters = CalculateDistanceBetweenCoords(marker.position, positionToCompare)
  const distanceInKm = distanceInMeters > 0 ? (distanceInMeters / 1000).toFixed(2) : 0

  return (
    <Marker
      position={marker.position}
      icon={
        new Icon({
          iconUrl: '../icons/circle-icon.png',
          iconSize: [25, 25],
        })
      }
      title={marker.text}
    >
      <Popup>
        {checkPointDetails}

        <>
          <div>Distância atual: {distanceInKm} km</div>
        </>
      </Popup>
    </Marker>
  )
}

export default CheckpointMarker
