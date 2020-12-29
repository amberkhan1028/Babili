/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, StyleSheet, StatusBar,
} from 'react-native';
import axios from 'axios';
import FriendSideBar from '../components/FriendSideBar';
import FriendChat from '../components/FriendChat';
import TopFriends from '../components/TopFriends';
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
const FriendsScreen = ({ navigation }) => {
  // eslint-disable-next-line no-unused-vars
  const [friendLists, setFriendLists] = React.useState([
    // { id: 1, name: 'Friend1', img: 'https://i.redd.it/v0caqchbtn741.jpg' },
    // { id: 2, name: 'Friend2', img: 'https://i.redd.it/v0caqchbtn741.jpg' },
    // { id: 3, name: 'Friend3', img: 'https://i.redd.it/v0caqchbtn741.jpg' },
  ]);
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

  const sendFriendRequest = (data) => {
    // reset prev results
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
  }, []);

  return (
    <View>
      <StatusBar
        barStyle="dark-content"
      />
      <View>
        <TopFriends />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.chatWrapper}>
          <FriendSideBar
            friendLists={userInfo && userInfo.friends}
            onFriendPress={onFriendPressHandler}
          />
          <FriendChat currentFriend={currentFriend} />
        </View>
        <FriendSearchBar
          searchFriend={searchFriend}
          searchResults={searchResults}
          sendFriendRequest={sendFriendRequest}
        />
      </View>
    </View>
  );
};

export default FriendsScreen;
