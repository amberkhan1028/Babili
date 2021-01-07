/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import {
  ScrollView, View,
} from 'react-native';
import axios from 'axios';

import Cards from '../components/Card';

const randomWords = require('random-words');

const FlashCardScreen = () => {
  const [words] = useState(randomWords(11));
  const [flashCards, setFlashCards] = useState([]);

  useEffect(() => {
    words.forEach(async (word) => {
      const { data } = await axios.get(
        `https://www.dictionaryapi.com/api/v3/references/spanish/json/${word}?key=d6b808a4-8633-45b9-b236-00cea9023545`,
      );
      flashCards.push(data[0]);
      setFlashCards([...flashCards, data[0]]);
    });
  }, []);
  return (
    <View style={{ flex: 1 }}>

      <ScrollView>
        {
        flashCards.slice(1, flashCards.length - 1).map((card, i) => (
          <Cards
            card={card}
            key={i * Math.random()}
          />
        ))
        }
      </ScrollView>
    </View>
  );
};

export default FlashCardScreen;
