import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    FlatList
} from 'react-native'

import axios from 'axios';
import host from '../../assets/host';
import { useDispatch, useSelector } from 'react-redux'
import { editInfo } from '../../actions/followAction'
// icon store
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// close icon store
import * as Location from 'expo-location';
import { database } from '../../assets/host/firebase'

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
// import XuanMaiImg from '../../assets/images/xuanmai.jpg';
import AttendenceScreen from '../../screens/AttendenceScreen';
import MaleNoneAvatar from '../../assets/images/male-none-avatar.png'
import FemaleNoneAvatar from '../../assets/images/female-none-avatar.png'
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const SupervisorHomePage = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const bs = React.createRef()
    const fall1 = new Animated.Value(1);
    const user = useSelector(state => state.userReducer.data)
    const infoStudentList = useSelector(state => state.followReducer.infoStudentList)
    const scheduleInfo = useSelector(state => state.destinationReducer.data)
    const [gps, setGps] = React.useState(false);
    const [timer, setTimer] = React.useState();
    // const [location, setLocation] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);
    // const [mapRegion, setMapRegion] = React.useState(null);
    const [uid, setUid] = React.useState("");
    const [station, setStation] = React.useState([]);

    const getAttendanceScreen = {
        title: 'Lên xe',
        status: 1,
        valueAnim: 0,
        colorLabel:['#fff', '#2980B9']
    }

    const getOutBusScreen = {
        title: 'Xuống xe',
        status: 2,
        valueAnim: width/2 - 10,
        colorLabel:['#2980B9', '#fff']
    }
    
    const getStation = async () => {
        const isStation = await axios.get(`${host}/station/show`)
        setStation(isStation.data);
    }

    const getData = async () => {
        let id = "";
        await database.collection("location").where('locationById.id', '==',user._id)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                id = doc.id;
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        if(id) {
            setGps(true) 
            setUid(id)
            realtimeGps(id)
        }
        
    }

    const getPermission = async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
        }
    }
    React.useEffect(() => {
        getPermission();
        getData() 
        getStation()
    },[])

    const realtimeGps = (uid) => {
        setTimer(setInterval(handleData, 5000))
        async function handleData() {
            // console.log('uid', uid);
            let location = await Location.getCurrentPositionAsync({});
            database.collection('location').doc(uid).update({
                locationById: {
                    id: user._id,
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
                }
            })
        }
    }

    const addRealtimeGps = async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
        }
        let location = await Location.getCurrentPositionAsync({});
        database.collection('location').add({
            locationById: {
                id: user._id,
                lat: location.coords.latitude,
                lng: location.coords.longitude
            }
        })
        getData()
    }

    const deleteRealtimeGps = () => {
        database.collection('location').doc(uid).delete()
        clearInterval(timer);
    }

    const realtimeGpsOff = () => {
        deleteRealtimeGps()
        setGps(false)
    }

    const realtimeGpsOn = () => {
        addRealtimeGps()
        setGps(true)
    }

    const notification_content = (id, destinationName) => {
        infoStudentList.map(async (item) => {
            if(item.data.station.station === id) {
                const { parentsCode } = item.data.student;
                const isParents = await axios.post(`${host}/users/getUserById`, { id: parentsCode })
                isParents.data[0].tokens.map(itemToken => {
                    sendPushNotification(itemToken.tokenDevices, destinationName )
                });
            }
        })
    }
    // Start Bottom Sheet

    const renderHeader = () => (
        <View style={{ overflow: 'hidden', paddingTop: 5 }}>
            <View style={{
                backgroundColor: '#FFFFFF',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,
                elevation: 10,
                paddingTop: 15,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }}>
                <View style={{  alignItems: 'center',}}>
                    <View style={{
                        width: 40,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#00000040',
                        marginBottom: 10,
                    }} />
                </View>
            </View>
        </View>
    )

    const renderContent = (station) => (
        <View style={styles.panel}>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Thông báo</Text>
                <Text style={styles.panelSubtitle}>Chọn bến sắp đến trong khoảng 5 phút nữa</Text>
            </View>

            {
                station.map((item, index) => (
                <TouchableOpacity 
                    key={item._id}
                    style={styles.panelButton}
                    onPress={() => {
                        notification_content(item._id, item.name),
                        bs.current.snapTo(1)
                    }
                    }>
                    <Text style={styles.panelButtonTitle}>{item.name}</Text>
                </TouchableOpacity>
                ))
            }

            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => bs.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    // End Bottom SheetRef

    async function sendPushNotification(expoPushToken, destination) {
        const message = {
          to: expoPushToken,
          sound: 'default',
          title: 'Xe sắp đến',
          body: `Xe sẽ đến ${destination} khoảng 5 phút nữa`,
          data: { someData: 'goes here' },
        };
      
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }

    return (
        <View style={{ flex: 1 }} >
            {
                scheduleInfo ?
                <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                {/* start bottom sheet */}
                    {
                        station
                        ?
                        <BottomSheet
                            ref={bs}
                            initialSnap={1}
                            callbackNode={fall1}
                            snapPoints={[450, 0]}
                            borderRadius={10}
                            renderHeader={renderHeader}
                            renderContent={() => renderContent(station)}
                            zIndex={99999999}
                        />
                        : null
                    }
                    
                {/* end bottom sheet */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                    >
                        <View style={styles.goBackHeader}>
                            {/* <Entypo name="menu" size={30} color="#6495ED" /> */}
                            <Feather name="menu" size={29} color="#6495ED" />
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.titleHeader}>
                        <Text style={styles.titleHeader_text}>Trang chủ</Text>
                    </View>
                    
                    <TouchableOpacity
                        onPress={() => bs.current.snapTo(0)}
                    >
                        <View style={styles.RealtimeChatHeader}>
                            <AntDesign name="notification" size={24} color="#2980B9" />
                        </View>
                    </TouchableOpacity>
                </View>  

                <View style={styles.body}>
                    <View style={styles.attendance_management_list_space}>
                        <View style={styles.attendance_management_title_on_thebus}>
                            <Text style={{ 
                                color: '#2980B9',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}>Lên xe còn lại </Text>
                            <Text style={{
                                fontSize: 16,
                                color: '#FA0000',
                                fontWeight: 'bold',
                            }}>({
                                scheduleInfo.process.destination === 1 && scheduleInfo.status.getOnBus == true
                                ?
                                    !infoStudentList?'0':
                                    infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                    accumulator += array[currentIndex]?.data.station.getOnBusFromHouse?0:1,0)
                                : 
                                scheduleInfo.process.destination === 2 && scheduleInfo.status.getOnBus == true
                                ?
                                    !infoStudentList?'0':
                                    infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                    accumulator += array[currentIndex]?.data.station.getOnBusFromSchool?0:1,0)
                                : 0
                                })</Text>
                        </View>

                        <View style={styles.attendance_management_list_on_thebus}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        
                                {
                                    scheduleInfo.process.destination === 1 && scheduleInfo.status.getOnBus == true
                                    ? 
                                    infoStudentList.map((value, index) => (
                                        <View key={index}>
                                            {
                                                value.data.station.getOnBusFromHouse === false
                                                &&
                                                <TouchableOpacity  
                                                    onPress={() => navigation.navigate('ViewProfileStudent', {
                                                        studentData: value.data.student
                                                    })}
                                                >
                                                    <View style={styles.attendance_management_each_student_space}>
                                                        <View style={styles.attendance_management_each_student_image}>
                                                           
                                                            <Image 
                                                                source={value.data.student.avatar ? {uri: `${host}/${value.data.student.avatar}`} : value.data.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
                                                            style={{
                                                                width: 70,
                                                                height: 70,
                                                                borderRadius: 50
                                                            }}/>
                                                        </View>
                                                        <View style={styles.attendance_management_each_student_name}>
                                                            <Text style={{ 
                                                                color: '#2980B9',
                                                                fontWeight: '600',
                                                                width: 120, 
                                                                textAlign: 'center',
                                                                fontSize: 12
                                                            }}> {value.data.student.name} </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                }
                                        </View>
                                    ))
                                    : scheduleInfo.process.destination === 2 && scheduleInfo.status.getOnBus == true
                                    ? infoStudentList.map((value, index) => (
                                        <View key={index}>
                                            {
                                                value.data.station.getOnBusFromSchool === false
                                                &&
                                                <TouchableOpacity  
                                                    onPress={() => navigation.navigate('ViewProfileStudent', {
                                                        studentData: value.data.student
                                                    })}
                                                >
                                                    <View style={styles.attendance_management_each_student_space}>
                                                        <View style={styles.attendance_management_each_student_image}>
                                                            <Image 
                                                                source={value.data.student.avatar ? {uri: `${host}/${value.data.student.avatar}`} : value.data.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
                                                            style={{
                                                                width: 70,
                                                                height: 70,
                                                                borderRadius: 50
                                                            }}/>
                                                        </View>
                                                        <View style={styles.attendance_management_each_student_name}>
                                                            <Text style={{ 
                                                                color: '#2980B9',
                                                                fontWeight: '600',
                                                                width: 120, 
                                                                textAlign: 'center',
                                                                fontSize: 12
                                                            }}> {value.data.student.name} </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                }
                                        </View>
                                    ))
                                    : 
                                    null
                                }
                            </ScrollView>
                            <Text style={{ color: '#A6ACAF', marginBottom: 15 }}>
                                {
                                    scheduleInfo.process.destination === 1 && scheduleInfo.status.getOnBus == true
                                    ?
                                        !infoStudentList?'0':
                                        (
                                            infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                            accumulator += array[currentIndex]?.data.station.getOnBusFromHouse?1:0,0)
                                        ) - infoStudentList.length === 0
                                        ? "Không có thông tin học sinh."
                                        : ''
                                    : 
                                    scheduleInfo.process.destination === 2 && scheduleInfo.status.getOnBus == true
                                    ?
                                    (
                                        infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                        accumulator += array[currentIndex]?.data.station.getOnBusFromSchool?1:0,0)
                                        ) - infoStudentList.length === 0
                                        ? "Không có thông tin học sinh."
                                        : ''
                                    : "Lên xe chưa được bật"
                                }
                            </Text>
                        </View>

                        <View style={styles.attendance_management_title_off_thebus}>
                            <Text style={{ 
                                color: '#2980B9',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}>Xuống xe còn lại </Text>
                            <Text style={{
                                fontSize: 16,
                                color: '#FA0000',
                                fontWeight: 'bold',
                                // so 0 ne
                            }}>({
                                scheduleInfo.process.destination === 1 && scheduleInfo.status.getOutBus == true
                                ?
                                    !infoStudentList?'0':
                                    infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                    accumulator += array[currentIndex]?.data.station.getOutBusFromHouse?0:1,0)
                                : 
                                scheduleInfo.process.destination === 2 && scheduleInfo.status.getOutBus == true
                                ?
                                    !infoStudentList?'0':
                                    infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                    accumulator += array[currentIndex]?.data.station.getOutBusFromSchool?0:1,0)
                                : 0
                            })</Text>
                        </View>

                        <View style={styles.attendance_management_list_off_thebus}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    scheduleInfo.process.destination === 1 && scheduleInfo.status.getOutBus == true
                                    ? 
                                    infoStudentList.map((value, index) => (
                                        <View key={index}>
                                            {
                                                value.data.station.getOutBusFromHouse === false
                                                &&
                                                <TouchableOpacity  
                                                    onPress={() => navigation.navigate('ViewProfileStudent', {
                                                        studentData: value.data.student
                                                    })}
                                                >
                                                    <View style={styles.attendance_management_each_student_space}>
                                                        <View style={styles.attendance_management_each_student_image}>
                                                            <Image 
                                                                source={value.data.student.avatar ? {uri: `${host}/${value.data.student.avatar}`} : value.data.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
                                                            style={{
                                                                width: 70,
                                                                height: 70,
                                                                borderRadius: 50
                                                            }}/>
                                                        </View>
                                                        <View style={styles.attendance_management_each_student_name}>
                                                            <Text style={{ 
                                                                color: '#2980B9',
                                                                fontWeight: '600',
                                                                width: 120, 
                                                                textAlign: 'center',
                                                                fontSize: 12
                                                            }}> {value.data.student.name} </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                }
                                        </View>
                                    ))
                                    : scheduleInfo.process.destination === 2 && scheduleInfo.status.getOutBus == true
                                    ? infoStudentList.map((value, index) => (
                                        <View key={index}>
                                            {
                                                value.data.station.getOutBusFromSchool === false
                                                &&
                                                <TouchableOpacity  
                                                    onPress={() => navigation.navigate('ViewProfileStudent', {
                                                        studentData: value.data.student
                                                    })}
                                                >
                                                    <View style={styles.attendance_management_each_student_space}>
                                                        <View style={styles.attendance_management_each_student_image}>
                                                            <Image 
                                                                source={value.data.student.avatar ? {uri: `${host}/${value.data.student.avatar}`} : value.data.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
                                                            style={{
                                                                width: 70,
                                                                height: 70,
                                                                borderRadius: 50
                                                            }}/>
                                                        </View>
                                                        <View style={styles.attendance_management_each_student_name}>
                                                            <Text style={{ 
                                                                color: '#2980B9',
                                                                fontWeight: '600',
                                                                width: 120, 
                                                                textAlign: 'center',
                                                                fontSize: 12
                                                            }}> {value.data.student.name} </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                }
                                        </View>
                                    ))
                                    : null
                                }
                            </ScrollView>
                            <Text style={{ color: '#A6ACAF' }}>
                                {
                                    scheduleInfo.process.destination === 1 && scheduleInfo.status.getOutBus == true
                                    ?
                                        !infoStudentList?'0':
                                        (
                                            infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                            accumulator += array[currentIndex]?.data.station.getOutBusFromHouse?1:0,0)
                                        ) - infoStudentList.length === 0
                                        ? "Không có thông tin học sinh."
                                        : ''
                                    : 
                                    scheduleInfo.process.destination === 2 && scheduleInfo.status.getOutBus == true
                                    ?
                                    (
                                        infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                        accumulator += array[currentIndex]?.data.station.getOutBusFromSchool?1:0,0)
                                        ) - infoStudentList.length === 0
                                        ? "Không có thông tin học sinh."
                                        : ''
                                    : "Xuống xe chưa được bật"
                                }
                            </Text>
                        </View>
                    </View>

                    <View style={styles.status_of_destination_space}>
                        <View style={styles.status_of_destination_space_title}>
                            <View style={styles.status_of_destination_space_icons}>
                                {
                                    scheduleInfo.process.destination === 1
                                    ?   <MaterialIcons name="house" size={20} color="#40E0D0" />
                                    :   <FontAwesome5 name="school" size={20} color="#40E0D0" />
                                }
                                <AntDesign name="right" size={16} color="black" style={{ marginLeft: 3, marginRight: 3 }}/>
                                {
                                    scheduleInfo.process.destination === 1
                                    ?    <FontAwesome5 name="school" size={20} color="#40E0D0" />
                                    :   <MaterialIcons name="house" size={20} color="#40E0D0" />
                                }
                            </View>
                            <Text style={{
                                flex: 1,
                                marginBottom: 10,
                                fontSize: 13,
                                fontWeight: 'bold',
                                color: '#2980B9',
                                textAlign: 'right',
                            }}>{scheduleInfo.process.status === true ? "Đang diễn ra" : "Kết thúc"}</Text>
                        </View>

                        <View style={styles.status_of_destination_space_content}>
                            <View style={styles.status_of_destination_onoff_thebus}>

                                <Text style={{ fontSize: 13, color: '#2980B9' }}>Lên xe: </Text>
                                <Text style={{ fontSize: 13, color: '#2980B9' }}>
                                    {
                                        scheduleInfo.process.destination === 1 && scheduleInfo.status.getOnBus == true
                                        ?
                                            !infoStudentList?'0':
                                            infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                            accumulator += array[currentIndex]?.data.station.getOnBusFromHouse?1:0,0)
                                        : 
                                        scheduleInfo.process.destination === 2 && scheduleInfo.status.getOnBus == true
                                        ?
                                            !infoStudentList?'0':
                                            infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                            accumulator += array[currentIndex]?.data.station.getOnBusFromSchool?1:0,0)
                                        : 0
                                    }/{
                                        scheduleInfo.status.getOnBus == true
                                        ? 
                                        infoStudentList.length
                                        : 0
                                    }
                                </Text>

                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Text style={{ color: '#2980B9' }}>Điểm đến: </Text>
                                    <Text style={{ color: '#2980B9', fontWeight: 'bold' }}>Nguyễn Văn Linh</Text>
                                </View>

                            </View>

                            <View style={styles.status_of_destination_onoff_thebus}>

                                <Text style={{ fontSize: 13, color: '#2980B9' }}>Xuống xe: </Text>
                                <Text style={{ fontSize: 13, color: '#2980B9' }}>
                                    {
                                        scheduleInfo.process.destination === 1 && scheduleInfo.status.getOutBus == true
                                        ?
                                            !infoStudentList?'0':
                                            infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                            accumulator += array[currentIndex]?.data.station.getOutBusFromHouse?1:0,0)
                                        : 
                                        scheduleInfo.process.destination === 2 && scheduleInfo.status.getOutBus == true
                                        ?
                                            !infoStudentList?'0':
                                            infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                            accumulator += array[currentIndex]?.data.station.getOutBusFromSchool?1:0,0)
                                        : 0
                                    }/{
                                        scheduleInfo.status.getOutBus == true
                                        ? 
                                        infoStudentList.length
                                        : 0
                                    }
                                </Text>

                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#A6ACAF' }}>
                                        {
                                            new Date(scheduleInfo.date).getDate() + '-' + (Number(new Date(scheduleInfo.date).getMonth())+1) + '-' + new Date(scheduleInfo.date).getFullYear()
                                        }
                                    </Text>
                                </View>

                            </View>
                        </View>
                    </View>

                    <View style={styles.function_list_space}>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Attendence', {page: getAttendanceScreen })}
                        >
                            <View style={styles.each_function_space_border_left}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        {/* <AntDesign name="clockcircleo" size={width/10} color="#40E0D0" /> */}
                                        <FontAwesome name="calendar" size={width/12} color="#40E0D0" />
                                    </View>
                                    
                                </View>
                                <View style={styles.each_function_space_name}>
                                    <Text style={{ fontSize: 10, color: '#717D7E' }}>Lên xe</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Attendence', { page: getOutBusScreen })}
                        >
                            <View style={styles.each_function_space_middle}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name="log-out-outline" size={width/10} color="#40E0D0" />
                                    </View>
                                </View>
                                <View style={styles.each_function_space_name}>
                                    <Text style={{ fontSize: 10, color: '#717D7E' }}>Xuống xe</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {
                            !gps ?
                            <TouchableOpacity
                                onPress={realtimeGpsOn}
                            >
                                <View style={styles.each_function_space_middle}>
                                    <View style={styles.each_function_space_icon}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <MaterialIcons name="gps-fixed" size={width/11} color="#40E0D0" />
                                        </View>
                                        
                                    </View>
                                    <View style={styles.each_function_space_name}>
                                        <Text style={{ fontSize: 10, color: '#717D7E' }}>Bật GPS</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={realtimeGpsOff}
                            >
                                <View style={styles.each_function_space_middle}>
                                    <View style={styles.each_function_space_icon}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <MaterialIcons name="gps-off" size={width/11} color="#A6ACAF" />
                                        </View>
                                        
                                    </View>
                                    <View style={styles.each_function_space_name}>
                                        <Text style={{ fontSize: 10, color: '#717D7E' }}>Tắt GPS</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                        
                        
                        <TouchableOpacity 
                            onPress={() => bs.current.snapTo(0)}
                        >
                            <View style={styles.each_function_space_middle}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialIcons name="update" size={width/11} color="#40E0D0" />
                                    </View>
                                </View>
                                <View style={styles.each_function_space_name}>
                                    <Text style={{ fontSize: 10, color: '#717D7E' }}>Cập nhật</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Map')}
                        >
                            <View style={styles.each_function_space_border_right}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        {/* <AntDesign name="clockcircleo" size={width/10} color="#40E0D0" /> */}
                                        <FontAwesome5 name="map-marked-alt" size={width/13} color="#40E0D0" />
                                    </View>
                                    
                                </View>
                                <View style={styles.each_function_space_name}>
                                    <Text style={{ fontSize: 10, color: '#717D7E' }}>Bản đồ</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            : <></>
            }
        </View>
    );
};

