import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import * as React from 'react';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PasswordProvider } from '../contexts/PasswordContext';
import { AccessPasswordModal } from '../components/AccessPasswordModal';
import { ChangeAccessPasswordModal } from '../components/ChangeAccessPasswordModal';
import { ExportPasswordsModal } from '../components/ExportPasswordsModal';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      setIsLoading(true);
      const hasPassword = await AsyncStorage.getItem('accessPassword');
      setIsFirstTime(!hasPassword);
      setIsLoading(false);
    } catch (error) {
      console.error('检查首次使用状态失败:', error);
      setIsLoading(false);
    }
  };

  const handleAuthenticationSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <Text style={{ flex: 1, justifyContent: 'center', textAlign: 'center', marginTop: 50 }}>
        加载中...
      </Text>
    );
  }

  if (!isAuthenticated) {
    return (
      <AccessPasswordModal
        visible={true}
        onSuccess={handleAuthenticationSuccess}
        isFirstTime={isFirstTime}
      />
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <PasswordProvider>
        <Stack screenOptions={{
          headerStyle: {
            backgroundColor: '#007BFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
          <Stack.Screen 
            name="index" 
            options={{
              title: '密码管理器',
              headerRight: () => (
                <View style={styles.headerButtons}>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => setShowChangePassword(true)}
                  >
                    <Icon name="settings" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              ),
            }}
          />
        </Stack>
        
        <ChangeAccessPasswordModal
          visible={showChangePassword}
          onClose={() => setShowChangePassword(false)}
        />
      </PasswordProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5
  },
});
