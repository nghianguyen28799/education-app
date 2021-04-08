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
    TextInput,
    Dimensions,
    Picker,
    Modal
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../actions/userAction';
import axios from 'axios';
import host from '../../assets/host';
// icon store 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons';
import UserCirle from '../../assets/images/user-circle.png'
import MaleNoneAvatar from '../../assets/images/male-none-avatar.png'
import FemaleNoneAvatar from '../../assets/images/female-none-avatar.png'
// close icon

import RNPickerSelect from 'react-native-picker-select';
import LottieView from 'lottie-react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const ProfileParentsScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer)

    const [parentsData, setParentsData] = React.useState({});
    const [studentData, setStudentData] = React.useState({});
    const [teacherData, setTeacherData] = React.useState({});
    const [classData, setClassData] = React.useState({});
    const [edit, setEdit] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [imageStudent, setImageStudent] = React.useState(null);
    const [imageParents, setImageParents] = React.useState(null);
    const [isModalVisible, setModalVisible] = React.useState(false);
    
    React.useEffect(() => {
        getStudentById();
    },[])

    const getStudentById = async () => {
        try{
            const isStudent = await axios.post(`${host}/student/getStudentByParentsId`, {id: user.data._id})
            const isTeacher = await axios.post(`${host}/teacher/getUserById`, {id: isStudent.data.teacherCode})
            const isClass = await axios.post(`${host}/class/getClassById`, {id: isStudent.data.classCode})
            setStudentData(isStudent.data) 
            setTeacherData(isTeacher.data)  
            setClassData(isClass.data[0])
            setParentsData(user.data)
            
            isStudent.data.avatar && setImageStudent(isStudent.data.avatar)
            setImageParents(user.data.Avatar)

            // console.log(isStudent.data);
            // console.log(isTeacher.data);
        } catch(error) {
            console.log(error);
        }
    }

    const getGoBack = () => {
        navigation.goBack();
    }

    const changeEdit = async () => {
        setEdit(!edit);
    }

    const onChangeTextName = (value) => {
        setParentsData({
            ...parentsData,
            FullName: value
        })
    }

    const onChangeTextPhone = (value) => {
        setParentsData({
            ...parentsData,
            NumberPhone: value
        })
    }

    const onChangeTextEmail = (value) => {
        setParentsData({
            ...parentsData,
            Email: value
        })
    }

    const onChangeTextBirthDay = (value) => {
        setParentsData({
            ...parentsData,
            birthDay: value
        })
    }

    const onChangeTextRelationship = (value) => {
        setParentsData({
            ...parentsData,
            relationship: value
        })
    }

    const onChangeTextAddress = (value) => {
        setParentsData({
            ...parentsData,
            Address: value
        })
    }

    const onChangeTextGender = (value) => {
        setParentsData({
            ...parentsData,
            gender: value
        })
    }

    const confirmChangeInfo = async () => {
        const changeInfo = await axios.post(`${host}/users/changeInfoParents`, { parentsData })
        const { data, error } = changeInfo;
        
        if(!error) {
            setLoading(true)
            const timer = setInterval(async () => {
                dispatch(addUser(parentsData))
                navigation.replace('Profile');
                clearInterval(timer)
            },2000)
 
        } else {
            console.log(error);
        }
    }

    const bs1 = React.createRef()
    const fall1 = new Animated.Value(1);

    const bs2 = React.createRef()
    const fall2 = new Animated.Value(1);

    const takePhotoFromCamera = () => {
        console.log('take photo');
    }

    const uploadParentsImage = async (file) => {
        const localUri = file;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        const formData = new FormData();
        const dataPicture = JSON.parse(JSON.stringify({ uri: localUri, name: filename, type }));
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        
        formData.append('photo', dataPicture);
        formData.append('_id', parentsData._id);

        // end upload image

        const changeInfo = await axios.post(`${host}/users/changeAvatarParents`, formData, config)
        const { data, error } = changeInfo;
        if(!error) {
            setLoading(true)
            const timer = setInterval(async () => {
                await dispatch(addUser({
                    ...user.data,
                    Avatar: data.uri
                }))
                navigation.replace('Profile');
                clearInterval(timer)
            },2000)
        } else {
            console.log(error);
        }
    }

    const uploadStudentImage = async (file) => {
        const localUri = file;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        const formData = new FormData();
        const dataPicture = JSON.parse(JSON.stringify({ uri: localUri, name: filename, type }));
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        
        formData.append('photo', dataPicture);
        formData.append('_id', studentData._id);

        // end upload image

        const changeInfo = await axios.post(`${host}/student/changeStudentAvatar`, formData, config)
        const { data, error } = changeInfo;
        if(!error) {
            setLoading(true)
            const timer = setInterval(async () => {
                navigation.replace('Profile');
                clearInterval(timer)
            },2000)
        } else {
            console.log(error);
        }
    }

    const choosePhotoFromLibraryForParents = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
          });
      
          if (!result.cancelled) {
            setParentsData({
                ...parentsData,
                Avatar: result.uri
            })
            uploadParentsImage(result.uri)
        }
    }

    const choosePhotoFromLibraryForStudent = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
          });
      
        if (!result.cancelled) {
            uploadStudentImage(result.uri)
        }
    }

    const renderInnerParents = () => (
        <View style={styles.panel}>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Cập nhật hình ảnh</Text>
                <Text style={styles.panelSubtitle}>Chọn hình ảnh hồ sơ của bạn</Text>
            </View>

            <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
                <Text style={styles.panelButtonTitle}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibraryForParents}>
                <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => bs1.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity> 
        </View>
    )

    const renderInnerStudent = () => (
        <View style={styles.panel}>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Cập nhật hình ảnh</Text>
                <Text style={styles.panelSubtitle}>Chọn hình ảnh cho học sinh</Text>
            </View>

            <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
                <Text style={styles.panelButtonTitle}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibraryForStudent}>
                <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => bs1.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
            
        </View>
    )

    const renderHeader = () => (
        <View style={{     overflow: 'hidden', paddingTop: 5 }}>
            <View style={{
                backgroundColor: '#FFFFFF',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,

                elevation: 10,

                paddingTop: 15,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }}>
                <View style={{  alignItems: 'center',}}>
                    <View style={{
                        width: 40,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#00000040',
                        marginBottom: 10,
                    }} />
                </View>
            </View>
        </View>
    )
   
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
                    <BottomSheet 
                        ref={bs1}
                        snapPoints={[330, 0]}
                        initialSnap={1}
                        callbackNode={fall1}
                        enabledGestureInteraction={true}
                        renderContent={renderInnerParents}
                        zIndex={99999}
                        renderHeader={renderHeader}
                    />

                    <BottomSheet 
                        ref={bs2}
                        snapPoints={[450, 0]}
                        initialSnap={1}
                        callbackNode={fall2}
                        enabledGestureInteraction={true}
                        renderContent={renderInnerStudent}
                        zIndex={99999}
                        renderHeader={renderHeader}
                    />
                </View>
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
                            <TouchableOpacity onPress={() => bs2.current.snapTo(0)}>
                                {
                                    imageParents
                                    ? <Image source={{ uri: `${host}/${imageStudent}` }} style={{ width: 120, height: 120, borderRadius: 70, borderWidth: 3, borderColor: '#9EBBD0' }}/> 
                                    : studentData.gender === "Male"
                                    ?  <Image source={MaleNoneAvatar} style={{ width: 80, height: 80 }}/> 
                                    : studentData.gender === "Female"
                                    ?  <Image source={FemaleNoneAvatar} style={{ width: 80, height: 80 }}/> 
                                    : null
                                }
                            </TouchableOpacity>
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
                    

                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#D5DBDB', marginVertical: 15}} /> 

                    {
                        edit

                        ?   // Edit Info
                        
                        <View style={styles.contentProfile_parents}>
                        <View style={styles.contentProfile_parents_header}>
                            <LinearGradient 
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                locations={[0.5, 1]}
                                colors={['#f1c1bfed', '#69dfe3']}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                }}>

                                    <TouchableOpacity onPress={changeEdit}>
                                        <FontAwesome5 name="angle-left" size={30} color="#2471A3" style={{ marginRight: 15}}/>
                                    </TouchableOpacity>

                                    <Text style={{
                                        flex: 1,
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: '#2980B9'
                                    }}>
                                        Cập nhật thông tin phụ huynh
                                    </Text>
                                    
                                    <TouchableOpacity onPress={confirmChangeInfo}>
                                        <AntDesign name="check" size={22} color="#28B463" />
                                    </TouchableOpacity>

                            </LinearGradient>
                        </View>

                        <View style={styles.contentProfile_parents_body}>
                            <View style={{
                                flexDirection: 'row',
                                // borderWidth: 1,
                            }}>

                                {/* Image  */}
                                <TouchableOpacity onPress={() => bs1.current.snapTo(0)}>
                                    {
                                        imageParents
                                        ? <Image source={{ uri: `${host}/${imageParents}` }} style={{ width: 80, height: 80, borderRadius: 15 }}/> 
                                        : <Image source={UserCirle} style={{ width: 80, height: 80}}/> 
                                    }
                                   
                                </TouchableOpacity>
                               
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginLeft: 15  }}>
                                        <Text style={{ 
                                            color: "#A6ACAF", 
                                            fontSize: 12, 
                                            fontWeight: 'bold', 
                                            borderBottomWidth: 1, 
                                            borderBottomColor: '#D5DBDB',
                                            justifyContent: 'center',
                                            height: 30,
                                            textAlign: 'auto',
                                            paddingTop: 7
                                        }}>
                                            Họ và tên:
                                        </Text>
                                        <TextInput 
                                            style={{ 
                                                flex: 1, 
                                                color: "#2980B9", 
                                                fontSize: 12, 
                                                fontWeight: 'bold', 
                                                borderBottomWidth: 1,  
                                                borderBottomColor: '#D5DBDB',
                                                textAlign: 'right',
                                                height: 30,
                                            }}
                                            value={parentsData.FullName} 
                                            onChangeText={(value) => onChangeTextName(value)}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginLeft: 15 }}>
                                    <Text style={{ 
                                            color: "#A6ACAF", 
                                            fontSize: 12, 
                                            fontWeight: 'bold', 
                                            borderBottomWidth: 1, 
                                            borderBottomColor: '#D5DBDB',
                                            justifyContent: 'center',
                                            height: 30,
                                            textAlign: 'auto',
                                            paddingTop: 7
                                        }}>
                                            Số điện thoại
                                        </Text>
                                        <TextInput 
                                            style={{ 
                                                flex: 1, 
                                                color: "#2980B9", 
                                                fontSize: 12, 
                                                fontWeight: 'bold', 
                                                borderBottomWidth: 1,  
                                                borderBottomColor: '#D5DBDB',
                                                textAlign: 'right',
                                                height: 30,
                                            }}
                                            value={parentsData.NumberPhone} 
                                            onChangeText={(value) => onChangeTextPhone(value)}
                                        />
                                    </View>
                                </View>
                            </View>
                        
                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Email: </Text>
                                <TextInput
                                    style={styles.contentProfile_textinput_content}
                                    value={parentsData.Email}
                                    onChangeText={(value) => onChangeTextEmail(value)}
                                />
                            </View>
                        
                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Giới tính: </Text>
                                
                                <View
                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                >
                                    <Picker
                                        selectedValue={parentsData.gender}
                                        style={{ height: 30, width: 100,  color: '#2980B9', fontSize: 13, }}
                                        onValueChange={(itemValue) => onChangeTextGender(itemValue)}
                                        >
                                        <Picker.Item label="Nam" value="Male" />
                                        <Picker.Item label="Nữ" value="Female" />
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Mối quan hệ: </Text>
                                <TextInput
                                    style={styles.contentProfile_textinput_content}
                                    value={parentsData.relationship}
                                    onChangeText={(value) => onChangeTextRelationship(value)}
                                />
                            </View>
                            
                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Năm sinh: </Text>
                                <TextInput
                                    style={styles.contentProfile_textinput_content}
                                    value={parentsData.birthDay}
                                    onChangeText={(value) => onChangeTextBirthDay(value)}
                                />
                            </View>

                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Địa chỉ: </Text>
                                <TextInput
                                    style={styles.contentProfile_textinput_content}
                                    value={parentsData.Address}
                                    onChangeText={(value) => onChangeTextAddress(value)}
                                />
                            </View>
                        </View>
                        {
                            loading
                            ? <LottieView source={require('../../assets/json/loader.json')} autoPlay loop />
                            : null
                        }
                    </View> 

                    :       // View Info

                    <View style={styles.contentProfile_parents}>
                        <View style={styles.contentProfile_parents_header}>
                            <LinearGradient 
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                locations={[0.5, 1]}
                                colors={['#f1c1bfed', '#69dfe3']}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                }}>
                                <Text style={{
                                    flex: 1,
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: '#2980B9'
                                 }}>
                                    Thông tin phụ huynh
                                </Text>
                                
                                <TouchableOpacity onPress={changeEdit}>
                                    <Feather name="edit" size={22} color="#2471A3" />
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>

                        <View style={styles.contentProfile_parents_body}>
                            <View style={{
                                flexDirection: 'row',
                                // borderWidth: 1,
                            }}>
                                    {
                                        imageParents
                                        ? <Image source={{ uri: `${host}/${imageParents}` }} style={{ width: 80, height: 80, borderRadius: 15 }}/> 
                                        : <Image source={UserCirle} style={{ width: 80, height: 80}}/> 
                                    }
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginLeft: 15, }}>
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
                                                user.data.FullName
                                                ? user.data.FullName
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
                                                user.data.NumberPhone
                                                ? user.data.NumberPhone
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
                                        user.data.Email
                                        ? user.data.Email
                                        : null
                                    }
                                </Text>
                            </View>
                        
                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Giới tính: </Text>
                                <Text style={styles.contentProfile_textfield_content}> 
                                    {
                                        user.data.gender === "Male"
                                        ? 'Nam'
                                        : user.data.gender === "Female"
                                        ? "Nữ"
                                        : null
                                    }
                                </Text>
                            </View>

                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Mối quan hệ: </Text>
                                <Text style={styles.contentProfile_textfield_content}> 
                                    {
                                        user.data.relationship
                                        ? user.data.relationship
                                        : null
                                    }
                                </Text>
                            </View>
                            
                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Năm sinh: </Text>
                                <Text style={styles.contentProfile_textfield_content}>
                                    {
                                        user.data.birthDay
                                        ? user.data.birthDay
                                        : null
                                    }
                                </Text>
                            </View>

                            <View style={styles.contentProfile_textfield}>
                                <Text style={styles.contentProfile_textfield_title}> Địa chỉ: </Text>
                                <Text style={styles.contentProfile_textfield_content}> 
                                    {
                                        user.data.Address
                                        ? user.data.Address
                                        : null
                                    }
                                </Text>
                            </View>
                        </View>
                    </View> 
                    }
                </View>
            </View>
        </ScrollView>
    );
};

export default ProfileParentsScreen;

const styles = StyleSheet.create({ 
    container : {
        flex: 1,    
        zIndex: 0
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
        zIndex: 0
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

    contentProfile_textinput_content: {
        flex: 1,
        marginTop: 10,
        // paddingVertical: 5, 
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