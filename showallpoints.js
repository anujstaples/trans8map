import React, { Component } from 'react';
import { View, Text, Image, SafeAreaView, NetInfo, StyleSheet,Button,Dimensions,TouchableOpacity } from 'react-native';
import { StackActions } from '@react-navigation/native';
import PushNotification from "react-native-push-notification";
import PushController from './PushController';
import BackgroundFetch from 'react-native-background-fetch';
import {Picker} from '@react-native-picker/picker';
import { AsyncStorage } from 'react-native';
import getDirections from 'react-native-google-maps-directions' 
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import PubNubReact from "pubnub-react";
import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');
const haversine = require('haversine');

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 43.6038821;
const LONGITUDE = -79.5127419;
const LATITUDE_DELTA = 1.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const origin = {latitude: 43.6038821, longitude: -79.5127419};
const destination = {latitude: 43.6452219, longitude: -79.4797703};
const GOOGLE_MAPS_APIKEY = 'AIzaSyAeewuHY3zbXBGxOB8kR-4dFNVFoWyhNTo';
const newCoordinate = {
        latitude,
        longitude
      };

class App extends Component {
  constructor(props){
    super(props); 
    
    this.state = {
      channelid:'12345',
      seconds: 5,
      status: "false",
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
     coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0
      }),
      locations:[
        ["loc1", 43.6038821, -79.5127419],
        ["loc2", 43.69891, -79.4052167],
        ["loc3", 43.6479191, -79.4787424],
        ["loc4", 43.6469834, -79.4780713],
        ["loc4", 43.647304, -79.4738543],
        ["loc4", 43.6392867, -79.4727615],
        ["loc4", 43.6490415, -79.4797703],
        ["loc4", 43.6509535, -79.4723601],
        ["loc4", 43.6457458, -79.4737485],
        ["loc4", 43.6405296, -79.4743655],
        ["loc4", 43.6452219, -79.4797703]
      ],
      points:[
    {latitude: 43.6392867, longitude: -79.4727615},
    {latitude: 43.6509535, longitude: -79.4723601},
    {latitude: 43.6405296, longitude: -79.4743655},
    {latitude: 43.6457458, longitude: -79.4737485},
    {latitude: 43.647304, longitude: -79.4738543},
    {latitude: 43.6469834, longitude: -79.4780713},
    {latitude: 43.6479191, longitude: -79.4787424},
    {latitude: 43.6452219, longitude: -79.4797703},
    {latitude: 43.666630, longitude: -79.530149},
    {latitude: 43.666382, longitude: -79.495794},
    {latitude: 43.675570, longitude: -79.462457},
    {latitude: 43.673832, longitude: -79.437378},
    {latitude: 43.656198, longitude: -79.406160},
    {latitude: 43.650485, longitude: -79.421619},
    {latitude: 43.642535, longitude: -79.426086},
    {latitude: 43.642038, longitude: -79.411313},
    {latitude: 43.644523, longitude: -79.386234},
    {latitude: 43.645765, longitude: -79.374903},
    {latitude: 43.659924, longitude: -79.359450},
    {latitude: 43.664146, longitude: -79.348467},
    {latitude: 43.671845, longitude: -79.338511},
    {latitude: 43.678549, longitude: -79.325806},
    {latitude: 43.694687, longitude: -79.296981},
    {latitude: 43.705608, longitude: -79.275627},
    {latitude: 43.713550, longitude: -79.246768},
    {latitude: 43.715287, longitude: -79.231391},
    {latitude: 43.729926, longitude: -79.233470},
    {latitude: 43.737368, longitude: -79.219040},
    {latitude: 43.749769, longitude: -79.188122},

      ]
    }
    
}

componentDidMount = () => { 

// Geolocation.getCurrentPosition((info) => {
// var abc = info.coords.latitude;
// this.setState({
//          abc,
//          abc,
//          prevLatLng: newCoordinate
//        });

// });


this.watchID = navigator.geolocation.watchPosition(
    position => {
      const { coordinate, routeCoordinates, distanceTravelled } =   this.state;
      const { latitude, longitude } = position.coords;
      // console.log(position.coords); 
      const newCoordinate = {
        latitude,
        longitude 
      };
      if (Platform.OS === "android") {
        if (this.marker) {
          this.marker.animateMarkerToCoordinate(
            newCoordinate,
            500
          );
         }
       } else {
         coordinate.timing(newCoordinate).start();
       }
       this.setState({
         latitude,
         longitude,
         routeCoordinates: routeCoordinates.concat([newCoordinate]),
         distanceTravelled:
         distanceTravelled + this.calcDistance(newCoordinate),
         prevLatLng: newCoordinate
       });
     },
     error => console.log(error),
     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );

       


this.state.locations.sort((a, b) => {
  var origLat = 0,
    origLong = 0;

  return  this.distance(origLat, origLong, a[1], a[2]) - this.distance(origLat, origLong, b[1], b[2]);
});

console.log(this.state.locations)


}

calcDistance = newLatLng => {
  const { prevLatLng } = this.state;
  return haversine(prevLatLng, newLatLng) || 0;
};

getMapRegion = () => ({
  latitude: this.state.latitude,
  longitude: this.state.longitude,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA
});

componentWillUnmount() {
  
}
 

distance = (lat1, lon1, lat2, lon2, unit) => {
  var radlat1 = Math.PI * lat1 / 180;
  var radlat2 = Math.PI * lat2 / 180;
  var theta = lon1 - lon2;
  var radtheta = Math.PI * theta / 180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;

  return dist;
}

    handleGetDirections = () => {

    const data = {
       source: {
         latitude: 30.38,
         longitude: 76.78
      },
      destination: {
        latitude: 30.65501,
          longitude: 76.820619
      },
      params: [
        {
          key: "travelmode",
          value: "driving"        // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode
        }
      ],
      waypoints: this.state.locations
    }
 
    getDirections(data)
  }

  render() {

    

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Routes
        </Text>
          <MapView

      style={styles.map}
      
      region={{
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}
    style={{ width: '100%', height: '50%' }}
    mapType={Platform.OS == "android" ? "standard" : "standard"}
      >
      <Marker.Animated
    ref={marker => {
      this.marker = marker;
    }}
    coordinate={this.state.coordinate}
  />
       {this.state.points.map((coordinate, index) =>
          <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
        )}
          <MapViewDirections
            origin={origin}
            destination={destination}
            waypoints={this.state.points}
            apikey={GOOGLE_MAPS_APIKEY}
            optimizeWaypoints={false}
            splitWaypoints={true}
          />
      </MapView>
        <View style={styles.container}>
        <Button onPress={this.handleGetDirections} title="Get Directions" />
      </View>

      <View style={styles.buttonContainer}>
  <TouchableOpacity style={[styles.bubble, styles.button]}>
    <Text style={styles.bottomBarContent}>
      {parseFloat(this.state.distanceTravelled).toFixed(2)} km
    </Text>
  </TouchableOpacity>
</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,  
    textAlign: 'center',
    margin: 10,
    paddingTop:20

  },
  picker: {
    width: 100,
  },
  maps: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  }
});

export default App;

