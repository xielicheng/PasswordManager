import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface ExportPasswordsModalProps {
  visible: boolean;
  onClose: () => void;
  passwords: any[];
}

export function ExportPasswordsModal({ visible, onClose, passwords }: ExportPasswordsModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const resetState = () => {
    setPassword('');
    setError('');
    setIsExporting(false);
    setIsPasswordVerified(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const verifyPassword = async () => {
    if (!password.trim()) {
      setError('请输入访问密码');
      return;
    }

    try {
      const storedPassword = await AsyncStorage.getItem('accessPassword');
      const defaultPassword = 'admin';

      if (password === (storedPassword || defaultPassword)) {
        setIsPasswordVerified(true);
        setError('');
        exportPasswords();
      } else {
        setError('密码错误');
      }
    } catch (error) {
      console.error('密码验证失败:', error);
      setError('验证失败，请重试');
    }
  };

  const exportPasswords = async () => {
    setIsExporting(true);

    try {
      // 如果是 Android，检查权限
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: '存储权限',
            message: '导出密码需要访问您的文件存储',
            buttonNeutral: '稍后询问',
            buttonNegative: '取消',
            buttonPositive: '确认',
          }
        );
        
        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('权限被拒绝', '无法导出密码，因为应用没有访问存储的权限');
          setIsExporting(false);
          return;
        }
      }

      // 将密码数据转换为 CSV 格式
      let csvContent = '名称,账号,密码,邮箱,备注\n';
      passwords.forEach(pwd => {
        // 处理字段中的逗号和换行符，确保 CSV 格式正确
        const escapedName = pwd.name ? `"${pwd.name.replace(/"/g, '""')}"` : '';
        const escapedUsername = pwd.username ? `"${pwd.username.replace(/"/g, '""')}"` : '';
        const escapedPassword = pwd.password ? `"${pwd.password.replace(/"/g, '""')}"` : '';
        const escapedEmail = pwd.email ? `"${pwd.email.replace(/"/g, '""')}"` : '';
        const escapedNote = pwd.note ? `"${pwd.note.replace(/"/g, '""')}"` : '';
        
        csvContent += `${escapedName},${escapedUsername},${escapedPassword},${escapedEmail},${escapedNote}\n`;
      });

      // 生成当前时间戳作为文件名的一部分
      const timestamp = new Date().getTime();
      const fileName = `密码备份_${timestamp}.csv`;
      
      // 使用 Expo FileSystem 保存文件
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
      
      // 检查文件是否可以分享
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        // 使用 Expo Sharing 分享文件
        await Sharing.shareAsync(fileUri);
        Alert.alert('导出成功', `密码已导出到文件: ${fileName}`);
      } else {
        Alert.alert('错误', '在此设备上不支持文件分享');
      }
    } catch (error) {
      console.error('导出密码失败:', error);
      Alert.alert('导出失败', '导出密码时出现错误，请重试');
    } finally {
      setIsExporting(false);
      handleClose();
    }
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
          {isExporting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={styles.loadingText}>正在导出密码...</Text>
            </View>
          ) : !isPasswordVerified ? (
            <>
              <Text style={styles.title}>导出密码</Text>
              <Text style={styles.subtitle}>
                请输入访问密码以导出您的所有密码数据到CSV文件
              </Text>
              
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                placeholder="请输入访问密码"
                placeholderTextColor="#999"
                secureTextEntry
                autoFocus
              />
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                >
                  <Text style={styles.buttonText}>取消</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.exportButton]}
                  onPress={verifyPassword}
                >
                  <Text style={styles.buttonText}>导出</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.exportNote}>
                导出的文件将保存为CSV格式，可用Excel等软件打开
              </Text>
            </>
          ) : null }
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3
  },
  cancelButton: {
    backgroundColor: '#ff4444'
  },
  exportButton: {
    backgroundColor: '#4CAF50'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  exportNote: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333'
  }
}); 