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
    Alert,
    Modal,
    Dimensions,
    FlatList
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import CalendarPicker from 'react-native-calendar-picker';

import RNPickerSelect from 'react-native-picker-select';

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import host from '../assets/host';
// icon store 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
// close icon

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const { width, height } = screen;

const ChooseStation = ({ navigation }) => {

    const user = useSelector(state => state.userReducer)
    
    const [ stationData, setStationData] = React.useState([]);
    const [ busData, setBusData] = React.useState([]);
    const [isModal, setModal] = React.useState(false);
    const [ stationInfo, setStationInfo] = React.useState([]);
    const [selectedStartDate, setSelectedStartDate] = React.useState(null);
    const [selectedEndDate, setSelectedEndDate] = React.useState(null);
    const [valueBus, setValueBus] = React.useState("");
    const [valueStation, setValueStation] = React.useState("");
    const [otherRequire, setOtherRequire] = React.useState(false);

    const getData = async () => {

        const selectedDate = await axios.post(`${host}/registerBus/show`, {id: user.data._id})
        if(Object.entries(selectedDate.data).length != 0) {
            setSelectedStartDate(new Date(selectedDate.data.startDate))
            setSelectedEndDate(new Date(selectedDate.data.endDate));
            setValueBus(selectedDate.data.supervisorId);
            setValueStation(selectedDate.data.station);
            const now = new Date().getDate()+"/"+new Date().getMonth();
            const getDate = (new Date(selectedDate.data.otherRequirement)).getDate()+"/"+(new Date(selectedDate.data.otherRequirement)).getMonth();
            if(now == getDate) {
                setOtherRequire(true)
            }
        }    
        const isStation = await axios.get(`${host}/station/show`);
        setStationInfo(isStation.data);
        isStation.data.map(value => {
            setStationData(stationData => [... stationData, { label: value.name, value: value._id }])
        })
        const isBus = await axios.post(`${host}/bus/show`);

        isBus.data.map(async (item) => {
            axios.post(`${host}/teacher/getUserById`, { id: item.supervisorId})
            .then(res => {           
                setBusData(previous => [... previous, {
                    label: `Xe số ${item.id} - ${item.licensePlate} - ${res.data.FullName}`,
                    value: res.data._id, 
                }])
            })
        })
    }
    // console.log(busData);
    React.useEffect(() => {
        getData();
    }, [])
   

    const goInfoPage = (id) => {
        if(id) {
            navigation.navigate("ViewProfileSupervisor", {id: id})
        } else {
            Alert.alert(
                "Thất bại",
                "Bạn chưa chọn đầy đủ thông tin",
                [
                  { text: "OK", style: "cancel" }
                ]
            );
        }
    }

    const goMessagePage = (id) => {
        if(id) {
            navigation.navigate("Message", {id: id, type: 2 })
        } else {
            Alert.alert(
                "Thất bại",
                "Không có thông tin giáo viên đưa đón",
                [
                  { text: "OK", style: "cancel" }
                ]
            );
        }
    }

    const confirmBookBus = async () => {
        const parentsId = user.data._id
        const data = {
            parentsId: parentsId,
            supervisorId: valueBus,
            station: valueStation,
            startDate: selectedStartDate,
            endDate: selectedEndDate
        };
        if(!parentsId || !valueBus || !valueStation || !selectedStartDate || !selectedEndDate) {
            Alert.alert(
                "Thất bại",
                "Không có thông tin giáo viên đưa đón",
                [
                  { text: "OK", style: "cancel" }
                ]
            );
        } else {
            await axios.post(`${host}/registerBus/create`, {data})
            await axios.post(`${host}/history/create`, { id: parentsId, event:"Attendence" })
            Alert.alert(
                "Thành công",
                "Bạn vừa cập nhật đăng ký bến thành công",
                [
                  { text: "OK", style: "cancel" }
                ]
            );
        }
        
    }

    const showItemModal = ({ item }) => (
        <View style={{ width: '100%', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Entypo name="arrow-long-right" size={24} color="#148F77" />
                <Text style={{ marginHorizontal: 5, fontSize: 13 }}>
                    {item.name}
                </Text>
                <View style={{ flex: 1, borderWidth: 0.5 }} />
            </View>
            <View>
                <Text>{item.address}</Text>
            </View>
        </View>
    )

    const onDateChange = (date, type) => {
        if (type === 'END_DATE') {
            setSelectedEndDate(date);
        } else {
            setSelectedStartDate(date);
            setSelectedEndDate(null);
        }
    }

    const onSendRequire = async () => {
        const response = await axios.post(`${host}/registerBus/sendRequire`, { id: user.data._id })
        const { success } = response.data;
        if(success) {
            setOtherRequire(true);
            Alert.alert(
                "Thành công",
                "Bạn đã gửi yêu cầu nhờ người thân đón hộ",
                [
                  { text: "OK", style: "cancel" }
                ]
            );
        } else {
            Alert.alert(
                "Thất bại",
                "Không có thông tin đưa đón hôm nay",
                [
                  { text: "OK", style: "cancel" }
                ]
            );
        }
    }

    const minDate = new Date(new Date().setDate(new Date().getDate())) // nextDay
    const maxDate = new Date(new Date().setDate(new Date().getDate() + 90))
    const startDate  =  selectedStartDate ? selectedStartDate.toString() : '';
    const endDate = selectedEndDate ? selectedEndDate.toString() : '';

    const GetBusSelector = () => (
        <RNPickerSelect
            value={valueBus}
            onValueChange={(value) => setValueBus(value)}
            items={busData.length > 0 ? busData : []}
        />
    )

    const GetStationSelector = () => {
        return (
            <View>
                <RNPickerSelect
                    value={valueStation}
                    onValueChange={(value) => setValueStation(value)}
                    items={stationData} 
                />
            </View>
        )
    }
    return ( 
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            {/* Start View Rating Modal */}
            <Modal 
                transparent={true}
                animationType="fade"
                visible={isModal}
                nRequestClose={() => setModal(false)}
            >
                <View
                    style={styles.containerModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={[styles.modal, {height: height*1/3+ 60}]}>
                            <View style={{ width: '100%', flexDirection: 'row' }}>
                                <Ionicons name="close-sharp" size={24} color="#839192" style={{ padding: 3, opacity: 0 } } />
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 15, marginBottom: 10, color: '#148F77', fontWeight: 'bold' }}>Địa chỉ những điểm đến</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setModal(false)}
                                >
                                    <Ionicons name="close-sharp" size={24} color="#839192" style={{ padding: 3}} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderWidth: 1, width: 40, marginBottom: 15 }}/>
                            <View style={{ flex: 1, width: "100%" }}>
                                <FlatList
                                    data={stationInfo}
                                    renderItem={showItemModal}
                                    keyExtractor={item => item._id}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End Rating Modal */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.goBackHeader}>
                        <FontAwesome5 name="angle-left" size={30} color="#6495ED"/>
                    </View>
                </TouchableOpacity>
                
                <View style={styles.titleHeader}>
                    <Text style={styles.titleHeader_text}>Chọn lịch</Text>
                </View>
                
                <TouchableOpacity>
                    <View style={styles.RealtimeChatHeader}>
                        <TouchableOpacity
                            onPress={() => setModal(true)}
                        >
                            <Text style={{ color: "#6495ED", fontWeight: 'bold', fontSize: 12, paddingVertical: 10 }}>Xem địa chỉ</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>  
                
            <View style={styles.body}>
                <View style={styles.containerCalendar}>
                    <CalendarPicker
                        startFromMonday={true}
                        allowRangeSelection={true}
                        minDate={minDate}
                        maxDate={maxDate}
                        weekdays={['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN']}
                        months={['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']}
                        previousTitle="Trước"
                        nextTitle="Kế tiếp"
                        todayBackgroundColor="#45555d"
                        selectedDayColor="#2980B9"
                        selectedDayTextColor="#FFFFFF"
                        onDateChange={onDateChange}
                    />
            
                </View>

                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <View style={{ width: "50%", flexDirection: 'row' }}>
                        <Text style={{ textAlign: 'left'}}>Từ ngày: </Text>
                        <Text style={{ color: "#2980B9", fontWeight: 'bold' }}>
                            {
                                startDate ?
                                new Date(startDate).getDate()+'/'+(new Date(startDate).getMonth()+1)+'/'+(new Date(startDate).getFullYear())
                                : "Chưa chọn"
                            }
                        </Text>
                    </View>
                    <View style={{ width: "50%", flexDirection: 'row', justifyContent: "flex-end" }}>
                        <Text style={{ textAlign: 'right'}}>Đến ngày: </Text>
                        <Text style={{ color: "#2980B9", fontWeight: 'bold' }}>
                            {
                                endDate ?
                                new Date(endDate).getDate()+'/'+(new Date(endDate).getMonth()+1)+'/'+(new Date(endDate).getFullYear())
                                : "Chưa chọn"
                            }
                        </Text>
                    </View>
                </View>
    
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Chọn bến: </Text>
                        <View style={styles.select_station_border}>
                            <GetStationSelector />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Chọn xe: </Text>
                        <View style={styles.select_station_border}>
                            <GetBusSelector />
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: "50%" }}>
                        <TouchableOpacity
                            style={{ width: "95%" }}
                            onPress={() => goInfoPage(valueBus)}
                        >
                            <View style={{ padding: 10, backgroundColor: "#45555d", justifyContent: 'center', alignItems: "center" }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 12, fontWeight: 'bold', color: "#fff" }}>Xem hồ sơ</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: "50%", alignItems: "flex-end"}}>
                        <TouchableOpacity
                            style={{ width: "95%" }}
                            onPress={() => goMessagePage(valueBus)}
                        >
                            <View style={{ padding: 10, backgroundColor: "#45555d", justifyContent: 'center', alignItems: "center" }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 12, fontWeight: 'bold', color: "#fff" }}>Liên hệ</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                
                {
                    !otherRequire
                    ?
                    <TouchableOpacity
                        onPress={onSendRequire}
                    >
                        <View style={{ padding: 10, backgroundColor: "#45555d", marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>Gửi yêu cầu nhờ người đón hộ</Text>
                        </View>
                    </TouchableOpacity>  
                    :
                    <View style={{ padding: 10, backgroundColor: "#9e9e9e", marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>Bạn đã gửi yêu cầu nhờ người đón hộ</Text>
                    </View>
                }
                 

                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 15 }}>
                    <TouchableOpacity 
                        onPress={confirmBookBus}
                    >
                        <View style={{ padding: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: "#2980B9" }}>
                            <Text style={{ color: "#fff", fontWeight: 'bold' }}>Cập nhật</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
           
    );
};

export default ChooseStation;

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
    },    

    containerCalendar: {
        backgroundColor: "#fff",
        // paddingVertical: 20,
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
        marginRight: 35
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
        alignItems: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
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
        zIndex: 9999,
    },

    modalContainer: {
        width: width, 
        height: height,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0, 0.2)'
    },

    modal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: width - 30,
        paddingHorizontal: 20,
        zIndex: 99,
        alignItems: 'center',
        padding: 15,
    },

    modalInput: {
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor: '#A6ACAF', 
        width: '100%', 
        paddingHorizontal: 10,
        marginBottom: 10
    },

    modalButton: {
        width: '100%',
        backgroundColor: "#239B56",
        alignItems: 'center',
        paddingVertical: 12
    }
})