import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import {
  Card, Button, Icon,
} from 'react-native-elements';

const randomWords = require('random-words');

const FlashCardScreen = () => {
  const [words] = useState(randomWords(2));
  const [flashCards] = useState([]);
  useEffect(() => {
    words.forEach(async (word) => {
      const { data } = await axios.get(
        `https://www.dictionaryapi.com/api/v3/references/spanish/json/${word}?key=d6b808a4-8633-45b9-b236-00cea9023545`,
      );

      flashCards.push(data[0]);
    });
  }, [flashCards]);
  return (
    <View style={{ flex: 1 }}>
      {
        flashCards.map((card) => (
          <View style={{ flex: 1 }}>
            <Card style={{ flex: 1 }} key={card.id}>
              <Card.Title>{ card.hwi && card.hwi.hw }</Card.Title>
              <Card.Divider />
              <Card.Image source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg' }}>
                <Text style={{ marginBottom: 10 }}>
                  { `${card.fl}: ${card.shortdef && card.shortdef[0]}` }
                </Text>
                <Button
                  icon={<Icon name="code" color="#ffffff" />}
                  buttonStyle={{
                    borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,
                  }}
                  title="Flip"
                />
              </Card.Image>
            </Card>
          </View>

        ))
    }
    </View>
  );
};

export default FlashCardScreen;
