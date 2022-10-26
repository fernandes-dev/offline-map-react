import {Marker, Popup} from 'react-leaflet'
import React from 'react'
import {Icon} from 'leaflet'
import {CalculateDistanceBetweenCoords} from '../functions/'
import {ICheckpointMarkerProps} from "./index.types";

function CheckpointMarker({marker, checkPointDetails, positionToCompare, iconUrl, onClick}: ICheckpointMarkerProps) {
  const distanceInMeters = CalculateDistanceBetweenCoords(marker.position, positionToCompare)
  const distanceInKm = distanceInMeters > 0 ? (distanceInMeters / 1000).toFixed(2) : 0

  return (
    <Marker
      eventHandlers={{click: () => onClick?.(distanceInMeters)}}
      position={marker.position}
      icon={
        new Icon({
          iconUrl: iconUrl || 'https://i.imgur.com/yxwt71l.png',
          iconSize: [25, 25],
        })
      }
      title={marker.text}
    >
      <Popup>
        {checkPointDetails?.(distanceInMeters)}
        <>
          <div>Distância atual: {distanceInKm} km / {distanceInMeters} m</div>
        </>
      </Popup>
    </Marker>
  )
}

export default CheckpointMarker
