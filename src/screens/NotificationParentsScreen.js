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
    FlatList,
    Modal,
    Dimensions
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

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;


const NotificationParentsScreen = ({navigation}) => {
    const [data, setData] = React.useState([]);
    const user = useSelector(state => state.userReducer)
    const [isModalVisible, setModalVisible] = React.useState(false);
    const [picture, setPicture] = React.useState("");

    const fetchData = async () => {
        const getNotifi = await axios.post(`${host}/notification/show`, { parentsId: user.data._id })
        setData(getNotifi.data);
    }
    
    React.useEffect(() => {
        fetchData()
    },[])

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
                    {
                        picture
                        ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50 }}>
                            <View style={{ width: width, height: width }}>
                                <Image 
                                source={{ uri: `${host}/${picture}`}} 
                                    style={{ width: width, height: width }}
                                />
                            </View>
                        </View>
                        : <></>
                    }
                </View>   
            </Modal>
        )
    }

    const renderItem = ({ item }) => (
        <View style={item.title === "Vắng điểm danh" && !item.status ? styles.each_notification_area : styles.each_notification_area2 }>
            <View style={styles.notification_content}>
                <Text style={
                    item.title === "Vắng điểm danh" 
                    ?
                    styles.notification_failure
                    : item.title === "Vắng xuống xe" || item.title === "Vắng lên xe"
                    ? styles.notification_warning
                    : styles.notification_success
                }>
                    {item.title}
                </Text>
                <Text style={styles.notification_body}>{item.content}</Text>
                <Text style={styles.notification_date}>
                    {
                        (new Date(item.date)).getHours() + ':' +
                        (new Date(item.date)).getMinutes() + ' ' +
                        (new Date(item.date)).getDate() + '-' +
                        Number((new Date(item.date)).getMonth()+1) + '-' +
                        (new Date(item.date)).getFullYear()
                    }
                </Text>
            </View>
            {
                item.picture
                ?
                <TouchableOpacity 
                    onPress={() => {
                        setModalVisible(true)
                        setPicture(item.picture)
                    }}
                    style={{ justifyContent: 'center' }}
                >
                    <View style={{ width: 50, height: 50, marginRight: 5}}>
                        <Image source={{ uri: `${host}/${item.picture}`}} style={{ width: 50, height: 50, borderRadius: 25 }}/>
                    </View>
                </TouchableOpacity>

                : item.title === "Vắng điểm danh" && !item.status

                ?
                <TouchableOpacity 
                    onPress={() => navigation.navigate('ReasonAbsence', {
                        date: (new Date(item.date)).getDate() + '-' +Number((new Date(item.date)).getMonth()+1),
                        id: item._id,
                    })}
                    
                    style={{ justifyContent: 'center' }}
                >
                    <View style={styles.notification_next_page}>
                        <Entypo name="chevron-right" size={28} color="#2980B9" />
                    </View>
                </TouchableOpacity>

                : <></>
            }
            
        </View>
    )
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <ViewModal />
            <View style={styles.header}>
                <View style={styles.goBackHeader}>
                    <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                </View>
                
                <View style={styles.titleHeader}>
                    <Text style={styles.titleHeader_text}>Thông báo</Text>
                </View>
                
                <TouchableOpacity>
                    <View style={styles.RealtimeChatHeader}>
                        <AntDesign name="message1" size={22} color="#6495ED" />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                {
                    data ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                    /> : <></>
                }
            </View>  
        </View>
    )
}


export default NotificationParentsScreen

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
        opacity: 0
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

    each_notification_area: {
        // borderWidth: 1,
        height: 100,
        borderRadius: 20,
        marginVertical: 10,
        flexDirection: 'row',
        backgroundColor: '#E5E7E9'
    },

    each_notification_area2: {
        // borderWidth: 1,
        height: 100,
        borderRadius: 20,
        marginVertical: 10,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },

    notification_content: {
        flex: 1,
        backgroundColor: 1,
        paddingHorizontal: 20,
        paddingVertical: 10
    },

    notification_next_page: {
        justifyContent: 'center',
        paddingRight: 15
    },

    notification_success: {
        color: '#1E8449',
        fontWeight: 'bold',
        fontSize: 16
    },

    notification_warning: {
        color: '#E67E22',
        fontWeight: 'bold',
        fontSize: 16
    },

    notification_failure: {
        color: '#E12727',
        fontWeight: 'bold',
        fontSize: 16
    },
    notification_date: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#839192'
    }
})