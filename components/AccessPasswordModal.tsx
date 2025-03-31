import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccessPasswordModalProps {
  visible: boolean;
  onSuccess: () => void;
  isFirstTime?: boolean;
}

export function AccessPasswordModal({ visible, onSuccess, isFirstTime = false }: AccessPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    try {
      const storedPassword = await AsyncStorage.getItem('accessPassword');
      const defaultPassword = 'admin';

      if (isFirstTime) {
        // 首次设置密码
        await AsyncStorage.setItem('accessPassword', password);
        onSuccess();
      } else {
        // 验证密码
        if (password === (storedPassword || defaultPassword)) {
          onSuccess();
          setPassword('');
        } else {
          setError('密码错误');
        }
      }
    } catch (error) {
      console.error('密码验证失败:', error);
      setError('验证失败，请重试');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>
            {isFirstTime ? '设置访问密码' : '请输入访问密码'}
          </Text>
          
          <Text style={styles.subtitle}>
            {isFirstTime 
              ? '请设置一个用于保护您密码的访问密码' 
              : '输入正确密码后才能查看您的密码库'}
          </Text>
          
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            placeholder="请输入密码"
            placeholderTextColor="#999"
            secureTextEntry
            autoFocus
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              {isFirstTime ? '设置密码' : '确认'}
            </Text>
          </TouchableOpacity>
          
          {!isFirstTime && (
            <Text style={styles.hint}>
              默认密码: admin
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10
  },
  input: {
    height: 55,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9'
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  hint: {
    marginTop: 15,
    textAlign: 'center',
    color: '#888',
    fontSize: 13
  }
}); 