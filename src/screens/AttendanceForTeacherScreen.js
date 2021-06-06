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
    FlatList,
    Alert,
    ImageBackground,
    RefreshControl
} from 'react-native'

import axios from 'axios';
import host from '../assets/host';
import { useDispatch, useSelector } from 'react-redux'
import { addStudent, initialStudent } from '../actions/attendanceListAction'

// icon store
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// close icon store
import MaleNoneAvatar from '../assets/images/male-none-avatar.png'
import FemaleNoneAvatar from '../assets/images/female-none-avatar.png'
import backgroundImg from '../assets/images/background-login.jpg'

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const lesson = [
    {id: '1abc', serial: 1, start: '07:20', end: '07:55', session: 'AM'},
    {id: '2abc', serial: 2, start: '08:00', end: '08:35', session: 'AM'},
    // ra choi
    {id: '3abc', serial: 3, start: '09:00', end: '09:35', session: 'AM'},
    {id: '4abc', serial: 4, start: '09:40', end: '10:15', session: 'AM'},
    //ra choi
    {id: '5abc', serial: 5, start: '10:20', end: '10:55', session: 'AM'},

    // chiêu
    {id: '6abc', serial: 6, start: '01:45', end: '02:20', session: 'PM'},
    {id: '7abc', serial: 7, start: '02:25', end: '03:00', session: 'PM'},
    //ra choi
    {id: '8abc', serial: 8, start: '03:25', end: '04:00', session: 'PM'}
]

