import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  useEffect(() => {
    // Load stored credentials on component mount
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');
      const storedRememberMe = await AsyncStorage.getItem('rememberMe');

      if (storedRememberMe === 'true' && storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.log('Error loading stored credentials:', error);
    }
  };
  const saveCredentials = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.removeItem('rememberMe');
      }
    } catch (error) {
      console.log('Error saving credentials:', error);
    }
  };
  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter the email and password.');
      return;
    }

    setIsLoading(true); // Show loader

    try {
      const response = await axios.post('http://192.168.29.225:3000/api/auth/login', {
        email,
        password,
      });

      const { token } = response.data;
      console.log(token);
      await AsyncStorage.setItem('token', token);
      await saveCredentials();

      if (response.status === 200) {
        navigation.replace('Dashboard');
      } else {
        console.log('Login failed:', response.status);
        Alert.alert('Error', 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert('Error', 'Please check your email and try again');
      } else if (error.response && error.response.status === 401) {
        Alert.alert('Error', 'Invalid Password');
      } else {
        console.log(error);
        Alert.alert('Error', 'An error occurred during login. Please try again later.');
      }
    } finally {
      setIsLoading(false); // Hide loader
    }
  };
  const handleForgotPassword = () => {
    // Handle forgot password logic
  };

  const handleCreateAccount = () => {
    navigation.navigate('Register');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={toggleShowPassword}>
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#007bff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.rememberContainer} onPress={toggleRememberMe}>
            <View style={styles.checkbox}>{rememberMe && <Text>✓</Text>}</View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
          <Text style={styles.createAccountText}>Don't have an account? Create an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0066cc',
  },
  content: {
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#162447',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: '#162447',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 40,
    color: '#162447',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  loginButton: {
    backgroundColor: '#fca311',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 3,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 5,
    color: '#007bff',
  },
  forgotText: {
    color: '#007bff',
    marginLeft: 'auto',
  },
  createAccountButton: {
    alignItems: 'center',
  },
  createAccountText: {
    color: '#007bff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoginPage;
