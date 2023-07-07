import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CategoryPage = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [token, setToken] = useState('');

  const fetchUserCategories = useCallback(async (token) => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://192.168.29.225:3000/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const userCategories = response.data;
        setCategories(userCategories);
      } else {
        console.error('Failed to fetch user categories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserCategories(token);
    }
  }, [token]);

  const updateCategory = async () => {
    try {
      const response = await axios.put(
        `http://192.168.29.225:3000/api/categories/${editingCategoryId}`,
        {
          name: newCategoryName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        const updatedCategory = response.data;
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === updatedCategory._id ? updatedCategory : category,
          ),
        );
        setIsModalVisible(false);
        setNewCategoryName('');
      } else {
        console.error('Failed to update category:', response.status);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(
        `http://192.168.29.225:3000/api/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== categoryId),
        );
      } else {
        console.error('Failed to delete category:', response.status);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const createCategory = async () => {
    navigation.navigate('CreateCategory');
  };

  const handleDeleteCategory = (categoryId) => {
    Alert.alert('Delete Category', 'Are you sure you want to delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => deleteCategory(categoryId) },
    ]);
  };

  const renderCategoryItem = ({ item }) => {
    const navigateToExpenseCreation = () => {
      navigation.navigate('Expense', {
        categoryId: item._id,
        categoryName: item.name,
        token: token,
      });
    };

    return (
      <TouchableOpacity onPress={navigateToExpenseCreation}>
        <View style={styles.categoryItem}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <View style={styles.categoryActions}>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setNewCategoryName(item.name);
                setEditingCategoryId(item._id);
              }}
            >
              <Ionicons name="pencil" size={20} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteCategory(item._id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyCategories = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />;
    } else {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories found.</Text>
          <Text style={styles.emptyText}>Create a category to get started.</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Category Name"
              value={newCategoryName}
              onChangeText={(text) => setNewCategoryName(text)}
            />
            <Button
              title={editingCategoryId ? 'Update' : 'Create'}
              onPress={editingCategoryId ? updateCategory : createCategory}
            />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {isLoading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          ListEmptyComponent={renderEmptyCategories}
          keyExtractor={(item) => item._id.toString()}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={createCategory}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
  },
  categoryActions: {
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryPage;
