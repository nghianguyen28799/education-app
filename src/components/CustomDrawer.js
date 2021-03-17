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
    const user = useSelector(state => state.userReducer)
    const permission = React.useRef(user.data.permission);

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

    const handleSignOut = async () => {
        const getUserNameMemo = await AsyncStorage.getItem('userNameMemo');
        const getSelected= await AsyncStorage.getItem('isSelected');
        const getPermission = await AsyncStorage.getItem('permission');
        const token = await AsyncStorage.getItem('token');
        if(getPermission === 'teacher') {
            console.log('logout');
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


    if(permission.current === 'teacher' || permission.current === 'supervisor') {
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
                                        user.data.Avatar
                                        ? <Image source={{ uri: `${host}/${user.data.Avatar}`}} style={{width: 60, height: 60, borderRadius: 50}} />
                                        : <Image source={ UserCirle } style={{width: 60, height: 60}} />
                                    }
                                    
                                </View>
                            </View>
                            <View style={{ flex: 3/4, justifyContent: 'center', paddingLeft: 5}}>
                                <Text style={{ fontWeight: 'bold', color: '#000' }}>{user.data.FullName}</Text>
                                <View style={{ height: 5 }}></View>
                                {
                                    user.data.permission === 'teacher'
                                    ? <Text style={{ color: '#717D7E', fontSize: 12 }}>Giáo viên </Text>
                                    : <Text style={{ color: '#717D7E', fontSize: 12 }}>Giáo viên đưa đón</Text>
                                }
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
    
                            <DrawerItem 
                                label="Điểm danh" 
                                icon={({icon, size}) => <FontAwesome name="calendar" color="#057aae" size={18}/>}
                                onPress={() => navigation.navigate("Attendence", { page: getAttendanceScreen})}
                            />  
    
                            <DrawerItem 
                                label="Bản đồ" 
                                icon={({icon, size}) => <FontAwesome5 name="map-marked-alt" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("Attendence", { page: getAttendanceScreen})}
                            />  
     
                            <DrawerItem 
                                label="Scan QR" 
                                icon={({icon, size}) => <Ionicons name="scan" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("ScanQR")}
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
    } else if (permission.current === 'parents') {    // Phu huynh
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
                                        user.data.Avatar
                                        ? <Image source={{ uri: `${host}/${user.data.Avatar}` }} style={{width: 60, height: 60, borderRadius: 50}} />
                                        : <Image source={ UserCirle } style={{width: 60, height: 60}} />
                                    }
    
                                </View>
                            </View>
                            <View style={{ flex: 3/4, justifyContent: 'center', paddingLeft: 5}}>
                                <Text style={{ fontWeight: 'bold', color: '#000' }}>{user.data.FullName}</Text>
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

    <                       DrawerItem 
                                label="Hồ sơ GVCN" 
                                icon={({icon, size}) => <FontAwesome name="list-alt" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("ViewProfileTeacher")}
                            />
    
    
                            <DrawerItem 
                                label="Đổi mật khẩu" 
                                icon={({icon, size}) => <FontAwesome5 name="lock" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("ChangePassword")}
                            />

                            <DrawerItem 
                                label="Điểm danh" 
                                icon={({icon, size}) => <FontAwesome name="calendar" color="#057aae" size={18}/>}
                                onPress={() => navigation.navigate("Attendence", { page: getAttendanceScreen})}
                            />  
    
                            <DrawerItem 
                                label="Bản đồ" 
                                icon={({icon, size}) => <FontAwesome5 name="map-marked-alt" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("Attendence", { page: getAttendanceScreen})}
                            />  
     
                            <DrawerItem 
                                label="Scan QR" 
                                icon={({icon, size}) => <Ionicons name="scan" color="#057aae" size={18} />}
                                onPress={() => navigation.navigate("ScanQR")}
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
        <View></View>
    }
    
}
 
export default CustomDrawer;