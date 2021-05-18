import React, { Component } from 'react';
import { View, Text, Image, SafeAreaView, NetInfo, StyleSheet,Button,Dimensions,TouchableOpacity } from 'react-native';
import { image, config, _showErrorMessage, _showSuccessMessage, _retrieveUser,_storeWarehouse, _retrieveWarehouse, _retrieveWaypoints,_storeWaypoints,_storeAddress, Loader, _storeUser, _retrieveFulladdress,_storeFulladdress } from '../../assets';
import { getRoutes } from '../../api';
import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');

class Direction extends Component { 
  constructor(props){
    super(props); 

    this.state = {
      points:[],
      isloading:false
    }
    
}

componentDidMount = () => { 
  navigator.geolocation.getCurrentPosition(
            (position) => {
             
              this.props.navigation.replace("Map", { names: [position.coords.latitude,position.coords.longitude]});

            },
            (error) => console.warn(error.message),
            { enableHighAccuracy: true, timeout: 10000 }
          )


}

getNewRoutes(){
 
this.setState({isloading:true});

getRoutes().then((res) => {
  console.log(res)
  if(res.type == 1){
      _storeWarehouse(res.data.lat_long[0].address);
      _storeFulladdress(res.data.lat_long);
      var url = 'https://wse.ls.hereapi.com/2/findsequence.json?apiKey=hoeC8KKbZAQv2dVprjVcaN0LrXnojTkNThDzV9iG2kM&start='+res.data.lat_long[0].latitude+','+res.data.lat_long[0].longitude+'&improveFor=time&mode=fastest;car;&';
      // var url = 'https://wse.ls.hereapi.com/2/findsequence.json?apiKey=X-DD8Iw__H4RqFN03BfC3kBpmITPClOO9kk_xoVFGlc&start='+res.data.lat_long[0].latitude+','+res.data.lat_long[0].longitude+'&improveFor=time&mode=fastest;car;&';
      var count = 0;
      var string = url;
      for (const key of res.data.lat_long) {

          if(key.latitude != +res.data.lat_long[0].latitude){

            string+= 'destination'+count+'='+key.latitude+','+key.longitude+'&'
          }

          count++;
      }
      // console.log(string);
      this.sequenceWaypoints(string);
  }
  else{
    _showErrorMessage(res.message);
    this.setState({isloading:false});
  }


})

}

sequenceWaypoints(url){

fetch(url,{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }       
  })
  .then((response) => response.json())
  .then((res) => {
     console.log(res)
    // alert();
  const obj=[];
  if(res.results != null){

    _storeAddress(res.results[0].waypoints);

   for (const key of res.results[0].waypoints) {
    
        obj.push({latitude: key.lat, longitude:key.lng});

   }

   this.setState({isloading:false});

   _storeWaypoints(obj).then((res) => {

      navigator.geolocation.getCurrentPosition(
            (position) => {
             
              this.props.navigation.replace("Map", { names: [position.coords.latitude,position.coords.longitude]});

            },
            (error) => console.warn(error.message),
            { enableHighAccuracy: true, timeout: 10000 }
          )

   })
 
  }
  else 
  {
     _showErrorMessage('Waypoints not found!');
   this.setState({isloading:false});
  }
 
  })
  

  
}

handleGetDirections(){
   
}
logOut(){
   let appState = {
      isLoggedIn: true,
      userInfo: []
    };
    _storeUser(appState).then((user) => {
      this.props.navigation.replace("Login");
    });
}
  render() {

    

    return (
      <View style={styles.container}>
        <View>
        <Button onPress={()=> this.getNewRoutes()} title="Get Routes" />
        
      </View>
      <View style={styles.container2}>
        
        <Button style={styles.buttonlogout} onPress={()=> this.logOut()} title="Logout" />
      </View>

      
     {this.state.isloading && (
              <Loader />
          )}
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
  container2: {

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
     marginTop:20,
  },
  welcome: {
    fontSize: 20,  
    textAlign: 'center',
    margin: 10,
    paddingTop:20

  },
  buttonlogout:{
    marginTop:20,
    backgroundColor: '#fff',
  }
});

export default Direction;

