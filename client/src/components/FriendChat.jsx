/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'red',
  },
});

const FriendChat = ({ currentFriend }) => (
  <View style={styles.container}>
    <Text>Friend Chat</Text>
    {currentFriend && (<Text>{currentFriend.name}</Text>)}
    <TextInput />
    <TextInput>send message</TextInput>
  </View>
);

export default FriendChat;
