import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Alert,Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login  from './components/Login/Login';
import ForgotPassword from './components/Login/Login';
import  Map  from './components/Map';
import  Direction  from './components/Direction';


const Stack = createStackNavigator();

function AuthScreens() { 
	
  return (
    <Stack.Navigator headerMode="None" initialRouteName="Login" >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Direction" component={Direction} />
      <Stack.Screen name="Map" component={Map} />
      
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  ); 
}

export default 	AuthScreens;