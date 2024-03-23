import React from 'react';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { UserProvider } from './src/utils/UserContext';
import AppNavigation from './src/navigation/AppNavigation';
// 環境変数をインポート
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  WEB_CLIENT_ID,
} from '@env';

// Firebaseの設定を使用して初期化
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// Firebase認証の初期化（オプションでAsyncStorageを使用）
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Google SignInの設定
GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

export default function App() {
  return (
    <UserProvider>
      <AppNavigation />
    </UserProvider>
  );
}
