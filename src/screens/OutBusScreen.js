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
import * as Animatable from 'react-native-animatable';

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

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const  OutButScreen = ({navigation}) => {

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
          toValue: width/2,
          duration: 500
        }).start();
    };

    useEffect(() => {
        fadeIn()
    },[])  

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
                        <Text style={styles.titleHeader_text}>Xuống sớm</Text>
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
                        <View style={styles.function_selector_left}>
                            <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#2980B9' }}>Điểm danh</Text>
                        </View>
                        {/* <View style={styles.function_selector_right}>
                           
                        </View> */}
                        <Animated.View 
                     
                        style={{
                            position: 'absolute',
                            height: 60,
                            width: width/2-20, 
                            marginLeft: fadeAnim,
                        }}>
                            <LinearGradient
                                start={{ x: 0, y: 2 }}
                                end={{ x: 1, y: 1 }}
                                colors={['#408ffb', '#64cafb']}
                                style={{
                                    height: 60,
                                    width: width/2 - 20, 
                                    borderRadius: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <View style={styles.test}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#fff' }}>Xuống sớm</Text>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default  OutButScreen;

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
        alignItems: 'center'
    },

    function_selector_right: {
        flex: 1/2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
})