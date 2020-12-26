/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import 'react-native-gesture-handler';
import React from 'react';
import {
  View, StyleSheet, Button, Text, StatusBar, Image,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import axios from 'axios';
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
        androidClientId: config.GOOGLE_AND,
        iosClientId: config.GOOGLE_IOS,
        scopes: ['profile', 'email'],
        permissions: ['public_profile', 'email', 'gender', 'location'],
        androidStandaloneAppClientId: config.GOOGLE_AND,

      });
      if (type === 'success') {
        // const userData = {
        //   email: user.email,
        //   name: user.name,
        //   id: user.id,
        //   photoUrl: user.photoUrl,
        //   accessToken,
        // };

        axios.get(`${config.BASE_URL}/user/${user.email}`)
          .then((res) => {
            // console.warn(res)
            navigate('Home', {
              email: res.data.email,
            });
          })
          .catch((err) => {
            // user not found, so create user
            const postData = {
              email: user.email,
            };

            axios.post(`${config.BASE_URL}/user`, postData).then(() => navigate('Home', {
              email: user.email,
            }));
            console.warn(err);
          });
      }
      return { cancelled: true };
    } catch (e) {
      console.warn('something went wrong :(', e);
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
