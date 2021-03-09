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
} from 'react-native'

import { useSelector } from 'react-redux';
import axios from 'axios';
import host from '../assets/host';
// icon store 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

import MaleNoneAvatar from '../assets/images/male-none-avatar.png' 
import FemaleNoneAvatar from '../assets/images/female-none-avatar.png' 
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;



const ListStudentScreen = ({ navigation }) => {

    const user = useSelector(state => state.userReducer);

    const [searchText, setSearchText] = React.useState('');
    const [data, setData] = React.useState([]);

    const getData = async () => {
        const classCode = user.data.ClassCode;

        const isStudent = await axios.get(`${host}/student`)
        const studentData = isStudent.data.filter(value => {
            return value.classCode === classCode
        })

        setData(studentData)
    }

    React.useEffect(() => {
        getData();
    },[])

    const changeSearchText = (value) => {
        setSearchText(value);
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
                            ? none
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

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
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
                    onPress={() => navigation.navigate("MessageList")}
                >
                    <View style={styles.RealtimeChatHeader}>
                        <AntDesign name="message1" size={22} color="#6495ED" />
                        <Text style={styles.RealtimeChatHeader_text}>9</Text>
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
                        data={data}
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
    }
})