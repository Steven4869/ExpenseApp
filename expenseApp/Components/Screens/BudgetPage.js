import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BudgetPage = () => {
  const [budget, setBudget] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [isBudgetAllocated, setIsBudgetAllocated] = useState(false);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const fetchBudgetData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
      setIsTokenLoading(false);
    };

    fetchBudgetData();
  }, []);

  useEffect(() => {
    if (!isTokenLoading) {
      fetchBudget();
      fetchExpenses()
    }
  }, [token, isTokenLoading]);
  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };
  
  const fetchBudget = async () => {
    try {
      console.log("Token: ",token);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.get('http://192.168.29.225:3000/api/budget', { headers });
  
      if (response.status === 200) {
        const budgetData = response.data;
        setAllocatedAmount(budgetData.amount);
        setRemainingBalance(budgetData.remainingBalance);
        setIsBudgetAllocated(true);
      } else if (response.status === 404) {
        setAllocatedAmount(0);
        setRemainingBalance(0);
        setIsBudgetAllocated(false);
      } else {
        throw new Error('Failed to fetch budget');
      }
    } catch (error) {
      console.error('Error fetching budget:', error.response);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchExpenses = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get('http://192.168.29.225:3000/api/expenses', { headers });

      if (response.status === 200) {
        const totalAmount = response.data.reduce((acc, expense) => acc + expense.amount, 0);
        setTotalExpenses(totalAmount);
      } else {
        console.error('Failed to fetch expenses:', response.status);
        console.log(response.status.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleCreateBudget = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post('http://192.168.29.225:3000/api/budget', { amount: budget }, { headers });

      if (response.status !== 201) {
        throw new Error('Failed to create budget');
      }

      const createdBudget = response.data;
      setAllocatedAmount(createdBudget.amount);
      setRemainingBalance(createdBudget.remainingBalance);
      setIsBudgetAllocated(true);
      setBudget('');
    } catch (error) {
      console.error('Error creating budget:', error.response?.data || error.message);
    }
  };

  const handleUpdateBudget = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.put('http://192.168.29.225:3000/api/budget', { amount: budget }, { headers });

      if (response.status !== 200) {
        throw new Error('Failed to update budget');
      }

      const updatedBudget = response.data;
      setAllocatedAmount(updatedBudget.amount);
      setRemainingBalance(updatedBudget.remainingBalance);
      setBudget('');
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const confirmUpdateBudget = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to update the budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: handleUpdateBudget },
      ],
      { cancelable: false }
    );
  };
  if (isTokenLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget</Text>

      {isBudgetAllocated ? (
        <>
          <Text style={styles.budgetText}>Allocated Amount: ${allocatedAmount}</Text>
          <Text style={styles.budgetText}>Remaining Balance: ${allocatedAmount - totalExpenses}</Text>
        </>
      ) : (
        <Text style={styles.budgetText}>Budget not yet created</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder={isBudgetAllocated ? 'Update Budget' : 'Create Budget'}
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
      />

      <Button
        title={isBudgetAllocated ? 'Update Budget' : 'Create Budget'}
        onPress={isBudgetAllocated ? confirmUpdateBudget : handleCreateBudget}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  budgetText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default BudgetPage;
