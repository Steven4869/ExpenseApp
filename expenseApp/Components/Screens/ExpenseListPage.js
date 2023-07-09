import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ExpenseListPage = () => {
  const [token, setToken] = useState('');
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get('http://192.168.29.225:3000/api/expenses', { headers });

      if (response.status === 200) {
        setExpenses(response.data);
      } else {
        console.error('Failed to fetch expenses:', response.status);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token]);

  const handleDeleteExpense = (expenseId) => {
    // Show confirmation alert before deleting the expense
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const headers = {
                Authorization: `Bearer ${token}`,
              };

              const response = await axios.delete(
                `http://192.168.29.225:3000/api/expenses/${expenseId}`,
                { headers },
              );

              if (response.status === 200) {
                // Remove the deleted expense from the list
                setExpenses((prevExpenses) =>
                  prevExpenses.filter((expense) => expense._id !== expenseId),
                );
              } else {
                console.error('Failed to delete expense:', response.status);
              }
            } catch (error) {
              console.error('Error deleting expense:', error);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense List</Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.category}>Category: {item.category.name}</Text>
            <Text style={styles.description}>Description: {item.description}</Text>
            <Text style={styles.date}>Date: {new Date(item.date).toDateString()}</Text>
            <Text style={styles.amount}>Amount: {item.amount}</Text>

            <TouchableOpacity onPress={() => handleDeleteExpense(item._id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  expenseItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 4,
    marginBottom: 20,
  },
  category: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    marginBottom: 5,
  },
  date: {
    marginBottom: 5,
  },
  amount: {
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExpenseListPage;