const weekdayData = [
    { id: '1aaa', serial: 1, code: 'T2'},
    { id: '2aaa', serial: 2, code: 'T3'},
    { id: '3aaa', serial: 3, code: 'T4'},
    { id: '4aaa', serial: 4, code: 'T5'},
    { id: '5aaa', serial: 5, code: 'T6'},
    { id: '6aaa', serial: 6, code: 'T7'},
    { id: '7aaa', serial: 0, code: 'CN'},
]

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const TeacherHomePage = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer.data)
    const studentList = useSelector(state => state.attendanceListReducer.infoStudentList)

    var d = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var n = month[d.getMonth()];

    var weekday = new Array(7);
    weekday[0] = "sunday";
    weekday[1] = "monday";
    weekday[2] = "tuesday";
    weekday[3] = "wednesday";
    weekday[4] = "thurday";
    weekday[5] = "friday";
    weekday[6] = "saturday";

    const [isDay, setDay] = React.useState(new Date().getDay())
    const [status, setStatus] = React.useState(false);
    const [absenceData, setAbsenceData] = React.useState([]);
    // const [student, setStudent] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => {
            setRefreshing(false);
            getData();
        })
    }, []);

    const getData = async () => {
        dispatch(initialStudent());
        console.log('add');
        const classCode = user.ClassCode;
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
  
    const getAttendanced = () => {
        let qty = 0;
        studentList.map(item => {
            qty += ((new Date(item.data.attendanceDay)).getDate() === new Date().getDate() && item.data.attendanceStatus )?1:0
        })
        return qty
    }

    const getAbsence = async() => {
        setAbsenceData([])
        const absenceList = await axios.post(`${host}/absence/show`, { classCode: user.ClassCode })
        const newData = [];
        absenceList.data.map(item => {
            axios.post(`${host}/student/getStudentByParentsId`, {id: item.parentsId})
            .then(res => {
                setAbsenceData(previous => [...previous, {
                    studentId: res.data._id,
                    lessons: item.lessons,
                    reason: item.reason
                }])
            })
        })
    }
    
    React.useEffect(() => {
        getAbsence()
    },[]);

    const alertAttendance = () => {
        let qty = 0;
        studentList.map(item => {
            const check = absenceData.some(value => value.studentId === item.data._id);
            if((new Date(item.data.attendanceDay)).getDate() !== new Date().getDate()) {
                qty += check?0:1
            }
        })

        Alert.alert(
            "Thông báo!",
            `Còn ${qty} học sinh chưa điểm danh`,
            [
                { text: "Trở lại" },
                { text: "Xác nhận", onPress: () => handleAttendance() }
            ]
        );
    }

    const alertSuccess = () => {
        setStatus(true)
        Alert.alert(
            "Thành công!",
            `Buổi điểm danh đã xác nhận!`,
            [
                { text: "OK" },
            ]
        );
    }

    const handleAttendance = async () => {
        const fetchData = await studentList.filter(item => {
            return (new Date(item.data.attendanceDay)).getDate() !== new Date().getDate() && !absenceData.some(value => value.studentId === item.data._id)
        })
        const newData = await fetchData.map(item => {
            return {
                ...item,
                reason: ""
            }
        })
       
        axios.post(`${host}/noattendance/create`, { classCode: user.ClassCode, studentList: newData })
        .then((res) => {
            res.data.map(item => {
                if(item.tokens.length === 0) {
                    axios.post(`${host}/notification/create`, { 
                        parentsId: item.parentsCode,
                        title: "Vắng điểm danh",
                        content: `${item.name} đã vắng điểm danh!`,
                    })
                } else {
                    item.tokens.map(value => {
                        sendPushNotification(value.tokenDevices, item.name)
                    })
                    axios.post(`${host}/notification/create`, { 
                        parentsId: item.parentsCode,
                        title: "Vắng điểm danh",
                        content: `${item.name} đã vắng điểm danh!`,
                    })
                } 
            })
            alertSuccess()
            loadStudentList()
        })
    }

    const loadStudentList = async () => {
        dispatch(initialStudent());
        const isStudentList = await axios.post(`${host}/student/getStudentByClassCode`, { classCode: user.ClassCode })
        isStudentList.data.map(item => {
          dispatch(addStudent(item))
        })
      }

    const renderItem = ({item}) => (
        <View style={styles.body_area_content_area}>
            <View style={styles.body_area_content_left}>
                <TouchableOpacity
                    style = {styles.body_area_content_left_child}
                    onPress={() => navigation.navigate('ViewProfileStudent', {
                    studentData: item.data
                })}
                    key={item.data._id}
                >
                <View style={styles.body_area_content_left_child}>
                    <View style={styles.body_area_content_avt_box}>
                        <Image source={
                            item.data.avatar ? {uri: `${host}/${item.data.avatar}`} 
                            : item.data.gender === 'Male' ? MaleNoneAvatar
                            : item.data.gender === 'Female' ? FemaleNoneAvatar
                            : null
                        } 
                         style={styles.body_area_content_avt_box}
                        />
                        <View style={{ marginTop: 3, justifyContent: 'center', alignItems: 'center'}}>
                            {/* <Text style={{ fontSize: 12 }}>Da diem danh</Text>  */}
                            {
                                item.data.bus
                                ? 
                                !item.data.getOnBusFromHouse
                                ? <Text style={{ fontSize: 12, alignItems: 'center'}}>Không đi xe trường</Text>
                                : item.data.getOnBusFromHouse && !item.data.getOutBusFromHouse && new Date().getDate() == (new Date(item.data.date)).getDate()
                                ? <Text style={{ fontSize: 12, alignItems: 'center', color: "green",  fontWeight: 'bold'}}>Đã lên xe</Text>
                                : item.data.getOutBusFromHouse && new Date().getDate() == (new Date(item.data.date)).getDate()
                                ? <Text style={{ fontSize: 12, alignItems: 'center', color: "green", fontWeight: 'bold'}}>Đã xuống xe</Text>
                                : <Text style={{ fontSize: 12, alignItems: 'center'}}>Không đi xe trường</Text>
                                : <Text style={{ fontSize: 12, alignItems: 'center'}}>Không đi xe trường</Text>
                            }
                        </View>
                    </View>
                </View>
                </TouchableOpacity>
            </View>

            <View style={styles.body_area_content_right}>
                <View style={styles.body_area_content_right_child}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
                        {item.data.name}
                        {/* <View  style={{ width: 10 }}/>
                        <Text style={{ fontSize: 12, textAlign: 'right' }}>Đã điểm danh xuống xe</Text> */}
                    </Text>
                    {item.data.attendanceDay.attendanceStatus}
                    {
                        absenceData.some(value => value.studentId === item.data._id)
                        ?
                        <View>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#E67E22'}}>Vắng có phép</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Tiết: </Text>
                                <Text style={{ fontSize: 12 }}>
                                    {
                                        (absenceData.find(element => element.studentId === item.data._id).lessons).map((value, index) => (
                                            (absenceData.find(element => element.studentId === item.data._id).lessons).length == index+1 ? value : value+","
                                        ))
                                    }
                                </Text>
                            </View>
                            <Text style={{ fontSize: 12}}>Lý do: {absenceData.find(value => value.studentId === item.data._id).reason}</Text>
                        </View>
                        :
                        item.data.attendanceDay
                        ?
                            new Date(item.data.attendanceDay).getDate() === new Date().getDate()
                            ?
                                item.data.attendanceStatus === true
                                ? <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#239B56' }}>Đã điểm danh</Text>
                                : <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#C0392B'}}>Vắng không phép</Text>
                            : <></>
                        : <></>
                    }
                </View>
            </View>
        </View>
    )

    return (
        <ImageBackground source={backgroundImg} style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <View style={styles.header}>
                <View style={styles.menu_border}>
                    <View style={styles.menu}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                        <View style={styles.goBackHeader}>
                            <Entypo name="chevron-left" size={24} color="black" />
                        </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}} >
                        <Text style={{
                            fontSize: 17,
                            fontWeight: 'bold'
                        }}>Danh sách điểm danh</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() =>
                            !status ?
                            navigation.navigate('ScanQRTeacher') :
                            Alert.alert(
                                "Thông báo!",
                                `Điểm danh cho hôm nay đã kết thúc`,
                                [
                                    { text: "OK" },
                                ]
                            )
                        }
                    >
                        <View style={[styles.menu]}>
                            <View style={styles.goBackHeader}>
                                <AntDesign name="qrcode" size={24} color="black" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.container_box}>
                    <View style={styles.container_header_box}>
                        <View style={styles.container_header_left}>
                            <FontAwesome name="calendar-check-o" size={30} color="black" style={{ marginRight: 10}}/>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#5F6A6A' }}>{new Date().getDate()}</Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginHorizontal: 5, color: '#000' }}>{n}</Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#5F6A6A' }}>{new Date().getFullYear()}</Text>
                        </View>
                        <View style={styles.container_header_right}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{isDay === new Date().getDay() ? 'Hôm nay' : ''}</Text>
                        </View>
                    </View>

                    <View style={styles.container_body_box}>
                        <View style={styles.container_body_child1_box}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>Có mặt: </Text>
                                <Text style={{ fontWeight: 'bold' }}>
                                    {
                                        studentList
                                        ? getAttendanced()
                                        : 0
                                    }
                                    /
                                    {studentList ? studentList.length : 0}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }} />
                            {
                                status 
                                ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text>Vắng mặt: </Text>
                                        <Text style={{ fontWeight: 'bold' }}>{
                                            studentList
                                            ?
                                            studentList.length - getAttendanced() - absenceData.length
                                            : 0
                                        }/{studentList ? studentList.length : 0}</Text>
                                    </View>
                                : <></>
                            }
                            
                        </View>
                        <View style={styles.container_body_child2_box}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>Có phép: </Text>
                                <Text style={{ fontWeight: 'bold' }}>{absenceData.length}/{studentList ? studentList.length : 0}</Text>
                            </View>
                            <View style={{ flex: 1 }} />
                            {
                                !status
                                ?
                                    <TouchableOpacity
                                        onPress={alertAttendance}
                                    >
                                        <Text style={{ fontSize: 12, fontWeight: 'bold', backgroundColor: '#239B56', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, color: '#fff'}}>
                                            Xác nhận
                                        </Text>
                                    </TouchableOpacity>
                                :  
                                    <View>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold', backgroundColor: '#FF0000', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, color: '#fff'}}>
                                            Đã điểm danh
                                        </Text>
                                    </View>
                            }
                            
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.body_area_absolute} />

                <View style={styles.body_area}>
                    {
                        studentList
                        ?
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={studentList}
                            renderItem={renderItem}
                            keyExtractor={item => item.data._id}
                            refreshControl={
                                <RefreshControl
                                  refreshing={refreshing}
                                  onRefresh={onRefresh}
                                />
                            }
                        />
                        : <></>
                    }
                </View>
            </View>
        </ImageBackground>
    );
};

