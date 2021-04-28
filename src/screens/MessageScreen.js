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
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

import UserCirle from '../assets/images/user-circle.png'

let socket;

const MessageScreen = ({ navigation, route }) => {

    const user = useSelector(state => state.userReducer)

    const [name, setName] = React.useState('');
    const [room, setRoom] = React.useState('');
    const [messages, setMessages] = React.useState([]);


    if(user.data.permission === "parents") {
        const [studentData, setStudentData] = React.useState();
        const [teacherData, setTeacherData] = React.useState([]);
        const [parentsData, setParentsData] = React.useState();
    
        React.useEffect(() => {
            getData();
        }, [])
    
        const getData = async () => {
          try{
            socket = io.connect(host);
          
            const isStudent = await axios.post(`${host}/student/getStudentByParentsId`, {id: user.data._id})
            const isTeacher = await axios.post(`${host}/teacher/getUserById`, {id: isStudent.data.teacherCode})
            const isClass = await axios.post(`${host}/class/getClassById`, {id: isStudent.data.classCode})
            
            setTeacherData(isTeacher.data)  
  
            const name = user.data.FullName;
            const room = isTeacher.data._id+'_'+user.data._id;
           
            axios.post(`${host}/chat/checkroom`, {room} )

            const getMessages = await  axios.post(`${host}/chat/showMessages`, {room} )
            
            setMessages(getMessages.data[0].messages)

            setName(name);
            setRoom(room);
  
            socket.emit('join', { name, room });
   
            return () => {
              socket.emit('disconnect');
              socket.off();
            }
          } catch(error) {
            console.log(error);
          }
        }
    
        React.useEffect(() => {
          socket.on('message', (message) => {
            if(message.data[0].user._id !== user.data._id) {
              const mess = message.data[0]
              setMessages(previousMessages => GiftedChat.append(previousMessages, mess))
            }
          })
        }, []);
    
        const onSend = React.useCallback((messages = {}) => {
            setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
            socket.emit('sendMessage', messages);
        }, [])
    
        const renderSend = (props) => {
            return (
              <Send {...props}>
                <View>
                  <MaterialCommunityIcons
                    name="send-circle"
                    style={{marginBottom: 5, marginRight: 5}}
                    size={32}
                    color="#2e64e5"
                  />
                </View>
              </Send>
            );
          };
        
          const renderBubble = (props) => {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: '#00a6b5c9',
                  },
                }}
                textStyle={{
                  right: {
                    color: '#fff',
                  },
                }}
              />
            );
          };
        
          const scrollToBottomComponent = () => {
            return(
              <FontAwesome name='angle-double-down' size={22} color='#333' />
            );
          }
          const TitleHeader = () => {
              return (
                <View style={styles.titleHeader}>
                  <Text style={styles.titleHeader_text}>
                      { teacherData.Gender === "Male" ? "(Thầy)" : "Cô" } {teacherData.FullName}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                      {/* <Text style={{ color: '#fff', fontSize: 13 }}>Phụ huynh của: </Text> */}
                      <Text style={{ fontWeight: 'bold', color: 'yellow' }}>GVCN</Text>
                  </View>
              </View>
              )
          }
    
      return (
        <View style={styles.container}>
            <View style={styles.header}>
            <StatusBar backgroundColor="#00a6b5c9" barStyle="light-content" />
            <TouchableOpacity
                onPress={() => navigation.goBack()}
            >
                <View style={styles.goBackHeader}>
                    <FontAwesome5 name="angle-left" size={30} color="#fff"/>
                </View>
            </TouchableOpacity>
            
            <TitleHeader />
            
            <TouchableOpacity
                onPress={() => setSearch(true)}
            >
                <View style={styles.SearchHeader}>
                    <AntDesign name="search1" size={22} color="#6495ED" />
                    {/* <AntDesign name="message1" size={22} color="#6495ED" /> */}
                </View>
            </TouchableOpacity>
            </View>
    
      
            <View style={styles.body}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: user.data._id,
                        name: 'Teacher',
                        avatar: `${host}/${user.data.Avatar}`
                    }}
                    renderBubble={renderBubble}
                    alwaysShowSend
                    renderSend={renderSend}
                    scrollToBottom
                    scrollToBottomComponent={scrollToBottomComponent}
                />
            </View>
        </View>
      )
    } 
    
    
    

















    
    
    
    
    else if(user.data.permission === "teacher") {
        // const [studentData, setStudentData] = React.useState();
        // const [teacherData, setTeacherData] = React.useState([]);
        // const [parentsData, setParentsData] = React.useState();
        const { studentData, parentsData, teacherData } = route.params
        
        // console.log(studentData);

        React.useEffect(() => {
            getData();
        }, [])

        const getData = async () => {
          try{
            socket = io(host);
        
            const name = user.data.FullName;
            const room = user.data._id+'_'+parentsData._id;

            axios.post(`${host}/chat/checkroom`, {room} )

            const getMessages = await  axios.post(`${host}/chat/showMessages`, {room} )
            
            setMessages(getMessages.data[0].messages)
            
            setName(name);
            setRoom(room);

            socket.emit('join', { name, room }, () => {
                console.log('joined');
            });

            return () => {
              socket.emit('disconnect');
              socket.off();
            }
            
          } catch(error) {
            console.log(error);
          }
        }

        React.useEffect(() => {
          socket.on('message', (message) => {
            if(message.data[0].user._id !== user.data._id) {
              const mess = message.data[0]
              setMessages(previousMessages => GiftedChat.append(previousMessages, mess))
            }
          })
        }, []);

        const onSend = React.useCallback((messages = {}) => {
            setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
            socket.emit('sendMessage', messages);
        }, [])

        const renderSend = (props) => {
            return (
              <Send {...props}>
                <View>
                  <MaterialCommunityIcons
                    name="send-circle"
                    style={{marginBottom: 5, marginRight: 5}}
                    size={32}
                    color="#2e64e5"
                  />
                </View>
              </Send>
            );
          };
        
          const renderBubble = (props) => {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: '#00a6b5c9',
                  },
                }}
                textStyle={{
                  right: {
                    color: '#fff',
                  },
                }}
              />
            );
          };
        
          const scrollToBottomComponent = () => {
            return(
              <FontAwesome name='angle-double-down' size={22} color='#333' />
            );
          }
          const TitleHeader = () => {
              return (
                <View style={styles.titleHeader}>
                  <Text style={styles.titleHeader_text}>
                      {parentsData.myFullName}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{ color: '#21618C', fontSize: 13 }}>Phụ huynh của: </Text>
                      <Text style={{ fontWeight: 'bold', color: '#fff' }}>{studentData.name}</Text>
                  </View>
              </View>
              )
          }

      return (
        <View style={styles.container}>
            <View style={styles.header}>
            <StatusBar backgroundColor="#00a6b5c9" barStyle="light-content" />
            <TouchableOpacity
                onPress={() => {
                  navigation.goBack()
                }}
            >
                <View style={styles.goBackHeader}>
                    <FontAwesome5 name="angle-left" size={30} color="#fff"/>
                </View>
            </TouchableOpacity>
            
            <TitleHeader />
            
            <TouchableOpacity
                onPress={() => setSearch(true)}
            >
                <View style={styles.SearchHeader}>
                    <AntDesign name="search1" size={22} color="#6495ED" />
                    {/* <AntDesign name="message1" size={22} color="#6495ED" /> */}
                </View>
            </TouchableOpacity>
            </View>

      
            <View style={styles.body}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: user.data._id,
                        name: 'Parents',
                        avatar: `${host}/${teacherData.Avatar}`
                    }}
                    renderBubble={renderBubble}
                    alwaysShowSend
                    renderSend={renderSend}
                    scrollToBottom
                    scrollToBottomComponent={scrollToBottomComponent}
                />
            </View>
        </View>
      )
    }
    
}
export default MessageScreen

const styles = StyleSheet.create({ 
    container : {
        flex: 1,    
    },

    header: {
        flexDirection: 'row',
        flex: 1/11,
        backgroundColor: '#00a6b5c9',
        // paddingTop: 30,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
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
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
        paddingLeft: 15,    
    },

    RealtimeChatHeader: {
      flexDirection: 'row',
      padding: 10,
    },

    SearchHeader: {
        flexDirection: 'row',
        padding: 10,
        opacity: 0
    },

    body: {
        flex: 1,
        justifyContent: 'center',

    },

    myMessage: {
        borderWidth: 1,

    },

    footer: {
        // borderWidth: 1, 
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    textMessage: {
        flex: 1, 
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginHorizontal: 10,
    },

    buttonMessage: {
        padding: 10, 
    }
})