import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import type { PostSheetsRequest } from '../types/api';

const OFFLINE_QUEUE_KEY = '@BookMate:OfflineQueue';

interface QueuedRequest {
  id: string;
  timestamp: string;
  payload: PostSheetsRequest;
  retryCount: number;
}

class OfflineQueue {
  private queue: QueuedRequest[] = [];
  private isProcessing = false;

  async initialize() {
    try {
      const storedQueue = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      this.queue = storedQueue ? JSON.parse(storedQueue) : [];
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  async addToQueue(payload: PostSheetsRequest): Promise<string> {
    const queuedRequest: QueuedRequest = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      payload,
      retryCount: 0,
    };

    this.queue.push(queuedRequest);
    await this.saveQueue();
    
    console.log(`Added transaction to offline queue: ${queuedRequest.id}`);
    
    // Try to process queue immediately
    this.processQueue();
    
    return queuedRequest.id;
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const processedIds: string[] = [];

    try {
      for (const request of [...this.queue]) {
        try {
          console.log(`Processing queued transaction: ${request.id}`);
          
          const result = await apiService.postSheets(request.payload);
          
          if (result.ok) {
            console.log(`Successfully submitted queued transaction: ${request.id}`);
            processedIds.push(request.id);
          } else {
            // Increment retry count
            request.retryCount++;
            
            // Remove after 3 failed attempts
            if (request.retryCount >= 3) {
              console.warn(`Removing failed transaction after 3 retries: ${request.id}`);
              processedIds.push(request.id);
            }
          }
        } catch (error) {
          console.error(`Failed to process queued transaction ${request.id}:`, error);
          
          request.retryCount++;
          
          // Remove after 3 failed attempts
          if (request.retryCount >= 3) {
            console.warn(`Removing failed transaction after 3 retries: ${request.id}`);
            processedIds.push(request.id);
          }
        }
      }

      // Remove processed items from queue
      this.queue = this.queue.filter(request => !processedIds.includes(request.id));
      await this.saveQueue();
      
    } finally {
      this.isProcessing = false;
    }
  }

  async getQueueStatus(): Promise<{
    pending: number;
    oldest?: string;
    total: number;
  }> {
    return {
      pending: this.queue.length,
      oldest: this.queue.length > 0 ? this.queue[0].timestamp : undefined,
      total: this.queue.length,
    };
  }

  async clearQueue(): Promise<void> {
    this.queue = [];
    await this.saveQueue();
    console.log('Offline queue cleared');
  }

  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }
}

export const offlineQueue = new OfflineQueue();