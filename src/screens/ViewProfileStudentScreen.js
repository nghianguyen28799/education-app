import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

import { useSelector } from 'react-redux';
import axios from 'axios';
import host from '../assets/host';
// icon store 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

import UserCirle from '../assets/images/user-circle.png'
// close icon
const ViewProfileStudentScreen = ({ navigation, route }) => {
    const getGoBack = () => {
        navigation.goBack();
    }
    // const user = useSelector(state => state.userReducer)
    // console.log(user);

    const { studentData } = route.params
    
    const [teacherData, setTeacherData] = React.useState({});
    const [classData, setClassData] = React.useState({});
    const [parentsData, setParentsData] = React.useState({});

    const getData = async () => {
        try{
            const isTeacher = await axios.post(`${host}/teacher/getUserById`, {id: studentData.teacherCode})
            const isClass = await axios.post(`${host}/class/getClassById`, {id: studentData.classCode})
            const isParents = await axios.post(`${host}/users/getUserById`, {id: studentData.parentsCode})
            setTeacherData(isTeacher.data)  
            setClassData(isClass.data[0])
            setParentsData(isParents.data[0])
        } catch(error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        getData();
    },[])

    return (
        <ScrollView>
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={getGoBack}>
                        <View style={styles.goBackHeader}>
                            <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.titleHeader}>
                        <Text style={styles.titleHeader_text}>Hồ sơ học sinh</Text>
                    </View>
                    
                    <TouchableOpacity>
                        <View style={styles.RealtimeChatHeader}>
                            <AntDesign name="message1" size={22} color="#6495ED" />
                        </View>
                    </TouchableOpacity>
                </View>  
                 
                <View style={styles.body}>
                    <View style={styles.contentProfile}>
                        <View style={styles.contentProfile_avatar}>
                            <Image source={UserCirle} style={{ width: 80, height: 80 }}/> 
                        </View>
                        
                        {/* Họ tên */}

                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}> Họ và tên </Text>
                            <Text style={styles.contentProfile_textfield_content}> 
                                {
                                    studentData.name
                                    ? studentData.name
                                    : null
                                }
                            </Text>
                        </View>   

                        {/* Giới tính */}

                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}> Giới tính</Text>
                            <Text style={styles.contentProfile_textfield_content}>
                                {
                                    studentData.gender == 'Male'
                                    ? 'Nam'
                                    : studentData.gender == 'Female'
                                    ? 'Nữ'
                                    : null
                                }
                            </Text>
                        </View>   

                        {/* Ngày sinh */}

                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}> Ngày sinh</Text>
                            <Text style={styles.contentProfile_textfield_content}> 
                                {
                                    studentData.birthday
                                    ? studentData.birthday
                                    : null
                                }
                            </Text>
                        </View>   

                        {/* Ngày nhập học */}

                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Ngày nhập học</Text>
                            <Text style={styles.contentProfile_textfield_content}>
                                {
                                    studentData.joined
                                    ? studentData.joined
                                    : null
                                }
                            </Text>
                        </View>  

                        {/* Lớp */}

                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}> Lớp</Text>
                            <Text style={styles.contentProfile_textfield_content}> {`Lớp `}
                                {
                                    classData.ClassCode
                                    ? classData.ClassCode
                                    : null
                                }
                            
                            </Text>
                        </View>   

                        {/* GVCN */}

                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}> Giáo viên chủ nhiệm</Text>
                            <Text style={styles.contentProfile_textfield_content}>
                                {
                                    teacherData.Gender === 'Male'
                                    ? '( Thầy ) '
                                    : teacherData.Gender === 'Female'
                                    ? '( Cô ) '
                                    : null 
                                }
                                {
                                    teacherData.FullName
                                    ? teacherData.FullName
                                    : null
                                }
                            </Text>
                        </View>
                    </View>
                    
                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#D5DBDB', marginVertical: 15}}></View> 

                    <View style={{ flex: 1, height: 50, marginBottom: 15 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }}>
                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 0.5, y: 3 }}
                                colors={['#5499C7', '#5DADE2','#40E0D0']}
                                style={{ 
                                    flexDirection: 'row', 
                                    flex: 1, 
                                    paddingHorizontal: 20, 
                                    borderRadius: 40 ,
                                    alignItems: 'center'
                                }}
                            >
                                <AntDesign name="message1" size={22} color="#D5DBDB" />
                                <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>Tin nhắn</Text>
                                <AntDesign name="message1" size={22} color="#6495ED"  style={{ opacity: 0 }} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>                

                    <View style={styles.contentProfile_parents}>
                        <View style={styles.contentProfile_parents_header}>
                            <LinearGradient 
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                locations={[0.5, 1]}
                                colors={['#f1c1bfed', '#69dfe3']}
                                style={{
                                    flex: 1,
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    paddingHorizontal: 20,
                                    justifyContent: 'center'
                                }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: '#2980B9'
                                 }}>
                                    Thông tin phụ huynh
                                </Text>
                            </LinearGradient>
                        </View>
                        <View style={styles.contentProfile_parents_body}>
                            <View style={{
                                flexDirection: 'row',
                                // borderWidth: 1,
                            }}>
                                <Image source={UserCirle} style={{ width: 80, height: 80}}/> 
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginLeft: 15 }}>
                                        <Text style={{ 
                                            color: "#A6ACAF", 
                                            fontSize: 12, 
                                            fontWeight: 'bold', 
                                            borderBottomWidth: 1, 
                                            borderBottomColor: '#D5DBDB',
                                            paddingVertical: 5 
                                        }}>
                                            Họ và tên:
                                        </Text>
                                        <Text style={{ 
                                            flex: 1, 
                                            color: "#2980B9", 
                                            fontSize: 12, 
                                            fontWeight: 'bold', 
                                            borderBottomWidth: 1,  
                                            borderBottomColor: '#D5DBDB',
                                            paddingVertical: 5,
                                            textAlign: 'right'
                                        }}>
                                            {
                                                parentsData.myFullName
                                                ? parentsData.myFullName
                                                : null
                                            }
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginLeft: 15 }}>
                                        <Text style={{ 
                                            color: "#A6ACAF", 
                                            fontSize: 12, 
                                            fontWeight: 'bold', 
                                            borderBottomWidth: 1, 
                                            borderBottomColor: '#D5DBDB',
                                            paddingVertical: 5,
                                        }}>
                                            Số điện thoại:
                                        </Text>
                                        <Text style={{ 
                                            flex: 1, 
                                            color: "#2980B9", 
                                            fontSize: 12, 
                                            fontWeight: 'bold', 
                                            borderBottomWidth: 1,  
                                            borderBottomColor: '#D5DBDB',
                                            paddingVertical: 5,
                                            textAlign: 'right'
                                        }}>
                                            {
                                                parentsData.numberPhone
                                                ? parentsData.numberPhone
                                                : null
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        
                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Email: </Text>
                                <Text style={styles.contentProfile_textfield_content}> 
                                    {
                                        parentsData.email
                                        ? parentsData.email
                                        : null
                                    }
                                </Text>
                            </View>
                        
                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Giới tính: </Text>
                                <Text style={styles.contentProfile_textfield_content}> 
                                    {
                                        parentsData.gender === 'Male'
                                        ? 'Nam'
                                        : parentsData.gender === 'Female'
                                        ? 'Nữ'
                                        : null
                                    }
                                </Text>
                            </View>

                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Mối quan hệ: </Text>
                                <Text style={styles.contentProfile_textfield_content}> 
                                    {
                                        parentsData.relationship
                                        ? parentsData.relationship
                                        : null
                                    }
                                </Text>
                            </View>
                            
                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Năm sinh: </Text>
                                <Text style={styles.contentProfile_textfield_content}>
                                    {
                                        parentsData.birthDay
                                        ? parentsData.birthDay
                                        : null
                                    }
                                </Text>
                            </View>

                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Địa chỉ: </Text>
                                <Text style={styles.contentProfile_textfield_content}> 
                                    {
                                        parentsData.address
                                        ? parentsData.address
                                        : null
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>     
                </View>
            </View>
        </ScrollView>
    );
};

