import React, { Component, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, Alert, TouchableOpacity, AsyncStorage, Image, CheckBox  } from 'react-native';

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions'

import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import host from '../assets/host';

import Logo from '../assets/images/Kids-Reading.jpg'
import Logo2 from '../assets/images/go-to-school-by-bus-logo.png'

import ImageBackgroundLogin from "../assets/images/background-login.jpg"


import { useDispatch } from 'react-redux';
import { addUser } from '../actions/userAction'
import { addInfo, initialInfo } from '../actions/followAction'
import { addDestination } from '../actions/destinationAction'
import { addStudent, initialStudent } from '../actions/attendanceListAction'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});




const Login = ({ navigation, route }) => {

    const dispatch = useDispatch();
    
    // start notification 

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    React.useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
        setExpoPushToken(token);
    //   console.log(token);

    });
    
        // (async () => {
        //   const token_vale = await AsyncStorage.getItem('token');
        
        // })();
      }, []);

    // end notification

    const [loading, setLoading] = React.useState(false);

    const { valueUserName, valueSelector } = route.params;
    const [isSelected, setSelection] = useState(valueSelector);

    const [data, setData] = React.useState({
        userName: valueUserName,
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
    })


    const TextInputChange = (val) => {
        if( val.length === 0 ) {
            setData({
                ...data,
                userName: val,
                check_textInputChange: false,  
            })
        } else {
            setData({
                ...data,
                userName: val,
                check_textInputChange: true,  
            })
        }
    }

    const handelPasswordChange = (val) => {
        setData({
            ... data,
            password: val
        })
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        })
    }
    
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
            //   supervisorId: updatedData.data.supervisorId,
            }
          };  
          dispatch(addInfo(studentInfo))
        })
    }

    const addStudentToAttendannce = async (classCode) => {
        dispatch(initialStudent());
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

    const _storeData = async (token, userName, permission) => {
        try {
            setLoading(true);
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('permission', permission);
            
            if(isSelected) {
                await AsyncStorage.setItem('userNameMemo', userName);
                await AsyncStorage.setItem('isSelected', 'true')
            } else {
                await AsyncStorage.removeItem('userNameMemo');
                await AsyncStorage.removeItem('isSelected');
            }

            
            if(permission === 'supervisor') {
                const timer = setInterval(async () => {
                    dispatch(initialInfo());
                    const user = await axios.post(`${host}/teacher/getUserFromToken`, { token, permission: 'supervisor' })
                    dispatch(addUser(user.data))
                    addStudentList(user.data._id)
                    navigation.replace('SupervisorHome')
                    clearInterval(timer) 
                }, 2000);
            }
            else if(permission === 'teacher') { // handle login Teacher
                const timer = setInterval(async () => {
                    const user = await axios.post(`${host}/teacher/getUserFromToken`, { token, permission: 'teacher' })
                    dispatch(addUser(user.data))
                    addStudentToAttendannce(user.data.ClassCode)
                    navigation.replace('TeacherHome')
                    clearInterval(timer) 
                }, 2000);
            } else {
                const timer = setInterval( async () => { // handle login User
                    const user = await axios.post(`${host}/users/getUserFromToken`, { token, permission: 'user' })
                    dispatch(addUser(user.data))
                    navigation.replace('Home')
                    clearInterval(timer) 
                }, 2000);
            }
           
        } catch (error) {
            console.log('authentic error');
        }
    };

    const validLogin = async () => {
        const user = {
            userName: data.userName,
            password: data.password,
            tokenDevices: expoPushToken
        }
   
        await axios.post(`${host}/teacher/login`, user )
        .then(resTeacher => {
            const { teacher, token, error } = resTeacher.data
            if(error) {
                console.log('abc');
                axios.post(`${host}/users/login`, user )
                .then(resUser => {
                    const { token, error } = resUser.data
                    if(error) {
                        console.log(expoPushToken);
                    Alert.alert("Tên đăng nhập hoặc mật khẩu không đúng!")
                    setData({
                        ...data,
                        password: '',
                    })
                    }else {
                        _storeData(token, data.userName, 'user')    
                    }
                })
            } else {
                _storeData(token, data.userName, teacher.permission)
            }
        })
    }

    return(
        <View style={ styles.container }>
            <ImageBackground source={ImageBackgroundLogin} style={{ flex: 1, resizeMode: "cover", justifyContent: "center"}}>
                <View style={styles.header}>

                    
                </View>
                <View style={styles.footer}>
                    {/* Start UserName */}
                    <View>
                        <Text style={{ color: '#05375a', fontSize: 16 }}>
                            Tên đăng nhập
                        </Text>
                        <View style={{ 
                            flexDirection: 'row',
                            marginTop: 5,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f2f2f2',
                            paddingBottom: 5
                            // marginVertical: 10,
                        }}>
                            <FontAwesome 
                                name="user-o" 
                                size={20} 
                                color="black" 
                                style={{ marginTop: 5}}
                            />
                            <TextInput 
                                value={data.userName}
                                style={{ marginHorizontal: 10, flex: 1 }}
                                placeholder="Tên đăng nhập"
                                autoCapitalize= "none"
                                onChangeText={(val) => TextInputChange(val)}
                            />
                            { data.check_textInputChange ?
                            <Feather 
                                name="check-circle" 
                                size={18} 
                                color="green" 
                                style={{ marginTop: 5}}
                            />
                            : null }
                            
                        </View>
                    {/* End UserName */}

                    {/* Start Password */}
                        <Text style={{ color: '#05375a', fontSize: 16, marginTop: 20 }}>
                            Mật khẩu
                        </Text>
                        <View style={{ 
                            flexDirection: 'row',
                            marginTop: 5,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f2f2f2',
                            paddingBottom: 5
                            // marginVertical: 10,
                        }}>
                            <Entypo 
                                name="lock" 
                                size={20} 
                                color="black" 
                                style={{ marginTop: 5}}
                            />
                            <TextInput 
                                value={data.password}
                                style={{ marginHorizontal: 10, flex: 1 }}
                                placeholder="Mật khẩu"
                                autoCapitalize= "none"
                                secureTextEntry={ data.secureTextEntry }
                                onChangeText = {(val) => handelPasswordChange(val)}
                            />
                            
                            <TouchableOpacity
                                onPress = {updateSecureTextEntry}
                            > 
                                { data.secureTextEntry
                                    ? <Feather name="eye-off" size={20} color="black" style={{ marginTop: 5}}/>
                                    : <Feather name="eye" size={20} color="black" style={{ marginTop: 5}}/>
                                }
                            </TouchableOpacity>
                    </View>
                    {/* End Password */}
                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                        <CheckBox
                            value={isSelected}
                            onValueChange={setSelection}
                        />
                        <Text>Ghi nhớ tài khoản</Text>
                    </View>
                    {/* Start Button */}
                    <View style={{ alignItems: 'center', marginTop: 30 }}>
                        <TouchableOpacity
                            style={{ flex: 0, width: '100%'}}
                            onPress={validLogin}
                        >
                        <LinearGradient
                            colors={['#08d4c4', '#01ab9d']}
                            style={{ 
                                width: '100%',
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đăng nhập</Text>
                        </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center', marginTop: 30, width: '100%', height: 260 }}>
                        <Image source={Logo} style={{ width: '100%', height: 260 }}/>
                    </View>
                    
                    {/* End Button */}

                    </View>
                </View>
                {
                    loading
                    ? <LottieView source={require('../assets/json/loader.json')} autoPlay loop />
                    : null
                }
               
            </ImageBackground>
        </View>
    )
}

export default Login

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    //   console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#009387'
    },

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },

    footer: {
        flex: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    }
})