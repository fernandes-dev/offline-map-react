import {ICoords} from "../LeafletMap/index.types";

const deg2rad = (deg: number) => deg * (Math.PI / 180)

export function CalculateDistanceBetweenCoords(firstPosition?: ICoords, secondPosition?: ICoords): number {
  if (!firstPosition || !secondPosition) return 0

  const R = 6371
  const dLat = deg2rad(secondPosition.lat - firstPosition.lat)
  const dLng = deg2rad(secondPosition.lng - firstPosition.lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(firstPosition.lat)) *
      Math.cos(deg2rad(firstPosition.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c * 1000
}
