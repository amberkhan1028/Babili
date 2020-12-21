import React from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, StyleSheet, Image, StatusBar, Button,
} from 'react-native';

import * as Google from 'expo-google-app-auth';

const IOS_CLIENT_ID = '932033800797-qipd3i832qgt56rksik1f11p9ia02djm.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '932033800797-hbdmbb02jkmg5tv62opqcbasd3esob9b.apps.googleusercontent.com';

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

const LoginScreen = ({ navigation }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId: IOS_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        console.warn('LoginScreen.js.js 21 | ', result.user.givenName);
        navigation.navigate('MatchingGameScreen');
        return result.accessToken;
      }
      return { cancelled: true };
    } catch (e) {
      console.warn('LoginScreen.js.js 30 | Error with login', e);
      return { error: true };
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
          // eslint-disable-next-line global-require
          source={require('../../assets/logo.png')}
        />
      </View>
      <Button title="Login with Google" onPress={signInWithGoogle} />
    </View>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoginScreen;
