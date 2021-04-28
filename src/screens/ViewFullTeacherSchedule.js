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
import host from '../assets/host';
import { useDispatch, useSelector } from 'react-redux'

// icon store
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// close icon store

import backgroundImg from '../assets/images/background-login.jpg'
// import MaleNoneAvatar from '../assets/images/male-none-avatar.png'
// import FemaleNoneAvatar from '../assets/images/female-none-avatar.png'
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

    var weekday = new Array(7);
    weekday[0] = "sunday";
    weekday[1] = "monday";
    weekday[2] = "tuesday";
    weekday[3] = "wednesday";
    weekday[4] = "thurday";
    weekday[5] = "friday";
    weekday[6] = "saturday";

    const getDay = weekday[d.getDay()];
    const [subject, setSubject] = React.useState([]);
    const [isDay, setDay] = React.useState(new Date().getDay())
    const [isDate, setDate] = React.useState([])

    const getData = async () => {
        const classCode = user.ClassCode;
        const isSchedule = await axios.post(`${host}/schedule/show`, { classCode: classCode })
        const dayList = isSchedule.data.DayList
        for (const [key, value] of Object.entries(dayList)) {
            const getKey = key.slice(0, key.length-1);
            if(getKey === getDay) {
                setSubject(previous => [...previous, value])
            }
        }
    }

    const getMonday = (d) => {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        const dateArr = [];
        for(let i=0 ; i<7 ; i++) {
            const date = new Date(d.setDate(diff));
            const newDate = new Date(date.setDate(date.getDate() + i));
            dateArr.push(newDate.getDate())
        }
        setDate(dateArr);
      }

    React.useEffect(() => {
        getData()
        getMonday(new Date())
    },[]);

    const handleChangeDay = async (valueDay) => {
        setDay(valueDay)
        setSubject([]);
        const getDay = weekday[valueDay];
        const classCode = user.ClassCode;
        const isSchedule = await axios.post(`${host}/schedule/show`, { classCode: classCode })
        const dayList = isSchedule.data.DayList
        for (const [key, value] of Object.entries(dayList)) {
            const getKey = key.slice(0, key.length-1);
            if(getKey === getDay) {
                setSubject(previous => [...previous, value])
            }
        }
    }

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
                        }}>Lịch giảng dạy</Text>
                    </View>

                    <View style={{ opacity: 0  }}>
                        <TouchableOpacity>
                        <View style={styles.goBackHeader}>
                            <AntDesign name="message1" size={24} color="#000" />
                        </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.container_box}>
                    <View style={styles.container_header_box}>
                        <View style={styles.container_header_left}>
                            <Entypo name="calendar" size={30} color="black" style={{ marginRight: 10}}/>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{n}</Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginHorizontal: 5, color: '#5F6A6A' }}>2021</Text>
                        </View>
                        <View style={styles.container_header_right}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{isDay === new Date().getDay() ? 'Hôm nay' : ''}</Text>
                        </View>
                    </View>

                    <View style={styles.container_body_box}>

                        {
                            weekdayData.map((item, index) => (
                                <View 
                                    style={styles.each_date_box} 
                                    key={item.id}
                                >
                                    <TouchableOpacity
                                        style={{ flex: 1 }}
                                        onPress={() => handleChangeDay(item.serial)}
                                    >
                                        <View style={ item.serial == isDay ? styles.each_date_selected : styles.each_date}>
                                            <Text style={[{ fontWeight: 'bold', fontSize: 13, color: '#797D7F'}, item.serial == isDay ? {color: '#fff'} : {color: '#000'}]}>
                                                {item.code}
                                            </Text>
                                            <Text style={[{ fontWeight: 'bold' }, item.serial == isDay ? {color: '#fff'} : {color: '#000'} ]}>{item.serial !== 0 ? isDate[item.serial-1] : isDate[6]}</Text>
                                        </View>
                                    </TouchableOpacity>  
                                </View>
                            ))
                        }

                        {/* <View style={styles.each_date_box}>
                            <View style={[styles.each_date, {backgroundColor: '#212F3C'}]}>
                                <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#fff'}}>T4</Text>
                                <Text style={{ fontWeight: 'bold', color: '#fff' }}>7</Text>
                            </View>
                        </View> */}
                        
                    </View>
                </View>
                
            </View>
            <View style={styles.body}>
                <View style={styles.body_area_absolute} />
        
                <View style={styles.body_area}>
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
        backgroundColor: '#ffc41d'   
    },

    header: {
        height: height*28/100,
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
        height: "30%",
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
        height: "70%",
        flexDirection: 'row',

        justifyContent: 'center',
        alignItems: 'center'
    },

    each_date_box: {
        height: '60%',
        flex: 1/7,
        paddingHorizontal: 2
    },

    each_date: {
        flex: 1,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },

    each_date_selected: {
        backgroundColor: '#212F3C',
        flex: 1,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },

    body: {
        height: height*72/100,
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
        height: 120,
        // backgroundColor: 'red',
        marginBottom: 20,
        flexDirection: 'row',
    },

    body_area_content_left: {
        width: '22%',
        height: '100%',
        paddingLeft: 20
    },

    body_area_content_left_child: {
        backgroundColor: '#38f9d6',
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

