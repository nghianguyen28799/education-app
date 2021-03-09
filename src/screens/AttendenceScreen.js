import React, { useEffect, useRef } from 'react';
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
    Animated
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient';

// icon store
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Easing } from 'react-native-reanimated';
// close icon store

import AttendenceComponent from '../components/Attendence.js/AttendenceComponent.js'
import OutBusComponent from '../components/Attendence.js/OutBusComponent.js'
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const AttendenceScreen = ({navigation, route}) => {

    const [title, setTitle] = React.useState(route.params.page.title)
    const [status, setStatus] = React.useState(route.params.page.status)
    const widthAnim = useRef(new Animated.Value(route.params.page.valueAnim)).current;
    const [colorLabel, setColorLabel] = React.useState(route.params.page.colorLabel);
   
    const changeAttendence = () => {
        Animated.timing(widthAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: false
        }).start();
        setTitle('Điểm danh');
        setStatus(1)
        setColorLabel(['#fff', '#2980B9']);
    };

    const changeOutBus = () => {
        Animated.timing(widthAnim, {
          toValue: width/2-10,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
        setTitle('Xuống sớm');
        setStatus(2),
        setColorLabel(['#2980B9', '#fff']);
    };

    if( status === 1) {
        return (
            <ScrollView>
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
                            <Text style={styles.titleHeader_text}>{title}</Text>
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
                        <View style={styles.function_selector_space}>
                            
                            
                            <View style={styles.function_selector_left}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold', color: colorLabel[0] }}>Điểm danh</Text>
                            </View>
      
                            <TouchableOpacity onPress={changeOutBus} style={styles.function_selector_right}>
                                <View style={styles.function_selector_right}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: colorLabel[1] }}>Xuống sớm</Text>
                                </View>
                            </TouchableOpacity>
    
    
                            <View 
                                style={{
                                    position: 'absolute',
                                    flexDirection: 'row',
                                    height: 60,
                                    width: width-20,
                                }}>
                                <Animated.View style={{ width: widthAnim }}>                                    
                                </Animated.View>
                                <View style={{ width: width/2-10 }}>
                                    <LinearGradient
                                        start={{ x: 0, y: 2 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={['#408ffb', '#64cafb']}
                                        style={{
                                            height: 60,
                                            width: width/2-10, 
                                            borderRadius: 30,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                    </LinearGradient>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <AttendenceComponent navigation={navigation}/>
            </ScrollView>
        );
    } else {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            <View style={styles.goBackHeader}>
                                {/* <Entypo name="menu" size={30} color="#6495ED" /> */}
                                <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                            </View>
                        </TouchableOpacity>
                        
                        <View style={styles.titleHeader}>
                            <Text style={styles.titleHeader_text}>{title}</Text>
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
                        <View style={styles.function_selector_space}>
                            
                            <TouchableOpacity onPress={changeAttendence} style={styles.function_selector_left}>
                                <View style={styles.function_selector_right}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#2980B9' }}>Điểm danh</Text>
                                </View>
                            </TouchableOpacity>
    
                            <View style={styles.function_selector_right}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#fff' }}>Xuống sớm</Text>
                            </View>
    
                            <View 
                                style={{
                                    position: 'absolute',
                                    flexDirection: 'row',
                                    height: 60,
                                    width: width-20,
                                }}>
                                <Animated.View style={{ width: widthAnim }}>                                    
                                </Animated.View>
                                <View style={{ width: width/2-10 }}>
                                    <LinearGradient
                                        start={{ x: 0, y: 2 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={['#408ffb', '#64cafb']}
                                        style={{
                                            height: 60,
                                            width: width/2-10, 
                                            borderRadius: 30,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                    </LinearGradient>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <OutBusComponent navigation={navigation} />
            </ScrollView>
        );
    }
};

export default AttendenceScreen;

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
        marginVertical: 20,
        marginHorizontal: 10,
    },

    function_selector_space: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#fff',
        height: 60,
        borderRadius: 30,
        shadowColor: "blue",
        shadowOffset: {
            width: 0,
            height: 2, 
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 7,
    },

    function_selector_left: {
        flex: 1/2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },

    function_selector_right: {
        flex: 1/2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
})