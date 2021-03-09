import React from 'react';
import {
    StyleSheet,
    Text, 
    View,
    Image,
    AsyncStorage,
    TouchableOpacity
} from 'react-native'

import Onboarding from 'react-native-onboarding-swiper';

import Image1 from '../../assets/images/welcome1.png';
import Image2 from '../../assets/images/welcome2.png';
import Image3 from '../../assets/images/lms-hero-facts.png';

const Dots = ({ selected }) => {
    let backgroundColor;
    backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';

    return (
        <View
            style={{
                width: 6,
                height: 6,
                marginHorizontal: 3,
                backgroundColor
            }}
        />
    )
}

const Skip = ({...props}) => (  
    <TouchableOpacity
        style={{ 
            paddingHorizontal: 20,   
            paddingVertical: 10,
        }}
        { ...props }
    >
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Bỏ qua</Text>
    </TouchableOpacity>
)


const Next = ({...props}) => (  
    <TouchableOpacity
        style={{ 
            paddingHorizontal: 20,   
            paddingVertical: 10,
        }}
        { ...props }
    >
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Tiếp tục</Text>
    </TouchableOpacity>
)

const Done = ({...props}) => (
    <TouchableOpacity
        style={{ 
            paddingHorizontal: 20,   
            paddingVertical: 10,
        }}
        { ...props }
    >
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Xong</Text>
    </TouchableOpacity>
)

const OnBoardingComponent = ({ navigation }) => {
    const setDone = () => { 
        AsyncStorage.setItem('alreadyLauched', 'Launched');
        navigation.replace('Login', {
            valueUserName: '',
            valueSelector: false
         });
    }
    return (
        <Onboarding
            SkipButtonComponent={Skip}
            NextButtonComponent={Next}
            DoneButtonComponent={Done}
            DotComponent={Dots}
            skipToPage={2}
            onDone={setDone}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Image source={Image1} style={{ width: "100%", height: 240 }} />,
                    title: 'Theo dõi',
                    subtitle: 'Theo',
                },
                {
                    backgroundColor: '#fff',
                    image: <Image source={Image2} />,
                    title: 'Onboarding 2',
                    subtitle: 'Done with React Native Onboarding Swiper',
                },
                {
                    backgroundColor: '#fff',
                    image: <Image source={Image3} style={{ width: "100%", height: 240 }} />,
                    title: 'Onboarding 3',
                    subtitle: 'Done with React Native Onboarding Swiper',
                },
            ]}
        
        />
    );
};

export default OnBoardingComponent;