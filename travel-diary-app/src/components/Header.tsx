import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  const { isDarkMode, theme, toggleDarkMode } = useGlobalContext();
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  return (
    <View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
