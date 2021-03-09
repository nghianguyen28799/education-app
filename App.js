import * as React from 'react';
// import { View, Text } from 'react-native';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';

import StackNavigator from './src/navigations/Navigator'
import configureStore from './src/store';

const store = configureStore();

const HandleRedux = () => 
    <Provider store={store}>
       <StackNavigator />
    </Provider>

AppRegistry.registerComponent(appName, () => HandleRedux);

export default HandleRedux