import React from 'react';
import { SafeAreaView, View, Text, AsyncStorage } from 'react-native';
// import LottieView from 'lottie-react-native';
// import animateLoader from '../assets/json/loader.json'
import axios from 'axios';
import host from '../assets/host'
import { useDispatch } from 'react-redux';
import { addUser } from '../actions/userAction'
import { addInfo, initialInfo } from '../actions/followAction'
import { addStudent, initialStudent } from '../actions/attendanceListAction'
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
    

    const isList = await axios.post(`${host}/registerbus/showAllList`, { id })
    // const dateNow = new Date(isSchedule.data.date).getDate()+"/"+new Date(isSchedule.data.date).getMonth()
    
    isList.data.map(async (value) => {
      const studentData = await axios.post(`${host}/student/getStudentByParentsId`, {id: value.parentsId})
      const updatedData = await axios.post(`${host}/registerbus/updateDate`, {id: value.parentsId})
      const studentInfo = {
        valueparentsId: value.parentsId,
        student: studentData.data,
        station: {
          station: value.station,
          getOnBusFromHouse: updatedData.data.getOnBusFromHouse,
          getOutBusFromHouse: updatedData.data.getOutBusFromHouse,
          getOnBusFromSchool: updatedData.data.getOnBusFromSchool,
          getOutBusFromSchool: updatedData.data.getOutBusFromSchool,
          // supervisorId: updatedData.data.supervisorId,
        }
      };  
      dispatch(addInfo(studentInfo))
    })
  }

  const addStudentToAttendannce = async (classCode) => {
    const isStudentList = await axios.post(`${host}/student/getStudentByClassCode`, { classCode })
    isStudentList.data.map(async(item) => {
      const isParents = await axios.post(`${host}/users/getUserById`, { id: item.parentsCode })
      const parentsId = isParents.data[0]._id;
      const isRegister = await axios.post(`${host}/registerbus/show`, { id: parentsId })
      if(Object.entries(isRegister.data).length > 0) {
        const info = {
          ...item,
          bus: true,
          date: isRegister.data.date,
          getOnBusFromHouse: isRegister.data.getOnBusFromHouse,
          getOutBusFromHouse: isRegister.data.getOutBusFromHouse,
          getOnBusFromSchool: isRegister.data.getOnBusFromSchool,
          getOutBusFromSchool: isRegister.data.getOutBusFromSchool,
        } 
        // console.log(info);
        dispatch(addStudent(info))    
      } else {
        const info = {
          ...item,
          bus: false,
        } 
        dispatch(addStudent(info))    
      }
    })
  }

  const handleChangePage = async () => {
    // AsyncStorage.clear();
    // navigation.replace('Welcome');
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
          dispatch(initialInfo())
          const user = await axios.post(`${host}/teacher/getUserFromToken`, {token: valueToken, permission: 'supervisor'})
          addStudentList(user.data._id)
          dispatch(addUser(user.data))
          navigation.replace('SupervisorHome');
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

  React.useEffect(() => {
  // database.collection('location').onSnapshot(query => {
  //   query.forEach((doc) => {
  //     console.log(doc.data());
  //   })
  // })
  // database.collection('location').add({
  //   locationById: {
  //     id: '123',
  //     lat: Number(1.232),
  //     lng: Number(123.23)
  //   }
  // })
  },[])

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