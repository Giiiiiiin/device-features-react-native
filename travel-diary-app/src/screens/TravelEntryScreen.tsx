import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/globalContext';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const TravelEntryScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    };

    requestLocationPermission();
  }, []);

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to take pictures.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1, 
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); 
      setAddress(null);
      fetchLocation(result.assets[0].uri); 
    }
  };

  const fetchLocation = async (uri: string) => {
    if (!hasLocationPermission) {
      alert('Location permission is required.');
      return;
    }

    setIsLoading(true);

    try {
      const { coords } = await Location.getCurrentPositionAsync();
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      const { city, country } = reverseGeocode[0];
      setAddress(`${city}, ${country}`);
    } catch (error) {
      alert('Failed to fetch address');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntry = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'New entry saved!',
      body: 'Your new travel entry has been successfully saved.',
    },
    trigger: null,
  });

  try {
    const savedEntries = await AsyncStorage.getItem('entries');
    const entries = savedEntries ? JSON.parse(savedEntries) : [];

    const newEntry = {
      id: uuid.v4(), 
      imageUri,
      address,
    };
    entries.push(newEntry);

    await AsyncStorage.setItem('entries', JSON.stringify(entries));

    setImageUri(null);
    setAddress(null);
    alert('Travel entry saved successfully!');

    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  } catch (error) {
    console.error('Failed to save entry:', error);
  }
};


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Add a New Travel Entry</Text>

      {/* Take Entry Picture Button */}
      <Pressable
        onPress={takePicture}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: imageUri ? theme.background : theme.accent,
            borderColor: imageUri ? theme.accent : 'transparent',
            borderWidth: imageUri ? 2 : 0,
            transform: [{ scale: pressed ? 0.97 : 1 }],
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {imageUri ? 'Retake Entry Picture' : 'Take Entry Picture'}
        </Text>
      </Pressable>

      {/* Show the image if taken */}
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      {/* Loading Spinner when getting address */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Fetching address...</Text>
        </View>
      )}

      {/* Display Address once fetched */}
      {address && !isLoading && (
        <Text style={[styles.addressText, { color: theme.text }]}>
          Location: {address}
        </Text>
      )}

      {/* Save Entry Button */}
      <Pressable
        onPress={saveEntry}
        style={({ pressed }) => [
          styles.button,
          { 
            backgroundColor: theme.accent, 
            opacity: !imageUri || !address ? 0.5 : 1, 
            transform: [{ scale: pressed ? 0.97 : 1 }]
          },
        ]}
        disabled={!imageUri || !address}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Save Entry</Text>
      </Pressable>
    </View>
  );
};

export default TravelEntryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
  },
  addressText: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
