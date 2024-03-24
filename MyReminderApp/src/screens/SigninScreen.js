import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useUser } from '../utils/UserContext';
import { WEB_CLIENT_ID } from '@env';

// GoogleSigninの設定
GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

function SignInScreen({ navigation }) {
  const { setUserId } = useUser();

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const auth = getAuth();
      const userCredential = await signInWithCredential(auth, googleCredential);
      setUserId(userCredential.user.uid);
      // サインイン成功時にホーム画面へナビゲート
      navigation.navigate('Home');
    } catch (error) {
      // サインインエラー時の処理
      Alert.alert('Google Sign-In Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Sign In with Google" onPress={handleGoogleSignIn} color="white" />
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

export default SignInScreen;
