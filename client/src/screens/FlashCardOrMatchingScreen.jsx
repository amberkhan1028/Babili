import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar,
} from 'react-native';

const styles = StyleSheet.create({
  topButton: {
    width: 370,
    height: 320,
    justifyContent: 'center',
  },
  bottomButton: {
    width: 375,
    height: 340,
    justifyContent: 'center',
    backgroundColor: '#ffc857',
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    color: '#F42B03',
  },
});

// eslint-disable-next-line react/prop-types
const FlashCardOrMatchingScreen = ({ navigation: { navigate } }) => (
  <View style={styles.app}>
    <StatusBar
      barStyle="dark-content"
    />
    <TouchableOpacity style={styles.topButton} onPress={() => navigate('Matching')}>
      <Text style={styles.text}>Matching Game</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.bottomButton} onPress={() => navigate('FlashCard')}>
      <Text style={styles.text}>Flashcards</Text>
    </TouchableOpacity>
  </View>
);

export default FlashCardOrMatchingScreen;
