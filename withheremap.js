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
const destination = {latitude: 43.5989983, longitude: -79.5975174};
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
      destination:{},
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
        {latitude: 43.6038821, longitude: -79.5127419},
{latitude: 43.6038821, longitude: -79.5127419},
{latitude: 43.5985776, longitude: -79.568918},
{latitude: 43.6025219, longitude: -79.5690581},
{latitude: 43.6031869, longitude: -79.5653316},
{latitude: 43.6002476, longitude: -79.5717797},
{latitude: 43.602392, longitude: -79.572087},
{latitude: 43.5974901, longitude: -79.5785395},
{latitude: 43.5955522, longitude: -79.5805616},
{latitude: 43.5959478, longitude: -79.5763009},
{latitude: 43.5948469, longitude: -79.5740184},
{latitude: 43.5889054, longitude: -79.5780567},
{latitude: 43.5888804, longitude: -79.5856719},
{latitude: 43.5898192, longitude: -79.5884149},
{latitude: 43.5763012, longitude: -79.594852},
{latitude: 43.5768621, longitude: -79.5969727},
{latitude: 43.5606987, longitude: -79.6192632},
{latitude: 43.5584437, longitude: -79.6257743},
{latitude: 43.5566503, longitude: -79.6249817},
{latitude: 43.5623728, longitude: -79.6278181},
{latitude: 43.5639203, longitude: -79.6280813},
{latitude: 43.5676503, longitude: -79.6444101},
{latitude: 43.5666962, longitude: -79.6438289},
{latitude: 43.5665892, longitude: -79.6462057},
{latitude: 43.5628744, longitude: -79.639004},
{latitude: 43.5606467, longitude: -79.6426885},
{latitude: 43.5586198, longitude: -79.6487494},
{latitude: 43.5631148, longitude: -79.6556927},
{latitude: 43.5608947, longitude: -79.6570755},
{latitude: 43.5605968, longitude: -79.656811},
{latitude: 43.5627177, longitude: -79.6621721},
{latitude: 43.5733435, longitude: -79.6602422},
{latitude: 43.5200971, longitude: -79.6379472},
{latitude: 43.5221268, longitude: -79.6335004},
{latitude: 43.5311318, longitude: -79.620711},
{latitude: 43.5328943, longitude: -79.6212813},
{latitude: 43.5327728, longitude: -79.62036},
{latitude: 43.5330526, longitude: -79.6177276},
{latitude: 43.5304294, longitude: -79.6114095},
{latitude: 43.5356068, longitude: -79.6077895},
{latitude: 43.533687, longitude: -79.6105817},
{latitude: 43.5319822, longitude: -79.607547},
{latitude: 43.5199153, longitude: -79.6046083},
{latitude: 43.5258991, longitude: -79.6106636},
{latitude: 43.5414011, longitude: -79.5949192},
{latitude: 43.5461, longitude: -79.5965969},
{latitude: 43.5456149, longitude: -79.5943616},
{latitude: 43.5451315, longitude: -79.5948275},
{latitude: 43.5436006, longitude: -79.607263},
{latitude: 43.54653, longitude: -79.5984648},
{latitude: 43.5467767, longitude: -79.5989256},
{latitude: 43.5451395, longitude: -79.6029627},
{latitude: 43.542253, longitude: -79.6132119},
{latitude: 43.5411561, longitude: -79.6191354},
{latitude: 43.5426877, longitude: -79.6184076},
{latitude: 43.5430944, longitude: -79.6238698},
{latitude: 43.5429601, longitude: -79.6246375},
{latitude: 43.5408784, longitude: -79.6246375},
{latitude: 43.536619, longitude: -79.6284216},
{latitude: 43.532172, longitude: -79.6335359},
{latitude: 43.5340394, longitude: -79.6325352},
{latitude: 43.5267732, longitude: -79.6397497},
{latitude: 43.5258727, longitude: -79.6425131},
{latitude: 43.5459026, longitude: -79.6510182},
{latitude: 43.5518365, longitude: -79.6474732},
{latitude: 43.5641056, longitude: -79.6218865},
{latitude: 43.5686997, longitude: -79.624336},
{latitude: 43.5694078, longitude: -79.6208396},
{latitude: 43.5722089, longitude: -79.6175521},
{latitude: 43.5848293, longitude: -79.608665},
{latitude: 43.5836769, longitude: -79.6106931},
{latitude: 43.5868747, longitude: -79.616872},
{latitude: 43.5904241, longitude: -79.6246156},
{latitude: 43.6007611, longitude: -79.6240142},
{latitude: 43.6042315, longitude: -79.6188683},
{latitude: 43.6081758, longitude: -79.6201845},
{latitude: 43.6082018, longitude: -79.6229046},
{latitude: 43.6094309, longitude: -79.6245717},
{latitude: 43.6102652, longitude: -79.6304502},
{latitude: 43.6122332, longitude: -79.6363246},
{latitude: 43.6162807, longitude: -79.6385233},
{latitude: 43.6157063, longitude: -79.6378707},
{latitude: 43.6159033, longitude: -79.6486974},
{latitude: 43.6041463, longitude: -79.6460768},
{latitude: 43.6129188, longitude: -79.6436535},
{latitude: 43.6113902, longitude: -79.6415481},
{latitude: 43.6025257, longitude: -79.6383899},
{latitude: 43.602776, longitude: -79.6358458},
{latitude: 43.6011428, longitude: -79.6325997},
{latitude: 43.598684, longitude: -79.6340602},
{latitude: 43.5987117, longitude: -79.62517299999999},
{latitude: 43.5987117, longitude: -79.62517299999999},
{latitude: 43.5900028, longitude: -79.6135156},
{latitude: 43.5900028, longitude: -79.6135156},
{latitude: 43.5971205, longitude: -79.6117605},
{latitude: 43.5949574, longitude: -79.6071972},
{latitude: 43.6074053, longitude: -79.5895889},
{latitude: 43.6098942, longitude: -79.5897096},
{latitude: 43.6102966, longitude: -79.5995619},
{latitude: 43.607591, longitude: -79.60122},
{latitude: 43.6034248, longitude: -79.6015302},
{latitude: 43.6011162, longitude: -79.6023577},
{latitude: 43.5989983, longitude: -79.5975174}
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
    //  var total = res.data.lat_long.length;
    // console.log(res.data.lat_long);
    // this.setState({origin:{"latitude": res.data.lat_long[0].latitude, "longitude": res.data.lat_long[0].longitude}});
    // this.setState({destination:{"latitude":res.data.lat_long[total-1].latitude, "longitude": res.data.lat_long[total-1].longitude}});
    // this.setState({latitude:res.data.lat_long[0].latitude});
    // this.setState({longitude:res.data.lat_long[0].longitude});
    // this.setState({points:res.data.lat_long});
    // console.log(this.state.origin) 
    // console.log(this.state.destination) 
    // console.log(origin) 

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
        {this.state.points.map((coordinate, index) =>
          <MapView.Marker key={`coordinate_${index}`} pinColor="green" coordinate={coordinate} onPress={() => this.handleGetDirections(coordinate)}>
          
          <Text style={{backgroundColor:"green",height:20,textAlign: 'center',color:"#fff",borderWidth: 5,borderRadius:10}}>{index+1}</Text>
          
          </MapView.Marker>
        )}

        <MapViewDirections   
            origin={origin}
            destination={destination}
            waypoints={this.state.points}
            apikey={GOOGLE_MAPS_APIKEY}
            splitWaypoints={true}
            strokeWidth={5}
            strokeColor="hotpink"
            optimizeWaypoints={false}
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

