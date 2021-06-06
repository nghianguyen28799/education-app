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
    FlatList,
    Alert,
    Modal,
    Dimensions
} from 'react-native'
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps'; 
import MapViewDirections from 'react-native-maps-directions';
import { LinearGradient } from 'expo-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';
import BusLocation from '../assets/icons/bus-stop.png'
import BusStopIcon from '../assets/icons/signboard.png'
import SchoolIcon from '../assets/icons/school.png'



import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import host from '../assets/host';
// icon store   

import { FontAwesome5 } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { database } from '../assets/host/firebase'
// close icon

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const GOOGLE_MAPS_APIKEY = '';
// const GOOGLE_MAPS_APIKEY = 'AIzaSyBLnQ6KLSCfkgMFDgbw1_jMzlo4fhXILss';

const MapScreen = ({ navigation }) => {
    const user = useSelector(state => state.userReducer.data)

    const [timer, setTimer] = React.useState()
    const [station, setStation] = React.useState([]);
    const [isModalVisible, setModalVisible] = React.useState(false);
    const [location, setLocation] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [mapRegion, setMapRegion] = React.useState(null);
    const [schoolRegion, setSchoolRegion] = React.useState({
        title: "Trường học",
        // description:: "Địa điểm đến"
        location: {
            latitude: 10.033882853267741, 
            longitude:  105.77985570188193
        },
        icon: 'school'
    });

    const [desDatabase, setDesDatabase] = React.useState({})
    const [stationRegion, setStationRegion] = React.useState([]);

    React.useEffect(() => {
        (async () => {
          let { status } = await Location.requestPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          setMapRegion({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
            longitudeDelta: 0.0922,
            latitudeDelta: 0.0421
          });
        })();
        realtimeGps();
        getDestination();
        getStation();
    }, []);

    const getStation = async () => {
        const isStation = await axios.get(`${host}/station/show`)
        setStation(isStation.data);
    }

    const checkDestination = async () => {
        var data = {};
        await database.collection("destination").where('id', '==',user._id)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data = doc.data()
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        })    
        return data
    }

    const getDestination = async () => {
        if(Object.entries(await checkDestination()).length > 0) {
            if((await checkDestination()).idDes == 'truonghoc') {
                setDesDatabase({
                    id: 'truonghoc',
                    name: "Trường học",
                    gps: {
                        latitude: 10.033882853267741, 
                        longitude:  105.77985570188193
                    },
                })
            } else {
                const idDes = (await checkDestination()).idDes;
                const isStation = await axios.get(`${host}/station/show`)
                const data = isStation.data.filter((item) => {
                    return item._id == idDes
                })
                setDesDatabase(data[0])
            }
        }
    }

    const realtimeGps = () => {
        setTimer(setInterval(handleData, 5000))
        async function handleData() {
            console.log('test');
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setMapRegion({
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                longitudeDelta: 0.0922,
                latitudeDelta: 0.0421
              });
        }
    }

    React.useEffect(() => {
        (
            async () => {
                const isStation = await axios.get(`${host}/station/show`)
                setStationRegion(isStation.data);
            }
        )()
    },[])
    
    const changeModalVisiblity = (bool) => {
        setModalVisible(bool);
    }

    const changeDestination = async (data) => {
        if(Object.entries(desDatabase).length == 0) {
            database.collection('destination').add({
                id: user._id,
                idDes: data._id,
                name: data.name
            })
        } else {
            var uid = "";
            await database.collection("destination").where('id', '==',user._id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    uid = doc.id
                })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            })
            database.collection('destination').doc(uid).update({
                id: user._id,
                idDes: data._id,
                name: data.name
            })
            
        }
        setDesDatabase(data)
    }

    const deleteDestination = async () => {
        var uid = "";
        await database.collection("destination").where('id', '==',user._id)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                uid = doc.id
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        })
        database.collection('destination').doc(uid).delete()
        setDesDatabase({})
    }

    const ModalPicker = () => {
        return (
            <TouchableOpacity
                onPress={() => changeModalVisiblity(false)}
                style={styles.containerModal}
            >
                <View style={styles.modal}>
                    <Text
                        style={{ marginTop: 15, marginBottom: 5, fontSize: 20, }}
                    >Chọn điểm đến</Text>
                    {
                        station 
                        && 
                        station.map(item => (
                            <TouchableOpacity
                                key={item._id}
                                style={item._id == desDatabase._id ? styles.modal_button_active : styles.modal_button}
                                onPress={async () => {
                                        changeDestination(item)
                                        changeModalVisiblity(false)
                                    }
                                }
                            >
                                <Text>{ item.name }</Text>
                            </TouchableOpacity>
                        ))
                    }
                    {/* Start Truong hoc */}
                    <TouchableOpacity
                        style={desDatabase.id == 'truonghoc' ? styles.modal_button_active : styles.modal_button}
                        onPress={async () => {
                            changeDestination(
                                {
                                    _id: "truonghoc",
                                    name: "Trường học",
                                },
                                changeModalVisiblity(false)
                            )
                            setDesDatabase({
                                _id: 'truonghoc',
                                name: "Trường học",
                                gps: {
                                    latitude: 10.033882853267741, 
                                    longitude:  105.77985570188193
                                },
                            });
                            changeModalVisiblity(false)
                        }}
                    >
                        <Text>Trường học</Text>
                    </TouchableOpacity>
                    {/* End Truong hoc */}

                    {/* Start Delete */}
                    <TouchableOpacity
                        style={styles.modal_button}
                        onPress={() => {
                            deleteDestination()
                            changeModalVisiblity(false)
                        }}
                    >
                        <Text>Kết Thúc</Text>
                    </TouchableOpacity>
                    {/* End Delete */}

                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Modal 
                transparent={true}
                animationType="fade"
                visible={isModalVisible}
                nRequestClose={() => changeModalVisiblity(false)}
            >
                <ModalPicker />
            </Modal>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    navigation.goBack() 
                    clearInterval(timer)
                }}>
                    <View style={styles.goBackHeader}>
                        <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                    </View>
                </TouchableOpacity>
                
                <View style={styles.titleHeader}>
                    <Text style={styles.titleHeader_text}>Bản đồ</Text>
                </View>
                
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                >
                    <View style={styles.RealtimeChatHeader}>
                        <MaterialIcons name="update" size={30} color="#6495ED" />
                    </View>
                </TouchableOpacity>
            </View>  
                
            <View style={styles.body}> 
                <MapView 
                    initialRegion={mapRegion} 
                    style={styles.mapView}
                >
                    {
                        mapRegion
                        ?
                        <>
                            <Marker 
                                coordinate={mapRegion} 
                                title="Xe Bus" description="Vị trí hiện tại">
                                <Image source={BusLocation} style={{ width: 32, height: 32 }} />
                            </Marker>
                            {/* {
                                <MapViewDirections
                                    origin={mapRegion}
                                    destination={Object.entries(desDatabase).length !== 0 ? desDatabase.gps : null}
                                    apikey={GOOGLE_MAPS_APIKEY}
                                    strokeWidth={3}
                                    strokeColor="red"
                                    optimizeWaypoints={true}
                                />
                            } */}
                        </>
                        
                        : null
                    }
                    {/* school */}
                    {
                        schoolRegion
                        ?
                        <Marker 
                            coordinate={schoolRegion.location} 
                            title={schoolRegion.title}
                        >
                            <Image source={SchoolIcon} style={{ width: 32, height: 32 }} />
                        </Marker>
                        : null
                    }
                    {
                        stationRegion
                        ?
                        stationRegion.map(item => (
                            <Marker 
                                key={item._id}
                                coordinate={{
                                    longitude: item.gps.longitude,
                                    latitude: item.gps.latitude
                                }} 
                                title={item.name} description={item.address}
                            >
                                <Image source={BusStopIcon} style={{ width: 32, height: 32 }} />
                            </Marker>
                        ))
                        : null
                    }
                </MapView>
            </View>
        </View>
    )
    
}

export default MapScreen;

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
        marginRight: 20
    },

    titleHeader: {
        flex: 1,
        // backgroundColor: '#000',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'
    },

    titleHeader_text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2980B9',    
    },

    RealtimeChatHeader: {
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
        // padding: 10,
        // borderWidth: 1,
    },

    mapView: {
        width: '100%',
        height: '100%',
    },

    circle: {
        width: 26,
        height: 26,
        borderRadius: 50
    },
    stroke: {
        backgroundColor: "#ffffff",
        borderRadius: 50,
        width: "100%",
        height: "100%",
        zIndex: 1
    },
    core: {
        backgroundColor: "red",
        width: 24,
        position: "absolute",
        top: 1,
        left: 1,
        right: 1,
        bottom: 1,
        height: 24,
        borderRadius: 50,
        zIndex: 2
    },

    containerModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        position: 'absolute',
        width: width, 
        height: height
    },

    modal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: width - 30,
        paddingHorizontal: 20,
        zIndex: 99
    },
    
    modal_button: {
        width: '100%',
        paddingVertical: 15,
        justifyContent: 'center',
    },

    modal_button_active: {
        width: '100%',
        paddingVertical: 15,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    }
})