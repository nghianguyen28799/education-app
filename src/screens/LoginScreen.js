import React, { Component, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, Alert, TouchableOpacity, AsyncStorage, Image, CheckBox  } from 'react-native';
// import { TextInput } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import host from '../assets/host';

import Logo from '../assets/images/Kids-Reading.jpg'
import ImageBackgroundLogin from "../assets/images/background-login.jpg"

import { useDispatch } from 'react-redux';
import { addUser } from '../actions/userAction';

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: false,
//         shouldSetBadge: false,
//     }),
// });


const Login = ({ navigation, route }) => {

    const dispatch = useDispatch();
    
    const [loading, setLoading] = React.useState(false);

    const { valueUserName, valueSelector } = route.params;

    // const valueUserName = 'teacher1';
    // const valueSelector = 'true'
   
    const [isSelected, setSelection] = useState(valueSelector);

    const [data, setData] = React.useState({
        userName: valueUserName,
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
    })

    // console.log(data);
  
    // const [expoPushToken, setExpoPushToken] = useState('');
    // const [notification, setNotification] = useState(false);
    // const notificationListener = useRef();
    // const responseListener = useRef();

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

            
            if(permission === 'teacher') { // handle login Teacher
                const timer = setInterval(async () => {
                    const user = await axios.post(`${host}/teacher/getUserFromToken`, { token, permission: 'teacher' })
                    dispatch(addUser(user.data))
                    navigation.replace('Home')
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
            password: data.password
        }
        await axios.post(`${host}/teacher/login`, user)
        .then(resTeacher => {
            const { token, error } = resTeacher.data
            if(error) {
                axios.post(`${host}/users/login`, user)
                .then(resUser => {
                    const { token, error } = resUser.data
                    if(error) {
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
                _storeData(token, data.userName, 'teacher')
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