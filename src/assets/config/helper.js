import React from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Toast, Root } from 'native-base';


export async function _storeUser(data) {
	try {
		await AsyncStorage.setItem('@Trans8:sQd!@_loginInfo', JSON.stringify(data));
		return true;
	} catch (error) {
		return false
	}
} 
export async function _storeWaypoints(data) {
	try {
		await AsyncStorage.setItem('waypoints', JSON.stringify(data));
		return true;
	} catch (error) {
		return false
	}
}

export async function _retrieveWaypoints(data) {
	try {
		const value = await AsyncStorage.getItem('waypoints');
		return value
	} catch (error) {
		return false
	}
		
}

export async function _storeAddress(data) {
	try {
		await AsyncStorage.setItem('addresses', JSON.stringify(data));
		return true;
	} catch (error) {
		return false
	}
}

export async function _retrieveAddress(data) {
	try {
		const value = await AsyncStorage.getItem('addresses');
		return value
	} catch (error) {
		return false
	}
		
}

export async function _storeWarehouse(data) {
	try {
		await AsyncStorage.setItem('warehouse', JSON.stringify(data));
		return true;
	} catch (error) {
		return false
	}
}

export async function _retrieveWarehouse(data) {
	try {
		const value = await AsyncStorage.getItem('warehouse');
		return value
	} catch (error) {
		return false
	}
		
}

export async function _storeFulladdress(data) {
	try {
		await AsyncStorage.setItem('fulladdress', JSON.stringify(data));
		return true;
	} catch (error) {
		return false
	}
}

export async function _retrieveFulladdress(data) {
	try {
		const value = await AsyncStorage.getItem('fulladdress');
		return value
	} catch (error) {
		return false
	}
		
}
export async function _retrieveUser() {
	// try {
	// 	const value = await AsyncStorage.getItem('@Trans8:sQd!@_loginInfo');
	// 	return value
	// } catch (error) {
	// 	return false;
	// }
}

export async function _retrieveUserToken() {
	try {
		const value = await AsyncStorage.getItem('@Trans8:sQd!@_loginInfo').then((userInfo) => {
			  const data = JSON.parse(userInfo);
			  if(typeof data.userInfo != "undefined") {
			  	const token = data.userInfo.token;
			  	return token;
			  }else{
			  	return null;
			  }

		});
		return value;

	} catch (error) {
		console.log(error);
		return false;
	}
}

// export async function _removeUser() {
// 	try {
// 		await AsyncStorage.removeItem('@Trans8:sQd!@_loginInfo');
// 		await AsyncStorage.removeItem('totalStops_');
// 		await AsyncStorage.removeItem('not_delivered_count_');
// 		await AsyncStorage.removeItem('completed_');
// 		await AsyncStorage.removeItem('return_count_');
// 		await AsyncStorage.removeItem('totalpack_');
// 		await AsyncStorage.removeItem('PendingStops_');
// 		await AsyncStorage.removeItem('retail_drops_');
// 		await AsyncStorage.removeItem('retail_drop_stops_count_');
// 		await AsyncStorage.removeItem('door_knocker_count_');
// 		await AsyncStorage.removeItem('listing_routes');
// 		//await AsyncStorage.removeItem('companyId');
// 		//await AsyncStorage.removeItem('companyName');
// 		return true;
//     }
//     catch(exception) {
// 		return false;
//     }
// }

// export async function _getAll() {
// 	await AsyncStorage.getAllKeys().then((user) => {
// 		const data = JSON.parse(user);
// 		return data;
// 	});
// 	return true;
// }

export async function _showErrorMessage(msg, showAlert = false) {
	if(showAlert) {
		alert(msg);
	}else{
		Toast.show({
			text: msg,
			buttonText: "Okay",
			duration: 3000,
			type: "danger",
			position:Platform.OS === 'ios' ? 'top' : 'bottom',
		})
	}
}

export async function _showSuccessMessage(msg, showAlert = false) {
	if(showAlert) {
		alert(msg);
	}else {
		Toast.show({
			text: msg,
			buttonText: "Okay",
			duration: 3000,
			type: "success",
			position:Platform.OS === 'ios' ? 'top' : 'bottom',
		});
	}
}

// export async function _storeData(key,data) {
// 	try {
// 		await AsyncStorage.setItem(key, JSON.stringify(data));
// 		return true;
// 	} catch (error) {
// 		return false
// 	}
// }

// export async function _retrieveData(key) {
// 	try {
// 		const value = await AsyncStorage.getItem(key);
// 		return JSON.parse(value);
// 	} catch (error) {
// 		return false;
// 	}
// }

// // checkNet = async (): Promise<void> => {
// export async function checkNet() {
// 	let internet = 'on';
// 	let netSpeed = 1;
//     await NetInfo.fetch().then(state => {
//       if(state.isConnected == false) {
//       	 internet = 'off';
//         _showErrorMessage("Your phone not connect with internet. Please try again");

//       }
//     });
//     console.log("wait");
//     const netSpeedInfo = await AsyncStorage.getItem('netSpeed');
//     if(netSpeedInfo == null) {
//     	netSpeed = 0.3;
//     } else {
//     	netSpeed = netSpeedInfo;
//     }
//     // netSpeed = 10;
//     if(internet == 'on') {
//     	try {
//   	console.log("IN");
//     const networkSpeed: NetworkBandwidthTestResults = await measureConnectionSpeed();
//     console.log(networkSpeed.speed.toFixed(1)+' Mbps');
//     console.log("OOUT");
//     if(networkSpeed.speed < netSpeed){
//     	console.log("OFFline");
//       //_showErrorMessage('Your internet speed is slow, Your net speed is '+networkSpeed.speed.toFixed(1)+' Mbps');
// 	   	return 1;
//     } else {
//     	console.log("ONline");
//       return 0;
//     }
//     } catch (err) {
//       console.log(err); 
//       return 1; 
//     }
//     } else {
//     	return 2;
//     }

  

  // }