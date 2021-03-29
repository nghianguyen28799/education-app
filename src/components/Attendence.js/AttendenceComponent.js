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
    Easing
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient';
import MaleNoneAvatar from '../../assets/images/male-none-avatar.png'
import FemaleNoneAvatar from '../../assets/images/female-none-avatar.png'
import { useSelector } from 'react-redux'
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

const Item = ({ item }) => (
    <View>
        {
        item.station.getOnBusFromHouse
        ?
        (<View 
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
               item.station.getOnBusFromHouse
                &&
                <View style={{ position: 'absolute', right: 1}}>
                    <Entypo name="check" size={15} color="#04B604" />
                </View>
            }
        
            <View style={{ flex: 2/3, justifyContent: 'center', alignItems: 'center' }}>
                <Image 
                    source={item.student.avatar ? {uri: `${host}/${item.student.avatar}`} : item.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
                    style={{
                        width: width/6*2-45, 
                        height: width/6*2-45,
                        borderRadius: 50
                    }}
                />
            </View>
            <View style={{ flex: 1/3, alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', color: '#229954', fontSize: 12, fontWeight: 'bold' }}>{item.student.name}</Text>
            </View>
        </View>)
        :
        (<View 
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
                    source={item.student.avatar ? {uri: `${host}/${item.student.avatar}`} : item.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
                    style={{
                        width: width/6*2-45, 
                        height: width/6*2-45,
                        borderRadius: 50
                    }}
                />
            </View>
            <View style={{ flex: 1/3, alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', color: '#717D7E', fontSize: 12, fontWeight: 'bold' }}>{item.student.name}</Text>
            </View>
        </View>)
        }
    </View>
)

const AttendenceComponent = ({ navigation }) => {
    const user = useSelector(state => state.userReducer)

    const [searchText, setSearchText] = React.useState('');
    const [stationData, setStationData] = React.useState([]);
    const [isStationSelected, setStationSelected] = React.useState("Chọn bến");
    const [studentList, setStudentList] = React.useState([]);
    const [studentListAtStation, setStudentListAtStation] = React.useState([]);
    const [isStatus, setStatus] = React.useState(false)

    const getData = async () => {
        const isStation = await axios.post(`${host}/station/show`)
        setStationData(isStation.data);
        const isSchedule = await axios.post(`${host}/supervisorschedule/show`, { id: user.data._id })
        if (isSchedule.data) {
            setStatus(isSchedule.data.status.getOnBus)
        }
    }

    const getStudent = async () => {
        setStudentList([]);
        const isSchedule = await axios.post(`${host}/supervisorschedule/showdestination`, { id: user.data._id})

        const isList = await axios.post(`${host}/registerbus/showAllList`)
        const dateNow = new Date(isSchedule.data.date).getDate()+"/"+new Date(isSchedule.data.date).getMonth()
        isList.data.map(value => {
            value.listBookStation.map(value2 => {
                const getDate = (new Date(value2.date)).getDate()+'/'+(new Date(value2.date)).getMonth()
                if(getDate === dateNow) {
                    axios.post(`${host}/student/getStudentByParentsId`, {id: value.parentsId})
                    .then(res => {
                        setStudentList(studentList => [...studentList, 
                            {
                                valueparentsId: value.parentsId,
                                student: res.data,
                                station: value2
                            }]
                        )
                    })
                }    
            })
        })
    }

    React.useEffect(() => {
        getData();
        getStudent();
    }, [])

    const handleSearchText = (val) => {
        setSearchText(val)
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

  
    // console.log(studentList);
    const changeStation = async (data) => {
        const isStudentList = await studentList.filter(value => {
            return value.station.station === data._id
        }) 

        setStudentListAtStation(isStudentList);
        setStationSelected(data.name); 
        getClose()
    }
    return (
       <View style={styles.container}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 15 }}>
                    <Entypo name="arrow-with-circle-right" size={24} color="#48C9B0" />
                    <Text style={{ paddingHorizontal: 10, color: '#148F77', fontWeight: 'bold', fontSize: 14}}>Bến sắp tới</Text>
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
                        <Text style={{ marginBottom: 10, fontSize: 13, color: '#2E86C1'}}>Mã xe: 6</Text>
                        <Text style={{ fontSize: 13, color: '#2E86C1' }}>Biển số xe: 65A - 56789</Text>
                    </View>
                    <View style={{ flex: 1/2, flexDirection: 'row' }}>
                        {
                            isStatus === false
                            ?   // bat dau
                            <TouchableOpacity
                                onPress={async () => {
                                    const isSchedule = await axios.post(`${host}/supervisorschedule/start`, { id: user.data._id, status: "OnBus" })
                                    setStatus(true)
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
                                        <Feather name="stop-circle" size={width/11} color="#3498DB" />
                                    </View>
                                    <Text style={{ fontSize: 9, textAlign: 'center', color:'#3498DB' }}>Bắt đầu</Text>
                                </View>
                            </TouchableOpacity>
                            :   // ket thuc
                            <TouchableOpacity
                                onPress={async () => {
                                    const isSchedule = await axios.post(`${host}/supervisorschedule/end`, { id: user.data._id, status: "OnBus" })
                                    setStatus(false)
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
                                        <Feather name="stop-circle" size={width/11} color="#A6ACAF" />
                                    </View>
                                    <Text style={{ fontSize: 9, textAlign: 'center', color:'#717D7E' }}>Kết thúc</Text>
                                </View>
                            </TouchableOpacity>
                        }
                       
                        <TouchableOpacity>
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
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ScanQR", {
                                type: "OnBus",
                                supervisorId: user.data._id
                            })}
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

                <View style={{ flex: 1 , 
                    marginVertical: 10, 
                    backgroundColor: '#fff', 
                    borderRadius: 15, 
                    paddingHorizontal: 20 
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
                            Lên xe (tại bến: 10/13)
                            </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, paddingVertical: 10 }}>
                            
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                <MaterialCommunityIcons name="exit-to-app" size={24} color="#2E86C1" />
                                <Text style={{ color: '#2E86C1', marginHorizontal: 5, fontSize: 13 }}>Lên xe: 49/50</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="exit-to-app" size={24} color="#2E86C1" />
                                <Text style={{ color: '#2E86C1', marginHorizontal: 5, fontSize: 13 }}>Lên xe tại bến: 10/13</Text>
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
                            keyExtractor={ item => item.student._id}
                        />
                    </View>
                </View>
           </View>
       </View>
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
        zIndex: 11
    }


})