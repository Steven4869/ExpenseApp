import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateCategoryPage = ({ navigation }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    }
  };

  const createCategory = async () => {
    try {
      const response = await axios.post(
        'http://192.168.29.225:3000/api/categories',
        {
          name: newCategoryName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        // Category created successfully
        navigation.navigate('Dashboard'); // Navigate back to the CategoryPage
      } else {
        console.error('Failed to create category:', response.status);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category Name:</Text>
      <TextInput
        style={styles.input}
        value={newCategoryName}
        onChangeText={(text) => setNewCategoryName(text)}
      />
      <Button title="Create Category" onPress={createCategory} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default CreateCategoryPage;
