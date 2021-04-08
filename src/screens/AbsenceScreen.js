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
    Alert
} from 'react-native'

import RNPickerSelect from 'react-native-picker-select';
import { useSelector } from 'react-redux';
import axios from 'axios';
import host from '../assets/host';
// icon store 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

import { LinearGradient } from 'expo-linear-gradient';
import MaleNoneAvatar from '../assets/images/male-none-avatar.png' 
import FemaleNoneAvatar from '../assets/images/female-none-avatar.png' 
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const ListStudentScreen = ({ navigation }) => {

    const user = useSelector(state => state.userReducer);

    const [lessonData, setLessonData] = React.useState([]);
    const [dateList, setDateList] = React.useState([]);
    const [ dateSelected, setDateSelected ] = React.useState([]);
    const [absenceSelected, setAbsenceSelected ] = React.useState([]);
    const [absenceValue, setAbsenceValue] = React.useState('');
    React.useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        for(let i=0 ; i<9 ; i++) {
            setLessonData(lessonData => [...lessonData, i+1])
        }   

        for (let i = 0; i < 7; i++) {
            const date = new Date()
            date.setDate(date.getDate() + i+1)
            setDateList(dateList => [...dateList, { id: `date${i}`, date: date }])
        }
    }

    const addDataSelected = (item) => {
        setDateSelected(dateSelected => [...dateSelected, item.date.getDate()+"/"+item.date.getMonth()])
        var lessons = [];
        for(let i=0 ; i<9 ; i++) {
            lessons.push({
                date: new Date(item.date),
                lesson: i+1,
                status: false
            })
        }
        setAbsenceSelected(absenceSelected => [...absenceSelected, 
            {
                date: new Date(item.date),
                lesson: lessons,
                reason: "",
            }
        ])
    }

    const removeDataSelected = (item) => {
        const newData = dateSelected.filter(date => {
            return date !== item.date.getDate()+"/"+item.date.getMonth()
        })
        setDateSelected(newData)  

        const newAbsence = absenceSelected.filter(value => {
            return value.date.getDate() !== item.date.getDate()
        })
        setAbsenceSelected(newAbsence)
    }

    const renderItem = ({ item }) => (
        (item.date.getDay() === 0 || item.date.getDay() === 6) 
        ?
        <View style={[styles.each_date, {borderColor: '#B3B6B7'}]}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#B3B6B7' }}>
                { item.date.getDate() + '-' + item.date.getMonth() }    
            </Text>
            <Text style={{ fontSize: 12, color: '#B3B6B7' }}>
                {
                    item.date.getDay() === 0
                    ? "Chủ nhật"
                    : item.date.getDay() === 6
                    ? "Thứ 7"
                    : null
                }
            </Text>
        </View>
        : dateSelected.indexOf(item.date.getDate()+"/"+item.date.getMonth()) === -1
        ? <TouchableOpacity
                onPress={() => {
                    addDataSelected(item)
                }}
            >
                <View style={[styles.each_date]}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#000' }}>
                        { item.date.getDate() + '-' + (Number(item.date.getMonth())+1) }    
                    </Text>
                    <Text style={{ fontSize: 12, color: '#000' }}>
                        {
                            item.date.getDay() === 1
                            ? "Thứ 2"
                            : item.date.getDay() === 2
                            ? "Thứ 3"
                            : item.date.getDay() === 3
                            ? "Thứ 4"
                            : item.date.getDay() === 4
                            ? "Thứ 5"
                            : item.date.getDay() === 5
                            ? "Thứ 6"
                            : null
                        }
                    </Text>
                </View>
            </TouchableOpacity>
        : 
        <TouchableOpacity
            onPress={() => {
                removeDataSelected(item)
            }}
        >
            <View style={[styles.each_date, { backgroundColor: '#2980B9'}]}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>
                    { item.date.getDate() + '-' + (Number(item.date.getMonth())+1) }    
                </Text>
                <Text style={{ fontSize: 12, color: '#fff' }}>
                    {
                        item.date.getDay() === 1
                        ? "Thứ 2"
                        : item.date.getDay() === 2
                        ? "Thứ 3"
                        : item.date.getDay() === 3
                        ? "Thứ 4"
                        : item.date.getDay() === 4
                        ? "Thứ 5"
                        : item.date.getDay() === 5
                        ? "Thứ 6"
                        : null
                    }
                </Text>
            </View>
        </TouchableOpacity>
    );

    const updateStatusLesson = (item) => {
        const newArr = [];
        absenceSelected.map(value => {
            if((new Date(value.date)).getDate() === (new Date(item.date).getDate())) {
                const newValue = value.lesson.map(data => {
                    if(item.lesson === data.lesson){
                        return {
                            ...data,
                            status: !data.status
                        }
                    } else {
                        return data
                    }
                })
                const newData = {
                    ...value,
                    lesson: newValue
                }
                newArr.push(newData)
            } else {
                newArr.push(value)
            }
        });
        setAbsenceSelected(newArr)
    }

    const lessonItems = ({ item }) => (
        <TouchableOpacity onPress={() => updateStatusLesson(item)}>
            {
                item.status
                ?
                <View style={[styles.lesson_border, {backgroundColor: '#2980B9'}]}>
                    <Text style={{ color: "#fff" }}>Tiết { item.lesson }</Text>
                </View>
                :
                <View style={styles.lesson_border}>
                    <Text>Tiết { item.lesson }</Text>
                </View>
            }            
        </TouchableOpacity>
    )

    const renderChooseReason = ({ item  }) => (
        // <View >
            <View style={styles.get_lesson_on_row}>
                <Text style={{ marginRight: 15 }}>
                    {
                        item.date.getDay() === 1
                        ? "Thứ 2"
                        : item.date.getDay() === 2
                        ? "Thứ 3"
                        : item.date.getDay() === 3
                        ? "Thứ 4"
                        : item.date.getDay() === 4
                        ? "Thứ 5"
                        : item.date.getDay() === 5
                        ? "Thứ 6"
                        : null
                    }
                    {" " + item.date.getDate()}-{(Number(item.date.getMonth())+1)}:
                </Text>
                <View style={styles.select_lesson_border}>
                    {
                        lessonData !== []
                        ?
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            horizontal={true}
                            data={item.lesson}
                            renderItem={lessonItems}
                            keyExtractor={item => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}
                        />
                        : 
                        null
                    } 
                </View>
            </View> 
        // </View>        
    )

    const confirmSubmitApp = () => {
        const id = user.data._id
        console.log(id);
        const newData = [];
        absenceSelected.map(data => {
            // data.date
            const lessons = [];
            const newValue = data.lesson.filter(value => {
                return value.status === true
            })
            newValue.map(value2 => {
                lessons.push(value2.lesson)
            })
            newData.push({
                date: data.date,
                lesson: lessons
            })
        });
        axios.post(`${host}/absence/create`, { id: id, absenceApp: newData, reason: absenceValue })
        axios.post(`${host}/history/create`, { id: user.data._id, event:"Absence" })
        Alert.alert("Bạn đã gửi yêu cầu xin vắng thành công!")
    }

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
                    <Text style={styles.titleHeader_text}>Xin vắng</Text>
                </View>
                
                <TouchableOpacity
                    onPress={() => navigation.navigate("Message")}
                >
                    <View style={styles.RealtimeChatHeader}>
                        <AntDesign name="message1" size={22} color="#6495ED" />
                        <Text style={styles.RealtimeChatHeader_text}>9</Text>
                    </View>
                </TouchableOpacity>
            </View>  

            <View style={styles.body}>
                <View style={styles.title_content}>
                    <Text style={styles.title_content_name}>Chọn ngày</Text>
                </View>
                <View style={styles.get_date_content}>
                    {
                        dateList
                        ?
                        <FlatList
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={dateList}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                        :<></>
                    } 
                </View>
                <View style={styles.title_content}>
                    <Text style={styles.title_content_name}>Tiết vắng</Text>
                </View>

                <View style={styles.select_lesson_border}>
                    {
                        dateSelected !== []
                        ?
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={absenceSelected}
                            renderItem={renderChooseReason}
                            keyExtractor={item => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}
                        />
                        :
                        // <View style={{ borderWidth: 1, width: width, height: 100 }}>
                            <Text style={{ color: '#000' }}>Bạn chưa ghi danh đăng ký bến xe </Text>
                        // </View>    
                    } 
                    <View style={styles.absence_reason_border}>
                        <TextInput 
                            value={absenceValue}
                            style={{ width: "100%", borderWidth: 1, height: 50, borderColor: '#B3B6B7', paddingHorizontal: 10, marginVertical: 15, borderRadius: 10,}}
                            placeholder="Điền vào lý do vắng"
                            onChangeText={(value) => setAbsenceValue(value)}
                        />
                        <View style={styles.button_confirm_border}>
                            <View style={styles.button_confirm}>
                                <TouchableOpacity 
                                    onPress={confirmSubmitApp}
                                >
                                    <LinearGradient
                                    start={{ x: 0, y: 2 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#408ffb', '#64cafb']}
                                    style={styles.button_confirm}
                                    >
                                    <View style={styles.changePassword_confirm}>
                                        <Text style={{
                                        color: "#fff",
                                        }}>
                                        Gửi yêu cầu</Text>
                                    </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
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
        // opacity: 0
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

    title_content: {
        // flex: 1,
        // borderWidth: 1,
        marginVertical: 10,
        alignItems: 'flex-start'
    },

    title_content_name: {
        fontSize: 18,
        fontWeight: 'bold',
        // borderBottomWidth: 1,
    },

    get_date_content: {
        // flex: 1,
        marginVertical: 15,
        flexDirection: 'row'
    },

    each_date: {
        width: 100,
        borderWidth: 1,
        padding: 5,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },

    select_lesson_border: {
        flex: 1,
        // flexDirection: 'row',
        // marginVertical: 10,
        // alignItems: 'center'
    },

    get_lesson_on_row: {
        // flex: 1,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        // borderWidth: 1,
    },

    select_lesson_border: {
        // flex: 1, 
        // borderWidth: 1,
        marginBottom: 5
    },

    lesson_border: {
        width: 70, 
        height: 30, 
        borderWidth: 1,
        marginHorizontal: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },

    absence_reason_border: {
        justifyContent: 'center',
        alignItems: 'center',
        // flexDirection: 'row'
    },

    button_confirm_border: {
        width: '100%',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    button_confirm: {
        width: width/2,
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})