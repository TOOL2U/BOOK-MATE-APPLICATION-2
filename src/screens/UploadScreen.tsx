import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/api';
import { COLORS, SHADOWS } from '../config/theme';
import BrandedAlert from '../components/BrandedAlert';
import { useBrandedAlert } from '../hooks/useBrandedAlert';
import LogoBM from '../components/LogoBM';

export default function UploadScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [ocrText, setOcrText] = useState('');

  const {
    isVisible: alertVisible,
    alertConfig,
    showError,
    showSuccess,
    hideAlert
  } = useBrandedAlert();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        processImage(result.assets[0].base64, 'image/jpeg');
      }
    } catch (error) {
      showError('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showError('Permission Denied', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        processImage(result.assets[0].base64, 'image/jpeg');
      }
    } catch (error) {
      showError('Error', 'Failed to take photo');
    }
  };

  const processImage = async (base64: string, fileType: string) => {
    setLoading(true);
    try {
      // Step 1: OCR
      const ocrResponse = await apiService.ocr(
        `data:${fileType};base64,${base64}`,
        fileType
      );

      if (!ocrResponse.ok || !ocrResponse.text) {
        throw new Error('OCR failed');
      }

      setOcrText(ocrResponse.text);

      // Step 2: AI Extract
      const extractResponse = await apiService.extract(ocrResponse.text);

      if (extractResponse.ok) {
        showSuccess('Success', 'Receipt processed successfully!', () => {
          // Navigate to review screen with extracted data
          console.log('Navigation to review screen would happen here');
        });
      }
    } catch (error) {
      showError('Error', error instanceof Error ? error.message : 'Processing failed');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setOcrText(''); // Clear any previous OCR results
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.YELLOW}
          />
        }
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LogoBM size={64} />
        </View>
        
        {/* Header */}
        <Text style={styles.title}>Upload Receipt</Text>
        <Text style={styles.subtitle}>
          Take a photo or select from gallery to process your receipt
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={takePhoto}
            disabled={loading}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="camera" size={24} color={COLORS.BLACK} />
              <Text style={styles.buttonText}>Take Photo</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
            disabled={loading}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="images" size={24} color={COLORS.BLACK} />
              <Text style={styles.buttonText}>Choose from Gallery</Text>
            </View>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.YELLOW} />
            <Text style={styles.loadingText}>Processing receipt...</Text>
          </View>
        )}

        {ocrText && !loading && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>OCR Result:</Text>
            <Text style={styles.resultText}>{ocrText}</Text>
          </View>
        )}
      </ScrollView>

      {/* Branded Alert */}
      <BrandedAlert
        visible={alertVisible}
        title={alertConfig?.title || ''}
        message={alertConfig?.message || ''}
        type={alertConfig?.type}
        onClose={hideAlert}
        onConfirm={alertConfig?.onConfirm}
        confirmText={alertConfig?.confirmText}
        cancelText={alertConfig?.cancelText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GREY_PRIMARY,
  },
  content: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontFamily: 'MadeMirage-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Aileron-Light',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: COLORS.YELLOW,
    padding: 16,
    borderRadius: 0,
    alignItems: 'center',
    ...SHADOWS.YELLOW_GLOW,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  loadingContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Aileron-Light',
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.SURFACE_1,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  resultTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    marginBottom: 8,
  },
  resultText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontFamily: 'Aileron-Light',
    lineHeight: 20,
  },
});

