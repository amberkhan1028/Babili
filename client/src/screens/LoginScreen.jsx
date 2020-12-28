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
      console.warn('provider data', providerData);
      for (let i = 0; i < providerData.length; i + 1) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID
          && providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // don't need to re-auth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const onSignIn = (googleUser) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(
      (firebaseUser) => {
        unsubscribe();
        // Check if signed-in Firebase with the correct user.
        if (!isSameUser(googleUser, firebaseUser)) { // if not the same user
          // create Firebase credentials with the Google ID token.
          const credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken,
          );
          // Sign in with credential from the Google user.
          firebase.auth().signInAndRetrieveDataWithCredential(credential).then((result) => {
            console.warn('user signed in ');
            if (result.additionalUserInfo.isNewUser) { // if they are a new user add to fb db
              firebase.database().ref(`/users/${result.user.uid}`).set({
                gmail: result.user.email,
                profile_picture: result.additionalUserInfo.profile.picture,
                first_name: result.additionalUserInfo.profile.given_name,
                last_name: result.additionalUserInfo.profile.family_name,
                created_at: Date.now(),
              });
            } else { // otherwise update their last login date
              firebase.database().ref(`/users/${result.user.uid}`).update({
                last_logged_in: Date.now(),
              });
            }
          }).catch((error) => console.warn(error));
        } else {
          console.warn('User already signed-in Firebase.');
        }
      },
    );
  };

  async function signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        androidClientId: config.GOOGLE_AND,
        iosClientId: config.GOOGLE_IOS,
        scopes: ['profile', 'email'],
        permissions: ['public_profile', 'email', 'gender', 'location'],
        androidStandaloneAppClientId: config.GOOGLE_AND,

      });
      if (result.type === 'success') {
        onSignIn(result); // check if user exists in fb db and postgresql db
        axios.get(`http://192.168.1.138:3000/user/${result.user.email}`)
          .then((res) => {
            navigate('Home', { email: res.data.email });
          })
          .catch((err) => {
            // user not found, so create user
            axios.post('http://192.168.1.138:3000/login', {
              email: result.user.email,
              name: result.user.name,
              photoUrl: result.user.photoUrl,
              id: result.user.id,
              session: result.accessToken,
            })
              .then(() => navigate('Home', { email: result.user.email }));
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
