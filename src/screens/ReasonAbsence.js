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
    AsyncStorage
} from 'react-native'

// icon store
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
// close icon store

import UserCirle from '../assets/images/user-circle.png'

const TeacherHomePage = ({navigation}) => {
    const test = () => {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('alreadyLauched')
        console.log('logout');
    }
    return (
      <View style={styles.container}>
          <TouchableOpacity onPress={test}>
            <Text>Logout</Text>
          </TouchableOpacity>
          {/* <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
              >
                  <View style={styles.goBackHeader}>
                    <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                  </View>
              </TouchableOpacity>
              
              <View style={styles.titleHeader}>
                  <Text style={styles.titleHeader_text}>Tin nhắn</Text>
              </View>
              
              <TouchableOpacity>
                  <View style={styles.RealtimeChatHeader}>
                      <AntDesign name="message1" size={22} color="#6495ED" />
                  </View>
              </TouchableOpacity>
          </View>  
          <View style={styles.body}>
              
          </View> */}
      </View>
    );
};
export default TeacherHomePage;

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
        opacity: 0
    },

    body: { 
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 15,
    },
})