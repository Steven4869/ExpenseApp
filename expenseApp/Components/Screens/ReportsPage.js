import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie, VictoryLegend } from 'victory-native';

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
    const categoryExpenses = expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      if (category.name in acc) {
        acc[category.name] += amount;
      } else {
        acc[category.name] = amount;
      }
      return acc;
    }, {});

    const data = Object.keys(categoryExpenses).map((category) => ({
      x: category,
      y: categoryExpenses[category],
    }));

    return (
      <View style={styles.chartContainer}>
        <View style={styles.pieChartContainer}>
          <VictoryPie
            data={data}
            colorScale={['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']}
            innerRadius={70}
          />
        </View>
        <View style={styles.legendContainer}>
          <VictoryLegend
            data={data.map((d) => ({
              name: `${d.x} ($${d.y})`,
            }))}
            colorScale={['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>

      {isLoading ? (
        <Text>Loading...</Text>
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
  },
  pieChartContainer: {
    marginBottom: 20,
  },
  legendContainer: {
    alignItems: 'center',
  },
});

export default ReportsPage;
