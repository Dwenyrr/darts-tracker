import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Etusivu from '../screens/Etusivu';
import { RootStackParamList } from './navigationTypes';
import KierrosValinta from '../screens/KierrosValinta';
import Kierrokset from '../screens/Kierrokset';
import KilpailijaLisays from '../screens/KilpailijaLisays';
import Tulokset from '../screens/Tulokset';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Etusivu">
                <Stack.Screen name="Etusivu" component={Etusivu} options={{title: 'Tikanheiton tulossovellus', headerLeft: () => null}} />
                <Stack.Screen name="KilpailijaLisays" component={KilpailijaLisays} options={{title: '', headerLeft: () => null}}/>
                <Stack.Screen name="KierrosValinta" component={KierrosValinta} options={{title: '', headerLeft: () => null}}/>
                <Stack.Screen name="Kierrokset" component={Kierrokset} options={{title: '', headerLeft: () => null}}/>
                <Stack.Screen name="Tulokset" component={Tulokset} options={{title: '', headerLeft: () => null}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MainNavigator;