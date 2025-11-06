import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
  showClearButton?: boolean;
  noMargin?: boolean;
  borderColor?: string;
  zIndex?: number;
}

export default function SearchableDropdown({
  label,
  value,
  onValueChange,
  items,
  placeholder = 'Search...',
  required = false,
  dropdownPosition = 'bottom',
  showClearButton = true,
  noMargin = false,
  borderColor = COLORS.YELLOW,
  zIndex = 1000,
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
    <View style={[
      styles.container, 
      noMargin && styles.noMargin, 
      showDropdown && { zIndex }
    ]}>
      {label ? (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      ) : null}

      {/* Selected Value Display / Search Input */}
      <View style={[styles.inputContainer, { borderColor }]}>
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
          {value && !showDropdown && showClearButton ? (
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
          dropdownPosition === 'top' ? styles.dropdownTop : styles.dropdownBottom,
          { borderColor, zIndex }
        ]}>
          <ScrollView
            style={styles.dropdownList}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
            indicatorStyle="black"
            scrollEventThrottle={16}
            bounces={false}
            overScrollMode="never"
            contentContainerStyle={{ paddingVertical: 4 }}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <TouchableOpacity
                  key={`${item}-${index}`}
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
                    numberOfLines={2}
                  >
                    {item}
                  </Text>
                  {item === value && (
                    <Ionicons 
                      name="checkmark" 
                      size={20} 
                      color={COLORS.YELLOW} 
                      style={{ marginTop: 2, marginLeft: 8 }}
                    />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            )}
          </ScrollView>
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
  noMargin: {
    marginBottom: 0,
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
    maxHeight: 350,
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
    maxHeight: 320,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    minHeight: 48,
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

