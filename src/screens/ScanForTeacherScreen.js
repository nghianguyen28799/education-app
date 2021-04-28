import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
  Alert
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
// import Modal from 'react-native-modal';
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

import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import host from '../assets/host';
import { useDispatch, useSelector } from 'react-redux'
import { addStudent, initialStudent } from '../actions/attendanceListAction'


const getAttendanceScreen = {
  title: 'Lên xe',
  status: 1,
  valueAnim: 0,
  colorLabel:['#fff', '#2980B9']
}

const getOutBusScreen = {
  title: 'Xuống xe',
  status: 2,
  valueAnim: width/2 - 10,
  colorLabel:['#2980B9', '#fff']
}

export default function ScanScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userReducer.data)
  const infoStudentList = useSelector(state => state.followReducer.infoStudentList)
  const scheduleInfo = useSelector(state => state.destinationReducer.data)

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [studentData, setStudentData] = useState();
  const [tokens, setTokens] = useState([]);
  const [parentsData, setParentsData] = useState();
  const [classData, setClassData] = useState();
  const [teacherData, setTeacherData] = useState();

  const openScan = () => {
    setScanned(false)
    setModalVisible(!isModalVisible);
  }

  const loadStudentList = async (classCode) => {
    dispatch(initialStudent());
    const isStudentList = await axios.post(`${host}/student/getStudentByClassCode`, { classCode })
    isStudentList.data.map(item => {
      dispatch(addStudent(item))
    })
  }
  
  const alertQR = async (name) => {
    await tokens.map(item => {
      sendPushNotification(item.tokenDevices, name)
    })
    await axios.post(`${host}/notification/create`, { 
      parentsId: parentsData._id,
      title: "Điểm danh",
      content: `${name} đã điểm danh vào lớp!`,
    })
    Alert.alert(
      "Thành công!",
      `${name} đã ghi danh thành công!`,
      [
        { text: "OK" }
      ]
    );
  }
  
  const ModalComponent = () => {
    return (
      <Modal animationType = {"slide"} transparent = {false}
        visible = {isModalVisible}  
          onRequestClose = {() => { console.log("Modal has been closed.") } 
      }>
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee3f3', position: 'absolute' }}>
            <View style={{ backgroundColor: '#fff', width: width-30, zIndex: 999999, borderRadius: 10 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ padding: 10, fontSize: 18, textTransform: 'uppercase', fontWeight: 'bold', color: '#1C81DF' }}>
                      Điểm danh
                    </Text>
                </View>
                <LinearGradient 
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    locations={[0.5, 1]}
                    colors={['#f1c1bfed', '#69dfe3']}
                    style={{ backgroundColor: '#2980B9', justifyContent: 'center', alignItems: 'center', padding: 10 }}
                  >
                    <Text style={{ color: '#6D2EF3', fontWeight: 'bold', fontSize: 15  }}>Thẻ học sinh</Text>
                </LinearGradient>
    
                <View style={{ padding: 15 }}>
                  <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: 88, height: 120, borderWidth: 1, }}>
                      { studentData ? <Image source={{ uri: `${host}/${studentData.avatar}`}} style={{ width: 88, height: 120 }}/> : null}
                    </View>
                    <View style={{ width: '70%', paddingLeft: 15 }}>
                     
                      <View style={{ borderBottomWidth: 1, borderBottomColor: '#839192', marginBottom: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                          <Text style={{ color: '#839192', fontSize: 13 }}>Họ và tên: </Text>
                            <Text style={{ flex: 1, textAlign: 'right', color: '#2980B9', fontWeight: 'bold' }}>
                                { studentData ? studentData.name : null }
                            </Text>
                        </View>
                      </View>

                      <View style={{ borderBottomWidth: 1, borderBottomColor: '#839192', marginBottom: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                          <Text style={{ color: '#839192', fontSize: 13 }}>Giới tính: </Text>
                          <Text style={{ flex: 1, textAlign: 'right', color: '#2980B9', fontWeight: 'bold' }}>
                              { !studentData ? null : studentData.gender === "Male" ? "Nam" : "Nữ."  }
                            </Text>
                        </View>
                      </View>

                      <View style={{ borderBottomWidth: 1, borderBottomColor: '#839192', marginBottom: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                          <Text style={{ color: '#839192', fontSize: 13 }}>Lớp: </Text>
                          <Text style={{ flex: 1, textAlign: 'right', color: '#2980B9', fontWeight: 'bold' }}>Lớp: 
                            { classData ? classData.ClassCode : null }
                          </Text>
                        </View>
                      </View>

                      <View style={{ borderBottomWidth: 1, borderBottomColor: '#839192', marginBottom: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                          <Text style={{ color: '#839192', fontSize: 13 }}>GVCN: </Text>
                          <Text style={{ flex: 1, textAlign: 'right', color: '#2980B9', fontWeight: 'bold' }}>
                            ({ !teacherData ? null : teacherData.Gender === "Male" ? "Thầy" : "Cô"}) 
                            { teacherData ? teacherData.FullName : null }
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>    
                </View>
              
                <View>
                  <View style={{ flexDirection: 'row', margin: 15 }}>
                    <TouchableOpacity
                      style={{ flex: 1/2, height: 50, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, borderRadius: 30 }}
                      onPress={() => {
                        axios.post(`${host}/student/getAttendanceSuccessly`,
                         {id: studentData._id}
                        ).then(() => {
                          loadStudentList( studentData.classCode )
                          openScan()
                          alertQR(studentData.name)
                        })
                      }
                      }
                    >
                        <LinearGradient
                          start={{ x: 0, y: 2 }}
                          end={{ x: 1, y: 1 }}
                          colors={['#408ffb', '#64cafb']}
                          style={{
                            flex: 1,
                            flexDirection: 'row', 
                            backgroundColor: 'red',
                            width: '100%', 
                            height: '100%', 
                            borderRadius: 30,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                        <FontAwesome5 name="check" size={20} color="#1BD812" style={{ marginRight: 5 }}/>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16}}>Xác nhận</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    

                    <TouchableOpacity
                      style={{ flex: 1/2, height: 50, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, borderRadius: 30 }}
                      onPress={openScan}
                    >
                        <LinearGradient
                          start={{ x: 0, y: 2 }}
                          end={{ x: 1, y: 1 }}
                          colors={['#408ffb', '#64cafb']}
                          style={{
                            flex: 1,
                            flexDirection: 'row', 
                            backgroundColor: 'red',
                            width: '100%', 
                            height: '100%', 
                            borderRadius: 30,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                        <FontAwesome5 name="check" size={20} color="#EE3121" style={{ marginRight: 5 }}/>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16}}>Hủy bỏ</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
          </View>
        </View>
      </Modal>
    )
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    var dom1 = data.slice(data.indexOf("/")+2, data.length)
    var dom2 = dom1.slice(dom1.indexOf("/")+1, dom1.length)
    const isStudent = await axios.get(`${host}/${dom2}`)
    const isParents = await axios.post(`${host}/users/getUserById`, { id: isStudent.data.student.parentsCode })
    const isClass = await axios.post(`${host}/class/getClassById`, { id: isStudent.data.student.classCode })
    const isTeacher = await axios.post(`${host}/teacher/getUserById`, { id: isStudent.data.student.teacherCode })
    setStudentData(isStudent.data.student)
    setTokens(isStudent.data.tokens)
    setParentsData(isParents.data[0])
    setTeacherData(isTeacher.data)
    setClassData(isClass.data[0])
    setModalVisible(!isModalVisible);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const leftTop = {
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: '#fff',

  };

  const leftBottom = {
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#fff',
  };

  const rightTop = {
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: '#fff',
  };
  
  const rightBottom = {
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#fff',
  };

  async function sendPushNotification(expoPushToken, name) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Điểm danh',
      body: `${name} đã điểm danh vào lớp!`,
      data: { someData: 'goes here' },
    };
    
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ModalComponent />
      <View style={styles.header}>
        <TouchableOpacity
            onPress={() => navigation.goBack()}
        >
          <View style={styles.goBackHeader}>
              <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
          </View>
        </TouchableOpacity>
            
          <View style={styles.titleHeader}>
              <Text style={styles.titleHeader_text}>QR Điểm Danh</Text>
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
      
        <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', }}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{... StyleSheet.absoluteFillObject, backgroundColor: '#fff'}}
          />
          {/* <View style={{ flex: 1, position: 'absolute', width: width/5*3+50 , height: width/5*3+50 }}>
    
          </View> */}
          <View style={{ width: width/5*3 , height: width/5*3 }}>  
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, ...leftTop}}></View>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 1, ...rightTop}}></View>
            </View>
            
            <View style={{ flex: 1}} />
            
            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 1, ...leftBottom}}></View>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 1, ...rightBottom}}></View>
            </View>
          </View>
        </View> 
    </View>
  );
}


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
      opacity: 0,
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
})