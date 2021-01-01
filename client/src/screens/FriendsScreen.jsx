/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, StyleSheet, StatusBar, Text, Alert,
} from 'react-native';
import axios from 'axios';
import { withNavigationFocus } from 'react-navigation';
import FriendSideBar from '../components/FriendSideBar';
import FriendChat from '../components/FriendChat';
// import TopFriends from '../components/TopFriends';
import FriendSearchBar from '../components/FriendSearchBar';
import config from '../../../config';

const styles = StyleSheet.create({
  chatWrapper: {
    flexDirection: 'column',
  },
  searchBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 230,
    borderColor: '#147EFB',
    borderWidth: 1,
    borderRadius: 25,
    color: '#147EFB',
    margin: 20,
  },
});
const FriendsScreen = ({ navigation, isFocused }) => {
  // eslint-disable-next-line no-unused-vars
  const [searchResults, setSearchResults] = React.useState(null);
  const [currentFriend, setCurrentFriend] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);

  const onFriendPressHandler = (friend) => {
    setCurrentFriend(friend);
  };

  const searchFriend = (searchTerm) => {
    if (!searchTerm || searchTerm === '') return;
    axios.get(
      `${config.BASE_URL}/user/search?q=${searchTerm}`,
    ).then((res) => setSearchResults(res.data))
      .catch(() => setSearchResults([]));
  };

  const getCurrentUserInfo = () => {
    axios.get(
      `${config.BASE_URL}/user/${navigation.getParam('email')}`,
    ).then((res) => setUserInfo(res.data))
      .catch((e) => console.warn(e.message));
  };
  const updateFriend = (email, data) => {
    axios.patch(
      `${config.BASE_URL}/user/${email}`, data,
    ).then((res) => console.warn(res.data))
      .catch((e) => console.warn(e.message));
  };

  const checkFriend = (email, arr) => {
    if (!arr && !email) return;
    return arr.find((friend) => friend.email === email);
  };

  const sendFriendRequest = (data) => {
    // check if request has been already sent
    const requestSent = checkFriend(data.email, userInfo.friendrequests);
    if (!requestSent) return Alert.alert('Error!', 'Friend request was already sent!');

    // check if friend already
    const alreadyFriend = checkFriend(data.email, userInfo.friends);
    if (!alreadyFriend) return Alert.alert('Error!', 'You are already friend!');

    axios.get(
      `${config.BASE_URL}/user/${data.email}`,
    ).then((res) => {
      const userGettingRequest = res.data;
      const userSendingRequest = {
        username: userInfo.username,
        email: userInfo.email,
        image: userInfo.image,
      };
      const makeFriend = [userSendingRequest, ...userGettingRequest.friendrequests || []];
      // Sending friend request to the server to handle
      updateFriend(userGettingRequest.email, { friendrequests: makeFriend });
    }).catch((e) => console.warn(e.message));
  };

  React.useEffect(() => {
    getCurrentUserInfo();
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
      />
      <View>
        {/* <TopFriends /> */}
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={styles.chatWrapper}>
          <FriendSideBar
            friendLists={userInfo && userInfo.friends}
            onFriendPress={onFriendPressHandler}
          />
        </View>
        <View style={{ flexDirection: 'column', flex: 1 }}>

          <FriendSearchBar
            searchFriend={searchFriend}
            searchResults={searchResults}
            sendFriendRequest={sendFriendRequest}
          />
          {
            currentFriend
          && <FriendChat me={userInfo} currentFriend={currentFriend} />
}
        </View>
      </View>
    </View>
  );
};

export default withNavigationFocus(FriendsScreen);
