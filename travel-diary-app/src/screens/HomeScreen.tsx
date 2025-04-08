import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { GlobalContext } from '../context/globalContext';

const HomeScreen = () => {
  const globalContext = useContext(GlobalContext);
  if (!globalContext) {
    throw new Error("GlobalContext must be used within a GlobalProvider");
  }


  return (
    <View>
      <Text>Cart Count: T</Text>
    </View>
  );
};

export default HomeScreen;
