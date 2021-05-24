import {_retrieveUser, _retrieveUserToken, _storeUser, _removeUser, _showErrorMessage, _showSuccessMessage } from '../assets/config/helper';
import { image, config } from '../assets';


// const fetchWithAuth = async (url, options = {}) => {
// _retrieveUser().then((user) => {
// 		var user = JSON.parse(user);
// 		var token = user.userInfo.token;
// 		return fetch(url, {
// 			...options,
// 			headers: {
// 				'Authorization': 'Bearer '+token,
// 			},
// 		});
// 	});
// };

export async function getRoutes() {
  return _retrieveUserToken().then((token) => {
    return fetch(config.API_URL+'get_lat_long',{
                      method: 'GET',
                      headers: {
                          'Authorization': 'Bearer ' + token,
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                      },
                    }).then((res) => res.json())
  });
}

export async function demo() {

    return fetch('https://my-json-server.typicode.com/typicode/demo/posts',{
                      method: 'GET',
                      headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                      },
                    }).then((res) => res.json())
}