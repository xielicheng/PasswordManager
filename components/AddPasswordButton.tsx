import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ImportModal } from './ImportModal';
import { ExportPasswordsModal } from './ExportPasswordsModal';
import { AddPasswordModal } from './AddPasswordModal';
import { usePasswordContext } from '../contexts/PasswordContext';

export const AddPasswordButton: React.FC = () => {
  const { passwords, addPassword } = usePasswordContext();
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const handleImportPress = () => {
    setImportModalVisible(true);
  };

  const handleExportPress = () => {
    setExportModalVisible(true);
  };

  const handleAddPress = () => {
    setAddModalVisible(true);
  };

  const handleImportComplete = (data: any[]) => {
    // 遍历导入的数据数组，逐个添加密码
    data.forEach(item => {
      addPassword(item);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.importButton]}
          onPress={handleImportPress}
        >
          <Ionicons name="download-outline" size={24} color="white" />
          <ThemedText style={styles.buttonText}>导入</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.exportButton]}
          onPress={handleExportPress}
        >
          <Ionicons name="share-outline" size={24} color="white" />
          <ThemedText style={styles.buttonText}>导出</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={handleAddPress}
        >
          <Ionicons name="add" size={24} color="white" />
          <ThemedText style={styles.buttonText}>添加</ThemedText>
        </TouchableOpacity>
      </View>

      <ImportModal 
        isVisible={importModalVisible} 
        onClose={() => setImportModalVisible(false)} 
        onImport={handleImportComplete} 
      />
      
      <ExportPasswordsModal 
        visible={exportModalVisible} 
        onClose={() => setExportModalVisible(false)} 
        passwords={passwords} 
      />
      
      <AddPasswordModal 
        visible={addModalVisible} 
        onDismiss={() => setAddModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  importButton: {
    backgroundColor: '#4CAF50',
  },
  exportButton: {
    backgroundColor: '#2196F3',
  },
  addButton: {
    backgroundColor: '#ff4081',
  },
}); 