import React, { useEffect, useRef } from 'react';
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
    Animated,
    TextInput,
    FlatList,
    Easing,
    Alert
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient';
import MaleNoneAvatar from '../../assets/images/male-none-avatar.png'
import FemaleNoneAvatar from '../../assets/images/female-none-avatar.png'
import { useDispatch, useSelector } from 'react-redux'
import { addInfo, initialInfo } from '../../actions/followAction'
import { addDestination } from '../../actions/destinationAction'
import axios from 'axios';
import host from '../../assets/host';

// icon store
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;


const AttendenceComponent = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer)
    const infoStudentList = useSelector(state => state.followReducer.infoStudentList)
    const scheduleInfo = useSelector(state => state.destinationReducer.data)

    const [searchText, setSearchText] = React.useState('');
    const [stationData, setStationData] = React.useState([]);
    const [isStationSelected, setStationSelected] = React.useState("Chọn điểm đến đón");
    const [studentListAtStation, setStudentListAtStation] = React.useState([]);
    const [studentListAtStationFilter, setStudentListAtStationFilter] = React.useState([]);
    const [qtyAttendanced, setQtyAttendanced] = React.useState(0);

    const getData = async () => {
        const isStation = await axios.get(`${host}/station/show`)
        setStationData(isStation.data);
    }

    React.useEffect(() => {
        getData();
    }, [])

    const handleSearchText = (text) => {
        setSearchText(text)

        if(text) {
            const newData = studentListAtStation.filter((item) => {
                const itemData = item.data.student.name.toUpperCase() 
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1
            });
            setStudentListAtStation(newData);
        }
        else {
            setStudentListAtStation(studentListAtStationFilter);
        }
    }

    const heightAnimListStation = useRef(new Animated.Value(0)).current;
    var maxHeightAnimListStation = 50;
    if(stationData !== []) {
        var maxHeightAnimListStation = stationData.length*50+30;
    }

    let rotateValueHolder = new Animated.Value(0);

    const [openAnimStation, setOpenAnimStation] = React.useState(false)

    const getOpen = () => {
        Animated.timing(heightAnimListStation, {
            toValue: maxHeightAnimListStation,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: false
        }).start(() => setOpenAnimStation(!openAnimStation));
    
        rotateValueHolder.setValue(0);
        Animated.timing(rotateValueHolder, {
          toValue: 1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
    }

    const getClose = () => {
        Animated.timing(heightAnimListStation, {
            toValue: 0,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: false
        }).start(() => setOpenAnimStation(!openAnimStation));
     
        rotateValueHolder.setValue(0);
        Animated.timing(rotateValueHolder, {
          toValue: 1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
    }

    const RotateData1 = rotateValueHolder.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const RotateData2 = rotateValueHolder.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const changeStation = async (data) => {
        const isStudentList = await infoStudentList.filter(value => {
            return value.data.station.station === data._id
        }) 

        var qty = 0;
        isStudentList.map((value)=> {
            if(value.data.station.getOnBusFromHouse && scheduleInfo.process.destination === 1) {
                qty+=1;
            } else if(value.data.station.getOnBusFromSchool && scheduleInfo.process.destination === 2) {
                qty+=1;
            }
        })
        setQtyAttendanced(qty)

        setStudentListAtStation(isStudentList);
        setStudentListAtStationFilter(isStudentList)
        setStationSelected(data.name); 
        getClose()
    }

    const goStart = async () => {
        dispatch(initialInfo());
        const isSchedule = await axios.post(`${host}/supervisorschedule/start`, { id: user.data._id, status: "OnBus" })
        dispatch(addDestination(isSchedule.data))
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

        if(isSchedule.data.process.destination === 1) {
            Alert.alert(
                "Thành công!",
                "Bắt đầu lên xe từ trường Nhà đến Trường",
                [
                    { text: "OK"  }
                ]
            );
        } else {
            Alert.alert(
                "Thành công!",
                "Bắt đầu lên xe từ trường Trường về Nhà",
                [
                    { text: "OK" }
                ]
            );
        }
        
    }

    const goEnd = async () => {
        dispatch(initialInfo());
        const isSchedule = await axios.post(`${host}/supervisorschedule/end`, { id: user.data._id, status: "OnBus" })
        dispatch(addDestination(isSchedule.data))
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
                        if(scheduleInfo.process.destination === 1 && !value2.getOnBusFromHouse) {
                            studentName = res.data.name;
                            axios.post(`${host}/notification/create`, { 
                                parentsId: value.parentsId,
                                title: 'Vắng lên xe',
                                content: `${studentName} vắng điểm danh lên xe từ Nhà đến Trường`,
                            })
                            axios.post(`${host}/notification/pushNotification`, { 
                                parentsId: value.parentsId,
                            })
                            .then(res => {
                                res.data.map(item => {
                                    sendPushNotification(item.tokenDevices, studentName, 1)
                                });
                            })
                        } else if(scheduleInfo.process.destination === 2 && !value2.getOnBusFromSchool) {
                            studentName = res.data.name;
                            axios.post(`${host}/notification/create`, { 
                                parentsId: value.parentsId,
                                title: 'Vắng lên xe',
                                content: `${studentName} vắng điểm danh lên xe từ Trường về Nhà`,
                            })
                            axios.post(`${host}/notification/pushNotification`, { 
                                parentsId: value.parentsId,
                            })
                            .then(res => {
                                res.data.map(item => {
                                    sendPushNotification(item.tokenDevices, studentName, 2)
                                });
                            })
                        }
                      dispatch(addInfo(studentInfo))
                    })
                }    
            })
        })
        if(isSchedule.data.process.destination === 1) {
            Alert.alert(
                "Thành công!",
                "Kết thúc lên xe từ trường Nhà đến Trường",
                [
                  { text: "OK"  }
                ]
            );
        } else {
            Alert.alert(
                "Thành công!",
                "Kết thúc lên xe từ Trường về Nhà",
                [
                  { text: "OK"  }
                ]
            );
        }
    }

    const getNavigateQR = (type) => {
        navigation.navigate("ScanQR", {
            type: type,
            supervisorId: user.data._id
        })
    }

    const getAlertQR = () => {
        Alert.alert(
            "Thất bại",
            "Chuyến đi chưa được bật",
            [
              { text: "OK" }
            ]
          );
    }

    const getAlertCheck = () => {
        var qty = 0;
        infoStudentList.map((value)=> {
            if(value.data.station.getOnBusFromHouse && scheduleInfo.process.destination === 1) {
                qty+=1;
            } else if(value.data.station.getOnBusFromSchool && scheduleInfo.process.destination === 2) {
                qty+=1;
            }
        })

        Alert.alert(
            "Kiểm tra",
            `Có ${infoStudentList.length - qty} học sinh chưa điểm danh lên xe`,
            [
                {
                    text: "Trở lại",
                    style: "cancel"
                },
                { text: "Xác nhận", onPress: () => goEnd() }
            ]
        );
    }

    async function sendPushNotification(expoPushToken, name, type) {
        const message = {
          to: expoPushToken,
          sound: 'default',
          title: 'Vắng xuống xe',
          body: `${name} đã vắng điểm danh xuống xe từ ${type == 1 ? "Nhà đến Trường" : "Trường về nhà"}!`,
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

    const Item = ({ item }) => {
        if(scheduleInfo.process.destination === 1) {
            return (
                <View>
                    {
                        item.data.station.getOnBusFromHouse
                    ?
                    (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('ViewProfileStudent', {
                            studentData: item.data.student
                    })}>
                        <View 
                            style={{ 
                                borderColor: '#04B604', 
                                width: width/3-25, 
                                height: width/3+15,
                                borderWidth: 2, 
                                marginBottom: 5, 
                                borderRadius: 5, 
                                marginHorizontal: 2, 
                            }}>
                            {
                            item.data.station.getOnBusFromHouse
                                &&
                                <View style={{ position: 'absolute', right: 1}}>
                                    <Entypo name="check" size={15} color="#04B604" />
                                </View>
                            }
                        
                            <View style={{ flex: 2/3, justifyContent: 'center', alignItems: 'center' }}>
                                <Image 
                                    source={item.data.student.avatar ? {uri: `${host}/${item.data.student.avatar}`} : item.data.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
                                    style={{
                                        width: width/6*2-45, 
                                        height: width/6*2-45,
                                        borderRadius: 50
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1/3, alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#229954', fontSize: 12, fontWeight: 'bold' }}>{item.data.student.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    )
                    :
                    (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('ViewProfileStudent', {
                            studentData: item.data.student
                    })}>
                        <View 
                            style={{ 
                                borderColor: '#717D7E', 
                                width: width/3-25, 
                                height: width/3+15,
                                borderWidth: 2, 
                                marginBottom: 5, 
                                borderRadius: 5, 
                                marginHorizontal: 2, 
                            }}>
                            <View style={{ flex: 2/3, justifyContent: 'center', alignItems: 'center' }}>
                                <Image 
                                    source={item.data.student.avatar ? {uri: `${host}/${item.data.student.avatar}`} : item.data.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
                                    style={{
                                        width: width/6*2-45, 
                                        height: width/6*2-45,
                                        borderRadius: 50
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1/3, alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#717D7E', fontSize: 12, fontWeight: 'bold' }}>{item.data.student.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    )
                    }
                </View>
            )
        } else if(scheduleInfo.process.destination === 2){
            return (
                <View>
                    {
                        item.data.station.getOnBusFromSchool
                    ?
                    (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('ViewProfileStudent', {
                            studentData: item.data.student
                    })}>
                        <View 
                            style={{ 
                                borderColor: '#04B604', 
                                width: width/3-25, 
                                height: width/3+15,
                                borderWidth: 2, 
                                marginBottom: 5, 
                                borderRadius: 5, 
                                marginHorizontal: 2, 
                            }}>
                            {
                            item.data.station.getOnBusFromSchool
                                &&
                                <View style={{ position: 'absolute', right: 1}}>
                                    <Entypo name="check" size={15} color="#04B604" />
                                </View>
                            }
                        
                            <View style={{ flex: 2/3, justifyContent: 'center', alignItems: 'center' }}>
                                <Image 
                                    source={item.data.student.avatar ? {uri: `${host}/${item.data.student.avatar}`} : item.data.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
                                    style={{
                                        width: width/6*2-45, 
                                        height: width/6*2-45,
                                        borderRadius: 50
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1/3, alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#229954', fontSize: 12, fontWeight: 'bold' }}>{item.data.student.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    )
                    :
                    (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('ViewProfileStudent', {
                            studentData: item.data.student
                    })}>
                        <View 
                            style={{ 
                                borderColor: '#717D7E', 
                                width: width/3-25, 
                                height: width/3+15,
                                borderWidth: 2, 
                                marginBottom: 5, 
                                borderRadius: 5, 
                                marginHorizontal: 2, 
                            }}>
                            <View style={{ flex: 2/3, justifyContent: 'center', alignItems: 'center' }}>
                                <Image 
                                    source={item.data.student.avatar ? {uri: `${host}/${item.data.student.avatar}`} : item.data.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
                                    style={{
                                        width: width/6*2-45, 
                                        height: width/6*2-45,
                                        borderRadius: 50
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1/3, alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#717D7E', fontSize: 12, fontWeight: 'bold' }}>{item.data.student.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    )
                    }
                </View>
            )
        }
    }

    return (
        <>
            {
                scheduleInfo
                ?
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 15 }}>
                                <Entypo name="arrow-with-circle-right" size={24} color="#48C9B0" />
                                <Text style={{ paddingHorizontal: 10, color: '#148F77', fontWeight: 'bold', fontSize: 14}}>Xem danh sách chọn điểm đến</Text>
                        </View>
                        <View style={styles.station_selector_space}>
                            <TouchableOpacity
                                onPress={ !openAnimStation ? getOpen : getClose }
                            >   
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', zIndex: 9999, paddingVertical: 12 }}>
                                <FontAwesome5 name="map-marker-alt" size={24} color="#2E86C1" />
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ paddingHorizontal: 15, color: '#2E86C1', fontWeight: 'bold' }}>{isStationSelected}</Text>
                                </View>
                                    <Animated.View 
                                        style={{ transform: [{ rotate: openAnimStation ? RotateData2 : RotateData1 }] }} 
                                    >
                                        <MaterialCommunityIcons 
                                            name="menu-down-outline" 
                                            size={24} 
                                            color="#85C1E9" 
                                        />
                                    </Animated.View>
                            </View>
                            <Animated.View style={{ flex: 1, height: heightAnimListStation, backgroundColor: '#fff', overflow: 'hidden'  }}>
                                {
                                    stationData !== []
                                    ?
                                    stationData.map((data, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => changeStation(data)}
                                        >
                                            <View style={{ height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                                <FontAwesome5 name="bus" size={18} color="black" style={{ marginRight: 15 }}/>
                                                <Text>{data.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                    : null
                                }
                            </Animated.View>
                        </TouchableOpacity>
                    </View>

                        <View style={styles.info_station_space}>
                            <View style={{ flexDirection: 'row', flex: 1, marginVertical: 10 }}>
                                <View style={{ flex: 1/2 }}>
                                    <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end'}}>
                                        <Text style={{ fontSize: 13, color: '#2E86C1'}}>Đi từ: </Text>
                                        <Text style={{ color: '#2E86C1', fontWeight: 'bold' }}>
                                            {
                                                scheduleInfo.process.destination === 1 ? " Nhà > Trường" : scheduleInfo.process.destination === 2 ? " Trường > Nhà" : ''
                                            }
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 13, color: '#2E86C1' }}>Biển số xe: 65A - 56789</Text>
                                </View>
                                <View style={{ flex: 1/2, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    {
                                        scheduleInfo.status.getOnBus === false
                                        ?   // bat dau
                                            (!scheduleInfo.process.status && scheduleInfo.process.destination != 2)
                                            ?
                                            <TouchableOpacity
                                                onPress={goStart}
                                            >
                                                <View style={{ width: width/9, height: width/9+15, marginHorizontal: width/15 }}>
                                                    <View style={{ 
                                                        width: width/9, 
                                                        height: width/9, 
                                                        backgroundColor: '#fff', 
                                                        borderRadius: 10 ,
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Feather name="stop-circle" size={width/11} color="#3498DB" />
                                                    </View>
                                                    <Text style={{ fontSize: 9, textAlign: 'center', color:'#3498DB' }}>Bắt đầu</Text>
                                                </View>
                                            </TouchableOpacity>
                                            : <></> 
                                        :   // ket thuc
                                        <TouchableOpacity
                                            onPress={getAlertCheck}
                                        >
                                            <View style={{ width: width/9, height: width/9+15, marginHorizontal: width/15 }}>
                                                <View style={{ 
                                                    width: width/9, 
                                                    height: width/9, 
                                                    backgroundColor: '#fff', 
                                                    borderRadius: 10 ,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <Feather name="stop-circle" size={width/11} color="#A6ACAF" />
                                                </View>
                                                <Text style={{ fontSize: 9, textAlign: 'center', color:'#717D7E' }}>Kết thúc</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                
                                    {/* <TouchableOpacity>
                                        <View style={{ width: width/9, height: width/9+15, marginHorizontal: width/15 }}>
                                            <View style={{ 
                                                width: width/9, 
                                                height: width/9, 
                                                backgroundColor: '#fff', 
                                                borderRadius: 10 ,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <AntDesign name="notification" size={24} color="#40E0D0" />
                                            </View>
                                            <Text style={{ fontSize: 9, textAlign: 'center', color: '#2E86C1' }}>Gửi thông báo</Text>
                                        </View>
                                    </TouchableOpacity> */}
                                    
                                    <TouchableOpacity
                                        onPress={() => {
                                            scheduleInfo.status.getOnBus
                                            ? getNavigateQR('OnBus')
                                            : getAlertQR()
                                        }}
                                    >
                                        <View style={{ width: width/9, height: width/9+15 }}>
                                            <View style={{ 
                                                width: width/9, 
                                                height: width/9, 
                                                backgroundColor: '#fff', 
                                                borderRadius: 10 ,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <AntDesign name="qrcode" size={width/11} color="#40E0D0" />
                                            </View>
                                            <Text style={{ fontSize: 9, textAlign: 'center', color: '#2E86C1' }}>Quét QR</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {
                                scheduleInfo.status.getOnBus
                                ?
                                <View style={{ flex: 1 , 
                                    marginVertical: 10, 
                                    backgroundColor: '#fff', 
                                    borderRadius: 15, 
                                    paddingHorizontal: 20,
                                }}>
                                    <View style={{ 
                                        flexDirection: 'row',
                                        flex: 1, 
                                        height: 50, 
                                        borderBottomColor: 'gray', 
                                        borderBottomWidth: 2,
                                        // justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{ 
                                            flex: 1, 
                                            textAlign: 'center',
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: '#2E86C1'
                
                                        }}>
                                            Lên xe (tại bến: {``}
                                            { qtyAttendanced }
                                            /
                                            {studentListAtStationFilter.length})
                                            </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flex: 1, paddingVertical: 10 }}>
                                            
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                                <MaterialCommunityIcons name="exit-to-app" size={24} color="#2E86C1" />
                                                <Text style={{ color: '#2E86C1', marginHorizontal: 5, fontSize: 13 }}>Lên xe: {``}
                                                    {
                                                        scheduleInfo.process.destination === 1
                                                        ?
                                                            !infoStudentList?'0':
                                                            infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                                            accumulator += array[currentIndex]?.data.station.getOnBusFromHouse?1:0,0)
                                                        :
                                                            !infoStudentList?'0':
                                                            infoStudentList.reduce((accumulator,currentValue,currentIndex, array)=>
                                                            accumulator += array[currentIndex]?.data.station.getOnBusFromSchool?1:0,0)
                                                    }
                                                    /
                                                    {infoStudentList.length}
                                                </Text>
                                            </View>
                
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <MaterialCommunityIcons name="exit-to-app" size={24} color="#2E86C1" />
                                                <Text style={{ color: '#2E86C1', marginHorizontal: 5, fontSize: 13 }}>Lên xe tại bến: {``}
                                                {qtyAttendanced}
                                                /
                                                {studentListAtStationFilter.length}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ 
                                            flexDirection: 'row', 
                                            flex: 1, 
                                            marginVertical: 10, 
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            borderColor: '#A6ACAF',
                                            height: 35,
                                            padding: 5,
                                            alignItems: 'center',
                                        }}>
                                            <AntDesign name="search1" size={22} color="#A6ACAF" />
                                            <TextInput 
                                                style={{ flex: 1, paddingHorizontal: 10 }}
                                                placeholder="Tìm kiếm"
                                                onChangeText = {(val) => handleSearchText(val)}
                                            />
                                        </View>
                                    </View>
                
                                    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 7 }}>
                                        <FlatList
                                            data={studentListAtStation}
                                            numColumns={3}
                                            renderItem={Item}
                                            keyExtractor={ item => item.data.student._id}
                                        />
                                    </View>
                                </View>
                                : null   
                            }
                    </View>
                </View>
            : <></>
            }
        </>
    );
};

export default AttendenceComponent;

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        // marginVertical: 10,
        marginHorizontal: 10,
    },

    station_selector_space: {
        flex: 1,
        // borderWidth: 1,
        borderRadius: 30,
        backgroundColor: '#fff',
        paddingHorizontal: 20
    },

    info_station_space: {
        flex: 1,
        paddingVertical: 20,
        zIndex: 11,
    }
})