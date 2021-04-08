import React from 'react';
import { SafeAreaView, View, Text, AsyncStorage } from 'react-native';
// import LottieView from 'lottie-react-native';
// import animateLoader from '../assets/json/loader.json'
import axios from 'axios';
import host from '../assets/host'
import { useDispatch } from 'react-redux';
import { addUser } from '../actions/userAction'
import { addInfo } from '../actions/followAction'
import { addStudent } from '../actions/attendanceListAction'
import { addDestination } from '../actions/destinationAction'

import LottieView from 'lottie-react-native';
import { useRef } from 'react';

import { database } from '../assets/host/firebase'
// import LoadingAnimation from '../assets/json/loader.json';



export default function LoaderScreen({ navigation }) {
  
  const animataLotte = useRef(null);

  const dispatch = useDispatch();

  const addStudentList = async (id) => {
    const isSchedule = await axios.post(`${host}/supervisorschedule/showdestination`, { id: id})
    const initialSchedule = {
      date: new Date(),
        process: {
            "destination": 0,
            "status": false,
          },
        status: {
            "getOnBus": false,
            "getOutBus": false,
        },
    }   
    if(Object.entries(isSchedule.data).length != 0) {
      const findDate = (new Date(isSchedule.data.date)).getDate() + '/' + (new Date(isSchedule.data.date)).getMonth();
      const today = new Date().getDate() + '/' + new Date().getMonth();
      if(findDate === today) {
        dispatch(addDestination(isSchedule.data))
      } else {
        dispatch(addDestination(initialSchedule))
      }
    }  else {
      dispatch(addDestination(initialSchedule))
    }   
    

    const isList = await axios.post(`${host}/registerbus/showAllList`)
    const dateNow = new Date(isSchedule.data.date).getDate()+"/"+new Date(isSchedule.data.date).getMonth()
    
    isList.data.map(value => {
        value.listBookStation.map(value2 => {
            const getDate = (new Date(value2.date)).getDate()+'/'+(new Date(value2.date)).getMonth()
            if(getDate === dateNow) {
                axios.post(`${host}/student/getStudentByParentsId`, {id: value.parentsId})
                .then(res => {
                  const studentInfo = {
                    valueparentsId: value.parentsId,
                    student: res.data,
                    station: value2
                  };
                  dispatch(addInfo(studentInfo))
                })
            }    
        })
    })
  }

  const addStudentToAttendannce = async (classCode) => {
    const isStudentList = await axios.post(`${host}/student/getStudentByClassCode`, { classCode })
    isStudentList.data.map(item => {
      dispatch(addStudent(item))
    })
  }

  const handleChangePage = async () => {
    const getUserNameMemo = await AsyncStorage.getItem('userNameMemo');
    const getSelected= await AsyncStorage.getItem('isSelected');

    const valueFirstLaunch = await AsyncStorage.getItem('alreadyLauched')
    const valueToken = await AsyncStorage.getItem('token')

    if(valueFirstLaunch) {
    
      if(valueToken) {
        const valuePermission = await AsyncStorage.getItem('permission')
        if(valuePermission === 'teacher') {
          const user = await axios.post(`${host}/teacher/getUserFromToken`, {token: valueToken, permission: 'teacher'})
          dispatch(addUser(user.data))
          addStudentToAttendannce(user.data.ClassCode);
          navigation.replace('TeacherHome');
        }
        else if(valuePermission === 'supervisor' ) {
          const user = await axios.post(`${host}/teacher/getUserFromToken`, {token: valueToken, permission: 'supervisor'})
          addStudentList(user.data._id)
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
    handleChangePage()
    animataLotte.current.play();
  },[])

  // React.useEffect(() => {
  //   database.ref('location')
  //   .on('idSupervisor', (snapshot) => {
  //     console.log(snapshot.val());
  //   })
  // },[])

  const timer = setInterval(() => {
    // handleChangePage()
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