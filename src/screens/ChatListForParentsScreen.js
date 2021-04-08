import React from 'react';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat'
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
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

// icon store
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
// close icon store
import axios from 'axios';
import host from '../assets/host';
import { useSelector } from 'react-redux';

const ChatListForParentsScreen = ({ navigation, route }) => {
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
                    <Text style={styles.titleHeader_text}>Tùy chọn</Text>
                </View>

                <View style={styles.RealtimeChatHeader}>
                    <AntDesign name="message1" size={22} color="#6495ED" />
                    <Text style={styles.RealtimeChatHeader_text}>9</Text>
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.option_area}>
                    <TouchableOpacity>
                        <LinearGradient 
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            locations={[0.5, 1]}
                            colors={['#a1c4fd', '#c2e9fb']}
                            style={styles.chat_button_area}
                        >
                            <Text style={styles.text}>Giáo viên chủ nhiệm</Text>        
                        </LinearGradient>    
                    </TouchableOpacity>
                    
                    
                    <TouchableOpacity>
                        <LinearGradient 
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            locations={[0.5, 1]}
                            colors={['#a1c4fd', '#c2e9fb']}
                            style={styles.chat_button_area}
                        >
                            <Text style={styles.text}>Giáo viên đưa đón</Text>        
                        </LinearGradient>    
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ChatListForParentsScreen;

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        justifyContent: 'center', 
    },
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
        alignItems: 'center',
        paddingRight: 5,
    },

    titleHeader_text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2980B9',
        // paddingLeft: 10,       
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
        justifyContent: 'center',
        marginBottom: 50
    },

    option_area: {
        paddingHorizontal: 20,
    },

    chat_button_area: {
        backgroundColor: '#fff',
        height: 100,
        marginVertical: 25,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    text: {
        color: '#839192',
        fontSize: 18
    }


})