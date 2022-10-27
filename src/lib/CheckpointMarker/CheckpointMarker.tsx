import {Marker, Popup} from 'react-leaflet'
import React from 'react'
import {Icon} from 'leaflet'
import {CalculateDistanceBetweenCoords} from '../functions/'
import {ICheckpointMarkerProps} from "./index.types";

function CheckpointMarker({marker, checkPointDetails, positionToCompare, onClick, redCheckpoint}: ICheckpointMarkerProps) {
  const distanceInMeters = CalculateDistanceBetweenCoords(marker.position, positionToCompare)
  const distanceInKm = distanceInMeters > 0 ? (distanceInMeters / 1000).toFixed(2) : 0

  const parsedDistanceInMeters = Number(distanceInMeters || 0).toFixed(2)

  return (
    <Marker
      eventHandlers={{click: () => onClick?.(distanceInMeters)}}
      position={marker.position}
      icon={
        new Icon({
          iconUrl: redCheckpoint ? 'https://i.imgur.com/yxwt71l.png' : 'https://i.imgur.com/yw4QRVk.png',
          iconSize: [25, 25],
        })
      }
      title={marker.text}
    >
      <Popup>
        {checkPointDetails?.(distanceInMeters)}
        <>
          <div>Distância atual: {distanceInKm} km / {parsedDistanceInMeters} m</div>
        </>
      </Popup>
    </Marker>
  )
}

export default CheckpointMarker
