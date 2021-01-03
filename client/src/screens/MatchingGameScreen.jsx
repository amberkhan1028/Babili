import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Image, Text,
} from 'react-native';
import FlipCard from 'react-native-flip-card';

import Header from '../components/MemoryGameHeader';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
  },
  face: {
    borderRadius: 3,
    fontSize: 50,
    height: 100,
    width: 100,

  },
  back: {
    backgroundColor: '#ff0000',
    borderRadius: 3,
    fontSize: 50,
    height: 100,
    width: 100,
    justifyContent: 'center',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },

});

const MatchingGameScreen = () => {
  const [openedCard, setOpenedCard] = useState([]);
  const [matched, setMatched] = useState([]);

  const data = [
    { id: 1, name: 'apple', img: 'https://www.applesfromny.com/wp-content/uploads/2020/08/McIntosh_NYAS-Apples.png' },
    { id: 2, name: 'apple', img: 'https://logodix.com/logo/313588.png' },
  ];

  const flipCard = (index) => {
    setOpenedCard((opened) => [...opened, index]);
  };

  useEffect(() => {
    if (openedCard < 2) {
      return;
    }
    const firstMatched = data[openedCard[0]];
    const secondMatched = data[openedCard[1]];

    if (secondMatched && firstMatched.name === secondMatched.name) {
      console.warn('matched');
      setMatched([...matched, firstMatched.id]);
    }

    if (openedCard.length === 2) {
      setTimeout(() => setOpenedCard([]), 1500);
    }
  }, [openedCard]);

  const renderCards = (cards) => cards.map((card, i) => {
    let isFlipped = false;
    if (openedCard.includes(i)) {
      isFlipped = true;
    }
    if (matched.includes(card.name)) {
      isFlipped = true;
      console.warn(isFlipped);
    }
    return (
      <FlipCard
        flipHorizontal
        onFlipEnd={() => { flipCard(i); console.warn(openedCard); }}
        key={card.img}
        style={styles.card}
        clickable
      >
        <View style={styles.back}>
          <Text>Babili</Text>

        </View>
        <View style={styles.face}>
          <Image style={styles.image} source={{ uri: card.img }} />

        </View>
      </FlipCard>
    );
  });

  return (
    <View style={styles.container}>
      <View>
        <Header />
      </View>
      {renderCards(data) }

    </View>
  );
};

export default MatchingGameScreen;
