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
  TextInput
} from 'react-native';

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
import axios from 'axios';
import host from '../assets/host';
import { useSelector } from 'react-redux' 

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

import { LinearGradient } from 'expo-linear-gradient';

const changePassword = ({ navigation }) => {
    const user = useSelector(state => state.userReducer)

    const [secureTextEntry, setSecureTextEntry] = React.useState({
      currentPass: true,
      newPass1: true,
      newPass2: true,
    })

    const [passwordText, setPasswordText] = React.useState({
      currentPass: '',
      newPass1: '',
      newPass2: '',
    })


    const [errorValidate, setErrorValidate] = React.useState({
      currentPass: false,
      newPass1: false,
      newPass2: false,
    })

    const setTextCurrentPass = (value) => {
      setPasswordText({
        ...passwordText,
        currentPass: value
      })
    }

    const setTextNewPass1 = (value) => {
      setPasswordText({
        ...passwordText,
        newPass1: value
      })
    }

    const setTextNewPass2 = (value) => {
      setPasswordText({
        ...passwordText,
        newPass2: value
      })
    }

    const setSecureCurrentPass = () => {
      setSecureTextEntry({
        ...secureTextEntry,
        currentPass: !secureTextEntry.currentPass
      })
    }
    
    const setSecuretNewPass1 = () => {
      setSecureTextEntry({
        ...secureTextEntry,
        newPass1: !secureTextEntry.newPass1
      })
    }
    
    const setSecuretNewPass2 = () => {
      setSecureTextEntry({
        ...secureTextEntry,
        newPass2: !secureTextEntry.newPass2
      })
    }

    const confirmSaveNewPasswordParents = async () => {
      const { userName } = user.data
      const password = passwordText.currentPass
      const newPassword1 = passwordText.newPass1
      const newPassword2 = passwordText.newPass2
      const handler = await axios.post(`${host}/users/changePasswordParents`, { userName, password, newPassword1, newPassword2 })
      const { error, errorValid, errorExist, success } = handler.data

      if(error) {
        setErrorValidate({
          ...errorValidate,
          currentPass: true,
          newPass1: false,
          newPass2: false,
        })
      } else if(errorValid) {
        setErrorValidate({
          ...errorValidate,
          currentPass: false,
          newPass1: true,
          newPass2: false,
        })
      } else if(errorExist) {
        setErrorValidate({
          ...errorValidate,
          currentPass: false,
          newPass1: false,
          newPass2: true,
        })
      } else {
        // success : true 
        console.log('doi mat khau thanh cong');
        setErrorValidate({
          ...errorValidate,
          currentPass: false,
          newPass1: false,
          newPass2: false,
        })
      }
      
    }

    const confirmSaveNewPasswordTeacher = async () => {
      const { userName } = user.data
      const password = passwordText.currentPass
      const newPassword1 = passwordText.newPass1
      const newPassword2 = passwordText.newPass2

      const handler = await axios.post(`${host}/teacher/changePasswordTeacher`, { userName, password, newPassword1, newPassword2 })
      const { error, errorValid, errorExist, success } = handler.data

      if(error) {
        setErrorValidate({
          ...errorValidate,
          currentPass: true,
          newPass1: false,
          newPass2: false,
        })
      } else if(errorValid) {
        setErrorValidate({
          ...errorValidate,
          currentPass: false,
          newPass1: true,
          newPass2: false,
        })
      } else if(errorExist) {
        setErrorValidate({
          ...errorValidate,
          currentPass: false,
          newPass1: false,
          newPass2: true,
        })
      } else {
        // success : true 
        console.log('doi mat khau thanh cong');
        setErrorValidate({
          ...errorValidate,
          currentPass: false,
          newPass1: false,
          newPass2: false,
        })
        await axios.post(`${host}/history/create`, { id: user.data._id, event:"ChangePassword" })
      }
    }

    const errorValidBorder = {
      borderColor: 'red'
    }

    const errorValueText = {
      color: 'red'
    }
    
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
                <Text style={styles.titleHeader_text}>Đổi mật khẩu</Text>
            </View>
            

            <View style={styles.RealtimeChatHeader}>
              <AntDesign name="message1" size={22} color="#6495ED" />
                <Text style={styles.RealtimeChatHeader_text}>9</Text>
            </View>
        </View>  
        <View style={styles.body}>
          <View style={styles.changePassword_space}>
            <View style={styles.changePassword_component}>
              <Text style={styles.changePassword_text}>Mật khẩu cũ</Text>
                <View style={[styles.changePassword_textinput_border, errorValidate.currentPass ? { ...errorValidBorder } : null]}>
                  <TextInput 
                    value={passwordText.currentPass}
                    placeholder="Nhập vào mật khẩu hiện tại"
                    onChangeText={(value) => setTextCurrentPass(value)}
                    autoCapitalize= "none"
                    secureTextEntry={ secureTextEntry.currentPass }
                    style={[styles.changePassword_textinput, errorValidate.currentPass ? { ...errorValueText } : null]}
                  />
                  <TouchableOpacity onPress={setSecureCurrentPass}>
                    {
                      secureTextEntry.currentPass
                      ?  <Feather name="eye-off" size={20} color="black" style={{ paddingTop: 3, marginHorizontal: 5 }}/>
                      :  <Feather name="eye" size={20} color="black" style={{ paddingTop: 3, marginHorizontal: 5 }} />
                    }
                  </TouchableOpacity>
                  
                </View>
            </View>

            <View style={styles.changePassword_component}>
                <Text style={styles.changePassword_text}>Mật khẩu mới</Text>
                <View style={[styles.changePassword_textinput_border, errorValidate.newPass1 ? { ...errorValidBorder } : null]}>
                  <TextInput 
                    value={passwordText.newPass1}
                    placeholder="Nhập vào mật khẩu mới có ít nhất 7 ký tự"
                    onChangeText={(value) => setTextNewPass1(value)}
                    style={[styles.changePassword_textinput, errorValidate.newPass1 ? { ...errorValueText } : null]}
                    autoCapitalize= "none"
                    secureTextEntry={ secureTextEntry.newPass1 }
                  />
                  <TouchableOpacity onPress={setSecuretNewPass1}>
                    {
                      secureTextEntry.newPass1
                      ?  <Feather name="eye-off" size={20} color="black" style={{ paddingTop: 3, marginHorizontal: 5 }}/>
                      :  <Feather name="eye" size={20} color="black" style={{ paddingTop: 3, marginHorizontal: 5 }} />
                    }
                  </TouchableOpacity>
                </View>
            </View>

            <View style={styles.changePassword_component}>
                <Text style={styles.changePassword_text}>Nhập lại mật khẩu</Text>
                <View style={[styles.changePassword_textinput_border, errorValidate.newPass2 ? { ...errorValidBorder } : null]}>
                  <TextInput 
                    value={passwordText.newPass2}
                    placeholder="Nhập lại mật khẩu mới"
                    onChangeText={(value) => setTextNewPass2(value)}
                    autoCapitalize= "none"
                    secureTextEntry={ secureTextEntry.newPass2 }  
                    style={[styles.changePassword_textinput, errorValidate.newPass2 ? { ...errorValueText } : null]}
                  />
                  <TouchableOpacity onPress={setSecuretNewPass2}>
                    {
                      secureTextEntry.newPass2
                      ?  <Feather name="eye-off" size={20} color="black" style={{ paddingTop: 3, marginHorizontal: 5 }}/>
                      :  <Feather name="eye" size={20} color="black" style={{ paddingTop: 3, marginHorizontal: 5 }} />
                    }
                  </TouchableOpacity>
                </View>
            </View>

            <View style={styles.changePassword_component}>
                <TouchableOpacity onPress={ user.data.permission === "teacher" ? confirmSaveNewPasswordTeacher : confirmSaveNewPasswordParents }>
                    <LinearGradient
                      start={{ x: 0, y: 2 }}
                      end={{ x: 1, y: 1 }}
                      colors={['#408ffb', '#64cafb']}
                      style={styles.changePassword_confirm}
                    >
                      <View style={styles.changePassword_confirm}>
                        <Text style={{
                          color: "#fff",
                        }}>
                          Lưu thay đổi</Text>
                      </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    )
        
}

export default changePassword;

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
    flexDirection: 'row',
    marginTop: 40,
  },

  changePassword_space: {
    flex: 1,
  },

  changePassword_component: {
    // borderWidth: 1,
    paddingVertical: 7,
    marginHorizontal: 5
  },

  changePassword_text: {
    color: '#2980B9',
    fontWeight: 'bold',
    fontSize: 15,
    paddingLeft: 5
  },

  changePassword_textinput_border: {
    borderWidth: 2,
    marginVertical: 10,
    padding: 5,
    borderRadius: 10,
    borderColor: '#909497',
    flexDirection: 'row',
  },

  changePassword_textinput: {
    flex: 1,
    color: '#909497',
  },

  changePassword_confirm: {
    marginVertical: 10,
    height: 50,
    marginHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15
  }

})