import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LandingPage = () => {
  const navigation = useNavigation();

  const handleGetStarted = async () => {
    try {
      // Check if the user is already logged in by retrieving the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      if (token) {
        // If the token exists, navigate to the profile page
        navigation.replace('Dashboard');
      } else {
        // Otherwise, navigate to the login page
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log('Failed to get token', error);
      // Handle error while getting the token
      Alert.alert('Error', 'Failed to get token');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.content}>
        <Text style={styles.title}>Expense Tracker App</Text>
        <Text style={styles.description}>Track and manage your expenses effortlessly</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0066cc', // Dark Blue
    opacity: 0.8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // White
  },
  description: {
    fontSize: 16,
    color: '#fff', // White
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff', // White
    borderRadius: 25,
  },
  buttonText: {
    color: '#0066cc', // Dark Blue
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LandingPage;
