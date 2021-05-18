import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView,Alert,Platform,Modal } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label,Button, Toast, Icon } from 'native-base';
import { image, config, _showErrorMessage, _showSuccessMessage, LoaderMain, _storeUser,_retrieveUserToken } from '../../../assets';
const data = new FormData();

class Login extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      email: "",
      password: '',
      isloading: false,
      mac_address: '',
      versionModal:false,
      device_token:'',
    }
    _retrieveUserToken().then((token) => {
      if(token){
        this.props.navigation.replace("Direction");
      }
    })
  }
  componentDidMount() {
   
  // this.props.navigation.replace("Direction");
  }
  
  loginSubmit = () => {
    // alert(this.state.device_token);
    const email = this.state.email;
    const password = this.state.password;
    var error = false;
    var msg = '';
    var _this = this;
    if(email.trim() == '')
    {
      msg += 'Please enter username.\n';
      var error = true;
    }
    if(password.length < 6)
    {
      msg += 'Please enter password.';
      var error = true;
    }
    if(!error) {
      //check email valid
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(email) === false) {
        msg += 'Please enter valid email.';
        var error = true;
      }
    }
    if(error)
    {
      _showErrorMessage(msg);
    } else {
        this.setState({
          isloading: true,
        });
        var _this = this;
       console.log(data);
        data.append('email', email );
        data.append('password', password );
        data.append('mac_address', this.state.mac_address );
        data.append('device_token', this.state.device_token );
        console.log(data);
        fetch(config.API_URL+'login',{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body:data
        })
        .then((response) => response.json())
        .then((res) => {
          console.log(res);
          this.setState({
            isloading: false,
          });
          if(res.status == 1)
          {
            let appState = {
              isLoggedIn: true,
              userInfo: res.data
            };
            _storeUser(appState).then((user) => {
              this.props.navigation.replace("Direction");
            });
          }
          else if(res.status == 0)
          {
            _showErrorMessage(res.message, true)
          } else {
            throw "Error";
          }
        })
        .catch(function (error) {
          _showErrorMessage(error.message);
          _this.setState({
            isloading: false,
          });
        });
    }
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
      <Modal animationType="slide" transparent={true} visible={this.state.versionModal}>
        <View style={{flex: 1,alignItems: "center",marginTop: 70,padding: 10, height:500}}>
          <View style={{backgroundColor: "white",borderRadius: 20,shadowColor: "#000",borderColor: '#F9CCBE',
borderWidth: 1,shadowOffset: {width: 0,height: 2},shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 5}}>
            <View style={{alignSelf:'center',padding:10,height:80}}>
            <Text style={{fontSize:30, fontWeight:'bold', paddingTop:25}}>UPDATE APP</Text>
            </View>
            <View style={{ flexDirection: 'row',alignSelf:'center', padding:10,height:100}}>
              <Text style={{fontSize:22,color: 'red',alignSelf:'center', textAlign:'center'}}>ALERT: UPDATE TO THE LATEST VERSION OF THE APP TO CONTINUE.</Text>
            </View>
            <View style={{ flexDirection: 'row',alignSelf:'center', padding:10,height:20}}>
            </View>
          </View>
        </View>
      </Modal>
      <Container padder style={{backgroundColor: '#fff'}}>
          <View style={{ height: '100%', flexDirection: 'column' }}>
            <View style={{ backgroundColor: '#00C2F3', borderBottomLeftRadius: 80, borderBottomRightRadius: 80 }}>
              <Image
                style={{ height: 100, width: 200, resizeMode: 'contain', alignSelf: 'center', position: 'relative', top: '85%' }}
                source={image.logo}
              />
            </View>
            <View style={{flex: 1}}>
              <View style={{ marginTop: 50, padding: 10}}>
                <Form>
                  <Item stackedLabel>
                    <Label style={{ fontWeight: 'bold' }}>Email</Label>
                    <Item style={{ borderBottomColor: '#00C2F3'}}>
                      <Icon type="FontAwesome" name='user' style={{ color: '#00C2F3'}}/>
                      <Input placeholder="Enter your email" onChangeText={(email) => this.setState({ email: email })}/>
                    </Item>
                  </Item>
                  <Item stackedLabel last>
                    <Label style={{ fontWeight: 'bold' }}>Password</Label>
                    <Item style={{ borderBottomColor: '#00C2F3'}}>
                      <Icon type="FontAwesome" name='lock' style={{ color: '#00C2F3'}} />
                      <Input onChangeText={(password) => this.setState({ password: password })} secureTextEntry={true} placeholder="....."/>
                    </Item>
                  </Item>
                  <Item style={{ justifyContent: 'flex-end', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.replace('ForgotPassword') }}>
                      <Text>Forgot Password?</Text>
                    </TouchableOpacity>
                  </Item>
                </Form>
                <Button block style={{ width:"85%", height: 50, padding:15, marginTop: 20, backgroundColor: '#00C2F3', alignSelf: 'center' }}
                    onPress={() =>
                        this.loginSubmit()
                      }
                  >
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 22 }}>LOGIN</Text>
                </Button>
                <TouchableOpacity style={{alignSelf: 'center', top:18}} onPress={() => { this.props.navigation.replace('SignUp') }}>
                      <Text style={{fontSize: 16,color:'#00C2F3',textDecorationLine: 'underline'}}>{"Don't have an account? Sign up"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Container>
      {this.state.isloading && (
              <LoaderMain />
          )}
      </SafeAreaView>
    );
  }
}
export default Login;