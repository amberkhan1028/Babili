/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import 'react-native-gesture-handler';
import React from 'react';
import {
  View, StyleSheet, Button, Text, StatusBar, Image,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import config from '../../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fec857',
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
      const { type, user } = await Google.logInAsync({
        behavior: 'web',
        iosClientId: config.GOOGLE_IOS,
        // androidClientId: config.GOOGLE_ANDROID,
        scopes: ['profile', 'email'],
      });
      if (type === 'success') {
        alert(user.name, user.email);
        navigate('Home');
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
      <StatusBar
        barStyle="dark-content"
      />
      <View style={styles.logoContainer}>
        <Text style={styles.title}>babili</Text>
        <Image
          style={styles.logo}
        // eslint-disable-next-line global-require
          source={require('../../assets/logo.png')}
        />
        <Button onPress={() => signInWithGoogle()} title="Sign in with Google" />
      </View>
    </View>
  );
}
