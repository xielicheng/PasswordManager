import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { PasswordProvider } from '../contexts/PasswordContext';
import { SearchBar } from '../components/SearchBar';
import { PasswordList } from '../components/PasswordList';
import { AddPasswordButton } from '../components/AddPasswordButton';

export default function HomeScreen() {
  return (
    <PaperProvider>
      <PasswordProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <View style={styles.content}>
            <SearchBar />
            <PasswordList />
          </View>
          <AddPasswordButton />
        </SafeAreaView>
      </PasswordProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
}); 