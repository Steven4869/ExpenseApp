import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Svg, G, Circle, Path } from 'react-native-svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportsPage = () => {
  const [token, setToken] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token]);

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
        const expensesData = response.data;
        setExpenses(expensesData);
      } else {
        console.error('Failed to fetch expenses:', response.status);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPieChart = () => {
    // Check if the expenses array is empty
    if (expenses.length === 0) {
      return <Text>No expenses available.</Text>;
    }

    // Calculate the total amount spent on each category
    const categoryExpenses = expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      if (category in acc) {
        acc[category] += amount;
      } else {
        acc[category] = amount;
      }
      return acc;
    }, {});

    // Prepare data for the pie chart
    const chartData = Object.keys(categoryExpenses).map((category) => ({
      value: categoryExpenses[category],
      label: category,
    }));

    const totalValue = chartData.reduce((sum, data) => sum + data.value, 0);

    const colors = [
      '#E57373',
      '#FF9800',
      '#FFEB3B',
      '#4CAF50',
      '#2196F3',
      '#9C27B0',
      '#F44336',
      '#FFC107',
      '#8BC34A',
      '#03A9F4',
    ];

    let startAngle = 0;
    const chart = chartData.map((data, index) => {
      const percentage = (data.value / totalValue) * 100;
      const endAngle = startAngle + (percentage / 100) * Math.PI * 2;
      const largeArcFlag = percentage > 50 ? 1 : 0;

      const startX = Math.cos(startAngle);
      const startY = Math.sin(startAngle);
      const endX = Math.cos(endAngle);
      const endY = Math.sin(endAngle);

      const pathData = [
        `M ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `L 0 0`,
      ].join(' ');

      startAngle = endAngle;

      return (
        <Path
          key={data.label}
          d={pathData}
          fill={colors[index % colors.length]}
          stroke="white"
          strokeWidth="0.01"
        />
      );
    });

    return (
      <Svg width={300} height={300} viewBox="-1 -1 2 2">
        <G>{chart}</G>
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View style={styles.chartContainer}>{renderPieChart()}</View>
      )}
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
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReportsPage;
