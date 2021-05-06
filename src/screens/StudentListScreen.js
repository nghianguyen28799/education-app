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
    FlatList,
    Dimensions,
    Modal,
} from 'react-native'

import { useSelector } from 'react-redux';
import axios from 'axios';
import host from '../assets/host';
// icon store 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';

import MaleNoneAvatar from '../assets/images/male-none-avatar.png' 
import FemaleNoneAvatar from '../assets/images/female-none-avatar.png' 
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;



const ListStudentScreen = ({ navigation }) => {

    const user = useSelector(state => state.userReducer);

    const [searchText, setSearchText] = React.useState('');
    const [data, setData] = React.useState([]);
    const [filterData, setFilterData] = React.useState([]);
    const [isModalVisible, setModalVisible] = React.useState(false);
    const [textTitle, setTextTitle] = React.useState('');
    const [textContent, setTextContent] = React.useState('');
    const getData = async () => {
        const classCode = user.data.ClassCode;

        const isStudent = await axios.get(`${host}/student`)
        const studentData = isStudent.data.filter(value => {
            return value.classCode === classCode
        })
        setData(studentData)
        setFilterData(studentData)
    }

    React.useEffect(() => {
        getData();
    },[])

    const changeSearchText = (text) => {
        setSearchText(text);
        if(text) {
            const newData = data.filter((item) => {
                const itemData = item.name 
                                ? item.name.toUpperCase()
                                : ''.toUpperCase() 
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1
            });
            setFilterData(newData);
        }
        else {
            setFilterData(data);
        }
    }

    const Item = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ViewProfileStudent', {
                studentData: item
            })}
        >
            <View style={styles.student_info_border}>
                <View style={styles.student_info_space}>
                    <View style={styles.student_avatar}>
                        {
                            item.avatar
                            ? <Image source={{ uri: `${host}/${item.avatar}` }} style={styles.student_avatar_image} />
                            : item.gender === 'Male'
                            ? <Image source={MaleNoneAvatar} style={styles.student_avatar_image} />
                            : item.gender === 'Female'
                            ? <Image source={FemaleNoneAvatar} style={styles.student_avatar_image} />
                            : null
                        }
                    </View>
                    <View style={styles.student_name}>
                        <Text style={{ fontSize: 12, textAlign: 'center', color: '#2980B9' }}>
                            { item.name }
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const changeModalVisiblity = (bool) => {
        setModalVisible(bool);
    }

    const notification = async () => {
        await data.map(async (item) => {
            const isParents = await axios.post(`${host}/users/getUserById`, {id: item.parentsCode})
            const {tokens} = isParents.data[0];
            addNotification(isParents.data[0]._id);
            tokens.map(tokenItem => {
                sendPushNotification(tokenItem.tokenDevices)
            })
        })

        setTextTitle('');
        setTextContent('');
        changeModalVisiblity(false)
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

    const addNotification = (parentsId) => {
        axios.post(`${host}/notification/create`, {
            parentsId: parentsId,
            title: textTitle,
            content: textContent,
            picture: '',
        })
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Modal 
                transparent={true}
                animationType="fade"
                visible={isModalVisible}
                nRequestClose={() => changeModalVisiblity(false)}
            >
                <View
                    onPress={() => changeModalVisiblity(false)}
                    style={styles.containerModal}
                >
                    <View style={styles.modal}>
                    <View style={{ width: '100%', flexDirection: 'row', marginBottom: 10 }}>
                            <Ionicons name="close-sharp" size={24} color="black" style={{ padding: 3, opacity: 0 }} />
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, marginBottom: 10, color: '#148F77', fontWeight: 'bold' }}>Thông báo cho cả lớp</Text>
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
                            onPress={() => notification()}
                        >
                            <View>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Xác nhận</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <View style={styles.goBackHeader}>
                        <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                    </View>
                </TouchableOpacity>
                
                <View style={styles.titleHeader}>
                    <Text style={styles.titleHeader_text}>Danh sách lớp</Text>
                </View>
                
                <TouchableOpacity
                    onPress={() => changeModalVisiblity(true)}
                >
                    <View style={styles.RealtimeChatHeader}>
                    <AntDesign name="notification" size={24} color="#2980B9" />
                    </View>
                </TouchableOpacity>
            </View>  

            <View style={styles.body}>
                <View style={styles.search_space}>
                    <View style={styles.search_logo}>
                        <AntDesign name="search1" size={22} color="#A6ACAF" />
                    </View>
                    <View style={styles.search_text}>
                        <TextInput 
                            value={searchText}
                            placeholder="Nhập vào họ tên cần tìm ..."
                            onChangeText={(val) => changeSearchText(val)}
                        />
                    </View>
                </View>
                <View style={styles.students_list_space}>
                    <FlatList
                        data={filterData}
                        numColumns={3}
                        renderItem={Item}
                        keyExtractor={item => item._id}
                    />
                </View>
            </View>
        </View> 
    )
}

export default ListStudentScreen

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
        paddingLeft: 15,       
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
        paddingVertical: 15,
        paddingHorizontal: 20,
    },

    search_space: {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderColor: "#A6ACAF",
        backgroundColor: '#fff'
    },

    search_logo: {
    
    },

    search_text: {
        flex: 1,
        marginHorizontal: 10
    },

    students_list_space: {
        marginTop: 20,
        flexDirection: 'row'
    },

    student_info_space: {
        width: (width-60)/3,
        height: (width-60)/3+40,
    },

    student_info_border: {
        flex: 1,
        margin: 3,
        borderRadius: 15,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 5
    },

    student_avatar: {
        flex: 2/3,
        padding: 3,
        // borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },

    student_name: {
        flex: 1/3,
        // marginRight: 6,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },

    student_avatar_image: {
        flex: 1,
        width: ((width-60)/3)-15,
        borderRadius: 50,
    },

    containerModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        // position: 'absolute',
    },

    modal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: width - 30,
        paddingHorizontal: 20,
        zIndex: 99,
        alignItems: 'center',
        padding: 15
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