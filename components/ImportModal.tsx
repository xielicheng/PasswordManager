import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import Papa from 'papaparse';
import { Ionicons } from '@expo/vector-icons';

interface ImportModalProps {
  isVisible: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

interface PreviewData {
  title: string;
  username: string;
  password: string;
  url: string;
  notes?: string;
}

interface ParseError {
  message: string;
  [key: string]: any;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isVisible, onClose, onImport }) => {
  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [error, setError] = useState<string>('');

  const validateData = (data: any[]) => {
    const errors = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row.title) errors.push(`行 ${i + 1}: 标题为必填项`);
      if (!row.username) errors.push(`行 ${i + 1}: 用户名为必填项`);
      if (!row.password) errors.push(`行 ${i + 1}: 密码为必填项`);
    }
    return errors;
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
      });

      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];
        const response = await fetch(file.uri);
        const text = await response.text();
        
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const errors = validateData(results.data);
            if (errors.length > 0) {
              setError(errors.join('\n'));
              setPreviewData([]);
            } else {
              setError('');
              setPreviewData(results.data as PreviewData[]);
            }
          },
          error: (error: ParseError) => {
            setError('CSV解析错误：' + error.message);
          }
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError('文件选择错误：' + err.message);
      } else {
        setError('文件选择时发生未知错误');
      }
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>导入密码</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleFilePick}>
            <Ionicons name="document-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <ThemedText style={styles.buttonText}>选择CSV文件</ThemedText>
          </TouchableOpacity>

          {error ? (
            <ThemedText style={styles.error}>{error}</ThemedText>
          ) : null}

          {previewData.length > 0 && (
            <View style={styles.previewContainer}>
              <ThemedText style={styles.subtitle}>数据预览</ThemedText>
              <View style={styles.previewList}>
                {previewData.map((item, index) => (
                  <View key={index} style={styles.previewItem}>
                    <ThemedText style={styles.previewTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.previewUsername}>{item.username}</ThemedText>
                  </View>
                ))}
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.confirmButton]}
                  onPress={() => {
                    onImport(previewData);
                    onClose();
                  }}>
                  <Ionicons name="checkmark" size={20} color="#fff" style={styles.buttonIcon} />
                  <ThemedText style={styles.buttonText}>确认导入</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}>
                  <Ionicons name="close" size={20} color="#fff" style={styles.buttonIcon} />
                  <ThemedText style={styles.buttonText}>取消</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    width: '90%',
    maxHeight: '80%',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  closeButton: {
    padding: 4,
  },
  button: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A1CEDC',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f44336',
  },
  error: {
    color: '#f44336',
    fontSize: 14,
    marginVertical: 8,
  },
  previewContainer: {
    flex: 1,
  },
  previewList: {
    flex: 1,
  },
  previewItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  previewUsername: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
}); 