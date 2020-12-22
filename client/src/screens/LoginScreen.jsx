/* eslint-disable global-require */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
// import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import React from 'react';
import {
  View, Text, StyleSheet, Image, StatusBar,
} from 'react-native';
import * as Facebook from 'expo-facebook';
// import { FACEBOOK_ID } from 'react-native-dotenv';

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

const LoginScreen = () => {
  console.warn('hi', config.FACEBOOK_ID);
  const facebookLogIn = async () => {
    try {
      await Facebook.initializeAsync({ appId: '123', appName: 'babili' });
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
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
          source={require('../../assets/logo.png')}
        />
        <Text onPress={facebookLogIn}>Connect With Facebook</Text>
      </View>
    </View>
  );
};

export default LoginScreen;