async function sendPushNotification(expoPushToken, name) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Vắng điểm danh',
      body: `${name} đã vắng điểm danh hôm nay!`,
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

const styles = StyleSheet.create({ 
    container : {
        flex: 1,
        // backgroundColor: '#ffc41d'   
    },

    header: {
        height: height*20/100,
        paddingHorizontal: 20,
    },

    menu_border: {
        flexDirection: 'row',
        margin: -10,
        paddingVertical: 10,
    },

    goBackHeader: {
        padding: 10,
    },

    container_box: {
        flex: 1,
    },
    
    container_header_box: {
        height: "40%",
        flexDirection: 'row', 
    },

    container_header_left: {
        flex: 3/4, 
        alignItems: 'center',
        flexDirection: 'row'
    },

    container_header_right: {
        flex: 1/4,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },

    container_body_box: {
        height: "60%",
    },

    container_body_child1_box: {
        width: "100%",
        height: '40%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    container_body_child2_box: {
        width: "100%",
        height: '40%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    body: {
        height: height*80/100,
    },

    body_area_absolute: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },

    body_area: {
        flex: 1,
        // backgroundColor: '#fff'
        paddingVertical: 30
    },


    body_area_content_area: {
        height: 130,
        // backgroundColor: 'red',
        marginBottom: 20,
        flexDirection: 'row',
    },

    body_area_content_left: {
        width: '30%',
        height: '100%',
        paddingLeft: 20
    },

    body_area_content_left_child: {
        backgroundColor: '#38f9d6',
        // backgroundColor: '#9e9e9e',
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        paddingVertical: 5
    },

    body_area_content_avt_box: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },

    body_area_content_right: {
        width: '70%',
        height: '100%',
        paddingRight: 20,
    },

    body_area_content_right_child: {
        backgroundColor: '#F4F6F7',
        flex: 1,
        height: '100%',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,

    },
})

export default TeacherHomePage;

