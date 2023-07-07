import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-svg-charts';

const ReportsPage = () => {
  const [token, setToken] = useState('');
  const [expenseData, setExpenseData] = useState([]);

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

  const fetchExpenseData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get('http://192.168.29.225:3000/api/expense-data', { headers });

      if (response.status === 200) {
        setExpenseData(response.data);
      } else {
        console.error('Failed to fetch expense data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching expense data:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchExpenseData();
    }
  }, [token]);

  const renderPieChart = () => {
    const data = expenseData.map((item) => ({
      value: item.amount,
      label: item.category,
      key: item.category,
    }));

    return (
      <PieChart
        style={styles.chart}
        data={data}
        innerRadius="40%"
        outerRadius="80%"
        labelRadius={100}
        animate={true}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      {renderPieChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chart: {
    height: 300,
    marginBottom: 20,
  },
});

export default ReportsPage;
