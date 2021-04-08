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

import RNPickerSelect from 'react-native-picker-select';
import { useSelector } from 'react-redux';
import axios from 'axios';
import host from '../assets/host';
// icon store 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const dataSchedule = {
    ClassCode: "asdsadasd",
    DayList: {
        monday1: "",
        monday2: "",
        monday3: "",
        monday4: "",
        monday5: "",
        monday6: "",
        monday7: "",
        monday8: "",
        monday9: "",

        tuesday1: ""   ,
        tuesday2: ""   ,
        tuesday3: ""   ,
        tuesday4: ""   ,
        tuesday5: ""   ,
        tuesday6: ""   ,
        tuesday7: ""   ,
        tuesday8: ""   ,
        tuesday9: ""   ,
        
        wednesday1: ""   ,
        wednesday2: ""   ,
        wednesday3: "",
        wednesday4: ""   ,
        wednesday5: ""   ,
        wednesday6: ""   ,
        wednesday7: ""   ,
        wednesday8: ""   ,
        wednesday9: ""   ,

        thurday1: ""   ,
        thurday2: ""   ,
        thurday3: ""   ,
        thurday4: ""   ,
        thurday5: ""   ,
        thurday6: ""   ,
        thurday7: ""   ,
        thurday8: ""   ,
        thurday9: ""   ,

        friday1: ""   ,
        friday2: ""   ,
        friday3: ""   ,
        friday4: ""   ,
        friday5: ""   ,
        friday6: ""   ,
        friday7: ""   ,
        friday8: ""   ,
        friday9: ""   ,
    }
}

const ScheduleScreen = ({ navigation }) => {

    const user = useSelector(state => state.userReducer);
    const [data, setData] = React.useState(dataSchedule);

    const getData = async () => {
        const isStudent = await axios.post(`${host}/student/getStudentByParentsId`, {id: user.data._id})
        const isClass = await axios.post(`${host}/class/getClassById`, {id: isStudent.data.classCode})
        
        const getSchedule = await axios.post(`${host}/schedule/show`, { classCode: isClass.data[0]._id })
        setData(getSchedule.data)

    }

    React.useEffect(() => {
        getData()
    },[])

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
                    <Text style={styles.titleHeader_text}>Thời khóa biểu</Text>
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
                <View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Lớp 2A</Text>
                </View>

                {/* title */}
                <View style={{ marginVertical: 15 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>Tiết</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>Thứ 2</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>Thứ 3</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>Thứ 4</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>Thứ 5</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>Thứ 6</Text></View>
                    </View>

                    {/* Tiết 1 */}

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>1</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.monday1}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.tuesday1}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.wednesday1}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.thurday1}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.friday1}</Text></View>
                    </View>

                    {/* Tiết 2 */}

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>2</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.monday2}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.tuesday2}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.wednesday2}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.thurday2}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.friday2}</Text></View>
                    </View>

                    {/* Tiết 3 */}

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>3</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.monday3}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.tuesday3}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.wednesday3}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.thurday3}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.friday3}</Text></View>
                    </View>

                    {/* Tiết 4 */}

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>4</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.monday4}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.tuesday4}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.wednesday4}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.thurday4}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.friday4}</Text></View>
                    </View>

                    {/* Tiết 5 */}

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>5</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.monday5}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.tuesday5}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.wednesday5}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.thurday5}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.friday5}</Text></View>
                    </View>

                    {/* Ăn trưa */}

                    <View style={{ flexDirection: 'row' }}>
                        {/* <View style={styles.lesson_border}><Text style={styles.text_title}></Text></View> */}
                        <View style={{ height: 30, width: width-30, borderWidth: 1 }} />
                        {/* <View style={styles.lesson_border}><Text style={styles.text_title}>Thứ 2</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>Thứ 3</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>Thứ 4</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>Thứ 5</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>Thứ 6</Text></View> */}
                    </View>


                    {/* Tiết 6 */}

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>6</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.monday6}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.tuesday6}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.wednesday6}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.thurday6}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.friday6}</Text></View>
                    </View>

                    {/* Tiết 7 */}

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>7</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.monday7}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.tuesday7}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.wednesday7}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.thurday7}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.friday7}</Text></View>
                    </View>

                    {/* Tiết 8 */}

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>8</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.monday8}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.tuesday8}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.wednesday8}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.thurday8}</Text></View>
                        <View style={styles.lesson_border}><Text style={styles.text_title}>{data.DayList.friday8}</Text></View>
                    </View>

                    {/* Tiết 9 */}

                    {/* Thời gian */}
                    
                    <View style={{ marginVertical: 15 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Thời gian</Text>
                    </View>
                    <View>
                        <Text>Tiết 1: 7:20 - 7:55</Text>
                        <Text>Tiết 2: 8:00 - 8:35</Text>
                        <Text>Tiết 3: 9:00 - 9:35</Text>
                        <Text>Tiết 4: 9:40 - 10:15</Text>
                        <Text>Tiết 5: 10:25 - 11:00</Text>
                        <Text>Tiết 6: 13:45 - 14:20</Text>
                        <Text>Tiết 7: 14:25 - 15:00</Text>
                        <Text>Tiết 8: 15:25 - 16:00</Text>
                    </View>
                </View>
            </View>
        </View> 
    )
}

export default ScheduleScreen

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

    lesson_border: {
        width: (width-30)/6,
        height: 30,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    text_title: {
        fontWeight: 'bold'
    }

})