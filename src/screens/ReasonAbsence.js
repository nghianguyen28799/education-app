import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
// import Modal from 'react-native-modal';
// icon store
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Easing } from 'react-native-reanimated';
// close icon store
import MaleNoneAvatar from '../assets/images/male-none-avatar.png' 
import FemaleNoneAvatar from '../assets/images/female-none-avatar.png' 
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import host from '../assets/host';
import { useDispatch, useSelector } from 'react-redux'

const ReasonAbsence = ({navigation, route}) => {
    const [text, setText] = React.useState('');
    const [studentData, setStudentData] = React.useState({});
    const [teacherData, setTeacherData] = React.useState({});
    const [classData, setClassData] = React.useState({});
    const user = useSelector(state => state.userReducer)
    const fetchData = async () => {
        try{
            const isStudent = await axios.post(`${host}/student/getStudentByParentsId`, {id: user.data._id})
            const isTeacher = await axios.post(`${host}/teacher/getUserById`, {id: isStudent.data.teacherCode})
            const isClass = await axios.post(`${host}/class/getClassById`, {id: isStudent.data.classCode})
            setStudentData(isStudent.data) 
            setTeacherData(isTeacher.data)  
            setClassData(isClass.data[0])
        } catch(error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        fetchData()
    },[])

    const handleAbsence = async () => {
        await axios.post(`${host}/noattendance/editReason`,{
            classCode: classData._id,
            parentsId: user.data._id,
            reason: text
        })
        await axios.post(`${host}/notification/editStatus`, {
            id: route.params.id
        })

        navigation.replace('Home')
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.goBackHeader}>
                        <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                    </View>
                </TouchableOpacity>
                
                <View style={styles.titleHeader}>
                    <Text style={styles.titleHeader_text}>Lý do vắng điểm danh</Text>
                </View>
                
                <View style={styles.RealtimeChatHeader}>
                    <AntDesign name="message1" size={22} color="#6495ED" />
                    <Text style={styles.RealtimeChatHeader_text}>9</Text>
                </View>
            </View>  
            <View style={ styles.body }>
                <View style={styles.reason_intro}>
                    <Text style={{ textAlign: 'center', color: '#2980B9' }}>
                        Học sinh chưa được điểm danh ngày { route.params.date }. Vui lòng điền lý do vắng mặt ở dưới và xác nhận học sinh vắng
                    </Text>
                </View>
                <View style={ styles.reason_body }>
                    <View style={ styles.reason_form }>
                        <View style={ styles.form_title }>
                            <Text style={{ fontSize: 15, color: '#2980B9', fontWeight: 'bold' }}>Form điền lý do vắng</Text>
                        </View>
                        <View style={styles.reason_content}>
                            <View style={styles.reason_content_left}>
                            {
                                studentData.avatar 
                                    ? <Image source={{ uri: `${host}/${studentData.avatar}`}} style={{ width: 80, height: 80, borderRadius: 40 }}/> 
                                    : studentData.gender === "Male"
                                    ? <Image source={MaleNoneAvatar} style={{ width: 80, height: 80 }}/> 
                                    : studentData.gender === "Female"
                                    ? <Image source={FemaleNoneAvatar} style={{ width: 80, height: 80 }}/> 
                                : null
                            }
                            </View>
                            <View style={styles.reason_content_right}>
                                <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#2980B9' }}>
                                    { studentData ? studentData.name : null}
                                </Text>
                                <Text>Lớp: <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{ classData ? classData.ClassCode : null }</Text></Text>
                                <Text>GVCN: </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>({ teacherData ? teacherData.Gender === "Male" ? "Thầy" : teacherData.Gender === "Female" ? "Cô" : null : null}) </Text>
                                    <Text style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{teacherData ? teacherData.FullName : null }</Text>
                                </View>
                                <View style={{ width: '100%', borderBottomWidth: 1, borderBottomColor: '#BDC3C7', paddingVertical: 5 }}>
                                    <TextInput 
                                        placeholder="Điền lý do vắng"
                                        onChangeText={(value) => setText(value)}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={handleAbsence}
                                >
                                    <View style={{ width: '100%', alignItems: 'center', marginTop: 20, paddingVertical: 12, borderRadius: 13, backgroundColor: '#5DADE2' }}>
                                        <Text style={{ color: '#fff' }}>Xác nhận</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ReasonAbsence

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
        marginRight: 20
    },

    titleHeader: {
        flex: 1,
        // backgroundColor: '#000',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'
    },

    titleHeader_text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2980B9',
    },

    RealtimeChatHeader: {
        padding: 10,
        opacity: 0
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
    },

    reason_intro: {
        height: '15%',
        // borderWidth: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 20
    },

    reason_body: {
        flex: 1,
        paddingHorizontal: 15,
    },

    reason_form: {
        // borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    form_title: {
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#BDC3C7',
    },

    reason_content: {
        paddingVertical: 40,
        flexDirection: 'row',
    },

    reason_content_left: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 10
    },

    reason_content_right: {
        flex: 1,
    }
})