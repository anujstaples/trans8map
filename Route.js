import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Alert,Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Login, Splash, ForgotPassword } from './components';
import { image, _removeUser } from 'assets';
import { StackActions } from '@react-navigation/native';
import { logout } from 'api';
import DeviceInfo from 'react-native-device-info';

const AuthStack = createStackNavigator();

function AuthScreens() { 
  return (
    <AuthStack.Navigator headerMode="None" initialRouteName="Login" >
      <AuthStack.Screen name="Splash" component={Splash} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthStack.Navigator>
  ); 
}

export default AuthScreens;