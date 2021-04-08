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
import ParentHomePage from '../components/Home/ParentsHomePage';
import SupervisorHomePage from '../components/Home/SupervisorHomePage';
const Home = ({ navigation, route }) => {
    const user = useSelector(state => state.userReducer.data);
    
    const [permission, setPermission] = React.useState('');
    const getStorage = async () => {
        const valuePermission = await AsyncStorage.getItem('permission')
        setPermission(valuePermission)
    }

    useEffect(() => {
        (async () => {
            if(!user) {
                const backHandler = await BackHandler.addEventListener('hardwareBackPress', () => !!user);
            } else {
                const backHandler = await BackHandler.removeEventListener('hardwareBackPress', () => !!user);
            }
            return () => backHandler.remove();
        })();
        getStorage()
      }, []);
      
    if(permission) {
        if(permission === "teacher") {
            return (
                <TeacherHomePage navigation={navigation}/>
            )
        } else if(permission === "supervisor") {
            return (
                <SupervisorHomePage navigation={navigation}/>
            )
        } 
        else {
            return (
                <ParentHomePage navigation={navigation}/>
            )
        }
    }
    else {
        return <></>
    }
    
    
}

export default Home
