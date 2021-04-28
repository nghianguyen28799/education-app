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
    Alert
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
const GOOGLE_MAPS_APIKEY = 'AIzaSyBHRMxpBKc25CMHY51h1jrnCCm6PjNs62s';

const MapScreen = ({ navigation }) => {
    const user = useSelector(state => state.userReducer.data)

    const [timer, setTimer] = React.useState()
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
    mapView = null
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
        realtimeGps()
    }, []);

    const realtimeGps = () => {
        setTimer(setInterval(handleData, 5000))
        async function handleData() {
            console.log('123');
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

    const origin = {latitude: 37.3318456, longitude: -122.0296002};
    const destination = {latitude: 37.771707, longitude: -122.4053769};

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
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
                    onPress={() => navigation.navigate("Message")}
                >
                    <View style={styles.RealtimeChatHeader}>
                        <AntDesign name="message1" size={22} color="#6495ED" />
                        <Text style={styles.RealtimeChatHeader_text}>9</Text>
                    </View>
                </TouchableOpacity>
            </View>  
                
            <View style={styles.body}> 
                <MapView initialRegion={mapRegion} style={styles.mapView}>
                    {
                        mapRegion
                        ?
                        <Marker 
                            coordinate={{
                                longitude: mapRegion.longitude,
                                latitude: mapRegion.latitude
                            }} 
                            title="Xe Bus" description="Vị trí hiện tại">
                            <Image source={BusLocation} style={{ width: 32, height: 32 }} />
                        </Marker>
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
    }
})