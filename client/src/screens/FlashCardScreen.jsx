import React, { useEffect, useState } from 'react';
import {
  ScrollView, View,
} from 'react-native';
import axios from 'axios';

import Cards from '../components/Card';

const randomWords = require('random-words');

const FlashCardScreen = () => {
  const [words] = useState(randomWords(10));
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
        flashCards.sort(() => 0.5 - Math.random()).map((card) => (
          // console.log(card);
          // return (
          //   <View key={card.meta.id}>
          //     <Card>
          //       <Card.Title>{ card.hwi && card.hwi.hw.toUpperCase() }</Card.Title>
          //       <Card.Divider />
          //       <Card.Image source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg' }}>
          //         <Text style={{ marginBottom: 10 }}>
          //           { `${card.fl}:`}
          //         </Text>
          //         <Button
          //           icon={<Icon name="code" color="#ffffff" />}
          //           buttonStyle={{
          //             borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,
          //           }}
          //           title="Flip"
          //         />
          //       </Card.Image>
          //     </Card>
          //   </View>

          // );
          <Cards
            card={card}
          />
        ))
        }
      </ScrollView>
    </View>
  );
};

export default FlashCardScreen;
