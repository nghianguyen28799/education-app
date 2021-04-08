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
    Dimensions,
    FlatList,
    ImageBackground
} from 'react-native'

import Touchable from 'react-native-touchable-safe'
// icon store

import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// close icon store
import backgroundHeader from '../../assets/images/background-parents-home.png';
import KidWelcome from '../../assets/images/kid-welcome.jpg';
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const TeacherHomePage = ({navigation}) => {

    
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <View style={styles.header}>
                <ImageBackground source={backgroundHeader} style={styles.image}>
                    <View style={styles.menu_border}>
                        <View style={styles.menu}>
                            <TouchableOpacity
                                onPress={() => navigation.openDrawer()}
                            >
                            <View style={styles.goBackHeader}>
                                <Feather name="menu" size={24} color="#000" />
                            </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.introduce}>
                        <View style={styles.introduce_text}>
                            <Text 
                                style={{ fontSize: 22, marginBottom: 15, fontWeight: 'bold', color: "#fff", marginTop: 15 }}
                            >
                                Xin chào cô/chú
                            </Text>
                            <Text style={{ color: "#fff" }}> 
                                Thường xuyên truy cập ứng dụng để quan tâm cho con em mình nhé!
                            </Text>
                        </View>
                        <View style={styles.introduce_image}>
                            <Image 
                                source={KidWelcome}
                                style={{ width: '100%', height: 150, marginBottom: 20}}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </View>

            <View style={styles.body}>
                <View style={styles.category_border}>
                    
                    <View style={styles.categories_on_row}>
                        <TouchableOpacity 
                            style={styles.each_category_space}
                            onPress={() => navigation.navigate("Schedule")}
                        >
                            <View style={styles.each_category}>
                                <View style={styles.icon_category_border}>
                                    <View style={[styles.icon_category, {backgroundColor: "#3498DB"}]}>
                                        <FontAwesome5 name="clipboard-list" size={26} color="#fff" />
                                    </View>
                                </View>
                                <View style={styles.name_category_border}>
                                    <View style={styles.name_category}>
                                        <Text style={{ fontSize: 13, textAlign: 'center', color: "#3498DB" }}>
                                            Thời khóa biểu
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.each_category_space}
                            onPress={() => navigation.navigate("ChatListForParents")}
                        >
                            <View style={styles.each_category}>
                                <View style={styles.icon_category_border}>
                                    <View style={[styles.icon_category, {backgroundColor: "#855dfa"}]}>
                                        <AntDesign name="message1" size={26} color="#fff" />
                                    </View>
                                </View>
                                <View style={styles.name_category_border}>
                                    <View style={styles.name_category}>
                                        <Text style={{ fontSize: 13, textAlign: 'center', color: "#855dfa" }}>
                                            Tin nhắn
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.categories_on_row}>
                        
                        <TouchableOpacity 
                            style={styles.each_category_space}
                            onPress={() => navigation.navigate("ChooseStation")}
                        >
                            <View style={styles.each_category}>
                                <View style={styles.icon_category_border}>
                                    <View style={[styles.icon_category, {backgroundColor: "#ff76ea"}]}>
                                        <FontAwesome5 name="bus" size={26} color="#fff" />
                                    </View>
                                </View>
                                <View style={styles.name_category_border}>
                                    <View style={styles.name_category}>
                                        <Text style={{ fontSize: 13, textAlign: 'center', color: "#ff45e2" }}>
                                            Ghi danh xe đón
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.each_category_space}
                            onPress={() => navigation.navigate('History')}
                        >
                            <View style={styles.each_category}>
                                <View style={styles.icon_category_border}>
                                    <View style={[styles.icon_category, {backgroundColor: "#ff914d"}]}>
                                        <FontAwesome name="history" size={26} color="#fff" />
                                    </View>
                                </View>
                                <View style={styles.name_category_border}>
                                    <View style={styles.name_category}>
                                        <Text style={{ fontSize: 13, textAlign: 'center', color: "#ff914d" }}>
                                            Lịch sử
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.categories_on_row}>
                        <TouchableOpacity 
                            style={styles.each_category_space}
                            onPress={() => navigation.navigate('Absence')}
                        >
                            <View style={styles.each_category}>
                                <View style={styles.icon_category_border}>
                                    <View style={[styles.icon_category, {backgroundColor: "#547efe"}]}>
                                        <FontAwesome5 name="calendar-times" size={26} color="#fff" />
                                    </View>
                                </View>
                                <View style={styles.name_category_border}>
                                    <View style={styles.name_category}>
                                        <Text style={{ fontSize: 13, textAlign: 'center', color: "#547efe" }}>
                                            Xin vắng
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.each_category_space}
                            onPress={() => navigation.navigate("GpsFollow")}
                        >
                            <View style={styles.each_category}>
                                <View style={styles.icon_category_border}>
                                    <View style={[styles.icon_category, {backgroundColor: "#75f182"}]}>
                                        <FontAwesome5 name="map-marked-alt" size={26} color="#fff" />
                                    </View>
                                </View>
                                <View style={styles.name_category_border}>
                                    <View style={styles.name_category}>
                                        <Text style={{ fontSize: 13, textAlign: 'center', color: "#75f182" }}>
                                            Theo dõi GPS
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({ 
    container : {
        flex: 1,
        // flexDirection: 'column'
    },

    header: {
        height: height*3/10,
    },

    image: {
        flex: 1,
        resizeMode: "cover",
        // justifyContent: "center",
        paddingHorizontal: 15,
    },

    menu_border: {
        // borderWidth: 1,
        // paddingHorizontal: 15,
        paddingVertical: 10,
    },

    introduce: {
        // borderWidth: 1,
        flexDirection: 'row'
    },

    introduce_text: {
        // borderWidth: 1,
        flex: 2/3
    },

    introduce_image: {
        // borderWidth: 1,
        flex: 1/3,
    },

    body: {
        flex: 1,
    },
    category_border: {
        flex: 1,
        marginTop: -100,
        paddingHorizontal: 30,
        paddingVertical: 20,
    },

    categories_on_row: {
        flex: 1/3,
        flexDirection: 'row'
    },

    each_category_space: {
        flex: 1/2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },

    each_category: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        opacity: 0.9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

    icon_category_border: {
        flex: 3/5,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    name_category_border: {
        flex: 2/5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    icon_category: {
        width: 60,
        height: 60,
        backgroundColor: '#CACFD2',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

    name_category: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    }
})

export default TeacherHomePage;

