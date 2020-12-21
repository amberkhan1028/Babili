import React from 'react';
import {
  View, StyleSheet, Button,
} from 'react-native';
import PropTypes from 'prop-types';

import * as Google from 'expo-google-app-auth';

const IOS_CLIENT_ID = '932033800797-qipd3i832qgt56rksik1f11p9ia02djm.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '932033800797-hbdmbb02jkmg5tv62opqcbasd3esob9b.apps.googleusercontent.com';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
