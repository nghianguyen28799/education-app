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

import UserCirle from '../assets/images/user-circle.png'

const MessageScreen = ({navigation}) => {
    // return (
    //     <View style={styles.container}>
    //         <View style={styles.header}>
    //         <StatusBar backgroundColor="#00a6b5c9" barStyle="light-content" />
    //         <TouchableOpacity
    //           onPress={() => navigation.goBack()}
    //         >
    //             <View style={styles.goBackHeader}>
    //               <FontAwesome5 name="angle-left" size={30} color="#fff"/>
    //             </View>
    //         </TouchableOpacity>
            
    //         <View style={styles.titleHeader}>
    //             <Text style={styles.titleHeader_text}>Thanh Phúc</Text>
    //             <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
    //                 <Text style={{ color: '#fff', fontSize: 13 }}>Phụ huynh của: </Text>
    //                 <Text style={{ fontWeight: 'bold', color: '#21618C' }}>Hữu Đan</Text>
    //             </View>
                
    //             <Text style={{ color: 'green' }}>Online</Text>
    //         </View>
            
    //         <TouchableOpacity
    //           onPress={() => setSearch(true)}
    //         >
    //             <View style={styles.SearchHeader}>
    //               <AntDesign name="search1" size={22} color="#6495ED" />
    //                 {/* <AntDesign name="message1" size={22} color="#6495ED" /> */}
    //             </View>
    //         </TouchableOpacity>
    //         </View> 

    //         <View style={ styles.body }>
    //             <ScrollView>
    //                 <View style={styles.myMessage}>
                        
    //                 </View>

    //                 <View style={styles.otherMessage}>

    //                 </View>
    //             </ScrollView>
    //         </View>

    //         <View style={ styles.footer }>
    //             <View style={ styles.textMessage }>
    //                 <TextInput 
    //                     placeholder="Nhập tin nhắn ..."
    
    //                 />
    //             </View>
    //             <TouchableOpacity>
    //                 <View style={ styles.buttonMessage }>
    //                     <MaterialCommunityIcons name="send" size={24} color="black" />
    //                 </View>
    //             </TouchableOpacity>
    //         </View>
    //     </View>
    // )

    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {
        setMessages([
        {
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
            },
        },
        ])
    }, [])

    const onSend = React.useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        console.log(messages);
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
        
        <View style={styles.titleHeader}>
            <Text style={styles.titleHeader_text}>Thanh Phúc</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{ color: '#fff', fontSize: 13 }}>Phụ huynh của: </Text>
                <Text style={{ fontWeight: 'bold', color: '#21618C' }}>Hữu Đan</Text>
            </View>
            
            <Text style={{ color: 'green' }}>Online</Text>
        </View>
        
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
                    _id: 1,
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
        color: '#21618C',
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