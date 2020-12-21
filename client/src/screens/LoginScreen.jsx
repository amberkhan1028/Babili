import React from 'react';
import {
  View, Text, StyleSheet, Image, StatusBar,
} from 'react-native';

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
const LoginScreen = () => (
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
  </View>
);

export default LoginScreen;
