import config from './config/config' ;
import {_retrieveUser, _storeUser, _removeUser, _showErrorMessage, _showSuccessMessage, _getAll,_storeData,_retrieveData,_retrieveUserToken,checkNet,_storeWaypoints,_retrieveWaypoints } from './config/helper' ;
import { Loader } from './config/Loader' ;
import { LoaderMain } from './config/LoaderMain' ;

const image = {
	logo: require('./images/logo.png'),
	logog: require('./images/logo67.gif'),
	home: require('./images/home.png'),
	home_white: require('./images/home-white.png'),	
	load: require('./images/upload.png'),
	load_white: require('./images/upload-white.png'),
	delivery: require('./images/order.png'),
	delivery_white: require('./images/order-white.png'),
	settings: require('./images/gear.png'),
	settings_white: require('./images/gear-white.png'),
	logoff: require('./images/arrow.png'),
	logoff_white: require('./images/arrow-white.png'),
	user: require('./images/user.png'),
	correct: require('./images/correct.png'),
	scan: require('./images/scan.png'),
	splash: require('./images/splash.gif'),
	start: require('./images/start.png')
}


export {
	image,
	config,
	_retrieveUser,
	_storeUser,
	_removeUser,
	_showErrorMessage,
	_showSuccessMessage,
	Loader,
	LoaderMain,
	_getAll,
	_storeData,
	_retrieveData,
	_retrieveUserToken,
	checkNet,
	_storeWaypoints,
	_retrieveWaypoints
}