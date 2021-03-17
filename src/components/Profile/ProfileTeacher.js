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
    TextInput
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
import { Entypo } from '@expo/vector-icons';
// close icon

import LottieView from 'lottie-react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;


const ProfileTeacherScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer)

    const [loading, setLoading] = React.useState(false);
    const [userData, setUserData] = React.useState();
    const [userAvatarData, setUserAvatarData] = React.useState();
    const [classData, setClassData] = React.useState({});
    const [edit, setEdit] = React.useState(false)
    const [image, setImage] = React.useState(null);
    
    React.useEffect(() => {
        getData();
    },[])


    const getData = async () => {
        try{
            const isClass = await axios.post(`${host}/class/getClassById`, {id: user.data.ClassCode})
            setClassData(isClass.data[0])
            setUserData(user.data);
            setUserAvatarData(user.data);
            setImage(user.data.Avatar);
        } catch(error) {
            console.log(error);
        }
    }

    const authAccessLibrary = async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
    }

    const getGoBack = () => {
        navigation.goBack();
    }

    const handleChangeEdit = () => {
        authAccessLibrary()
        setEdit(!edit);
    }

    const onChangeTextName = (value) => {
        setUserData({
            ...userData,
            FullName: value
        })
    }

    const onChangeTextEmail = (value) => {
        setUserData({
            ...userData,
            Email: value
        })
    }

    const onChangeTextPhone = (value) => {
        setUserData({
            ...userData,
            NumberPhone: value
        })
    }

    const onChangeTextBirthDay = (value) => {
        setUserData({
            ...userData,
            BirthDay: value
        })
    }

    const onChangeTextIdent = (value) => {
        setUserData({
            ...userData,
            Identification: value
        })
    }

    const confirmChangeInfo = async () => {
        const changeInfo = await axios.post(`${host}/teacher/changeUserInfo`, { userData })
        const { data, error } = changeInfo.data;
        if(!error) {
            setLoading(true)
            const timer = setInterval(async () => {
                dispatch(addUser(userData))
                navigation.replace('Profile');
                clearInterval(timer)
            },2000)
 
        } else {
            console.log(error);
        }

    }

    const bs = React.createRef()
    const fall = new Animated.Value(1);


    const takePhotoFromCamera = () => {

    }

    const uploadImage = async (file) => {
        const localUri = file;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        const formData = new FormData();
        const dataPicture = JSON.parse(JSON.stringify({ uri: localUri, name: filename, type }));
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        
        formData.append('photo', dataPicture);
        formData.append('_id', userData._id);

        // end upload image

        const changeInfo = await axios.post(`${host}/teacher/changeUserAvatar`, formData, config)
        const { data, error } = changeInfo;
        if(!error) {
            setLoading(true)
            const timer = setInterval(async () => {
                // setUserAvatarData({
                //     ...userAvatarData,
                //     Avatar: data.uri
                // })
   
                await dispatch(addUser({
                    ...userAvatarData,
                    Avatar: data.uri
                }))
                navigation.replace('Profile');
                clearInterval(timer)
            },2000)
        } else {
            console.log(error);
        }
    }

    const choosePhotoFromLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
          });
      
          if (!result.cancelled) {
            setImage(result.uri);
            uploadImage(result.uri)
        }
    }

    const renderInner = () => (
        <View style={styles.panel}>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Cập nhật hình ảnh</Text>
                <Text style={styles.panelSubtitle}>Chọn hình ảnh hồ sơ của bạn</Text>
            </View>

            <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
                <Text style={styles.panelButtonTitle}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
                <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => bs.current.snapTo(1)}>
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
    if(edit) {          // edit profile
        return (
            <View style={styles.container_edit}>
                    <BottomSheet 
                        ref={bs}
                        snapPoints={[350, 0]}
                        initialSnap={1}
                        callbackNode={fall}
                        enabledGestureInteraction={true}
                        renderContent={renderInner}
                        zIndex={99999}
                        renderHeader={renderHeader}
                    />
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                
                <View style={styles.header_edit}>
                    <TouchableOpacity onPress={handleChangeEdit}>
                        <View style={styles.goBackHeader}>
                            <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.titleHeader}>
                        <Text style={styles.titleHeader_text}>Cập nhật hồ sơ</Text>
                    </View>
                    
                    <TouchableOpacity
                        onPress={confirmChangeInfo}
                    >
                        <View style={styles.RealtimeChatHeader}>
                            <AntDesign name="check" size={22} color="#28B463" />
                        </View>
                    </TouchableOpacity>
                </View>  
                    
                <Animated.View style={[styles.body_edit, {
                    opacity: Animated.add(0.1, Animated.multiply(fall, 1))
                }]}>
                    <View style={styles.contentProfile}>
    
                        {/* Avatar */}
    
                        <TouchableOpacity
                            onPress={() => bs.current.snapTo(0)}
                        >                      
                            <View style={styles.contentProfile_avatar}> 
                                {
                                    image
                                    ? <Image source={{ uri: `${host}/${image}` }} style={{ width: 120, height: 120, borderRadius: 70 }}/> 
                                    : <Image source={UserCirle} style={{ width: 80, height: 80 }}/> 
                                }
                            </View>
                        </TouchableOpacity>
                        
                        
                        {/* Họ tên */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>* Họ và tên </Text>
                            <TextInput 
                                style={styles.contentProfile_textinput_content}
                                value={userData.FullName}
                                onChangeText={(value)=>onChangeTextName(value)}
                            />
                        </View>   
    
                        {/* Giới tính */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Giới tính</Text>
                            <Text style={[styles.contentProfile_textfield_content, {color: "#A6ACAF"} ]}>
                                {
                                    user.data.Gender === 'Male'
                                    ? 'Nam'
                                    :  user.data.Gender === 'Female'
                                    ? 'Nữ'
                                    : null
                                }
                            </Text>
                        </View>   
    
                        {/* Email  */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>* Email</Text>
                            <TextInput 
                                style={styles.contentProfile_textinput_content}
                                value={userData.Email}
                                onChangeText={(value)=>onChangeTextEmail(value)}
                            />
                        </View>  
    
                        {/* Số điện thoại */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>* Số điện thoại</Text>
                            <TextInput 
                                style={styles.contentProfile_textinput_content}
                                value={userData.NumberPhone}
                                onChangeText={(value)=>onChangeTextPhone(value)}
                            />
                        </View>  
    
                        {/* Ngày sinh */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>* Ngày sinh</Text>
                            <TextInput 
                                style={styles.contentProfile_textinput_content}
                                value={userData.BirthDay}
                                onChangeText={(value)=>onChangeTextBirthDay(value)}
                            />
                        </View>   
    
                        {/* CMND */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>* CMND/CCCD </Text>
                            <TextInput 
                                style={styles.contentProfile_textinput_content}
                                value={userData.Identification}
                                onChangeText={(value)=>onChangeTextIdent(value)}
                            />
                        </View> 
    
                        {/* Ngày nhập học */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Năm Làm Việc</Text>
                            <Text style={[styles.contentProfile_textfield_content, {color: "#A6ACAF"} ]}>
                                {
                                    user.data.Worked
                                    ? user.data.Worked
                                    : null
                                }
                            </Text>
                        </View>  
    
                        {/* Quyền */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Quyền </Text>
                            <Text style={[styles.contentProfile_textfield_content, {color: "#A6ACAF"} ]}>
                                Giáo viên
                            </Text>
                        </View> 
    
                        {/* Lớp */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Chủ nhiệm lớp </Text>
                            <Text style={[styles.contentProfile_textfield_content, {color: "#A6ACAF"} ]}> {`Lớp `}
                                {
                                    classData.ClassCode
                                    ? classData.ClassCode
                                    : null
                                }
                            
                            </Text>
                        </View>   
                    </View>
                    {
                        loading
                        ? <LottieView source={require('../../assets/json/loader.json')} autoPlay loop />
                        : null
                    }
                </Animated.View>
            </View>  
        );
    } else {        // view profile
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <View style={styles.header_edit}>
                    <TouchableOpacity onPress={getGoBack}>
                        <View style={styles.goBackHeader}>
                            <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.titleHeader}>
                        <Text style={styles.titleHeader_text}>Hồ sơ cá nhân</Text>
                    </View>
                    
                    <TouchableOpacity
                        onPress={handleChangeEdit}
                    >
                        <View style={styles.RealtimeChatHeader}>
                            <Feather name="edit" size={22} color="#6495ED" />
                        </View>
                    </TouchableOpacity>
                </View>  
                    
                <View style={styles.body_edit}>
                    <View style={styles.contentProfile}>
    
                        {/* Avatar */}
         
                        <View style={styles.contentProfile_avatar}> 
                            {
                                image
                                ? <Image source={{ uri: `${host}/${image}` }} style={{ width: 120, height: 120, borderRadius: 70 }}/> 
                                : <Image source={UserCirle} style={{ width: 80, height: 80 }}/> 
                            }

                        </View>
                        
                        {/* Họ tên */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Họ và tên </Text>
                            <Text style={styles.contentProfile_textfield_content}> 
                                {
                                    user.data.FullName
                                    ? user.data.FullName
                                    : null
                                }
                            </Text>
                        </View>   
    
                        {/* Giới tính */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Giới tính</Text>
                            <Text style={styles.contentProfile_textfield_content}>
                                {
                                    user.data.Gender === 'Male'
                                    ? 'Nam'
                                    :  user.data.Gender === 'Female'
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
                                    user.data.Email
                                    ? user.data.Email
                                    : null
                                }
                            </Text>
                        </View>  
    
                        {/* Số điện thoại */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Số điện thoại</Text>
                            <Text style={styles.contentProfile_textfield_content}> 
                                {
                                    user.data.NumberPhone
                                    ? user.data.NumberPhone
                                    : null
                                }
                            </Text>
                        </View>  
    
                        {/* Ngày sinh */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Ngày sinh</Text>
                            <Text style={styles.contentProfile_textfield_content}> 
                                {
                                    user.data.BirthDay
                                    ? user.data.BirthDay
                                    : null
                                }
                            </Text>
                        </View>   
    
                        {/* CMND */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>CMND/CCCD </Text>
                            <Text style={styles.contentProfile_textfield_content}> 
                                {
                                    user.data.Identification
                                    ? user.data.Identification
                                    : null
                                }
                            </Text>
                        </View> 
    
                        {/* Ngày nhập học */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Năm Làm Việc</Text>
                            <Text style={styles.contentProfile_textfield_content}>
                                {
                                    user.data.Worked
                                    ? user.data.Worked
                                    : null
                                }
                            </Text>
                        </View>  
    
                        {/* Quyền */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Quyền </Text>
                            <Text style={styles.contentProfile_textfield_content}> 
                                Giáo viên
                            </Text>
                        </View> 
    
                        {/* Lớp */}
    
                        <View style={styles.contentProfile_textfield}>
                            <Text style={styles.contentProfile_textfield_title}>Chủ nhiệm lớp </Text>
                            <Text style={styles.contentProfile_textfield_content}> {`Lớp `}
                                {
                                    classData.ClassCode
                                    ? classData.ClassCode
                                    : null
                                }
                            </Text>
                        </View>   
                    </View>
                </View>
            </View>  
        );
    }
};

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
        padding: 10,
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