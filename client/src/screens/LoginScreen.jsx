/* eslint-disable import/no-unresolved */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import 'react-native-gesture-handler';
import React from 'react';
import {
  View, StyleSheet, Button, Text, StatusBar, Image,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import axios from 'axios';
import firebase from 'firebase';
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
  const isSameUser = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      const { providerData } = firebaseUser;
      for (let i = 0; i < providerData.length; i + 1) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID
          && providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to re-auth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const onSignIn = async (googleUser) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      unsubscribe();
      // if current user and current firebase user are not the same
      if (!isSameUser(googleUser, firebaseUser)) {
        // create a new google credit...
        const credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken,
        );
          // ...and sign in with that credit
        const result = await firebase.auth().signInWithCredential(credential);
        console.warn('user signed in', result);
        // if user is new add info to fb and postgreSql
        if (result.additionalUserInfo.isNewUser) {
          firebase.database().ref(`/users/${result.user.uid}`)
            .set({
              gmail: result.user.email,
              profile_picture: result.additionalUserInfo.profile.picture,
              first_name: result.additionalUserInfo.profile.given_name,
              last_name: result.additionalUserInfo.profile.family_name,
              created_at: Date.now(),
            });
          await axios.post(`${config.BASE_URL}`, {
            email: result.user.email,
            name: `${result.additionalUserInfo.profile.given_name} ${result.additionalUserInfo.profile.family_name}`,
            photoUrl: result.additionalUserInfo.profile.picture,
          });
          navigate('Home', { email: result.user.email });
        } else { // user is not new, just update login in firebase
          firebase.database().ref(`/users/${result.user.uid}`).update({
            last_logged_in: Date.now(),
          });
        }
      } else {
        console.warn('User already signed-in Firebase.');
      }
    });
  };

  const signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: config.GOOGLE_AND,
        iosClientId: config.GOOGLE_IOS,
        scopes: ['profile', 'email'],
        permissions: ['public_profile', 'email', 'gender', 'location'],
        androidStandaloneAppClientId: config.GOOGLE_AND,
      });
      if (result.type === 'success') {
        await onSignIn(result);
      }
    } catch (err) {
      console.warn('err in signInWithGoogleAsync', err);
    }
  };

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
