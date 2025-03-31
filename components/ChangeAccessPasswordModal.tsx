import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChangeAccessPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ChangeAccessPasswordModal({ visible, onClose }: ChangeAccessPasswordModalProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(false);

  const validateOldPassword = async () => {
    if (!oldPassword.trim()) {
      setError('请输入当前密码');
      return;
    }

    try {
      const storedPassword = await AsyncStorage.getItem('accessPassword');
      const defaultPassword = 'admin';

      if (oldPassword === (storedPassword || defaultPassword)) {
        setIsOldPasswordValid(true);
        setError('');
      } else {
        setError('当前密码错误');
      }
    } catch (error) {
      console.error('密码验证失败:', error);
      setError('验证失败，请重试');
    }
  };

  const handleSave = async () => {
    if (!isOldPasswordValid) {
      setError('请先验证当前密码');
      return;
    }

    if (!newPassword.trim()) {
      setError('请输入新密码');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      await AsyncStorage.setItem('accessPassword', newPassword);
      Alert.alert('成功', '访问密码已更新');
      resetForm();
      onClose();
    } catch (error) {
      console.error('保存密码失败:', error);
      setError('保存失败，请重试');
    }
  };

  const resetForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsOldPasswordValid(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>修改访问密码</Text>
          
          {!isOldPasswordValid ? (
            <>
              <Text style={styles.label}>当前密码</Text>
              <TextInput
                style={styles.input}
                value={oldPassword}
                onChangeText={(text) => {
                  setOldPassword(text);
                  setError('');
                }}
                placeholder="请输入当前密码"
                secureTextEntry
                autoFocus
              />
              <TouchableOpacity
                style={styles.validateButton}
                onPress={validateOldPassword}
              >
                <Text style={styles.buttonText}>验证当前密码</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.label}>新密码</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setError('');
                }}
                placeholder="请输入新密码"
                secureTextEntry
                autoFocus
              />
              
              <Text style={styles.label}>确认密码</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError('');
                }}
                placeholder="请确认新密码"
                secureTextEntry
              />
            </>
          )}
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>取消</Text>
            </TouchableOpacity>
            
            {isOldPasswordValid && (
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>保存</Text>
              </TouchableOpacity>
            )}
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500'
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  validateButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2
  },
  cancelButton: {
    backgroundColor: '#ff4444'
  },
  saveButton: {
    backgroundColor: '#4CAF50'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  }
}); 