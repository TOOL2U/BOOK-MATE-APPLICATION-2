import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { apiService } from '../services/api';

export default function UploadScreen() {
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState('');

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
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required');
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
      Alert.alert('Error', 'Failed to take photo');
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

      if (!ocrResponse.success || !ocrResponse.text) {
        throw new Error('OCR failed');
      }

      setOcrText(ocrResponse.text);

      // Step 2: AI Extract
      const extractResponse = await apiService.extract(ocrResponse.text);

      if (extractResponse.success) {
        Alert.alert('Success', 'Receipt processed successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // TODO: Navigate to review screen with extracted data
              console.log('Extracted data:', extractResponse.data);
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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
            <Text style={styles.buttonText}>📷 Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
            disabled={loading}
          >
            <Text style={styles.buttonText}>🖼️ Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#1E293B',
    borderRadius: 12,
  },
  resultTitle: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
  },
});

