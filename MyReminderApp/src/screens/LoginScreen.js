import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { useUser } from '../utils/UserContext';
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from '@env';

// Google Sign-Inを設定
GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

function LoginScreen({ navigation }) {
  const { setUserId } = useUser();

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const auth = getAuth();
      const userCredential = await signInWithCredential(auth, googleCredential);
      // ログイン成功時にユーザーIDをコンテキストに保存
      setUserId(userCredential.user.uid);
      // ログイン成功後、ホーム画面にナビゲート
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Login with Google" onPress={handleGoogleLogin} color="white" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#D9D9D9",
  },
  buttonContainer: {
    backgroundColor: "#2D3F45",
    padding: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;
