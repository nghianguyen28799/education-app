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
    FlatList
} from 'react-native'

// icon store
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// close icon store
import XuanMaiImg from '../../assets/images/xuanmai.jpg';
import AttendenceScreen from '../../screens/AttendenceScreen';
import MaleNoneAvatar from '../../assets/images/male-none-avatar.png'
import FemaleNoneAvatar from '../../assets/images/female-none-avatar.png'
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const TeacherHomePage = ({navigation}) => {
    const getAttendanceScreen = {
        title: 'Điểm danh',
        status: 1,
        valueAnim: 0,
        colorLabel:['#fff', '#2980B9']
    }

    const getOutBusScreen = {
        title: 'Xuống sớm',
        status: 2,
        valueAnim: width/2 - 10,
        colorLabel:['#2980B9', '#fff']
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                    >
                        <View style={styles.goBackHeader}>
                            {/* <Entypo name="menu" size={30} color="#6495ED" /> */}
                            <Feather name="menu" size={29} color="#6495ED" />
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.titleHeader}>
                        <Text style={styles.titleHeader_text}>Trang chủ</Text>
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
                    <View style={styles.attendance_management_list_space}>
                        <View style={styles.attendance_management_title_on_thebus}>
                            <Text style={{ 
                                color: '#2980B9',
                                fontWeight: 'bold',
                                fontSize: 17,
                            }}>Lên xe bến tiếp </Text>
                            <Text style={{
                                fontSize: 17,
                                color: '#FA0000',
                                fontWeight: 'bold'
                            }}>(10)</Text>
                        </View>

                        <View style={styles.attendance_management_list_on_thebus}>
                            <ScrollView horizontal={true}>
                                {/* <Text style={{ color: '#A6ACAF'}}>Không có thông tin học sinh.</Text> */}
                                <TouchableOpacity>
                                    <View style={styles.attendance_management_each_student_space}>
                                        <View style={styles.attendance_management_each_student_image}>
                                            <Image source={FemaleNoneAvatar} style={{
                                                width: 90,
                                                height: 90,
                                                borderRadius: 20,
                                            }}/>
                                        </View>
                                        <View style={styles.attendance_management_each_student_name}>
                                            <Text style={{ 
                                                color: '#2980B9',
                                                fontWeight: '600'
                                            }}>Hữu Đan</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <View style={styles.attendance_management_each_student_space}>
                                        <View style={styles.attendance_management_each_student_image}>
                                            <Image source={FemaleNoneAvatar} style={{
                                                width: 90,
                                                height: 90,
                                                borderRadius: 20,
                                            }}/>
                                        </View>
                                        <View style={styles.attendance_management_each_student_name}>
                                            <Text style={{ 
                                                color: '#2980B9',
                                                fontWeight: '600'
                                            }}>Khánh Duy</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <View style={styles.attendance_management_each_student_space}>
                                        <View style={styles.attendance_management_each_student_image}>
                                            <Image source={MaleNoneAvatar} style={{
                                                width: 90,
                                                height: 90,
                                                borderRadius: 20,
                                            }}/>
                                        </View>
                                        <View style={styles.attendance_management_each_student_name}>
                                            <Text style={{ 
                                                color: '#2980B9',
                                                fontWeight: '600'
                                            }}>Phước Nhân</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <View style={styles.attendance_management_each_student_space}>
                                        <View style={styles.attendance_management_each_student_image}>
                                            <Image source={MaleNoneAvatar} style={{
                                                width: 90,
                                                height: 90,
                                                borderRadius: 20,
                                            }}/>
                                        </View>
                                        <View style={styles.attendance_management_each_student_name}>
                                            <Text style={{ 
                                                color: '#2980B9',
                                                fontWeight: '600'
                                            }}>Khánh Thuận</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>

                        <View style={styles.attendance_management_title_off_thebus}>
                            <Text style={{ 
                                color: '#2980B9',
                                fontWeight: 'bold',
                                fontSize: 17,
                            }}>Xuống xe bến tiếp </Text>
                            <Text style={{
                                fontSize: 17,
                                color: '#FA0000',
                                fontWeight: 'bold',
                            }}>(0)</Text>
                            </View>
                        <View style={styles.attendance_management_list_off_thebus}>
                            <Text style={{ color: '#A6ACAF'}}>Không có thông tin học sinh.</Text>
                        </View>
                    </View>

                    <View style={styles.status_of_destination_space}>
                        <View style={styles.status_of_destination_space_title}>
                            <View style={styles.status_of_destination_space_icons}>
                                <FontAwesome5 name="school" size={20} color="#40E0D0" />
                                <AntDesign name="right" size={16} color="black" style={{ marginLeft: 5, marginRight: 3 }}/>
                                <MaterialIcons name="house" size={20} color="#40E0D0" />
                            </View>
                            <Text style={{
                                flex: 1,
                                marginBottom: 10,
                                fontSize: 13,
                                fontWeight: 'bold',
                                color: '#2980B9',
                                textAlign: 'right',
                            }}>Đang diễn ra</Text>
                        </View>

                        <View style={styles.status_of_destination_space_content}>
                            <View style={styles.status_of_destination_onoff_thebus}>
                                <Text style={{ fontSize: 13, color: '#2980B9' }}>Lên xe: </Text>
                                <Text style={{ fontSize: 13, color: '#2980B9' }}>0/0 </Text>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Text style={{ color: '#2980B9' }}>Bến tiếp: </Text>
                                    <Text style={{ color: '#2980B9', fontWeight: 'bold' }}>Nguyễn Văn Linh</Text>
                                </View>
                            </View>
                            <View style={styles.status_of_destination_onoff_thebus}>
                                <Text style={{ fontSize: 13, color: '#2980B9' }}>Xuống xe: </Text>
                                <Text style={{ fontSize: 13, color: '#2980B9' }}>10/13</Text>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#A6ACAF' }}>10:41 AM 10-08-2020 </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.function_list_space}>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Attendence', {page: getAttendanceScreen })}
                        >
                            <View style={styles.each_function_space_border_left}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        {/* <AntDesign name="clockcircleo" size={width/10} color="#40E0D0" /> */}
                                        <FontAwesome name="calendar" size={width/12} color="#40E0D0" />
                                    </View>
                                    
                                </View>
                                <View style={styles.each_function_space_name}>
                                    <Text style={{ fontSize: 10, color: '#717D7E' }}>Điểm danh</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Attendence', { page: getOutBusScreen })}
                        >
                            <View style={styles.each_function_space_middle}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name="log-out-outline" size={width/10} color="#40E0D0" />
                                    </View>
                                    
                                </View>
                                <View style={styles.each_function_space_name}>
                                    <Text style={{ fontSize: 10, color: '#717D7E' }}>Xuống sớm</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <View style={styles.each_function_space_middle}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialIcons name="system-update" size={width/10} color="#40E0D0" />
                                    </View>
                                    
                                </View>
                                <View style={styles.each_function_space_name}>
                                    <Text style={{ fontSize: 10, color: '#717D7E' }}>Cập nhật</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => navigation.navigate('ReasonAbsence')}>
                            <View style={styles.each_function_space_middle}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <AntDesign name="clockcircleo" size={width/12} color="#40E0D0" />
                                    </View>
                                    
                                </View>
                                <View style={styles.each_function_space_name}>
                                    <Text style={{ fontSize: 10, color: '#717D7E' }}>Báo muộn</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity>
                            <View style={styles.each_function_space_border_right}>
                                <View style={styles.each_function_space_icon}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        {/* <AntDesign name="clockcircleo" size={width/10} color="#40E0D0" /> */}
                                        <FontAwesome5 name="map-marked-alt" size={width/12} color="#40E0D0" />
                                    </View>
                                    
                                </View>
                                <View style={styles.each_function_space_name}>
                                    <Text style={{ fontSize: 10, color: '#717D7E' }}>Bản đồ</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

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
        // paddingLeft: 10,       
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

    attendance_management_list_space: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
    },

    attendance_management_title_on_thebus: {
        flexDirection: 'row',
        flex: 1,
        marginBottom: 15,
    },

    attendance_management_list_on_thebus: {
        flex: 1,
        alignItems: 'center'
    },

    attendance_management_title_off_thebus: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 30,
        marginBottom: 15,
    },

    attendance_management_list_off_thebus: {
        flex: 1,
        alignItems: 'center'
    },

    attendance_management_each_student_space: {
        width: 90,
        height: 120,
        // borderRadius: 20,
        marginRight: 15,
    },

    attendance_management_each_student_image: {
        width: 90,
        height: 90,
        borderRadius: 20,
    },

    attendance_management_each_student_name: {
        width: 90,
        height: 30,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    status_of_destination_space: {
        flex: 1,
        marginVertical: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 20,
    },

    status_of_destination_space_title: {
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#D5DBDB',
        alignItems: 'center',
    },
    
    status_of_destination_space_icons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        textAlign: 'center',
        marginBottom: 10,
    },

    status_of_destination_space_content: {
        marginVertical: 10,
    },

    status_of_destination_onoff_thebus: {
        flexDirection: 'row',
        flex: 1,
        marginBottom: 10,
        alignItems: 'flex-end'
    },

    function_list_space: {
        flexDirection: 'row',
        flex: 1,
    },

    each_function_space_border_left: {
        width: width/7,
        height: width/7+15,
        marginRight: width/35,
    },


    each_function_space_middle: {
        width: width/7,
        height: width/7+15,
        marginHorizontal: width/35,
    },

    each_function_space_border_right: {
        width: width/7,
        height: width/7+15,
        marginLeft: width/35,
    },

    each_function_space_icon: {
        width: width/7,
        height: width/7,
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
    },

    each_function_space_name: {
        flex: 1,
        height: 15,
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
    
})

export default TeacherHomePage;

