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
import { useDispatch, useSelector} from 'react-redux'
// icon store
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// close icon store
import XuanMaiImg from '../../assets/images/xuanmai.jpg';
import AttendenceScreen from '../../screens/AttendenceScreen';
import MaleNoneAvatar from '../../assets/images/male-none-avatar.png'
import FemaleNoneAvatar from '../../assets/images/female-none-avatar.png'
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const TeacherHomePage = ({navigation}) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer)

    const [isQtyOnBus, setQtyOnBus] = React.useState(0);
    const [isQtyOutBus, setQtyOutBus] = React.useState(0);
    const [totalList, setTotalList] = React.useState(0);
    const [studentsList, setStudentsList] = React.useState([]);
    const [studentsListOnBus, setStudentsListOnBus] = React.useState([]);
    const [studentsListOutBus, setStudentsListOutBus] = React.useState([]);
    const [scheduleInfo, setScheduleInfo] = React.useState({
        date: new Date(),
        process: {
            "destination": 2,
            "status": false,
          },
        status: {
            "getOnBus": false,
            "getOutBus": false,
          },
    });
    const getData = async () => {
        setStudentsListOnBus([])
        setStudentsListOutBus([])
        const isSchedule = await axios.post(`${host}/supervisorschedule/showdestination`, { id: user.data._id})
        setScheduleInfo(isSchedule.data)
        // const newData = [];
        var qtyOnBus = 0;
        var qtyOutBus = 0;
        const isList = await axios.post(`${host}/registerbus/showAllList`)
        const dateNow = new Date(isSchedule.data.date).getDate()+"/"+new Date(isSchedule.data.date).getMonth()

        // console.log(isSchedule.data.process.destination);

        isList.data.map(value => {
            value.listBookStation.map(value2 => {
                const getDate = (new Date(value2.date)).getDate()+'/'+(new Date(value2.date)).getMonth()
                if(getDate === dateNow) {
                    // newData.push({
                    //     parentsId: value.parentsId,
                    //     station: value2,
                    // });
                    
                    axios.post(`${host}/student/getStudentByParentsId`, {id: value.parentsId})
                    .then(res => {
                        if(isSchedule.data.process.destination == 1 && isSchedule.data.status.getOnBus === true && value2.getOnBusFromHouse == false) {
                            setStudentsListOnBus(studentsListOnBus => [
                                ...studentsListOnBus,
                                {
                                    parentsId: value.parentsId,
                                    student: res.data,
                                    station: value2
                                }
                            ])
                            qtyOnBus += 1
                        } else if(isSchedule.data.process.destination == 2 && isSchedule.data.status.getOnBus === true && value2.getOnBusFromSchool == false) {
                            setStudentsListOnBus(studentsListOnBus => [
                                ...studentsListOnBus,
                                {
                                    parentsId: value.parentsId,
                                    student: res.data,
                                    station: value2
                                }
                            ])
                            qtyOnBus += 1
                        } 


                        if(isSchedule.data.process.destination == 1 && isSchedule.data.status.getOutBus === true && value2.getOutBusFromHouse == false) {
                            setStudentsListOutBus(studentsListOutBus => [
                                ...studentsListOutBus,
                                {
                                    parentsId: value.parentsId,
                                    student: res.data,
                                    station: value2
                                }
                            ])
                            qtyOutBus += 1
                        } else if(isSchedule.data.process.destination == 2 && isSchedule.data.status.getOutBus === true && value2.getOutBusFromSchool == false) {
                            setStudentsListOutBus(studentsListOutBus => [
                                ...studentsListOutBus,
                                {
                                    parentsId: value.parentsId,
                                    student: res.data,
                                    station: value2
                                }
                            ])
                            qtyOutBus += 1
                        } 
                    })
                }    
            })
        })
        setQtyOnBus(qtyOnBus);
        setQtyOutBus(qtyOutBus); 
        setTotalList(isList.data.length)
    }

    // console.log(studentsListOnBus);
    React.useEffect(() => {
        getData()
    },[])

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

    // console.log(isQtyOnBus);
    return (
        <ScrollView>
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
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
                        onPress={() => navigation.navigate("MessageList")}
                    >
                        <View style={styles.RealtimeChatHeader}>
                            <AntDesign name="message1" size={22} color="#6495ED" />
                            <Text style={styles.RealtimeChatHeader_text}>9</Text>
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
                            }}>Lên xe </Text>
                            <Text style={{
                                fontSize: 16,
                                color: '#FA0000',
                                fontWeight: 'bold',
                            }}>({studentsListOnBus.length})</Text>
                        </View>

                        <View style={styles.attendance_management_list_on_thebus}>
                            {}
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    studentsList.length !== []
                                    ? 
                                    studentsListOnBus.map((value, index) => (
                                        <TouchableOpacity   
                                            key={index}
                                            onPress={() => navigation.navigate('ViewProfileStudent', {
                                                studentData: value.student
                                            })}
                                        >
                                            <View style={styles.attendance_management_each_student_space}>
                                                <View style={styles.attendance_management_each_student_image}>
                                                    <Image 
                                                        source={value.student.avatar ? {uri: `${host}/${value.student.avatar}`} : value.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
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
                                                    }}> {value.student.name} </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                    : 
                                    <Text style={{ color: '#A6ACAF'}}>Không có thông tin học sinh.</Text>
                                }
                            </ScrollView>
                        </View>

                        <View style={styles.attendance_management_title_off_thebus}>
                            <Text style={{ 
                                color: '#2980B9',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}>Xuống xe </Text>
                            <Text style={{
                                fontSize: 16,
                                color: '#FA0000',
                                fontWeight: 'bold',
                            }}>({studentsListOutBus.length})</Text>
                        </View>

                        <View style={styles.attendance_management_list_off_thebus}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    studentsList.length !== []
                                    ? 
                                    studentsListOutBus.map((value, index) => (
                                        <TouchableOpacity   
                                            key={index}
                                            onPress={() => navigation.navigate('ViewProfileStudent', {
                                                studentData: value.student
                                            })}
                                        >
                                            <View style={styles.attendance_management_each_student_space}>
                                                <View style={styles.attendance_management_each_student_image}>
                                                    <Image 
                                                        source={value.student.avatar ? {uri: `${host}/${value.student.avatar}`} : value.student.gender === 'Male' ? MaleNoneAvatar : FemaleNoneAvatar} 
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
                                                    }}> {value.student.name} </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                    : 
                                    <Text style={{ color: '#A6ACAF'}}>Không có thông tin học sinh.</Text>
                                }
                            </ScrollView>
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
                                <Text style={{ fontSize: 13, color: '#2980B9' }}>{totalList-studentsListOutBus.length}/{totalList}</Text>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Text style={{ color: '#2980B9' }}>Bến tiếp: </Text>
                                    <Text style={{ color: '#2980B9', fontWeight: 'bold' }}>Nguyễn Văn Linh</Text>
                                </View>
                            </View>
                            <View style={styles.status_of_destination_onoff_thebus}>
                                <Text style={{ fontSize: 13, color: '#2980B9' }}>Xuống xe: </Text>
                                <Text style={{ fontSize: 13, color: '#2980B9' }}>{Number(totalList)-Number(studentsListOutBus.length)}/{totalList}</Text>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#A6ACAF' }}>
                                        { new Date(scheduleInfo.date).getDate() + '-' + (Number(new Date(scheduleInfo.date).getMonth())+1) + '-' + new Date(scheduleInfo.date).getFullYear()}
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

                        <TouchableOpacity
                            onPress={getData}
                        >
                            <View style={styles.each_function_space_middle}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialIcons name="system-update" size={width/10} color="#40E0D0" />
                                    </View>
                                    
                                </View>
                                <View style={styles.each_function_space_name}>
                                    <Text style={{ fontSize: 10, color: '#717D7E' }}>Cập nhật</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => navigation.navigate('ReasonAbsence')}>
                            <View style={styles.each_function_space_middle}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <AntDesign name="clockcircleo" size={width/12} color="#40E0D0" />
                                    </View>
                                    
                                </View>
                                <View style={styles.each_function_space_name}>
                                    <Text style={{ fontSize: 10, color: '#717D7E' }}>Báo muộn</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity>
                            <View style={styles.each_function_space_border_right}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        {/* <AntDesign name="clockcircleo" size={width/10} color="#40E0D0" /> */}
                                        <FontAwesome5 name="map-marked-alt" size={width/12} color="#40E0D0" />
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({ 
    container : {
        flex: 1,    
    },

    header: {
        flexDirection: 'row',
        flex: 1/11,
        backgroundColor: '#fff',
        // paddingTop: 30,
        alignItems: 'center',
        paddingHorizontal: 10
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
    },

    body: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 10,
    },

    attendance_management_list_space: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
    },

    attendance_management_title_on_thebus: {
        flexDirection: 'row',
        flex: 1,
        marginBottom: 15,
    },

    attendance_management_list_on_thebus: {
        flex: 1,
        alignItems: 'center'
    },

    attendance_management_title_off_thebus: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 30,
        marginBottom: 15,
    },

    attendance_management_list_off_thebus: {
        flex: 1,
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
        flex: 1,
        marginVertical: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 20,
    },

    status_of_destination_space_title: {
        flexDirection: 'row',
        flex: 1,
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
        flex: 1,
        marginBottom: 10,
        alignItems: 'flex-end'
    },

    function_list_space: {
        flexDirection: 'row',
        flex: 1,
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
    }
    
})

export default TeacherHomePage;

