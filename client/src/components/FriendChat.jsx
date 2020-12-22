import React from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    backgroundColor: 'red',
  },
});

const FriendChat = () => (
  <View style={styles.container}>
    <Text>Friend Chat</Text>
  </View>
);

export default FriendChat;
