import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './Components/LandingPage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import DashboardPage from './Components/Screens/DashboardPage';
import ExpenseCreationPage from './Components/Screens/ExpenseCreationPage';
import BudgetPage from './Components/Screens/BudgetPage';
import ExpenseListPage from './Components/Screens/ExpenseListPage';
import ReportsPage from './Components/Screens/ReportsPage';
import CategoryPage from './Components/Screens/CategoryPage';
import EditCategoryPage from './Components/Screens/EditCategoryPage';
import CreateCategoryPage from './Components/Screens/CreateCategoryPage';

const Stack = createStackNavigator();

const App = () => {

  return (
    
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Landing" component={LandingPage} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="Dashboard" component={DashboardPage} />
          <Stack.Screen name="Expense" component={ExpenseCreationPage} />
          <Stack.Screen name="Category" component={CategoryPage} />
          <Stack.Screen name="CreateCategory" component={CreateCategoryPage} />
          <Stack.Screen name="EditCategory" component={EditCategoryPage} />
          <Stack.Screen name="ExpenseList" component={ExpenseListPage} />
          <Stack.Screen name="Budget" component={BudgetPage} />
          <Stack.Screen name="Reports" component={ReportsPage} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
