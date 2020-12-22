import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  score_container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  score: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});

// eslint-disable-next-line react/prop-types
const Score = ({ score }) => (
  <View style={styles.score_container}>
    <Text style={styles.score}>{ score }</Text>
  </View>
);

export default Score;
