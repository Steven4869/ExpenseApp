import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditCategoryPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [categoryName, setCategoryName] = useState(route.params.categoryName);

  const handleUpdateCategory = () => {
    // Logic to update the category with the new categoryName
    // This can involve making an API call to the backend

    // Redirect back to the CategoryPage upon successful update
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={categoryName}
        onChangeText={setCategoryName}
      />
      <Button title="Update" onPress={handleUpdateCategory} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default EditCategoryPage;
