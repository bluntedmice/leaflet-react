import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import SearchAddress from './components/SearchAddress'
import {apiurlReverse, apikey} from './config'
import './App.css'

const OpenStreetMapTiles = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OpenStreetMapAttr = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

const zoomLevel = 12

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mapCenter: [40.645, -73.975]
    }

    this.handlePointChange = this.handlePointChange.bind(this)
    this.markerChange = this.markerChange.bind(this)
    this.gotClick = this.gotClick.bind(this)
    this.hidePopup = this.hidePopup.bind(this)
  }

  gotClick (e) {
    const displayAddressData = (res) => {
      var addressCoords = res.features[0].geometry.coordinates.reverse()
      console.log(addressCoords)
      this.setState({
        markerLocation: addressCoords
      })
      this.map.leafletElement.panTo(addressCoords)
      console.log('Click : ' + addressCoords)
    }

    function gotAddressData (res, err) {
      res.json().then(displayAddressData)
    }

    const options = {
      lat: e.latlng.lat,
      lng: e.latlng.lng
    }

    const clickUrl = `${apiurlReverse}?api_key=${apikey}&point.lat=${options.lat}&point.lon=${options.lng}`
    console.log(clickUrl)
    fetch(clickUrl).then(gotAddressData)
  }

  handlePointChange (point) {
    this.setState({
      mapCenter: point,
      markerLocation: point
    })
  }

  markerChange (event) {
    this.setState({
      renderPopup: true,
      markerLocation: event.target.getLatLng()
    })

    console.log(event.target.getLatLng())
  }

  hidePopup (event) {
    console.log('test')
    this.setState({
      renderPopup: false

    })
  }

  render () {
    const markers = this.state.markerLocation ? (
      <Marker
        position={this.state.markerLocation}
        onDragEnd={this.markerChange}
        onDragStart={this.hidePopup}
        draggable
      />
    ) : null

    let popup = this.state.markerLocation ? (
      <Popup
        position={this.state.addressName}
        closeOnClick={false}
        closeButton={false}
        offset={[0, -25]}
      ><h1>test this</h1></Popup>
    ) : null

    if (this.state.renderPopup === false) {
      popup = null
    }
    return (
      <div id='rootDiv'>

        <Map
          center={this.state.mapCenter}
          zoom={zoomLevel}
          onClick={this.gotClick}
          ref={(ref) => { this.map = ref }}
        >
          <TileLayer
            attribution={OpenStreetMapAttr}
            url={OpenStreetMapTiles}
          />
          {popup}
          {markers}
        </Map>

        <div id='over'>
          <SearchAddress handlePointChange={this.handlePointChange} />
        </div>
      </div>
    )
  }
}

export default App
