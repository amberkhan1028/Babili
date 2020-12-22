import React from 'react';
import { View, Text } from 'react-native';
import { Searchbar } from 'react-native-paper';

const FriendsScreen = () => (
  <View>
    <Text>Friends</Text>
    <Searchbar
      placeholder="search for friend"
    />
  </View>
);

// const styles = StyleSheet.create({});

export default FriendsScreen;
