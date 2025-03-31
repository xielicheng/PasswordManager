import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, TextInput, Button, Title, HelperText } from 'react-native-paper';
import { usePasswordContext } from '../contexts/PasswordContext';

interface AddPasswordModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export const AddPasswordModal: React.FC<AddPasswordModalProps> = ({ visible, onDismiss }) => {
  const { addPassword } = usePasswordContext();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setUsername('');
    setPassword('');
    setEmail('');
    setNote('');
    setErrors({});
  };

  const handleDismiss = () => {
    resetForm();
    onDismiss();
  };

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!name.trim()) {
      newErrors.name = true;
    }
    
    if (!username.trim()) {
      newErrors.username = true;
    }
    
    if (!password.trim()) {
      newErrors.password = true;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      await addPassword({
        name,
        username,
        password,
        email,
        note,
      });
      handleDismiss();
    } catch (error) {
      console.error('保存密码失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Title style={styles.title}>添加新密码</Title>
        
        <ScrollView style={styles.scrollView}>
          <TextInput
            label="名称 *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            error={errors.name}
          />
          {errors.name && (
            <HelperText type="error">
              请输入密码名称
            </HelperText>
          )}
          
          <TextInput
            label="账号 *"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            error={errors.username}
          />
          {errors.username && (
            <HelperText type="error">
              请输入账号
            </HelperText>
          )}
          
          <TextInput
            label="密码 *"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            error={errors.password}
          />
          {errors.password && (
            <HelperText type="error">
              请输入密码
            </HelperText>
          )}
          
          <TextInput
            label="邮箱"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
          />
          
          <TextInput
            label="备注"
            value={note}
            onChangeText={setNote}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
          />
        </ScrollView>
        
        <View style={styles.buttonsContainer}>
          <Button
            mode="outlined"
            onPress={handleDismiss}
            style={styles.button}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            保存
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollView: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 