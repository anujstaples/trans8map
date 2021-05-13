import React, { Component } from 'react';
import {  StyleSheet,  ActivityIndicator, Text, View}  from 'react-native';

export class Loader extends Component {	
	render() {
		return (
			<View style={[styles.container, styles.horizontal]}>
			<ActivityIndicator color='#fc9f04' style={styles.indicator} size={'large'} text="loading"/>
			<Text style={styles.text}>Please wait we are fetching Routes.</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	indicator: {
  		position: 'relative',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		width:"100%",
		alignItems: 'center',
		justifyContent: 'center',
		//backgroundColor:"#F5FCFF88",
		backgroundColor:"#000",
		opacity:0.6		
  	},
  	text:{
  		flexDirection: "row",
  		position: 'absolute',
		left:0,
		right: 0,
		top: "55%",
		bottom: 0,
		 textAlign: 'center',
		fontSize:22,
		color:"#fff",
		width:"100%"
  	},
  	container: {
    flex: 1,
    justifyContent: "center",
    position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 0
  }
});