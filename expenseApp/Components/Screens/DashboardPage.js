import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const DrawerButton = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.drawerButton} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#888" />
      <Text style={styles.drawerLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const DashboardPage = () => {
  const navigation = useNavigation();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [token, setToken] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [allocatedAmount, setAllocatedAmount] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);

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
  // Function to fetch the expense list
  const fetchExpenses = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get('http://192.168.29.225:3000/api/expenses', { headers });

      if (response.status === 200) {
        setExpenses(response.data);
        fetchExpenses();
        const totalAmount = response.data.reduce((acc, expense) => acc + expense.amount, 0);
        setTotalExpenses(totalAmount);
        fetchBudget();
      } else {
        console.error('Failed to fetch expenses:', response.status);
        console.log(response.status.data);
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
  const fetchBudget = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.get('http://192.168.29.225:3000/api/budget', { headers });
  
      if (response.status === 200) {
        const budgetData = response.data;
        setAllocatedAmount(budgetData.amount);
        setRemainingBalance(budgetData.amount - totalExpenses);
      } else if (response.status === 404) {
        setAllocatedAmount(0);
        setRemainingBalance(0);
      } else {
        throw new Error('Failed to fetch budget');
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };
  
  useEffect(() => {
    // Update latestTransactions with expenses data
    const transactionsByCategory = expenses.reduce((acc, expense) => {
      const { _id, category, amount } = expense;
      const existingTransaction = acc.find(
        (transaction) => transaction.category._id === category._id,
      );

      if (existingTransaction) {
        existingTransaction.amount += amount;
      } else {
        acc.push({
          id: _id,
          category,
          amount,
        });
      }

      return acc;
    }, []);

    const formattedTransactions = transactionsByCategory.slice(0, 4).map((transaction) => ({
      id: transaction.id,
      description: transaction.category.name,
      amount: transaction.amount,
    }));

    setLatestTransactions(formattedTransactions);
  }, [expenses]);

  // Render item for the latest transactions list
  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text style={styles.transactionAmount}>{`$${item.amount}`}</Text>
    </View>
  );

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleExpense = () => {
    navigation.navigate('Category');
  };
  const handleExpenseList = () => {
    navigation.navigate('ExpenseList');
  };
  const handleBudget = () => {
    navigation.navigate('Budget');
  };
  const handleReports = () => {
    navigation.navigate('Reports');
  };
  const handleProfile = () => {
    navigation.navigate('Profile');
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Failed to logout', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Expense Tracker</Text>
          <TouchableOpacity onPress={toggleDrawer}>
            <Ionicons name="menu" size={30} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Total Expenses</Text>
          <Text style={styles.summaryAmount}>${totalExpenses}</Text>
          <Text style={styles.summaryText}>Budget Remaining</Text>
          <Text style={styles.summaryAmount}>${remainingBalance}</Text>
        </View>

        {/* Latest Transactions */}
        <View style={styles.latestTransactions}>
          <Text style={styles.sectionTitle}>Latest Transactions</Text>
          <FlatList
            data={latestTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>

      {/* Side Drawer */}
      {isDrawerOpen && (
        <View style={styles.drawerContainer}>
          <View style={styles.drawerContent}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleDrawer}>
              <Ionicons name="close" size={30} color="#888" />
            </TouchableOpacity>
            <DrawerButton icon="cash-outline" label="Expense" onPress={handleExpense} />
            <DrawerButton icon="list-outline" label="ExpenseList" onPress={handleExpenseList} />
            <DrawerButton icon="wallet-outline" label="Budget" onPress={handleBudget} />
            <DrawerButton icon="bar-chart-outline" label="Reports" onPress={handleReports} />
            <DrawerButton icon="person-outline" label="Profile" onPress={handleProfile} />
            <DrawerButton icon="log-out-outline" label="Logout" onPress={handleLogout} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0066cc',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  latestTransactions: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  transactionDescription: {
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '50%',
    backgroundColor: '#fff',
    elevation: 4,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  drawerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: '#888',
  },
});

export default DashboardPage;
