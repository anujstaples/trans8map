import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Toast, Root } from 'native-base';


import Navigation from './navigation';


export default function App(){
  return(
    <NavigationContainer>
	    <Root>
	        <Navigation></Navigation>
	    </Root>
    </NavigationContainer>
  );
}