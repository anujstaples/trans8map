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
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const origin = {latitude: LATITUDE, longitude: LONGITUDE};
const destination = {latitude: 29.387369, longitude: 76.974417};
const GOOGLE_MAPS_APIKEY = 'AIzaSyAeewuHY3zbXBGxOB8kR-4dFNVFoWyhNTo';

class App extends Component { 
  constructor(props){
    super(props); 

    this.state = {
      channelid:'12345',
      seconds: 5,
      status: "false",
      latitude: null,
      longitude: null,
      origin:null,
      destination:null,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
     coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0, 
        longitudeDelta: 0
      }),
      points:[
        
      ],
      points2:[
        
      ]
    }
    
}

componentDidMount = () => { 

// alert();
fetch('https://portal.trans8.app/api/get_lat_long',{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }       
  })
  .then((response) => response.json())
  .then((res) => {
     var total = res.data.lat_long.length;
    console.log(res.data.lat_long);
    this.setState({origin:{"latitude": res.data.lat_long[0].latitude, "longitude": res.data.lat_long[0].longitude}});
    this.setState({destination:{"latitude":res.data.lat_long[total-1].latitude, "longitude": res.data.lat_long[total-1].longitude}});
    this.setState({latitude:res.data.lat_long[0].latitude});
    this.setState({longitude:res.data.lat_long[0].longitude});
    this.setState({points:res.data.lat_long});

    console.log(this.state.destination) 

    const obj = [];

   for (const key of res.data.lat_long) {

        obj.push(['lt', key.latitude, key.longitude]);
   }

   const newaypoints = [];

 for (const key of obj) {
    // console.log(key);
      newaypoints.push({latitude: key[1], longitude:  key[2]});
 }
 this.setState({points2:newaypoints});

})  
 


   
Geolocation.getCurrentPosition((info) => {
var latitude = info.coords.latitude;
var longitude = info.coords.longitude;
// console.log(latitude);
this.setState({
         latitude,
         longitude,
         prevLatLng: {
            latitude,
            longitude 
          }
       });

});


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

 handleGetDirections = (coordinate) => {
  console.log(coordinate);
  const data = {
      destination: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude
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
      waypoints: [
        
        
      ]
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
    style={{ width: '100%', height: '70%' }}
    mapType={Platform.OS == "android" ? "standard" : "standard"}
      >
       <Marker.Animated
    ref={marker => {
      this.marker = marker;
    }}
    coordinate={this.state.coordinate}
  />
        {this.state.points2.map((coordinate, index) =>
          <MapView.Marker key={`coordinate_${index}`} pinColor="green" coordinate={coordinate} onPress={() => this.handleGetDirections(coordinate)}>
          
          <Text style={{backgroundColor:"green",height:20,textAlign: 'center',color:"#fff",borderWidth: 5,borderRadius:10}}>{index+1}</Text>
          
          </MapView.Marker>
        )}

        <MapViewDirections   
            origin={this.state.origin}
            destination={this.state.destination}
            waypoints={this.state.points}
            apikey={GOOGLE_MAPS_APIKEY}
            splitWaypoints={true}
            strokeWidth={5}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            timePrecision="now"
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

