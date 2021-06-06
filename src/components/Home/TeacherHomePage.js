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
    ImageBackground
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
import AttendenceScreen from '../../screens/AttendenceScreen';
import MaleNoneAvatar from '../../assets/images/male-none-avatar.png'
import FemaleNoneAvatar from '../../assets/images/female-none-avatar.png'
import UserCirle from '../../assets/images/user-circle.png'
import backgroundImg from '../../assets/images/background-login.jpg'
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

const TeacherHomePage = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer.data)
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

    const [subject, setSubject] = React.useState([]);
    const [isClass, setClass] = React.useState('');
    const [qty, setQty] = React.useState('');
    const getData = async() => {
        var day = new Date();
        var weekday = new Array(7);
        weekday[0] = "sunday";
        weekday[1] = "monday";
        weekday[2] = "tuesday";
        weekday[3] = "wednesday";
        weekday[4] = "thurday";
        weekday[5] = "friday";
        weekday[6] = "saturday";

        var getDay = weekday[day.getDay()];
        const classCode = user.ClassCode;
        const isSchedule = await axios.post(`${host}/schedule/show`, { classCode: classCode })
        const dayList = isSchedule.data.DayList
        for (const [key, value] of Object.entries(dayList)) {
            const getKey = key.slice(0, key.length-1);
            if(getKey === getDay) {
                setSubject(previous => [...previous, value])
            }
        }

        const classData = await axios.get(`${host}/class/id/${classCode}`)

        const isStudent = await axios.get(`${host}/student`)
        const studentData = isStudent.data.filter(value => {
            return value.classCode === classCode
        })
        setQty(studentData.length)
        setClass(classData.data[0].ClassCode)
    }

    React.useEffect(() => {
        getData()
    },[])
    
    const renderItem = ({item}) => (
        <View style={styles.body_area_content_area}>
            <View style={styles.body_area_content_left}>
                <View style={styles.body_area_content_left_child}>
                    <Text style={{
                        fontSize: 15, fontWeight: 'bold'
                    }}>
                        {item.start}
                    </Text>
                    <Text style={{
                        color: '#4D5656',
                        fontWeight: 'bold'
                    }}>
                        {item.session}
                    </Text>    
                </View>
            </View>

            <View style={styles.body_area_content_right}>
                <View style={styles.body_area_content_right_child}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold', 
                        color: '#4D5656',
                        marginVertical: 5
                    }}>
                        {item.start} - {item.end}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end'}}>
                        <Text style={{ fontSize: 12, color: '#979A9A' }}>Môn giảng dạy: </Text>
                        <Text style={{ fontWeight: 'bold' }}>{subject[item.serial-1]}</Text>
                    </View>
                </View>
            </View>
        </View>
    )

    return (
        <ImageBackground source={backgroundImg}  style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <View style={styles.header}>
                <View style={styles.menu_border}>
                    <View style={styles.menu}>
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                        >
                        <View style={styles.goBackHeader}>
                            <Feather name="menu" size={24} color="#000" />
                        </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }} />
                    
                    <View style={styles.menu}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('AttendanceForTeacher')}
                        >
                        <View style={styles.goBackHeader}>
                            <FontAwesome name="calendar-check-o" size={24} color="black" />
                        </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menu}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('MessageList')}
                        >
                        <View style={styles.goBackHeader}>
                            <AntDesign name="message1" size={24} color="#000" />
                        </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.container_header}>
                    <View style={styles.container_header_left}>
                        <View style={styles.container_header_info_area}>
                            <View style={styles.container_header_avt}>
                                {
                                    user 
                                    ?
                                        user.Avatar
                                        ?
                                        <Image source={{ uri: `${host}/${user.Avatar}` }} style={{ width: 50, height: 50, borderRadius: 15 }}/> 
                                        : <Image source={UserCirle} style={{ width: 50, height: 50 }}/> 
                                    : null
                                }
                            </View>
                            <Text style={{ fontSize: 20, fontWeight: 'bold'}}>Hi! {user ? user.Gender == 'Male' ? 'Thầy ' : user.Gender == 'Female' ? 'Cô ' : null : null}
                                { user ? user.FullName.split(' ')[user.FullName.split(' ').length-1] : null }
                            </Text>
                        </View>
                        <View style={styles.container_header_intro_area}>
                            <Text style={{ color: '#4D5656', fontSize: 12 }}>
                                <Text style={{ fontWeight: 'bold' }}>GVCN: </Text> 
                                Lớp {isClass}
                            </Text>
                            <Text style={{ color: '#4D5656', fontSize: 12 }}>
                                <Text style={{ fontWeight: 'bold' }}>Sỉ số: </Text> 
                                {qty} học sinh
                            </Text>
                        </View>
                    </View>

                    <View style={styles.container_header_right}>
                        <View style={{alignItems: 'center', paddingTop: 10}}>
                            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold', color: '#4D5656'}}>
                                {d.getDay()+1 === 1 ? 'Chủ nhật' : `Thứ ${d.getDay()+1}`}
                            </Text>
                            <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{d.getDate()} {n}</Text>
                            
                        </View>
                        {/* <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <TouchableOpacity>
                                <View style={styles.qrcode}>
                                    <AntDesign name="qrcode" size={24} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.body_area_absolute}>
                    <View style={styles.body_area_absolute_left} />
                    <View style={styles.body_area_absolute_right} />
                </View>
                
                <View style={styles.body_area}>
                    <View style={styles.body_area_header_area}>
                        <View style={styles.body_area_header_area_left} />
                        <View style={styles.body_area_header_area_right}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ViewFullTeacherSchedule')}
                            >
                                <Text style={{
                                    textDecorationLine: 'underline',
                                    color: '#979A9A',
                                    fontSize: 13,
                                    padding: 10
                                }}>
                                    See all
                                </Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}/>
                            <Text style={{
                                textTransform: "uppercase",
                                fontWeight: 'bold', 
                            }}>
                                lịch giảng dạy
                            </Text>
                        </View>
                    </View>
                    {
                        subject.length >= 8
                        ?
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={lesson}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                        : <></>
                    }
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({ 
    container : {
        flex: 1,
        // backgroundColor: '#ffc41d'   
    },

    header: {
        height: height*18/100,
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

    container_header: {
        flex: 1,
        flexDirection: 'row',
    },

    container_header_left: {
        width: '80%',
    },

    container_header_right: {
        width: '20%',
        paddingBottom: 15
    },

    container_header_info_area: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },

    container_header_avt: {
        width: 50,
        height: 50,
        borderRadius: 15,
        marginRight: 10
    },

    container_header_intro_area: {
        marginLeft: 60,
        height: 60,
        // marginTop: 10
    },

    // qrcode: {
    //     width: 40, 
    //     height: 40, 
    //     backgroundColor: '#ECF0F1', 
    //     borderRadius: 10, 
    //     justifyContent: 'center', 
    //     alignItems: 'center',
    //     shadowColor: "#000",
    //     shadowOffset: {
    //         width: 0,
    //         height: 2,
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 3.84,
        
    //     elevation: 5,
    // },

    body: {
        height: height*82/100,
    },

    body_area_absolute: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        flexDirection: 'row',
    },

    body_area_absolute_left: {
        width: '22%',
        height: '100%',
    },

    body_area_absolute_right: {
        width: '78%',
        height: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 40
    },

    body_area: {
        flex: 1,
        // backgroundColor: '#fff'
    },

    body_area_header_area: {
        height: 70,
        flexDirection: 'row',
    },

    body_area_header_area_left: {
        width: '22%',
        height: '100%',
    },

    body_area_header_area_right: {
        width: '78%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
    },

    body_area_content_area: {
        height: 120,
        // backgroundColor: 'red',
        marginBottom: 20,
        flexDirection: 'row',
    },

    body_area_content_left: {
        width: '22%',
        height: '100%',
        // paddingLeft: 20
    },

    body_area_content_left_child: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },

    body_area_content_right: {
        width: '78%',
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
        paddingHorizontal: 30,
        justifyContent: 'center'
    }
})

export default TeacherHomePage;

