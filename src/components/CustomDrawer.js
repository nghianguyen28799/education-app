import React from 'react';
import { Text, View, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';

import Animated from 'react-native-reanimated';
import UserCirle from '../assets/images/user-circle.png'
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';
import { deleteUser } from '../actions/userAction';

import axios from 'axios';
import host from '../assets/host';

function CustomDrawer({navigation, progress, ...props}) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer.data)
    const [isPermission, setPermission] = React.useState('');
    // const permission = React.useRef(user.permission);

    const getAttendanceScreen = {
        title: 'Điểm danh',
        status: 1,
        valueAnim: 0,
        colorLabel:['#fff', '#2980B9']
    }

    const translateX = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [-100, 0]
    })

    const getData = async() => {
        const valuePermission = await AsyncStorage.getItem('permission')
        setPermission(valuePermission)
        // console.log(valuePermission);
    }

    React.useEffect(() => {
        getData()
    },[])

    const handleSignOut = async () => {
        const getUserNameMemo = await AsyncStorage.getItem('userNameMemo');
        const getSelected= await AsyncStorage.getItem('isSelected');
        const getPermission = await AsyncStorage.getItem('permission');
        const token = await AsyncStorage.getItem('token');
        if(getPermission === 'teacher' || getPermission === 'supervisor') {
            axios.post(`${host}/teacher/logout`, {token: token, permission: getPermission})
        }
        else {
            axios.post(`${host}/users/logout`, {token: token, permission: 'user'})
        }
        await AsyncStorage.removeItem('token');

        // dispatch(deleteUser());
      
        navigation.replace('Login', {
            valueUserName: getUserNameMemo ? getUserNameMemo : '',
            valueSelector: getSelected ? true : false
        });
    }

    if(isPermission === 'supervisor' && user) {
        return (    // Nguoi giam sat
            <View >
                <View style={{ flex: 0, height: "3%",}}>
    
                </View>
                <View 
                    style={{ 
                        flex: 0,
                        height: "12%",
                        backgroundColor: '#fff'
                    }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 1/4, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: 60, height: 60, borderRadius: 15 }}>
                                    {
                                        user.Avatar
                                        ? <Image source={{ uri: `${host}/${user.Avatar}`}} style={{width: 60, height: 60, borderRadius: 50}} />
                                        : <Image source={ UserCirle } style={{width: 60, height: 60}} />
                                    }
                                    
                                </View>
                            </View>
                            <View style={{ flex: 3/4, justifyContent: 'center', paddingLeft: 5}}>
                                <Text style={{ fontWeight: 'bold', color: '#000' }}>{user.FullName}</Text>
                                <View style={{ height: 5 }}></View>
                                    <Text style={{ color: '#717D7E', fontSize: 12 }}>Giáo viên đưa đón </Text>   
                             </View>
                        </View>
                </View>
                
                <View 
                    style={{ 
                        flex: 0, 
                        height: "72%",
                
                    }}>
                    <DrawerContentScrollView {...props}>
                        <Animated.View style={{ transform: [{translateX}]}}>
                            <DrawerItem 
                                label="Hồ sơ" 
                                icon={({icon, size}) => <FontAwesome name="user" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("Profile")}
                            />

                            <DrawerItem 
                                label="Đổi mật khẩu" 
                                icon={({icon, size}) => <FontAwesome5 name="lock" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("ChangePassword")}
                            />
    
                        </Animated.View>
                    </DrawerContentScrollView>
                </View>
    
                <View style= {{
                    flex: 0,
                    height: "10%",
                }}>
                   <DrawerContentScrollView {...props}>
                        <Animated.View style={{ transform: [{translateX}]}}>
                            <DrawerItem 
                                label="Đăng xuất" 
                                icon={() => <MaterialIcons name="logout" size={24} color="#057aae" />}
                                onPress={handleSignOut}
                            />  
                        </Animated.View>
                    </DrawerContentScrollView>
                </View>
            </View>
        )
    } else if (isPermission === 'user' && user ) {    // Phu huynh
        return (
            <View >
                <View style={{ flex: 0, height: "3%",}} />

                <View 
                    style={{ 
                        flex: 0,
                        height: "12%",
                        backgroundColor: '#fff'
                    }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 1/4, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: 60, height: 60, borderRadius: 40 }}>
                                {
                                        user.Avatar
                                        ? <Image source={{ uri: `${host}/${user.Avatar}` }} style={{width: 60, height: 60, borderRadius: 50}} />
                                        : <Image source={ UserCirle } style={{width: 60, height: 60}} />
                                    }
    
                                </View>
                            </View>
                            <View style={{ flex: 3/4, justifyContent: 'center', paddingLeft: 5}}>
                                <Text style={{ fontWeight: 'bold', color: '#000' }}>{user.FullName}</Text>
                                <View style={{ height: 5 }}></View>

                                   <Text style={{ color: '#717D7E', fontSize: 12 }}>Phụ huynh</Text>
                                
                             </View>
                        </View>
    
                </View>
                
                <View 
                    style={{ 
                        flex: 0, 
                        height: "72%",
                
                    }}>
                    <DrawerContentScrollView {...props}>
                        <Animated.View style={{ transform: [{translateX}]}}>
                            <DrawerItem 
                                label="Hồ sơ cá nhân" 
                                icon={({icon, size}) => <AntDesign name="profile" color="#057aae" size={18} />}                                onPress={() => navigation.navigate("Profile")}
                            />

                            <DrawerItem 
                                label="Hồ sơ GVCN" 
                                icon={({icon, size}) => <FontAwesome name="list-alt" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("ViewProfileTeacher")}
                            />
    
    
                            <DrawerItem 
                                label="Đổi mật khẩu" 
                                icon={({icon, size}) => <FontAwesome5 name="lock" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("ChangePassword")}
                            />
    
                        </Animated.View>
                    </DrawerContentScrollView>
                </View>
    
                <View style= {{
                    flex: 0,
                    height: "10%",
                }}>
                   <DrawerContentScrollView {...props}>
                        <Animated.View style={{ transform: [{translateX}]}}>
                            <DrawerItem 
                                label="Đăng xuất" 
                                icon={() => <MaterialIcons name="logout" size={24} color="#057aae" />}
                                onPress={handleSignOut}
                            />  
                        </Animated.View>
                    </DrawerContentScrollView>
                </View>
            </View>
        )
    } else if(isPermission === 'teacher' && user ) {
        return (    // Giao vien
            <View >
                <View style={{ flex: 0, height: "3%",}}>
    
                </View>
                <View 
                    style={{ 
                        flex: 0,
                        height: "12%",
                        backgroundColor: '#fff'
                    }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 1/4, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: 60, height: 60, borderRadius: 15 }}>
                                    {
                                        user
                                        ? <Image source={{ uri: `${host}/${user.Avatar}`}} style={{width: 60, height: 60, borderRadius: 50}} />
                                        : <Image source={ UserCirle } style={{width: 60, height: 60}} />
                                    }
                                    
                                </View>
                            </View>
                            <View style={{ flex: 3/4, justifyContent: 'center', paddingLeft: 5}}>
                                <Text style={{ fontWeight: 'bold', color: '#000' }}>{user.FullName}</Text>
                                <View style={{ height: 5 }}></View>
                                    <Text style={{ color: '#717D7E', fontSize: 12 }}>Giáo viên chủ nhiệm</Text>
                             </View>
                        </View>
                </View>
                
                <View 
                    style={{ 
                        flex: 0, 
                        height: "72%",
                
                    }}>
                    <DrawerContentScrollView {...props}>
                        <Animated.View style={{ transform: [{translateX}]}}>
                            <DrawerItem 
                                label="Hồ sơ" 
                                icon={({icon, size}) => <FontAwesome name="user" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("Profile")}
                            />

                            <DrawerItem 
                                label="Đổi mật khẩu" 
                                icon={({icon, size}) => <FontAwesome5 name="lock" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("ChangePassword")}
                            />

                            <DrawerItem 
                                label="Danh sách lớp" 
                                icon={({icon, size}) => <FontAwesome name="list-alt" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("StudentList")}
                            />    
                        </Animated.View>
                    </DrawerContentScrollView>
                </View>
    
                <View style= {{
                    flex: 0,
                    height: "10%",
                }}>
                   <DrawerContentScrollView {...props}>
                        <Animated.View style={{ transform: [{translateX}]}}>
                            <DrawerItem 
                                label="Đăng xuất" 
                                icon={() => <MaterialIcons name="logout" size={24} color="#057aae" />}
                                onPress={handleSignOut}
                            />  
                        </Animated.View>
                    </DrawerContentScrollView>
                </View>
            </View>
        )
    } else {
        return (
            <View></View>
        )
    }
    
}
 
export default CustomDrawer;