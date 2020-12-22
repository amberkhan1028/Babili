import React from 'react';
import { View, Text, StyleSheet,
} from 'react-native';
import SearchBar from 'react-native-search-bar';

import FriendSideBar from '../components/FriendSideBar';
import FriendChat from '../components/FriendChat';
import TopFriends from '../components/TopFriends';

const styles = StyleSheet.create({
  chatWrapper: {
  //  flex: 1,
    flexDirection: 'column',
  },
});
const FriendsScreen = () => (
  <View>
    <View>
      <TopFriends />
    </View>
    <SearchBar
      placeholder="search for friends"
    />
    <View style={styles.chatWrapper}>
      <FriendSideBar />
      <FriendChat />
    </View>
  </View>
);

export default FriendsScreen;
