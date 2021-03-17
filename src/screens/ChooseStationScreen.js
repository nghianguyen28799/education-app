import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

import { useSelector } from 'react-redux';
import axios from 'axios';
import host from '../assets/host';
// icon store 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

import UserCirle from '../assets/images/user-circle.png'
import MaleNoneAvatar from '../assets/images/male-none-avatar.png' 
import FemaleNoneAvatar from '../assets/images/female-none-avatar.png' 
import { FlatList } from 'react-native-gesture-handler';
// close icon
const ChooseStation = ({ navigation }) => {

    const [dateList, setDateList] = React.useState([]);

    const listed_date = () => {
        for (let i = 0; i < 7; i++) {
            const date = new Date()
            date.setDate(date.getDate() + i+1)
            setDateList(dateList => [...dateList, { id: `date${i}`, date: date }])
        }
    }

    React.useEffect(() => {
        listed_date();
    }, [])


    const renderItem = ({ item }) => (
        <View style={[styles.each_date, item.date.getDay() == 0 ? {borderColor: '#9e9e9e'} : null ]}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }, item.date.getDay() == 0 ? {color: '#9e9e9e'} : null}>
                { item.date.getDate() + '-' + item.date.getMonth() }    
            </Text>
            <Text style={{ fontSize: 12  }, item.date.getDay() == 0 ? {color: '#9e9e9e'} : null }>
                {
                    item.date.getDay() === 0
                    ? "Chủ nhật"
                    : item.date.getDay() === 1
                    ? "Thứ 2"
                    : item.date.getDay() === 2
                    ? "Thứ 3"
                    : item.date.getDay() === 3
                    ? "Thứ 4"
                    : item.date.getDay() === 4
                    ? "Thứ 5"
                    : item.date.getDay() === 5
                    ? "Thứ 6"
                    : item.date.getDay() === 6
                    ? "Thứ 7"
                    : null
                }
            </Text>
        </View>
      );
    return (
        <ScrollView>
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View style={styles.goBackHeader}>
                            <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.titleHeader}>
                        <Text style={styles.titleHeader_text}>Đăng ký bến</Text>
                    </View>
                    
                    <TouchableOpacity>
                        <View style={styles.RealtimeChatHeader}>
                            <AntDesign name="message1" size={22} color="#6495ED" />
                        </View>
                    </TouchableOpacity>
                </View>  
                 
                <View style={styles.body}>
                    <View style={styles.title_content}>
                        <Text style={styles.title_content_name}>Chọn lịch và bến xe</Text>
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
                </View>
            </View>
        </ScrollView>
    );
};

export default ChooseStation;

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
        opacity: 0
    },

    body: { 
        flex: 1,
        padding: 10,
    },

    title_content: {
        flex: 1,
        // borderWidth: 1,
    },

    title_content_name: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    get_date_content: {
        flex: 1,
        marginTop: 15,
        flexDirection: 'row'
    },

    each_date: {
        width: 100,
        borderWidth: 1,
        padding: 5,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})