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
    Modal,
    Dimensions,
    TextInput,
    Alert,
    FlatList
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

import { useSelector } from 'react-redux';
import axios from 'axios';
import host from '../assets/host';
// icon store 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Octicons } from '@expo/vector-icons';
import UserCirle from '../assets/images/user-circle.png'
import MaleNoneAvatar from '../assets/images/male-none-avatar.png' 
import FemaleNoneAvatar from '../assets/images/female-none-avatar.png' 
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// close icon
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;
const ViewProfileStudentScreen = ({ navigation, route }) => {
    const getGoBack = () => {
        navigation.goBack();
    }
    const user = useSelector(state => state.userReducer.data);

    const { studentData } = route.params
    const [textTitle, setTextTitle] = React.useState('');
    const [textContent, setTextContent] = React.useState('');
    const [teacherData, setTeacherData] = React.useState({});
    const [classData, setClassData] = React.useState({});
    const [parentsData, setParentsData] = React.useState({});
    const [isModalVisible, setModalVisible] = React.useState(false);
    const [isModalViewRating, setModalViewRating] = React.useState(false);
    const [ratingData, setRatingData] = React.useState([]);
    const [busInfo, setBusInfo] = React.useState([]);
    
    const getData = async () => {
        try{
            const isTeacher = await axios.post(`${host}/teacher/getUserById`, {id: studentData.teacherCode})
            const isClass = await axios.post(`${host}/class/getClassById`, {id: studentData.classCode})
            const isParents = await axios.post(`${host}/users/getUserById`, {id: studentData.parentsCode})
            setTeacherData(isTeacher.data)  
            setClassData(isClass.data[0])
            setParentsData(isParents.data[0])
            const isRegister = await axios.post(`${host}/registerbus/show`, { id: isParents.data[0]._id})
            if(Object.entries(isRegister.data).length > 0) {
                const isSupervisor = await axios.post(`${host}/teacher/getUserById`, {id: isRegister.data.supervisorIdTemp})
                const bsxData = await axios.post(`${host}/bus/getDataById`, {id: isRegister.data.supervisorIdTemp})
                setBusInfo({
                    bsx: bsxData.data.licensePlate,
                    name: isSupervisor.data.FullName,
                    phone: isSupervisor.data.NumberPhone,
                })
            }
        } catch(error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        getData();
    },[])

    const changeModalVisiblity = (bool) => {
        setModalVisible(bool);
    }

    const changeModalViewRating = (bool) => {
        setModalViewRating(bool);
    }

    const getDataRating = async () => {
        const isRating = await axios.post(`${host}/rating/show`, { id: parentsData._id })
        setRatingData(isRating.data)
    }

    const showRatingView = ({ item }) => (
        <View style={{ width: '100%', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Entypo name="arrow-long-right" size={24} color="#148F77" />
                <Text style={{ marginHorizontal: 5, fontSize: 13 }}>
                    {
                        (new Date(item.createdAt)).getMinutes()+':'+(new Date(item.createdAt)).getMinutes()+' '+(new Date(item.createdAt)).getDate()+'-'+((new Date(item.createdAt)).getMonth()+1)+'-'+(new Date(item.createdAt)).getFullYear()
                    }
                </Text>
                <View style={{ flex: 1, borderWidth: 0.5 }} />
            </View>
            <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#2874A6' }}>{ item.title }</Text>
                <Text>{ item.content }</Text>
            </View>
        </View>
    )

    const handleRatting = async () => {
        const isParents = await axios.post(`${host}/users/getUserById`, {id: parentsData._id})
        const { tokens } = isParents.data[0];    
        axios.post(`${host}/rating/create`, {
            parentsId: parentsData._id,
            title: textTitle,
            content: textContent,
            studentId: studentData._id,
        }).then(async () => {
            await tokens.map(item => {
                sendPushNotification(item.tokenDevices)
            })
            setTextTitle('');
            setTextContent('');
            changeModalVisiblity(false)
            Alert.alert(
                "Thành công",
                "Bạn vừa đánh giá cho học sinh.",
                [
                    {
                        text: "OK",
                        style: "cancel"
                    },
                ],
              );
        })
    }

    async function sendPushNotification(expoPushToken) {
        const message = {
          to: expoPushToken,
          sound: 'default',
          title: textTitle,
          body: textContent,
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
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                {/* Start Rating Modal */}
                <Modal 
                    transparent={true}
                    animationType="fade"
                    visible={isModalVisible}
                    nRequestClose={() => changeModalVisiblity(false)}
                >
                    <View
                        style={styles.containerModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modal}>
                                <View style={{ width: '100%', flexDirection: 'row', marginBottom: 10 }}>
                                    <Ionicons name="close-sharp" size={24} color="black" style={{ padding: 3, opacity: 0 }} />
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15, marginBottom: 10, color: '#148F77', fontWeight: 'bold' }}>Đánh giá học sinh</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => changeModalVisiblity(false)}
                                    >
                                        <Ionicons name="close-sharp" size={24} color="#839192" style={{ padding: 3}} />
                                    </TouchableOpacity>
                                </View>
                                <TextInput placeholder="Tiêu đề" value={textTitle} onChangeText={(val) => setTextTitle(val)} style={styles.modalInput} />
                                <TextInput placeholder="Nội dung" value={textContent} onChangeText={(val) => setTextContent(val)} style={styles.modalInput} />
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handleRatting}
                                >
                                    <View>
                                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Xác nhận</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* End Rating Modal */}
                {/* Start View Rating Modal */}
                <Modal 
                    transparent={true}
                    animationType="fade"
                    visible={isModalViewRating}
                    nRequestClose={() => changeModalViewRating(false)}
                >
                    <View
                        style={styles.containerModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={[styles.modal, {height: height*2/3}]}>
                                <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <Ionicons name="close-sharp" size={24} color="black" style={{ padding: 3, opacity: 0 }} />
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15, marginBottom: 10, color: '#148F77', fontWeight: 'bold' }}>Những đánh giá từ GVCN</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => changeModalViewRating(false)}
                                    >
                                        <Ionicons name="close-sharp" size={24} color="#839192" style={{ padding: 3}} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ borderWidth: 1, width: 40, marginBottom: 15 }}/>
                                <View style={{ flex: 1, width: "100%" }}>
                                    <FlatList
                                        data={ratingData}
                                        renderItem={showRatingView}
                                        keyExtractor={item => item._id}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* End Rating Modal */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={getGoBack}>
                        <View style={styles.goBackHeader}>
                            <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.titleHeader}>
                        <Text style={styles.titleHeader_text}>Hồ sơ học sinh</Text>
                    </View>
                    
                    <TouchableOpacity
                        onPress={() => {
                            getDataRating()
                            changeModalViewRating(true)
                        }}
                    >
                        <View style={styles.RealtimeChatHeader}>
                            <Octicons name="note" size={26} color="#6495ED" />
                        </View>
                    </TouchableOpacity>
                </View>  
                 
                <View style={styles.body}>
                    <View style={styles.contentProfile}>
                        <View style={styles.contentProfile_avatar}>
                            {
                                studentData.avatar 
                                ? <Image source={{ uri: `${host}/${studentData.avatar}`}} style={{ width: 120, height: 120, borderRadius: 70 }}/> 
                                : studentData.gender === "Male"
                                ? <Image source={MaleNoneAvatar} style={{ width: 120, height: 120 }}/> 
                                : studentData.gender === "Female"
                                ? <Image source={FemaleNoneAvatar} style={{ width: 120, height: 120 }}/> 
                                : null
                            }
                            
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
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Message', {
                                studentData: studentData,
                                parentsData: parentsData,
                                teacherData: teacherData
                            })}
                            style={{ flexDirection: 'row', flex: 1 }}
                        >
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

                    {
                        user 
                        ?
                            user.permission == 'teacher'
                            ?
                            <>
                                <View style={{ flex: 1, height: 50, marginBottom: 15 }}>
                                    <TouchableOpacity 
                                        onPress={() => changeModalVisiblity(true)}
                                        style={{ flexDirection: 'row', flex: 1 }}
                                    >
                                        <LinearGradient
                                            start={{ x: 0, y: 1 }}
                                            end={{ x: 0.5, y: 3 }}
                                            colors={['#77A1D3', '#79CBCA', '#e684ae8c' ]}
                                            style={{ 
                                                flexDirection: 'row', 
                                                flex: 1, 
                                                paddingHorizontal: 20, 
                                                borderRadius: 40 ,
                                                alignItems: 'center'
                                            }}
                                        >
                                            <AntDesign name="codesquareo" size={20} color="#D5DBDB" />
                                            <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>Viết đánh giá</Text>
                                            <AntDesign name="message1" size={22} color="#6495ED"  style={{ opacity: 0 }} />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </>
                            : <></>
                        : <></>
                    }

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
                                {
                                    parentsData.avatar
                                    ? <Image source={{ uri: `${host}/${parentsData.avatar}`}} style={{ width: 80, height: 80, borderRadius: 15}}/>
                                    : <Image source={UserCirle} style={{ width: 80, height: 80}}/>
                                }
                                 
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

                    <View style={{ height: 20 }}/>

                    <View style={styles.contentProfile_parents}>
                        <View style={styles.contentProfile_parents_header}>
                            <LinearGradient 
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                locations={[0, 0]}
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
                                    Thông tin xe đã đăng ký.
                                </Text>
                            </LinearGradient>
                        </View>
                        <View style={styles.contentProfile_parents_body}>
                            
                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}>Biển số xe: </Text>
                                <Text style={styles.contentProfile_textfield_content}> 
                                    {
                                        busInfo.bsx
                                        ? busInfo.bsx
                                        : null
                                    }
                                </Text>
                            </View>

                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}>Tên người phụ trách: </Text>
                                <Text style={styles.contentProfile_textfield_content}> 
                                    {
                                        busInfo.name
                                        ? busInfo.name
                                        : null
                                    }
                                </Text>
                            </View>

                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}>Sđt người phụ trách: </Text>
                                <Text style={styles.contentProfile_textfield_content}> 
                                    {
                                        busInfo.phone
                                        ? busInfo.phone
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

    modalContainer: {
        width: width, 
        height: height,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0, 0.2)'
    },

    modal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: width - 30,
        paddingHorizontal: 20,
        zIndex: 99,
        alignItems: 'center',
        padding: 15,
    },

    modalInput: {
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor: '#A6ACAF', 
        width: '100%', 
        paddingHorizontal: 10,
        marginBottom: 10
    },

    modalButton: {
        width: '100%',
        backgroundColor: "#239B56",
        alignItems: 'center',
        paddingVertical: 12
    }
})