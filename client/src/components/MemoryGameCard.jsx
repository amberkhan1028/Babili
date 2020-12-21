/* eslint-disable camelcase */
import React from 'react';
import {
  StyleSheet, View, TouchableHighlight, Image,
} from 'react-native';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
  },
  card_text: {
    fontSize: 50,
    fontWeight: 'bold',
  },
});

const MemoryGameCard = ({
  // eslint-disable-next-line react/prop-types
  src, name, clickCard, is_open,
}) => {
  let cardSrc = 'https://scontent-dfw5-1.xx.fbcdn.net/v/t31.0-8/p960x960/30848584_493792521023939_8435646401627466011_o.png?_nc_cat=109&ccb=2&_nc_sid=85a577&_nc_ohc=xtJDLwjcB0cAX8mXhmS&_nc_oc=AQnt9csMPj2bfXFsIeP93AGAr5htp-FsZ3KuhIJ5p1o62411qGsClDioXN2Y_3qu5NuyuYv-MzLp9qxcbMzjiK4T&_nc_ht=scontent-dfw5-1.xx&_nc_tp=30&oh=31f26c47c253e1fa5237173182b55450&oe=60056885';
  if (is_open) {
    cardSrc = src;
  }
  return (
    <View style={styles.card}>
      <TouchableHighlight
        onPress={clickCard}
        activeOpacity={0.75}
        underlayColor="#f1f1f1"
      >
        <Image
          name={name}
          source={{ uri: cardSrc }}
          style={{
            width: 200, height: 200, marginRight: 5, borderRadius: 10,
          }}
        />
      </TouchableHighlight>
    </View>
  );
};

export default MemoryGameCard;
