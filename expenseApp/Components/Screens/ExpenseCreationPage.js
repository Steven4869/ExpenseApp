import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const ExpenseCreationPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date());  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const { categoryId, categoryName, token } = route.params || {};
  const handleSaveExpense = async () => {
    try {
      const expenseData = {
        category: categoryId,
        description,
        amount,
        date: expenseDate.getTime(),
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(`http://192.168.29.225:3000/api/expenses`, expenseData, { headers });

      if (response.status === 201) {
        navigation.replace('ExpenseList', { token });
      } else {
        console.error('Failed to create expense:', response.status);
      }
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (event, date) => {
    if (date) {
      setExpenseDate(date);
    }
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Creation</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={categoryName}
          editable={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Expense Description"
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
          <Text style={styles.datePickerButtonText}>
          {new Date(expenseDate).toDateString()}
          </Text>
        </TouchableOpacity>

        {isDatePickerVisible && (
          <DateTimePicker
            value={expenseDate}
            mode="date"
            display="default"
            onChange={handleDateConfirm}
          />
        )}

        <Button title="Save Expense" onPress={handleSaveExpense} />
      </View>
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
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 4,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: '#0066cc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  datePickerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ExpenseCreationPage;
