import React from 'react';
import { SafeAreaView, View, Text, AsyncStorage } from 'react-native';
// import LottieView from 'lottie-react-native';
// import animateLoader from '../assets/json/loader.json'
import axios from 'axios';
import host from '../assets/host'
import { useDispatch } from 'react-redux';
import { addUser } from '../actions/userAction'
import { addInfo } from '../actions/followAction'

import LottieView from 'lottie-react-native';
import { useRef } from 'react';

// import LoadingAnimation from '../assets/json/loader.json';



export default function LoaderScreen({ navigation }) {
  
  const animataLotte = useRef(null);

  const dispatch = useDispatch();

  const handleChangePage = async () => {
    const getUserNameMemo = await AsyncStorage.getItem('userNameMemo');
    const getSelected= await AsyncStorage.getItem('isSelected');

    const valueFirstLaunch = await AsyncStorage.getItem('alreadyLauched')
    const valueToken = await AsyncStorage.getItem('token')
    if(valueFirstLaunch) {
      if(valueToken) {
        const valuePermission = await AsyncStorage.getItem('permission')
        if(valuePermission === 'teacher' ) {
          const user = await axios.post(`${host}/teacher/getUserFromToken`, {token: valueToken, permission: 'teacher'})
          dispatch(addUser(user.data))
          navigation.replace('Home');
        } else {
          const user = await axios.post(`${host}/users/getUserFromToken`, {token: valueToken, permission: 'user'})
          dispatch(addUser(user.data))
          navigation.replace('Home');
        }
      } else {
        navigation.replace('Login', {
           valueUserName: getUserNameMemo ? getUserNameMemo : '',
           valueSelector: getSelected ? true : false
        });
      }
    } else {
      navigation.replace('Welcome');
    }
  }

  React.useEffect(()=>{
    animataLotte.current.play();
  },[])

  const timer = setInterval(() => {
    handleChangePage()
    clearInterval(timer) 
  }, 1000);
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <LottieView
      ref={animataLotte}
      source={require('../assets/json/data.json')}  />
    </View>
  )
}