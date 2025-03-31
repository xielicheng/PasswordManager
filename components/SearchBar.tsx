import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { usePasswordContext } from '../contexts/PasswordContext';
import { BlurView } from '@react-native-community/blur';

export function SearchBar() {
  const { searchPasswords, clearSearch } = usePasswordContext();
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (searchText.trim()) {
      searchPasswords(searchText);
    }
  };

  const handleClear = () => {
    setSearchText('');
    clearSearch();
  };

  const SearchContainer = Platform.OS === 'ios' ? BlurView : View;
  const blurProps = Platform.OS === 'ios' ? {
    blurType: 'light',
    blurAmount: 10,
  } : {};

  return (
    <View style={styles.container}>
      <SearchContainer style={styles.searchContainer} {...blurProps}>
        <View style={styles.searchContent}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="搜索名称..."
            placeholderTextColor="rgba(0,0,0,0.4)"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {searchText ? (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={handleClear} style={styles.iconButton}>
                <Icon name="close" size={20} color="#666" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                onPress={handleSearch}
                style={styles.iconButton}
                disabled={!searchText.trim()}
              >
                <Icon
                  name="arrow-forward"
                  size={20}
                  color={searchText.trim() ? '#2196F3' : '#999'}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </SearchContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#f5f5f5'
  },
  searchContainer: {
    borderRadius: 24,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden'
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    padding: 0,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 4,
  }
}); 