<h1 style="text-align: center">Welcome to offline-map-react 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/offline-map-react" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/offline-map-react.svg">
  </a>
  <a href="https://github.com/fernandes-dev/offline-map-react" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/fernandesdotts" target="_blank">
    <img alt="Twitter: fernandesdotts" src="https://img.shields.io/twitter/follow/fernandesdotts.svg?style=social" />
  </a>
</p>

> Projeto desenvolvido com ReactJS e Leaflet para visualizar pontos específicos no mapa e pontos de calor, com ausência de conexão com internet.

### ✨ [Demo](https://offline-map.netlify.app)

## Install

```sh
npm i offline-map-react
```

## Usage

```tsx
import React, {useEffect, useState} from 'react';
import './App.css';

import {OfflineMap} from 'offline-map-react'
import {ICheckpoint, IPosition} from "offline-map-react/dist/cjs/types/src/lib/LeafletMap/index.types";


function App() {
  // create the necessary react states
  const [map, setMap] = useState()
  const [existsMapControls, setExistsMapControls] = useState(false)
  const [totalLayersToSave, setTotalLayersToSave] = useState(0)
  const [progressSaveMap, setProgressSaveMap] = useState(0)
  const [polylines, setPolylines] = useState<IPosition[][]>([])
  const [mapPolyline, setMapPolyline] = useState<IPosition[]>()
  const [checkpoints, setCheckpoints] = useState<ICheckpoint[]>([])
  const [position, setPosition] = useState<IPosition | undefined>()

  // create offline map instance
  const OfflineMapInstance = OfflineMap({
    mapState: {map, setMap,},
    existsMapControlsState: {existsMapControls, setExistsMapControls,},
    totalLayerToSaveState: {setTotalLayersToSave,},
    progressSaveMapState: {setProgressSaveMap,},
    polylineState: {setPolylines, polylines,},
    mapPolylineState: {mapPolyline, setMapPolyline,},
    checkpointState: {checkpoints,},
    positionState: {position, setPosition,},
  })


  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(position => {
      // get current user position to set in map view
      setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })

      // example to create an checkpoint
      setCheckpoints([{
        position: {lat: 40.750749, lng: -74.077218},
        id: Math.random(),
        text: 'Ponto de Controle 1'
      }])
    })
  }, [])

  useEffect(() => {
    // verify if map exists to add offline controls
    if (map) OfflineMapInstance.addUserLocationHandler()
  }, [map])

  return (
    <div className="App">
      {/* call te function to render map */}
      {OfflineMapInstance.renderMap()}
    </div>
  );

}

export default App;
```

## Author

👤 **Eduardo Fernandes**

* Twitter: [@fernandesdotts](https://twitter.com/fernandesdotts)
* Github: [@fernandes-dev](https://github.com/fernandes-dev)
* LinkedIn: [@fernandes-dev](https://linkedin.com/in/fernandes-dev)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to
check [issues page](https://github.com/fernandes-dev/offline-map-react/issues).

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
