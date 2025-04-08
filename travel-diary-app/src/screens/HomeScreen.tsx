import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Pressable, StyleSheet, Image, 
  RefreshControl, ActivityIndicator, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/globalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { requestNotificationPermissions } from '../components/LocalPushNotification';
import { v4 as uuidv4 } from 'uuid';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const [travelEntries, setTravelEntries] = useState<{ id: string; imageUri: string; address: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadEntries = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem('entries');
      if (savedEntries) {
        setTravelEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    await loadEntries();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
          Alert.alert('Permission Required', 'Camera permission is required to take pictures.');
          return;
        }

        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
          setErrorMsg('Permission to access location was denied.');
        }

        await requestNotificationPermissions();
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    };

    requestPermissions();
    fetchEntries();
  }, []);

  const removeEntry = async (id: string) => {
    try {
      const savedEntries = await AsyncStorage.getItem('entries');
      const entries = savedEntries ? JSON.parse(savedEntries) : [];

      const updatedEntries = entries.filter(entry => entry.id !== id);

      await AsyncStorage.setItem('entries', JSON.stringify(updatedEntries));

      setTravelEntries(updatedEntries);
    } catch (error) {
      console.error('Failed to remove entry:', error);
    }
  };

  const confirmRemove = (id: string) => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => removeEntry(id), style: 'destructive' },
      ]
    );
  };

  if (loading && travelEntries.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.dominant} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading your travel entries...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome to your{'\n'}Travel Diary</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Capture the adventures and misadventures{'\n'}that life gives you.</Text>

        {errorMsg ? <Text style={[styles.errorText, { color: 'red' }]}>{errorMsg}</Text> : null}

        <FlatList
          data={travelEntries}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.entryContainer}>
              <Image source={{ uri: item.imageUri }} style={styles.entryImage} />
              <Text style={{ color: theme.text }}>{item.address}</Text>

              {/* Remove Entry Button */}
              <Pressable
                onPress={() => confirmRemove(item.id)} 
                style={({ pressed }) => [
                  styles.removeButton,
                  { 
                    backgroundColor: theme.accent,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <Text style={[styles.removeButtonText, { color: theme.text }]}>Remove Entry</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.text }]}>No Entries yet.</Text>}
          style={styles.list}
        />
      </View>

      {/* Sticky footer with the "Add a Travel Entry" button */}
      <View style={[styles.footer, { backgroundColor: theme.cardBackground }]}>
        <Pressable
          onPress={() => navigation.navigate('TravelEntry')}
          style={({ pressed }) => [
            styles.addButton,
            { 
              backgroundColor: theme.accent,
              transform: [{ scale: pressed ? 0.97 : 1 }],
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={[styles.addButtonText, { color: theme.text }]}>Add a Travel Entry</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },
  list: {
    marginTop: 16,
    flex: 1,
  },
  entryContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  entryImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  addButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },
  removeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

