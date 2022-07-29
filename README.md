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

> Project make with ReactJS and Leaflet to show specified points and heat points in the map, without active internet connexion.

### ✨ [Demo](https://offline-map.netlify.app)

## Used Libs
* [Leaflet JS v1.8.0](https://leafletjs.com)
* [React Leaflet v4.0.0](https://react-leaflet.js.org/)
* [Leaflet.LocateControl v0.76.1](https://github.com/domoritz/leaflet-locatecontrol)
* [Leaflet.Offline v2](https://github.com/allartk/leaflet.offline)
* [Leaflet.WebglTemperatureMap v0.2.0](https://github.com/sanchezweezer/Leaflet.webGlTemperatureMap#readme)
* [Leaflet.Heat](https://github.com/Leaflet/Leaflet.heat/blob/gh-pages/dist/leaflet-heat.js)

## Install

```sh
npm i offline-map-react
```

#### Add following Leaflet CDN in your index.html
```html
<head>
    ...

  <!--  LEAFLET -->
  <link href='https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.css' rel='stylesheet'/>
  <script
    charset='utf-8'
    src='https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.js'
  ></script>

  <link
    crossorigin=''
    href='https://unpkg.com/leaflet@1.8.0/dist/leaflet.css'
    integrity='sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=='
    rel='stylesheet'
  />
  <script
    crossorigin=''
    integrity='sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=='
    src='https://unpkg.com/leaflet@1.8.0/dist/leaflet.js'
  ></script>

    ...
</head>
```

## Usage

```tsx
import React, {useEffect, useState} from 'react';
import './App.css';

import {OfflineMap} from 'offline-map-react'
import {ICheckpoint} from "offline-map-react/dist/cjs/types/src/lib/LeafletMap/index.types";

function App() {
  const [checkpoints, setCheckpoints] = useState<ICheckpoint[]>([])

  const OfflineMapInstance = OfflineMap({
    checkpoints,
  })

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(position => {
      // checkpoints will be renderer in map
      setCheckpoints([{
        position: {lat: 40.750749, lng: -74.077218},
        id: Math.random(),
        text: 'Ponto de Controle 1'
      }])
    })
  }, [])

  useEffect(() => {
    // create heat points if map instance exists
    OfflineMapInstance.addHeatPoints([
      {
        lat: 40.750749,
        lng: -74.077218,
        intensity: 20, // 0 to 100
      }
    ])

    // set map view on user location
    OfflineMapInstance.setMapViewOnUserLocation()

  }, [OfflineMapInstance.map])

  return (
    <div className="App">
      {/* saved tiles number */}
      {OfflineMapInstance.progressSaveMap}

      {/* number of total tiles to save */}
      {OfflineMapInstance.totalLayersToSave}

      {/* call te function to render the map */}
      {OfflineMapInstance.renderMap(
        //    can be pass any children if is a valid React Leaflet child
      )}
    </div>
  );

}

export default App;

```

## Style

* Without "height" and "width" property the map will be not render


```css
#map {
  height: 400px;
  width: 800px;
}
```

## NextJS Support
- ### 1º Create "Map" component
  `Map.tsx`
  ```tsx
  import {OfflineMap} from "offline-map-react";

  import {IPosition} from "offline-map-react/src/lib/LeafletMap/index.types";

  function Map(userPosition: IPosition) {
    const mapInstance = OfflineMap({
      checkpoints: [], currentPosition: userPosition
    })

    return (mapInstance.renderMap({/* Optional -- Pass valid React Leaflet children */}))
  }

  export default Map
  ```
- ### 2º Create "DynamicMap" component
  `DynamicMap.tsx`
  ```tsx
  import dynamic from 'next/dynamic'
  import {IPosition} from "offline-map-react/src/lib/LeafletMap/index.types";


  function DynamicMap(userPosition: IPosition) {
    const DynamicComponentWithNoSSR = dynamic(
      () => import('./Map'),
      {ssr: false}
    )
    return (
      <DynamicComponentWithNoSSR {...userPosition} />
    )
  }

  export default DynamicMap

  ```

- ### 3º Use the DynamicMap component in your screen component
  `Home.tsx`

  ```tsx
  import type {NextPage} from 'next'
  import Head from 'next/head'
  import styles from '../styles/Home.module.css'
  import {useEffect, useState} from "react";
  import DynamicMap from "./DynamicMap";
  import {IPosition} from "offline-map-react/src/lib/LeafletMap/index.types";

  const Home: NextPage = () => {
    const [userPosition, setUserPosition] = useState<IPosition>()

    useEffect(() => {
      window.navigator.geolocation.getCurrentPosition(position => setUserPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }))
    }, [])

    return (
      <div className={styles.container}>
        <Head>{/* your header and Leaflet CDN's */}</Head>
        <main className={styles.main}>
          {userPosition && <DynamicMap {...userPosition}/>}
        </main>
        <footer className={styles.footer}>
          footer
        </footer>
      </div>
    )
  }

  export default Home
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