export default ViewProfileStudentScreen;

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
        alignItems: 'center'
    },

    titleHeader_text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2980B9',
        paddingLeft: 15,       
    },

    RealtimeChatHeader: {
        padding: 10,
        opacity: 0
    },

    body: { 
        flex: 1,
        padding: 10,
    },

    contentProfile: {
        backgroundColor: '#fff',
        flex: 2/3,  
        borderRadius: 20,
        padding: 20,
        // shadown
        shadowColor: "blue",
        shadowOffset: {
            width: 0,
            height: 2, 
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 7,
    },
    
    contentProfile_avatar: {
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },

    contentProfile_textfield: {
        flex: 1/9,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#D5DBDB',
        marginBottom: 5,
        alignItems: 'center'
    },

    contentProfile_textfield_title: {
        marginTop: 10,
        paddingVertical: 5, 
        color: '#A6ACAF',
        fontSize: 12,
        fontWeight: 'bold',
    },

    contentProfile_textfield_content: {
        flex: 1,
        marginTop: 10,
        paddingVertical: 5, 
        color: '#2980B9',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'right',
    },

    contentProfile_parents: {
        backgroundColor: '#fff',
        flex: 2/3,  
        borderRadius: 20,
        paddingBottom: 20,
        // shadown
        shadowColor: "blue",
        shadowOffset: {
            width: 0,
            height: 2, 
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 7,
    },

    contentProfile_parents_header: {
        height: 50,
    },
    
    contentProfile_parents_body: {
        marginTop: 15,
        paddingHorizontal: 20
    },
})