import React, { Component } from 'react';
import { View, Text, Image, SafeAreaView, NetInfo, StyleSheet,Button,Dimensions,TouchableOpacity,FlatList,Modal } from 'react-native';
import { _retrieveWaypoints,image,_retrieveAddress,_retrieveWarehouse,_retrieveFulladdress,_showSuccessMessage } from '../../assets';
import { StackActions } from '@react-navigation/native';
import { demo } from '../../api';
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
const LATITUDE_DELTA = 0.0;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyAeewuHY3zbXBGxOB8kR-4dFNVFoWyhNTo';

class Map extends Component { 
  constructor(props){
    super(props); 

    this.state = {

      latitude: null,
      longitude: null,
      maplatitude: 11,
      maplongitude: 11,
      origin:null,
      destination:null,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
  
      points:[],
      points2:null,
      showview:'map',
      FlatListItems: [
      ],
      warehouse:'',
      fulladdress:[],
      nextpoint:0,
      LATITUDE_DELTA : 0.01,
      LONGITUDE_DELTA : LATITUDE_DELTA * ASPECT_RATIO,
      currentpointstatus:true,
      bottomMargin:null,
      title:''
    }
    
}

componentDidMount = () => { 
            

setTimeout(()=>this.setState({statusBarHeight: 1}),500);

  _retrieveAddress().then((address) => {

      this.setState({FlatListItems:JSON.parse(address)});
      // console.log(this.state.FlatListItems);
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
        // console.log(newpoints.length);
        this.setState({origin:{"latitude": newpoints[0].latitude, "longitude": newpoints[0].longitude}});
        // this.setState({destination:{"latitude": newpoints[0].latitude, "longitude": newpoints[0].longitude}});
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
// console.log(latitude,longitude);
this.setState({
         latitude,
         longitude,
         prevLatLng: {
            latitude,
            longitude 
          }
       });

},
error => console.log(error),
{ enableHighAccuracy: true, timeout: 20000}


);


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

       //this.checkOnArrive(latitude, longitude);



     },
     error => console.log(error),
     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000,distanceFilter:0 }
  );

}

checkOnArrive = (lat,long) => {

  if(this.state.nextpoint < this.state.points.length){

    const destinationltlg = {latitude:this.state.points[this.state.nextpoint].latitude,longitude:this.state.points[this.state.nextpoint].longitude}
 
    const start = {latitude: lat, longitude: long }

    const distance = Math.round(haversine(start,destinationltlg,  {unit: 'meter'}));
   
    if(distance < 20 && this.state.currentpointstatus == true){

        _showSuccessMessage('point'+this.state.nextpoint);
      
        this.setState({nextpoint:this.state.nextpoint+1,currentpointstatus:false}); 

    }
    else{
      this.setState({currentpointstatus:true});
    }
    
 }

}

