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
    FlatList
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';

import { useDispatch, useSelector } from 'react-redux';
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
// close icon
const HistoryScreen = ({ navigation }) => {
    const user = useSelector(state => state.userReducer)

    const [data, setData] = React.useState();

    const getData = async () => {
        const historyList = await axios.post(`${host}/history/show`, { id: user.data._id })
        setData(historyList.data);
    }
    React.useEffect(() => {
        getData()
    },[])

    const renderItem = ({ item }) => (
        <View style={styles.each_history_border}>
            <View style={styles.each_history}>
                <View style={styles.each_history_left}>
                    <View>
                        <Text style={{ fontSize: 15, color: "#2980B9", fontWeight: 'bold' }}>
                            {
                                item.name === "Attendence"
                                ? "Bạn đã cập nhật ghi danh lên xe thành công"
                                : item.name === "Absence"
                                ? "Bạn đã gửi đơn xin tạm vắng thành công"
                                : item.name === "ChangePassword"
                                ? "Bạn đã đổi mật khẩu thành công"
                                : null
                            }
                        </Text>
                    </View>
                    {/* <View style={{ }}>
                        <TouchableOpacity>
                            <Text style={{ textAlign: 'right', marginTop: 15 }}>
                                Xem chi tiết {`>>`}
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
                
                <View style={{ borderLeftWidth: 1, borderLeftColor: "#A8ABAC", marginHorizontal: 15, marginVertical: 10 }} /> 

                <View style={styles.each_history_right}>
                    <Text style={{ fontSize: 12, color: '#A8ABAC' }}>
                        {`${(new Date(item.date)).getHours()}:${(new Date(item.date)).getMinutes()}`}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#A8ABAC'}}>
                        {`${(new Date(item.date)).getDate()}/${(new Date(item.date)).getMonth()+1}/${(new Date(item.date)).getFullYear()}`}
                    </Text>
                </View>
            </View> 
        </View>
    )


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
                    <Text style={styles.titleHeader_text}>Lịch sử</Text>
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
                {
                    data 
                    ?
                    <FlatList
                        data={data.events}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                    : null
                }
                
            </View>
        </View>
    )
}

export default HistoryScreen;

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
    },

    each_history_border: {
        // borderWidth: 1,
        paddingVertical: 7,
    },

    each_history: {
        backgroundColor: '#fff',
        borderRadius: 15,
        height: 80,
        paddingHorizontal: 15,
        flexDirection: 'row'
    },

    each_history_left: {
        flex: 1,
        justifyContent: 'center'
    },

    each_history_right: {
        width: 70,
        justifyContent: 'center',
        alignItems: 'center'
    }
})