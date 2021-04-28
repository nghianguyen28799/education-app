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
    Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import host from '../assets/host';
// icon store 
import { FontAwesome5 } from '@expo/vector-icons'; 

import { FlatList } from 'react-native-gesture-handler';
// close icon
const ChooseStation = ({ navigation }) => {

    const user = useSelector(state => state.userReducer)
    
    const [dateList, setDateList] = React.useState([]);
    const [ dateSelected, setDateSelected ] = React.useState([]);
    const [ stationData, setStationData] = React.useState([]);
    const [ stationSelected, setStationSelected ] = React.useState([]);

    const getData = async () => {
        for (let i = 0; i <= 7; i++) {
            const date = new Date()
            date.setDate(date.getDate() + i)
            setDateList(dateList => [...dateList, { id: `date${i}`, date: date }])
        }
        const today = new Date()
        const id = user.data._id
        const dataList = await axios.post(`${host}/registerBus/show`, {id})
        if(dataList.data.listBookStation){
            dataList.data.listBookStation.map(value => {
                if(today.getDate() <= (new Date(value.date)).getDate() && today.getMonth() <= (new Date(value.date)).getMonth()) {
                    setDateSelected(dateSelected => [...dateSelected, new Date(value.date).getDate()+"/"+ new Date(value.date).getMonth()])
                    setStationSelected(stationSelected  => [...stationSelected, {
                        date: new Date(value.date),
                        station: value.station
                    }])
                }
            })    
        }
        const isStation = await axios.post(`${host}/station/show`);
        isStation.data.map(value => {
            setStationData(stationData => [... stationData, { label: value.name, value: value._id }])
        })
    }

    React.useEffect(() => {
        getData();
    }, [])

    const addDataSelected = (item) => {
        setDateSelected(dateSelected => [...dateSelected, item.date.getDate()+"/"+item.date.getMonth() ])
        setStationSelected(stationSelected => [...stationSelected, 
            {
                date: item.date,
                station: "",
            }
        ])
    }

    const removeDataSelected = (item) => {
        const newData = dateSelected.filter(date => {
            return date !== item.date.getDate()+"/"+item.date.getMonth()
        })
        setDateSelected(newData)  

        const newStation = stationSelected.filter(value => {
            return value.date.getDate() !== item.date.getDate()
        })
        setStationSelected(newStation)
    }

    const renderItem = ({ item }) => (
        (new Date(item.date)).getDate() === new Date().getDate()
        ?
        <View style={{
            width: 100,
            padding: 5,
            marginHorizontal: 5,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#9e9e9e',
            borderRadius: 10
        }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>
                { item.date.getDate() + '-' + (Number(item.date.getMonth())+1) }    
            </Text>
            <Text style={{ fontSize: 12, color: '#fff' }}>
                {
                    item.date.getDay() === 1
                    ? "Thứ 2"
                    : item.date.getDay() === 2
                    ? "Thứ 3"
                    : item.date.getDay() === 3
                    ? "Thứ 4"
                    : item.date.getDay() === 4
                    ? "Thứ 5"
                    : item.date.getDay() === 5
                    ? "Thứ 6"
                    : null
                }
            </Text>
        </View>
        : (item.date.getDay() === 0 || item.date.getDay() === 6) 
        ?
        <View style={[styles.each_date, {borderColor: '#B3B6B7'}]}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#B3B6B7' }}>
                { item.date.getDate() + '-' + (Number(item.date.getMonth())+1) }    
            </Text>
            <Text style={{ fontSize: 12, color: '#B3B6B7' }}>
                {
                    item.date.getDay() === 0
                    ? "Chủ nhật"
                    : item.date.getDay() === 6
                    ? "Thứ 7"
                    : null
                }
            </Text>
        </View>
        : dateSelected.indexOf(item.date.getDate()+"/"+item.date.getMonth()) === -1
        ? <TouchableOpacity
                onPress={() => {
                    addDataSelected(item)
                }}
            >
                <View style={[styles.each_date]}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#000' }}>
                        { item.date.getDate() + '-' + (Number(item.date.getMonth())+1) }    
                    </Text>
                    <Text style={{ fontSize: 12, color: '#000' }}>
                        {
                            item.date.getDay() === 1
                            ? "Thứ 2"
                            : item.date.getDay() === 2
                            ? "Thứ 3"
                            : item.date.getDay() === 3
                            ? "Thứ 4"
                            : item.date.getDay() === 4
                            ? "Thứ 5"
                            : item.date.getDay() === 5
                            ? "Thứ 6"
                            : null
                        }
                    </Text>
                </View>
            </TouchableOpacity>
        : 
        <TouchableOpacity
            onPress={() => {
                removeDataSelected(item)
            }}
        >
            <View style={[styles.each_date, { backgroundColor: '#2980B9'}]}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>
                    { item.date.getDate() + '-' + (Number(item.date.getMonth())+1) }    
                </Text>
                <Text style={{ fontSize: 12, color: '#fff' }}>
                    {
                        item.date.getDay() === 1
                        ? "Thứ 2"
                        : item.date.getDay() === 2
                        ? "Thứ 3"
                        : item.date.getDay() === 3
                        ? "Thứ 4"
                        : item.date.getDay() === 4
                        ? "Thứ 5"
                        : item.date.getDay() === 5
                        ? "Thứ 6"
                        : null
                    }
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderChooseStation = ({ item }) => (
    <>
        {
            (new Date(item.date)).getDate() === new Date().getDate()
            ?
            <View style={styles.get_station_on_row}>
                <Text style={{ marginRight: 15 }}>
                    {
                        item.date.getDay() === 1
                        ? "Thứ 2"
                        : item.date.getDay() === 2
                        ? "Thứ 3"
                        : item.date.getDay() === 3
                        ? "Thứ 4"
                        : item.date.getDay() === 4
                        ? "Thứ 5"
                        : item.date.getDay() === 5
                        ? "Thứ 6"
                        : null
                    }
                    {" " + item.date.getDate()}-{item.date.getMonth()+1}:
                </Text>
                <View style={styles.select_station_border}>
                    <RNPickerSelect
                        onValueChange={(value) => onChangeStation(item, value)}
                        value={item.station}
                        disabled={true}
                        items={stationData !== [] ? stationData : []}
                    />
                </View>
            </View>
            :
            <View style={styles.get_station_on_row}>
                <Text style={{ marginRight: 15 }}>
                    {
                        item.date.getDay() === 1
                        ? "Thứ 2"
                        : item.date.getDay() === 2
                        ? "Thứ 3"
                        : item.date.getDay() === 3
                        ? "Thứ 4"
                        : item.date.getDay() === 4
                        ? "Thứ 5"
                        : item.date.getDay() === 5
                        ? "Thứ 6"
                        : null
                    }
                    {" " + item.date.getDate()}-{item.date.getMonth()+1}:
                </Text>
                <View style={styles.select_station_border}>
                    <RNPickerSelect
                        onValueChange={(value) => onChangeStation(item, value)}
                        value={item.station}
                        items={stationData !== [] ? stationData : []}
                    />
                </View>
            </View>
        }
    </>
    
    )

    const onChangeStation = async (item, value) => {
        const newData = [];
        const supervisorId = await axios.post(`${host}/teacher/getSupervisorInfo`)
        stationSelected.map(data => {
            if(data === item) {
                const setStation = {
                    supervisorId: supervisorId.data,
                    date: data.date,
                    station: value,
                    getOnBusFromHouse: false,
                    getOutBusFromHouse: false,
                    getOnBusFromSchool: false,
                    getOutBusFromSchool: false,
                }
                newData.push(setStation)
            }
            else {
                newData.push(data)
            }
        })
        setStationSelected(newData)
    }

    const confirmBookBus = async () => {
        const id = user.data._id
        const listBookRegister = stationSelected;
        await axios.post(`${host}/registerBus/create`, {id, listBookRegister})
        await axios.post(`${host}/history/create`, { id: user.data._id, event:"Attendence" })
        Alert.alert("Cập nhật thành công!")
    }

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
                        <Text style={styles.titleHeader_text}>Đăng ký bến</Text>
                    </View>
                    
                    <TouchableOpacity>
                        <View style={styles.RealtimeChatHeader}>
                            <TouchableOpacity
                                onPress={confirmBookBus}
                            >
                                <Text style={{ color: "#6495ED", fontWeight: 'bold', fontSize: 12, paddingVertical: 10 }}>Cập nhật</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>  
                 
                <View style={styles.body}>
                    <View style={styles.title_content}>
                        <Text style={styles.title_content_name}>Ghi Danh</Text>
                    </View>
                    <View style={styles.get_date_content}>
                        {
                            dateList
                            ?
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={dateList}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />
                            :<></>
                        } 
                    </View>
                    <View style={styles.title_content}>
                        <Text style={styles.title_content_name}>Chọn Bến</Text>
                    </View>

                    <View style={styles.get_station_border}>
                        {
                            dateSelected !== []
                            ?
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                data={stationSelected}
                                renderItem={renderChooseStation}
                                keyExtractor={item => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}
                            />
                            : 
                            <Text style={{ color: '#000' }}>Bạn chưa ghi danh đăng ký bến xe </Text>
                        } 
                    </View>
                </View>
            </View>
    );
};

export default ChooseStation;

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
        paddingLeft: 15,       
    },

    RealtimeChatHeader: {
        padding: 10,
        // opacity: 0
    },

    body: { 
        flex: 1,
        padding: 10,
    },

    title_content: {
        // flex: 1,
        // borderWidth: 1,
        marginVertical: 10,
        alignItems: 'flex-start'
    },

    title_content_name: {
        fontSize: 18,
        fontWeight: 'bold',
        // borderBottomWidth: 1,
    },

    get_date_content: {
        // flex: 1,
        marginVertical: 15,
        flexDirection: 'row'
    },

    each_date: {
        width: 100,
        borderWidth: 1,
        padding: 5,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },

    get_station_border: {
        flex: 1,
        flexDirection: 'row',
        // borderWidth: 1,
        // marginVertical: 10,
        // alignItems: 'center'
    },

    get_station_on_row: {
        // flex: 1,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        // borderWidth: 1,
    },

    select_station_border: {
        flex: 1, 
        // borderWidth: 1,
    }
})