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
import * as ImagePicker from 'expo-image-picker';

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
import { addInfo, initialInfo } from '../actions/followAction'
import { addDestination } from '../actions/destinationAction'


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
  const [tokens, setTokens] = useState([])
  const [parentsData, setParentsData] = useState();
  const [classData, setClassData] = useState();
  const [teacherData, setTeacherData] = useState();
  const [pictureOther, setPictureOther] = useState("");
  const [otherRequire, setOtherRequire] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const openScan = () => {
    setModalVisible(!isModalVisible);
    setScanned(false)
  }

  const loadStudentList = async () => {
    dispatch(initialInfo());
    const id = user._id;
    const isSchedule = await axios.post(`${host}/supervisorschedule/showdestination`, { id: id})
     
    if(Object.entries(isSchedule.data).length != 0) {
      dispatch(addDestination(isSchedule.data))
    }  else {
      dispatch(addDestination({
        date: new Date(),
        process: {
            "destination": 0,
            "status": false,
          },
        status: {
            "getOnBus": false,
            "getOutBus": false,
          },
      }))
    }   

    const isList = await axios.post(`${host}/registerbus/showAllList`, { id })
        
    isList.data.map(async (value) => {
      const studentData = await axios.post(`${host}/student/getStudentByParentsId`, {id: value.parentsId})
      const updatedData = await axios.post(`${host}/registerbus/updateDate`, {id: value.parentsId})
      const studentInfo = {
        valueparentsId: value.parentsId,
        student: studentData.data,
        station: {
          station: value.station,
          getOnBusFromHouse: value.getOnBusFromHouse,
          getOutBusFromHouse: value.getOutBusFromHouse,
          getOnBusFromSchool: value.getOnBusFromSchool,
          getOutBusFromSchool: value.getOutBusFromSchool,
        }
      };  
      dispatch(addInfo(studentInfo))
    })
  }
  const alertQR = async (name) => {
    const type = route.params.type === "OnBus" ? 1 : 0;
    const destination = scheduleInfo.process.destination === 1 ? "Nhà đến trường" : "Trường về nhà";
    await tokens.map(item => {
      sendPushNotification(item.tokenDevices, name, type, destination)
    })
    // console.log(pictureOther);
    const content = !pictureOther ? `${name} đã điểm danh ${type ? 'lên xe' : 'xuống xe'} từ ${destination}` : `${name} đã điểm danh xuống xe từ ${destination} do người thân đón hộ`;
    await axios.post(`${host}/notification/create`, { 
      parentsId: parentsData._id,
      title: type ? 'LÊN XE' : 'XUỐNG XE',
      content: content,
      picture: pictureOther ? pictureOther : null
    })

    Alert.alert(
      "Thành công!",
      `${name} đã ghi danh thành công!`,
      [
        { text: "OK" }
      ]
    );
  }

  const selectedPicture = async (file) => {
    const localUri = file;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        const formData = new FormData();
        const dataPicture = JSON.parse(JSON.stringify({ uri: localUri, name: filename, type }));
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        
        formData.append('photo', dataPicture);

        // end upload image

        const changeInfo = await axios.post(`${host}/teacher/handlePicture`, formData, config)
        const { data, error } = changeInfo;
        if(!error) {
          // console.log(data.uri);
          setPictureOther(data.uri);
        } else {
            console.log(error);
        }
  }

  const onCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    })
  
    if (!result.cancelled) {
      selectedPicture(result.uri)
    }
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
                      {route.params.type === "OnBus" ? "Lên xe" : "Xuống xe" }
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
                          <Text style={{ flex: 1, textAlign: 'right', color: '#2980B9', fontWeight: 'bold' }}>{ studentData ? studentData.name : null }</Text>
                        </View>
                      </View>

                      <View style={{ borderBottomWidth: 1, borderBottomColor: '#839192', marginBottom: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                          <Text style={{ color: '#839192', fontSize: 13 }}>Giới tính: </Text>
                          <Text style={{ flex: 1, textAlign: 'right', color: '#2980B9', fontWeight: 'bold' }}>{ !studentData ? null : studentData.gender === "Male" ? "Nam" : "Nữ."  }</Text>
                        </View>
                      </View>

                      <View style={{ borderBottomWidth: 1, borderBottomColor: '#839192', marginBottom: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                          <Text style={{ color: '#839192', fontSize: 13 }}>Lớp: </Text>
                          <Text style={{ flex: 1, textAlign: 'right', color: '#2980B9', fontWeight: 'bold' }}>Lớp: { classData ? classData.ClassCode : null }</Text>
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
                
                {
                  route.params.type !== "OnBus" && scheduleInfo.process.destination === 2
                  ?
                  <>
                    <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
                        <Text style={{ color: '#2980B9', fontWeight: 'bold', fontSize: 18  }}>Thông tin phụ huynh</Text>
                    </View>
                    <View style={{ padding: 15 }}>
                      <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '30%', height: 120, borderWidth: 1, }}>
                            {
                              pictureOther
                              ? <Image source={{ uri: `${host}/${pictureOther}` }} style={{ width: '100%', height: 120 }}/>
                              :parentsData
                              ?
                                parentsData.avatar
                                ?
                                <Image source={{ uri: `${host}/${parentsData.avatar}` }} style={{ width: '100%', height: 120 }}/>
                                : null
                              :null
                            }
                        </View>
                        <View style={{ width: '70%', paddingLeft: 15 }}>
                        
                          <View style={{ borderBottomWidth: 1, borderBottomColor: '#839192', marginBottom: 5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                              <Text style={{ color: '#839192', fontSize: 13 }}>Họ và tên: </Text>
                              <Text style={{ flex: 1, textAlign: 'right', color: '#2980B9', fontWeight: 'bold' }}>
                                  {
                                    parentsData
                                    ?
                                    parentsData.myFullName
                                    : null
                                  }
                              </Text>
                            </View>
                          </View>

                          <View style={{ borderBottomWidth: 1, borderBottomColor: '#839192', marginBottom: 5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                              <Text style={{ color: '#839192', fontSize: 13 }}>Giới tính: </Text>
                              <Text style={{ flex: 1, textAlign: 'right', color: '#2980B9', fontWeight: 'bold' }}>
                                  {
                                    parentsData
                                    ?
                                    parentsData.gender === "Male"
                                    ? 'Nam'
                                    : parentsData.gender === "Female"
                                    ? 'Nữ'
                                    : null
                                    : null
                                  }
                              </Text>
                            </View>
                          </View>

                          <View style={{ borderBottomWidth: 1, borderBottomColor: '#839192', marginBottom: 5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3}}>
                              <Text style={{ color: '#839192', fontSize: 13 }}>Mối quan hệ: </Text>
                              <Text style={{ flex: 1, textAlign: 'right', color: '#2980B9', fontWeight: 'bold' }}>
                                  {
                                    parentsData
                                    ?
                                    parentsData.relationship
                                    : null
                                  }
                              </Text>
                            </View>
                          </View>
                          
                          {
                            otherRequire
                            ?
                            <View style={{ marginBottom: 5 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3, }}>
                                <Text style={{ flex: 1, textAlign: 'right', color: 'green', fontWeight: 'bold' }}>
                                    Người nhà đón hộ
                                </Text>
                              </View>
                            </View>
                            :<></>
                          }
                          

                          <View style={{ marginBottom: 5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3, }}>
                              <TouchableOpacity style={{ flex: 1, height: 30 }}
                                onPress={onCamera}
                              >
                                <Text style={{ flex: 1, textAlign: 'right', color: '#2980B9', fontWeight: 'bold', textDecorationLine: 'underline' }}>
                                    Camera
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>    
                    </View>
                  </>
                  : <></>
                }
                <View>
                  <View style={{ flexDirection: 'row', margin: 15 }}>
                    <TouchableOpacity
                      style={{ flex: 1/2, height: 50, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, borderRadius: 30 }}
                      onPress={() => {
                        axios.post(`${host}/registerbus/attendance`,
                         {id: parentsData._id, type: route.params.type, supervisorId: route.params.supervisorId}
                        ).then(() => {
                          loadStudentList()
                          alertQR(studentData.name)
                          setPictureOther("");
                          openScan();
                          setModalVisible(false);
                          console.log("OKOKOK");
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
                      onPress={() => {
                        openScan(),
                        setPictureOther("");
                      }}
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
                        <Entypo name="cross" size={24} color="#EE3121" style={{ marginRight: 5 }}/>
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
    const check = infoStudentList.filter(item => {
      return item.data.student._id == isStudent.data.student._id
    })
    if(check.length == 0) {
      Alert.alert(
        "Thất bại",
        `Học sinh này không có trong danh sách`,
        [
          { text: "OK", onPress: () => setScanned(false) }
        ]
      );
    } else {
      const isParents = await axios.post(`${host}/users/getUserById`, { id: isStudent.data.student.parentsCode })
      const isClass = await axios.post(`${host}/class/getClassById`, { id: isStudent.data.student.classCode })
      const isTeacher = await axios.post(`${host}/teacher/getUserById`, { id: isStudent.data.student.teacherCode })
      const registerData = await axios.post(`${host}/registerBus/show`, { id: isStudent.data.student.parentsCode })
      setStudentData(isStudent.data.student)
      setTokens(isStudent.data.tokens)
      setParentsData(isParents.data[0])
      setTeacherData(isTeacher.data)
      setClassData(isClass.data[0])
      setModalVisible(!isModalVisible);
      const now = new Date().getDate()+"/"+new Date().getMonth();
      const getDate = (new Date(registerData.data.otherRequirement)).getDate()+"/"+(new Date(registerData.data.otherRequirement)).getMonth();
      if(now == getDate) {
        setOtherRequire(true)
      }
    }
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

  async function sendPushNotification(expoPushToken, name, type, destination) {
    const content = !pictureOther ? `${name} đã điểm danh ${type ? 'lên xe' : 'xuống xe'} từ ${destination}` : `${name} đã điểm danh xuống xe từ ${destination} do người thân đón hộ`;
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: type ? 'LÊN XE' : 'XUỐNG XE',
      body: content,
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
              <Text style={styles.titleHeader_text}>Check Out Mã QR</Text>
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