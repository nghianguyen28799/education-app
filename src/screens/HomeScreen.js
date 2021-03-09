import React, { Component, useState, useEffect } from 'react';
import { 
    AsyncStorage,
    BackHandler
} from 'react-native';
import { useDispatch, useSelector  } from 'react-redux';
import { getUser } from '../actions/userAction';
import axios from 'axios';
import host from '../assets/host';
import TeacherHomePage from '../components/Home/TeacherHomePage';

const Home = ({ navigation }) => {
    const user = useSelector(state => state.userReducer.data);
    // console.log(user);
    // Phuc document https://github.com/ThanhPhucHuynh/food-pet/blob/main/screens/Home.tsx
    useEffect(() => {
        (async () => {
            if(!user) {
                const backHandler = await BackHandler.addEventListener('hardwareBackPress', () => !!user);
            } else {
                const backHandler = await BackHandler.removeEventListener('hardwareBackPress', () => !!user);
            }
            return () => backHandler.remove();
        })();
      }, []);
    return (
        <TeacherHomePage navigation={navigation}/>
    )
}

export default Home
