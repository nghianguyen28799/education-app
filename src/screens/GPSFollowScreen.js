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
    FlatList
} from 'react-native'
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps'; 
import MapViewDirections from 'react-native-maps-directions';
import { LinearGradient } from 'expo-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';


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
// close icon
const GOOGLE_MAPS_APIKEY = '…';

const GpsFollowScreen = ({ navigation }) => {
    const user = useSelector(state => state.userReducer)

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
      }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.goBackHeader}>
                        <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                    </View>
                </TouchableOpacity>
                
                <View style={styles.titleHeader}>
                    <Text style={styles.titleHeader_text}>Theo dõi GPS</Text>
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
                            title="Tôi" description="this is description">
                            <MaterialCommunityIcons name="bus-school" size={22} color="black" />
                            {/* <View style={styles.circle}>
                                <View style={styles.stroke} />
                                <View style={styles.core} />
                            </View> */}
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
                            <FontAwesome5 name="map-marker-alt" size={26} color="red" />
                        </Marker>
                        : null
                    }

                    {/* {
                        (schoolRegion && mapRegion)
                        ?
                        <>
                        <MapViewDirections
                            origin={{
                                longitude: mapRegion.longitude,
                                latitude: mapRegion.latitude
                            }}
                            // waypoints={ (this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1): null}
                        
                            destination={schoolRegion.location}
                            // apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={3}
                            strokeColor="hotpink"
                            optimizeWaypoints={true}
                            onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                
                            mapView.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                right: (width / 20),
                                bottom: (height / 20),
                                left: (width / 20),
                                top: (height / 20),
                                }
                            });
                            }}
                            onError={(errorMessage) => {
                            // console.log('GOT AN ERROR');
                            }}
                        
                        />
                        {console.log(schoolRegion)}
                        </>
                        : null
                    } */}
                </MapView>
            </View>
        </View>
    )
}

export default GpsFollowScreen;

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