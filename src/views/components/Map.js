import React, { Component } from 'react';
import { View, Text, Image, SafeAreaView, NetInfo, StyleSheet,Button,Dimensions,TouchableOpacity,FlatList } from 'react-native';
import { _retrieveWaypoints,image,_retrieveAddress,_retrieveWarehouse,_retrieveFulladdress } from '../../assets';
import { StackActions } from '@react-navigation/native';
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
const GOOGLE_MAPS_APIKEY = 'AIzaSyAeewuHY3zbXBGxOB8kR-4dFNVFoWyhNTo';

class Map extends Component { 
  constructor(props){
    super(props); 
    console.log(this.props?.route?.params?.names[1]);
    this.state = {
      channelid:'12345',
      seconds: 5,
      status: "false",
      latitude: null,
      longitude: null,
      maplatitude: 11,
      maplongitude: 11,
      origin:null,
      destination:null,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
     coordinate: new AnimatedRegion({
        latitude: this.props?.route?.params?.names[0],
        longitude: this.props?.route?.params?.names[1],
        latitudeDelta: 0, 
        longitudeDelta: 0
      }),
      points:[],
      points2:null,
      showview:'map',
      FlatListItems: [
      ],
      warehouse:'',
      fulladdress:[],
    }
    
}

componentDidMount = () => { 

  _retrieveAddress().then((address) => {

      this.setState({FlatListItems:JSON.parse(address)});
  })
  _retrieveFulladdress().then((address) => {

      this.setState({fulladdress:JSON.parse(address)});
  })

  _retrieveWarehouse().then((address) => {

      this.setState({warehouse:address});
  })
  _retrieveWaypoints().then((points) => {
      
        var newpoints =  JSON.parse(points);
        
        var total = newpoints.length;
        // console.log(newpoints);
        this.setState({origin:{"latitude": newpoints[0].latitude, "longitude": newpoints[0].longitude}});
        this.setState({destination:{"latitude":newpoints[total-1].latitude, "longitude": newpoints[total-1].longitude}});
        this.setState({maplatitude:newpoints[0].latitude});
        this.setState({maplongitude:newpoints[0].longitude});
        this.setState({points:newpoints});
        // console.log(this.state.latitude) 
        // console.log(this.state.longitude)

      
    })


   
Geolocation.getCurrentPosition((info) => {
var latitude = info.coords.latitude;
var longitude = info.coords.longitude;
console.log(latitude);
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
           // alert()
          this.marker.animateMarkerToCoordinate(
            newCoordinate,
            500
          );
         }
       } else {
         coordinate.timing(newCoordinate).start();
       }
       // this.setState({
       //   latitude, 
       //   longitude,
       //   routeCoordinates: routeCoordinates.concat([newCoordinate]),
       //   distanceTravelled:
       //   distanceTravelled + this.calcDistance(newCoordinate),
       //   prevLatLng: newCoordinate
       // });

       // this.setState({
       //   maplatitude: latitude, 
       //   maplongitude: longitude
        
       // });

     },
     error => console.log(error),
     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000,distanceFilter:0 }
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
  // console.log(coordinate);
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

  ChangeView(view){
  
    this.setState({
          showview:view,
        })
    // alert(this.state.showview);
    }


    getaddress(latitude){
       for (const key of this.state.fulladdress) {
            if(key.latitude == latitude){
              return key.address;
            }

         }
    }

  render() {

    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center',flexDirection:'row',marginTop: 10}}>
         {this.state.showview == "map" &&     
          <Text style={styles.Active} onPress={() => this.ChangeView('map')}>Map</Text>
           }
           {this.state.showview != "map" &&     
          <Text style={styles.HeadStyle} onPress={() => this.ChangeView('map')}>Map</Text>
           }
           {this.state.showview == "list" && 
          <Text style={styles.Active} onPress={() => this.ChangeView('list')}>List </Text>
           }
           {this.state.showview != "list" && 
          <Text style={styles.HeadStyle} onPress={() => this.ChangeView('list')}>List</Text>
           }
        </View>
        {this.state.showview == "map" &&
        <View>
        <MapView

            style={styles.map}
            
            region={{
              latitude: this.state.maplatitude,
              longitude: this.state.maplongitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            showUserLocation
            followUserLocation
            loadingEnabled
          style={{ width: '100%', height: '90%' }}
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
            origin={this.state.origin}
            destination={this.state.destination}
            waypoints={this.state.points}
            apikey={GOOGLE_MAPS_APIKEY}
            splitWaypoints={true}
            strokeWidth={5}
            strokeColor="hotpink"
            optimizeWaypoints={false}
            timePrecision="now"
          />

      </MapView> 
      </View>
    }
    {this.state.showview == "list" &&
      <View style={{ width: '100%', height: '90%',backgroundColor:"#2d292d" }}>
          <FlatList
                data={this.state.FlatListItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (

                  <View style={styles.card}>
                   <View style={styles.imgtext}>
                    <Text style={{fontSize:16, backgroundColor:"#fff",height:25,width:25,textAlign: 'center',color:"#007efe",borderColor:"#fff",borderWidth: 5,borderRadius:15,fontWeight:"bold"}}>{item.sequence+1}</Text>
                    <Text style={styles.name}>
                    {this.getaddress(item.lat)} {item.sequence == -1 && <Text>( {this.state.warehouse} )</Text> }
                    </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Image style={styles.userImage} source={require('../../assets/images/marker.png')}/>
                    </View>
                   
                  
                  </View>

                  )} 
                  />
      </View>
    }
       
    </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
   flex: 1,
    justifyContent: 'center',
   backgroundColor:"#000",
    alignContent: 'center',
  },
  welcome: {
    fontSize: 20,  
    textAlign: 'left',
    margin: 10,
    paddingTop:40,
    color:"#000"

  },
  list: {
    fontSize: 20,  
    textAlign: 'right',
    margin: 10,
    paddingTop:20,

  },
  picker: {
    width: 100,
  },
  maps: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
   Active:{
    color: '#247ee8',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth :2,
    borderBottomColor: '#247ee8',
  },
  imgtext:{ 
    flexDirection:'row',
    alignItems:'center',
    width:"95%"
  },
  HeadStyle:{
    color: '#808080',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth :1,
    borderBottomColor: '#808080',
  },
  card:{
  flexDirection: "row",
  padding:20,

},
userImage:{
    height: 25,
    width: 25,
    alignSelf: 'flex-end',  

  },
  name:{
    fontSize:13,
    color:"#fff",
    fontWeight:'700',
    paddingLeft:20,
  },
  followButton: {
    marginTop:0,
    height:35,
    width:35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:80,
    backgroundColor: "#ea1780",
  }
});

export default Map;