const styles = StyleSheet.create({ 
    container : {
        flex: 1,    
        zIndex: 0
    },

    header: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#fff',
        // paddingTop: 30,
        alignItems: 'center',
        paddingHorizontal: 10,
    },

    goBackHeader: {
        padding: 10,
    },

    titleHeader: {
        flex: 1,
        // backgroundColor: '#000',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        paddingRight: 5,
    },

    titleHeader_text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2980B9',
        // paddingLeft: 10,       
    },

    RealtimeChatHeader: {
        flexDirection: 'row',
        padding: 10,
    },

    RealtimeChatHeader_text: {
        fontSize: 11,
        color: '#FFF',
        backgroundColor: '#FA0000',
        height: 15,
        width: 15,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 20,
        position: 'absolute',
        right: 4,
        bottom: 4,
        opacity: 0,
    },

    body: {
        // flex: 1,
        marginVertical: 20,
        marginHorizontal: 10,
    },

    attendance_management_list_space: {
        // flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
    },

    attendance_management_title_on_thebus: {
        flexDirection: 'row',
        // flex: 1,
        marginBottom: 15,
    },

    attendance_management_list_on_thebus: {
        // flex: 1,
        alignItems: 'center'
    },

    attendance_management_title_off_thebus: {
        flexDirection: 'row',
        // flex: 1,
        // marginTop: 30,
        marginBottom: 15,
    },

    attendance_management_list_off_thebus: {
        // flex: 1,
        alignItems: 'center'
    },

    attendance_management_each_student_space: {
        width: 90,
        height: 90,
        // borderRadius: 20,
        marginRight: 15,
    },

    attendance_management_each_student_image: {
        width: 90,
        height: 70,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },

    attendance_management_each_student_name: {
        width: 90,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    status_of_destination_space: {
        // flex: 1,
        marginVertical: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 20,
    },

    status_of_destination_space_title: {
        flexDirection: 'row',
        // flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#D5DBDB',
        alignItems: 'center',
    },
    
    status_of_destination_space_icons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        textAlign: 'center',
        marginBottom: 10,
    },

    status_of_destination_space_content: {
        marginVertical: 10,
    },

    status_of_destination_onoff_thebus: {
        flexDirection: 'row',
        // flex: 1,
        marginBottom: 10,
        alignItems: 'flex-end'
    },

    function_list_space: {
        flexDirection: 'row',
        // flex: 1,
    },

    each_function_space_border_left: {
        width: width/7,
        height: width/7+15,
        marginRight: width/35,
    },


    each_function_space_middle: {
        width: width/7,
        height: width/7+15,
        marginHorizontal: width/35,
    },

    each_function_space_border_right: {
        width: width/7,
        height: width/7+15,
        marginLeft: width/35,
    },

    each_function_space_icon: {
        width: width/7,
        height: width/7,
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
    },

    each_function_space_name: {
        flex: 1,
        height: 15,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
    },

    panelTitle: {
        fontSize: 20,
        height: 35,
        fontWeight: 'bold'
      },

      panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
      },

      panelButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#5DADE2',
        alignItems: 'center',
        marginVertical: 7,
      },

      panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
      },
})

export default SupervisorHomePage;

