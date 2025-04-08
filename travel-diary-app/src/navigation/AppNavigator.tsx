import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/HomeScreen';
import TravelEntry from '../screens/TravelEntryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerBackVisible: false }}
        />
        <Stack.Screen name="TravelEntry" component={TravelEntry} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
