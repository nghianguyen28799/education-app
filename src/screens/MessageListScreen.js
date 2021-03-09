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
    TextInput,
} from 'react-native'

// icon store
import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
// close icon store

import UserCirle from '../assets/images/user-circle.png'

const MessageListScreen = ({navigation}) => {
    const [isSearch, setSearch] = React.useState(false);

    const HeaderComponent = () => {
      if(!isSearch){
        return (
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
              
              <TouchableOpacity
                onPress={() => setSearch(true)}
              >
                  <View style={styles.RealtimeChatHeader}>
                    <AntDesign name="search1" size={22} color="#6495ED" />
                      {/* <AntDesign name="message1" size={22} color="#6495ED" /> */}
                  </View>
              </TouchableOpacity>
          </View>  
        )
      } else {
        return (
          <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => setSearch(false)}
                >
                    <View style={styles.goBackHeader}>
                      <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                    </View>
                </TouchableOpacity>
                
                <View style={{ flex: 1, marginLeft: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <TextInput 
                      placeholder="Tìm kiếm tên học sinh hoặc phụ huynh"
                      
                    />
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
        )
      }
     
    }
    return (
      <View style={styles.container}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <HeaderComponent />
          <View style={styles.body}>
              <View style={styles.messages_list}>
                <ScrollView>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Message')}
                  >
                    <View style={styles.each_message_space}>
                      <View style={styles.each_message_space_on_row}>
                        <Image source={UserCirle} style={{ width: 80, height: 80 }} />
                        <View style={styles.each_message_content}>
                          <View style={styles.each_message_content_info}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 16
                            }}>Nguyễn Văn C</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="family-restroom" size={20} color="#21b8ec" />
                                <Text style={{ color: '#787978', fontSize: 13, marginLeft: 5 }}>Phụ huynh</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>Bạn: </Text>
                                <Text>Hello World  </Text>
                            </View>
                            
                          </View>
                          <View style={styles.each_message_content_getdate}>
                              <Text style={styles.each_message_content_getdate_text}>26/02/2021</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <View style={styles.each_message_space}>
                      <View style={styles.each_message_space_on_row}>
                        <Image source={UserCirle} style={{ width: 80, height: 80 }} />
                        <View style={styles.each_message_content}>
                          <View style={styles.each_message_content_info}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 16
                            }}>Nguyễn Văn C</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="family-restroom" size={20} color="#21b8ec" />
                                <Text style={{ color: '#787978', fontSize: 13, marginLeft: 5 }}>Phụ huynh</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>Bạn: </Text>
                                <Text>Hello World</Text>
                            </View>
                            
                          </View>
                          <View style={styles.each_message_content_getdate}>
                              <Text style={styles.each_message_content_getdate_text}>26/02/2021</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <View style={styles.each_message_space}>
                      <View style={styles.each_message_space_on_row}>
                        <Image source={UserCirle} style={{ width: 80, height: 80 }} />
                        <View style={styles.each_message_content}>
                          <View style={styles.each_message_content_info}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 16
                            }}>Nguyễn Văn C</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="family-restroom" size={20} color="#21b8ec" />
                                <Text style={{ color: '#787978', fontSize: 13, marginLeft: 5 }}>Phụ huynh</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }}>
                                <Text style={{ fontWeight: 'bold' }}>Bạn: </Text>
                                <Text>Hello World  </Text>
                            </View>
                            
                          </View>
                          <View style={styles.each_message_content_getdate}>
                              <Text style={styles.each_message_content_getdate_text}>26/02/2021</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <View style={styles.each_message_space}>
                      <View style={styles.each_message_space_on_row}>
                        <Image source={UserCirle} style={{ width: 80, height: 80 }} />
                        <View style={styles.each_message_content}>
                          <View style={styles.each_message_content_info}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 16
                            }}>Nguyễn Văn C</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="family-restroom" size={20} color="#21b8ec" />
                                <Text style={{ color: '#787978', fontSize: 13, marginLeft: 5 }}>Phụ huynh</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>Bạn: </Text>
                                <Text>Hello World  </Text>
                            </View>
                            
                          </View>
                          <View style={styles.each_message_content_getdate}>
                              <Text style={styles.each_message_content_getdate_text}>26/02/2021</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <View style={styles.each_message_space}>
                      <View style={styles.each_message_space_on_row}>
                        <Image source={UserCirle} style={{ width: 80, height: 80 }} />
                        <View style={styles.each_message_content}>
                          <View style={styles.each_message_content_info}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 16
                            }}>Nguyễn Văn C</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="family-restroom" size={20} color="#21b8ec" />
                                <Text style={{ color: '#787978', fontSize: 13, marginLeft: 5 }}>Phụ huynh</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>Bạn: </Text>
                                <Text>Hello World  </Text>
                            </View>
                            
                          </View>
                          <View style={styles.each_message_content_getdate}>
                              <Text style={styles.each_message_content_getdate_text}>26/02/2021</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <View style={styles.each_message_space}>
                      <View style={styles.each_message_space_on_row}>
                        <Image source={UserCirle} style={{ width: 80, height: 80 }} />
                        <View style={styles.each_message_content}>
                          <View style={styles.each_message_content_info}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 16
                            }}>Nguyễn Văn C</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="family-restroom" size={20} color="#21b8ec" />
                                <Text style={{ color: '#787978', fontSize: 13, marginLeft: 5 }}>Phụ huynh</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>Bạn: </Text>
                                <Text>Hello World</Text>
                            </View>
                            
                          </View>
                          <View style={styles.each_message_content_getdate}>
                              <Text style={styles.each_message_content_getdate_text}>26/02/2021</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <View style={styles.each_message_space}>
                      <View style={styles.each_message_space_on_row}>
                        <Image source={UserCirle} style={{ width: 80, height: 80 }} />
                        <View style={styles.each_message_content}>
                          <View style={styles.each_message_content_info}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 16
                            }}>Nguyễn Văn C</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="family-restroom" size={20} color="#21b8ec" />
                                <Text style={{ color: '#787978', fontSize: 13, marginLeft: 5 }}>Phụ huynh</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>Bạn: </Text>
                                <Text>Hello World  </Text>
                            </View>
                            
                          </View>
                          <View style={styles.each_message_content_getdate}>
                              <Text style={styles.each_message_content_getdate_text}>26/02/2021</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <View style={styles.each_message_space}>
                      <View style={styles.each_message_space_on_row}>
                        <Image source={UserCirle} style={{ width: 80, height: 80 }} />
                        <View style={styles.each_message_content}>
                          <View style={styles.each_message_content_info}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 16
                            }}>Nguyễn Văn C</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="family-restroom" size={20} color="#21b8ec" />
                                <Text style={{ color: '#787978', fontSize: 13, marginLeft: 5 }}>Phụ huynh</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>Bạn: </Text>
                                <Text>Hello World  </Text>
                            </View>
                            
                          </View>
                          <View style={styles.each_message_content_getdate}>
                              <Text style={styles.each_message_content_getdate_text}>26/02/2021</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
          </View>
      </View>
    );
};
export default MessageListScreen;

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

    SearchHeader: {
        flexDirection: 'row',
        padding: 10,
        opacity: 0
    },

    body: { 
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 15,
    },

    messages_list: {
      flex: 1,
      borderRadius: 20,
    },

    
    each_message_space: {
      flex: 1,
    },

    each_message_space_on_row: {
      flexDirection: 'row',
      flex: 1,
      padding: 10,
      marginVertical: 5,
      borderRadius: 20,
      backgroundColor: '#fff'
    },

    each_message_content: {
      flexDirection: 'row',
      flex: 1,
      marginLeft: 10,
    },

    each_message_content_info: {
      flex: 2/3
    },

    each_message_content_getdate: {
      flex: 1/3,
      justifyContent: 'flex-end',
      alignItems: 'flex-end'
    },

    each_message_content_getdate_text: {
      fontSize: 11
    }
})