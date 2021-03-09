import React from 'react';
import { View } from 'react-native'
import OnBoarding from '../components/Welcome/OnBoarding'

const WelcomeScreen = ({navigation}) => {
    return (
        <View style={{ flex: 1 }}>
            <OnBoarding navigation={navigation} />
        </View>
        
    );
};

export default WelcomeScreen;