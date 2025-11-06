import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../config/theme';

interface SearchableDropdownProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: readonly string[];
  placeholder?: string;
  required?: boolean;
  dropdownPosition?: 'top' | 'bottom';
}

export default function SearchableDropdown({
  label,
  value,
  onValueChange,
  items,
  placeholder = 'Search...',
  required = false,
  dropdownPosition = 'bottom',
}: SearchableDropdownProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredItems, setFilteredItems] = useState<readonly string[]>(items);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Filter items based on search query
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const handleSelect = (item: string) => {
    onValueChange(item);
    setSearchQuery('');
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const handleFocus = () => {
    setShowDropdown(true);
    setSearchQuery('');
  };

  const handleClear = () => {
    onValueChange('');
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      {/* Selected Value Display / Search Input */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={showDropdown ? searchQuery : value}
          onChangeText={setSearchQuery}
          onFocus={handleFocus}
          placeholder={value || placeholder}
          placeholderTextColor={COLORS.TEXT_SECONDARY}
        />
        <View style={styles.iconContainer}>
          {value && !showDropdown ? (
            <TouchableOpacity onPress={handleClear} style={styles.iconButton}>
              <Ionicons name="close-circle" size={20} color={COLORS.TEXT_SECONDARY} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            style={styles.iconButton}
          >
            <Ionicons
              name={showDropdown ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.TEXT_SECONDARY}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown List */}
      {showDropdown && (
        <View style={[
          styles.dropdown,
          dropdownPosition === 'top' ? styles.dropdownTop : styles.dropdownBottom
        ]}>
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  item === value && styles.dropdownItemSelected,
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    item === value && styles.dropdownItemTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {item}
                </Text>
                {item === value && (
                  <Ionicons name="checkmark" size={20} color={COLORS.YELLOW} />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            }
            style={styles.dropdownList}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          />
        </View>
      )}

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => {
            setShowDropdown(false);
            setSearchQuery('');
            Keyboard.dismiss();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 1,
  },
  label: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: {
    color: COLORS.ERROR,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE_1,
    borderRadius: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.YELLOW,
  },
  input: {
    flex: 1,
    color: COLORS.TEXT_PRIMARY,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  iconButton: {
    padding: 4,
  },
  dropdown: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: COLORS.SURFACE_1,
    borderRadius: 8,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: COLORS.YELLOW,
    zIndex: 1000,
    ...SHADOWS.MEDIUM,
  },
  dropdownBottom: {
    top: 70,
  },
  dropdownTop: {
    bottom: 70,
  },
  dropdownList: {
    maxHeight: 180,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  dropdownItemSelected: {
    backgroundColor: COLORS.SURFACE_2,
  },
  dropdownItemText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: COLORS.YELLOW,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontFamily: 'Aileron-Light',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});

