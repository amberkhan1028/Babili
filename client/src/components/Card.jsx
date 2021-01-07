/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React from 'react';
import FlipCard from 'react-native-flip-card';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet, Text, View, Alert,
} from 'react-native';

import axios from 'axios';

import * as Speech from 'expo-speech';
import config from '../../../config';

const styles = StyleSheet.create({
  container: {
    flexBasis: '50%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    padding: 20,
    height: 200,
    borderWidth: 4,
    borderColor: '#0f9535',
    borderRadius: 6,

  },
  cardTitle: {
    color: '#7f8c8d',
    fontSize: 18,
    position: 'absolute',
    left: 20,
    top: 20,
  },
  subjectTitle: {
    color: '#F42B03',
    fontSize: 18,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  microphoneTitle: {
    color: '#F42B03',
    fontSize: 30,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  starTitle: {
    color: '#Ffc857',
    fontSize: 30,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  termText: {
    fontSize: 30,
    fontWeight: '500',
    color: '#2042a6',
  },
  definitionText: {
    fontSize: 20,
    color: '#007aff',
  },
});

export default function Card({ card }) {
  const handleSound = async (cardToBePlayed) => {
    const thingToSay = cardToBePlayed.hwi.hw;
    Speech.speak(thingToSay, {
      language: 'en',
      pitch: 1.5,
      rate: 0.75,

    });
  };

  return (

    <FlipCard perspective={500} friction={6} flipHorizontal flipVertical={false}>
      {/* Face Side */}
      <View style={[styles.container]}>
        <Text style={styles.cardTitle}>English</Text>
        <Icon name="microphone" style={styles.microphoneTitle} onPress={() => handleSound(card)} />
        <Text style={styles.definitionText}>{card.hwi.hw.toUpperCase()}</Text>
      </View>
      {/* Back Side */}
      <View style={[styles.container]}>
        <Text style={styles.cardTitle}>Español</Text>
        <Icon
          name="star"
          light
          style={styles.starTitle}
          onPress={async () => {
            Alert.alert(`Saved ${card.hwi.hw.toUpperCase()} to your word bank!`);
            await axios.post(`${config.BASE_URL}/wordbank`, { nativeterm: card.shortdef, engterm: card.hwi.hw.toUpperCase() });
          }}
        />
        <Text style={styles.termText}>
          { card.shortdef[0] && card.shortdef[0].split(',')
            ? card.shortdef[0].split(',')[0]
            : card.shortdef ? card.shortdef[0]
              : 'No translation found' }
        </Text>
      </View>
    </FlipCard>
  );
}
