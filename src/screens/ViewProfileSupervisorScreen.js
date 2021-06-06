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
    Modal
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

import { useSelector } from 'react-redux';
import axios from 'axios';
import host from '../assets/host';
// icon store 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UserCirle from '../assets/images/user-circle.png'

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;


const ProfileTeacherScreen = ({ navigation, route }) => {

    const user = useSelector(state => state.userReducer)

    // const [parentsData, setParentsData] = React.useState({});
    const [studentData, setStudentData] = React.useState({});
    const [teacherData, setTeacherData] = React.useState({});
    const [classData, setClassData] = React.useState({});
    const [isModalVisible, setModalVisible] = React.useState(false);

    React.useEffect(() => {
        getData();
    },[])


    const getData = async () => {
        try{
            const { id } = route.params;
            // const isStudent = await axios.post(`${host}/student/getStudentByParentsId`, {id: user.data._id})
            const isTeacher = await axios.post(`${host}/teacher/getUserById`, {id: id})
            // const isClass = await axios.post(`${host}/class/getClassById`, {id: isStudent.data.classCode })
            // setStudentData(isStudent.data) 
            setTeacherData(isTeacher.data)  
            // setClassData(isClass.data[0])

        } catch(error) {
            console.log(error);
        }
    }

    const ViewModal = () => {
        return (
            <Modal animationType = {"slide"} transparent = {false}
                visible = {isModalVisible}  
            >
                <View style={{ width: width, height: height }}>
                    <View style={{ height: 50, paddingHorizontal: 15, justifyContent: 'center'}}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                        >
                            <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50 }}>
                        <View style={{ width: width, height: width }}>
                            <Image 
                            source={{ uri: `${host}/${teacherData.Avatar}`}} 
                                style={{ width: width, height: width }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <ViewModal />
            <View style={styles.header_edit}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.goBackHeader}>
                        <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                    </View>
                </TouchableOpacity>
                
                <View style={styles.titleHeader}>
                    <Text style={styles.titleHeader_text}>Hồ sơ giáo viên đưa đón</Text>
                </View>
                
                {/* <TouchableOpacity
                    onPress={() => navigation.navigate("Message")}
                > */}
                    <View style={styles.RealtimeChatHeader}>
                        <AntDesign name="message1" size={22} color="#6495ED" />
                    <Text style={styles.RealtimeChatHeader_text}>9</Text>
                        </View>
                {/* </TouchableOpacity> */}
            </View>  
                
            <View style={styles.body_edit}>
                <View style={styles.contentProfile}>

                    {/* Avatar */}
        
                    <View style={styles.contentProfile_avatar}> 
                        {
                            teacherData.Avatar
                            ?
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Image source={{ uri: `${host}/${teacherData.Avatar}` }} style={{ width: 120, height: 120, borderRadius: 70 }}/> 
                            </TouchableOpacity> 
                            
                            : <Image source={UserCirle} style={{ width: 80, height: 80 }}/> 
                        }

                    </View>
                    
                    {/* Họ tên */}

                    <View style={styles.contentProfile_textfield}>
                        <Text style={styles.contentProfile_textfield_title}>Họ và tên </Text>
                        <Text style={styles.contentProfile_textfield_content}> 
                            {
                                teacherData.FullName
                                ? teacherData.FullName
                                : null
                            }
                        </Text>
                    </View>   

                    {/* Giới tính */}

                    <View style={styles.contentProfile_textfield}>
                        <Text style={styles.contentProfile_textfield_title}>Giới tính</Text>
                        <Text style={styles.contentProfile_textfield_content}>
                            {
                                teacherData.Gender === 'Male'
                                ? 'Nam'
                                :  teacherData.Gender === 'Female'
                                ? 'Nữ'
                                : null
                            }
                        </Text>
                    </View>   

                    {/* Email  */}

                    <View style={styles.contentProfile_textfield}>
                        <Text style={styles.contentProfile_textfield_title}>Email</Text>
                        <Text style={styles.contentProfile_textfield_content}> 
                            {
                                teacherData.Email
                                ? teacherData.Email
                                : null
                            }
                        </Text>
                    </View>  

                    {/* Số điện thoại */}

                    <View style={styles.contentProfile_textfield}>
                        <Text style={styles.contentProfile_textfield_title}>Số điện thoại</Text>
                        <Text style={styles.contentProfile_textfield_content}> 
                            {
                                teacherData.NumberPhone
                                ? teacherData.NumberPhone
                                : null
                            }
                        </Text>
                    </View>  

                    {/* Ngày sinh */}

                    <View style={styles.contentProfile_textfield}>
                        <Text style={styles.contentProfile_textfield_title}>Ngày sinh</Text>
                        <Text style={styles.contentProfile_textfield_content}> 
                            {
                                teacherData.BirthDay
                                ? teacherData.BirthDay
                                : null
                            }
                        </Text>
                    </View>   

                    {/* CMND */}

                    <View style={styles.contentProfile_textfield}>
                        <Text style={styles.contentProfile_textfield_title}>CMND/CCCD </Text>
                        <Text style={styles.contentProfile_textfield_content}> 
                            {
                                teacherData.Identification
                                ? teacherData.Identification
                                : null
                            }
                        </Text>
                    </View> 

                    {/* Ngày nhập học */}

                    <View style={styles.contentProfile_textfield}>
                        <Text style={styles.contentProfile_textfield_title}>Năm Làm Việc</Text>
                        <Text style={styles.contentProfile_textfield_content}>
                            {
                                teacherData.Worked
                                ? teacherData.Worked
                                : null
                            }
                        </Text>
                    </View>  

                    {/* Quyền */}

                    <View style={styles.contentProfile_textfield}>
                        <Text style={styles.contentProfile_textfield_title}>Quyền </Text>
                        <Text style={styles.contentProfile_textfield_content}> 
                            Giáo viên đưa đón
                        </Text>
                    </View> 

                </View>
            </View>
        </View>  
    );
}


export default ProfileTeacherScreen;

const styles = StyleSheet.create({ 
    container : {
        flex: 1,
    },

    container_edit: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },        
    
    header: {
        flexDirection: 'row',
        flex: 1/11,
        backgroundColor: '#fff',
        // paddingTop: 30,
        alignItems: 'center',
        paddingHorizontal: 10
    },

    header_edit: {
        flexDirection: 'row',
        flex: 1/11,
        backgroundColor: '#fff',
        // paddingTop: 30,
        alignItems: 'center',
        paddingHorizontal: 10,
        position: 'absolute'
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
        flexDirection: 'row',
        padding: 10,
        opacity: 0,
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
        padding: 10,
        zIndex: 0,
    },

    body_edit: { 
        // flex: 1,
        padding: 10,
        zIndex: 0,
        position: 'absolute',
        width: width,
        marginTop: 50
    },

    contentProfile: {
        backgroundColor: '#fff',
        flex: 2/3,  
        borderRadius: 20,
        padding: 20,
        // shadow
        // shadowColor: "blue",
        // shadowOffset: {
        //     width: 0,
        //     height: 2, 
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 3.84,
        // elevation: 7,
    },
    
    contentProfile_avatar: {
        height: 120,
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

    contentProfile_textinput_content: {
        flex: 1,
        marginTop: 10,
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

    // Content Upload Image

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