componentWillUnmount() {
  
}
 


 handleGetDirections = (coordinate) => {

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

   handleGetDirectionsFromList = (lat,lon) => {
 
  const data = {
      destination: {
        latitude: lat,
        longitude: lon
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
        <View style={styles.driverheader}>
          <View style={styles.item}>
          <View style={styles.section}>
            <View style={styles.profileimg}>
            <Image source={require('../../assets/images/driver.png')}  />
            </View>
             <View style={{width:"70%",paddingLeft:10}}>
                <Text style={{fontSize:16,fontWeight:'bold'}}>Driver Name:</Text>
                <Text style={{fontSize:14,fontWeight:'bold'}}>Date:</Text>
             </View>
             </View>
          </View>
          <View style={styles.section}>
            <View style={styles.item}>
              <Text style={{fontSize:16,fontWeight:'bold'}}>Steve Smith</Text>
              <Text style={{fontSize:14,fontWeight:'bold'}}>21st May 2021</Text>
            </View>
          </View>  
        </View>

        <View style={styles.indication}>

          <View style={styles.item2}>
            <View style={styles.section}>
              <View style={styles.profileimg2}>
              <Image source={require('../../assets/images/blue.png')}  />
              </View>
               <View style={{width:"70%",paddingLeft:0}}>
                  <Text style={{fontSize:14,fontWeight:'bold',paddingTop:6}}>Delevered</Text>
               </View>
            </View>
          </View>

          <View style={styles.item2}>
            <View style={styles.section}>
              <View style={styles.profileimg2}>
              <Image source={require('../../assets/images/red.png')}  />
              </View>
               <View style={{width:"70%",paddingLeft:0}}>
                  <Text style={{fontSize:14,fontWeight:'bold',paddingTop:6}}> Not Delevered</Text>
               </View>
            </View>
          </View>

          <View style={styles.item2}>
            <View style={styles.section}>
              <View style={styles.profileimg2}>
              <Image source={require('../../assets/images/yellow.png')}  />
              </View>
               <View style={{width:"70%",paddingLeft:0}}>
                  <Text style={{fontSize:14,fontWeight:'bold',paddingTop:6}}> Pending</Text>
               </View>
            </View>
          </View>
            
        </View>

        {this.state.showview == "map" &&
        <View style={{ width: '100%', height: '60%',flexDirection:'row'}}>
        <MapView
            ref={(ref) => { this.map = ref }} 
            initialRegion={{
              latitude: this.state.maplatitude,
              longitude: this.state.maplongitude,
              latitudeDelta: this.state.LATITUDE_DELTA,
              longitudeDelta: this.state.LONGITUDE_DELTA,
            }}
            mapPadding={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20
                    }}
            loadingEnabled={false}
            showsUserLocation
            userLocationPriority={'high'}
            followsUserLocation={true}
            showsMyLocationButton={true}
            showsTraffic={false}
            zoomEnabled={true}
            zoomTapEnabled={true}
            zoomControlEnabled={true}
            rotateEnabled={true}
            scrollEnabled={true}
            toolbarEnabled={true}
            showsCompass={false}
            userInterfaceStyle={'dark'}
            onRegionChangeComplete = {(region) => {
              //console.log(this.map.getCamera());
                  // this.map.animateCamera(, 350);
                //this.setState({LATITUDE_DELTA:region.latitudeDelta,LONGITUDE_DELTA:region.longitudeDelta,maplatitude:region.latitude,maplongitude:region.longitude});
               
                    }} 
            
          style={{
            marginBottom: this.state.bottomMargin,            
            ...StyleSheet.absoluteFillObject,
          }}
         
          mapType={Platform.OS == "android" ? "standard" : "standard"}
          onLayout = { (some) => {

          }}
          onMapReady={() => this.setState({ bottomMargin: 1 })}
            >
           
        {this.state.points.map((coordinate, index) =>
          <MapView.Marker key={`coordinate_${index}`} pinColor="green" coordinate={coordinate} onPress={() => this.handleGetDirections(coordinate)}>
          
          { index == 0 ?
            <Image source={require('../../assets/images/complete.png')}  />

            :<View><Image source={require('../../assets/images/pending.png')}  />
            <Text style={{textAlign: 'center',color:"#000",position:'absolute',right:15,top:6,fontWeight:'bold'}}>{index+1}</Text></View>
          }

          
          
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
            mode="DRIVING"
            onReady={result => {

              }}
          />

      </MapView> 
      <Text style={styles.name}>sdfsdfsd</Text>
      </View>
    }
    {this.state.showview == "list" &&
      <View style={{ width: '100%', height: '60%',backgroundColor:"#fff",padding:5 }}>
           
           <View style={{flexDirection:'row',padding:10,backgroundColor:'#cbf2fc',borderRadius:15,marginBottom:10}}>
                  <View style={{width:'15%',backgroundColor:'#fff',padding:5,borderRadius:10,justifyContent: 'center',alignItems: 'center',
}}>
                  <Image source={require('../../assets/images/startpoint.png')}  />
                  </View>
                  <View style={{width:"85%",paddingLeft:10}}>
                    <Text style={{fontSize:18,fontWeight:'bold',paddingTop:0,color:"#000"}}>Start Point</Text>
                    <Text style={{fontSize:14,fontWeight:'bold',paddingTop:0,color:"#000"}}>
                   205 New Toronto St, Toronto {"\n"}ON M8VOA1, Canada</Text>
                  </View>
          </View> 
          <FlatList
                data={this.state.FlatListItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (

                 <View style={{flexDirection:'row',padding:10,backgroundColor:'#f3aa00',borderRadius:15,marginBottom:10}}>
                  <View style={{width:'15%',backgroundColor:'#fff',padding:20,borderRadius:10,justifyContent: 'center',alignItems: 'center'}}>
                  <Text style={{color:'#f3aa00',fontWeight:'bold',fontSize:16}}>01</Text>
                  </View>
                  <View style={{width:"85%",paddingLeft:10,flexDirection:"row"}}>
                  <View style={{justifyContent: 'center',alignItems: 'center',paddingLeft:10}}>
                    <Image style={{paddingTop:15}} source={require('../../assets/images/pin.png')}  />
                   </View>
                   <View style={{justifyContent: 'center',alignItems: 'center',paddingLeft:10}}> 
                      <Text style={{fontSize:14,fontWeight:'bold',paddingTop:0,color:"#fff",paddingLeft:10}}>
                     205 New Toronto St, Toronto {"\n"}ON M8VOA1, Canada</Text>
                   </View>
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
   backgroundColor:"#fff",
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
    ...StyleSheet.absoluteFillObject

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
    borderBottomWidth :5,
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
  },

  driverheader: {
    flex: 0.4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    padding:10,
    marginTop:15,
    marginBottom:0,

   }, 
  section: {
    flexDirection: 'row',
  },
  item: {
    width: '50%'
  },
  profileimg:{
    width:"30%",
    backgroundColor:"#000",
    padding:10,
    backgroundColor: "#247ee8",
    borderRadius:10
  },
   profileimg2:{
    width:"30%",
  },
  indication:{
    marginBottom:10,
    flexDirection: 'row',
    paddingLeft:10,
    paddingRight:10
  },
  item2:{
    width: '33.333%'
  }
});

export default Map;

