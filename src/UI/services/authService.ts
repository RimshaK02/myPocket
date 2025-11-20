import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MilkshakeLoginParams {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  milkshakeUserId?: number;
  milkshakeEmail?: string;
  milkshakeData?: {
    firstName: string;
    lastName: string;
    siteId: number;
    role: string;
  };
  lastLogin?: string;
}

export interface MilkshakeLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
    milkshakeCookie: string;
  };
}

/**
 * Login with Milkshake credentials
 * Works for both new users (auto-creates account) and existing users
 */
export const milkshakeLogin = async (params: MilkshakeLoginParams): Promise<User> => {
  const response = await api.post<MilkshakeLoginResponse>('/auth/milkshake/login', params);

  if (response.data.success) {
    const { accessToken, refreshToken, user } = response.data.data;

    // Save tokens and user data to AsyncStorage
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    return user;
  }

  throw new Error(response.data.message || 'Login failed');
};

/**
 * Logout - clear all stored data
 */
export const logout = async (): Promise<void> => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
};

/**
 * Get current user from AsyncStorage
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const userJson = await AsyncStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  return !!accessToken;
};
