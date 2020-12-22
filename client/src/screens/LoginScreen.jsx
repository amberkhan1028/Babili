/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import * as Google from 'expo-google-app-auth';
import { GOOGLE_IOS, GOOGLE_ANDROID } from 'react-native-dotenv';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fec857',
  },
  googleContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
  },
});

export default function LoginScreen({ navigation: { navigate } }) {
  async function signInWithGoogleAsync() {
    try {
      const { type, accessToken, user } = await Google.logInAsync({
        behavior: 'web',
        iosClientId: GOOGLE_IOS,
        androidClientId: GOOGLE_ANDROID,
        scopes: ['profile', 'email'],
      });

      if (type === 'success') {
        alert(user);
        navigate('Messages');
      }
      return { cancelled: true };
    } catch (e) {
      alert('something went wrong :(');
      return { error: true };
    }
  }
  const signInWithGoogle = () => {
    signInWithGoogleAsync();
  };

  return (
    <View style={styles.container}>
      <Button onPress={() => signInWithGoogle()} title="Sign in with Google" />
    </View>
  );
}
