/* eslint-disable object-curly-newline */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, TouchableOpacity, Image, StyleSheet, Text,
} from 'react-native';
import axios from 'axios';

import config from '../../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  searchText: { color: 'white' },
  addButton: {
    backgroundColor: '#147EFB', marginBottom: 5, justifyContent: 'center', paddingHorizontal: 5,
  },
});

const FriendRequests = ({ currentUserEmail }) => {
  const [userInfo, setUserInfo] = React.useState(null);

  const getCurrentUserInfo = () => {
    axios.get(
      `${config.BASE_URL}/user/${currentUserEmail}`,
    ).then((res) => setUserInfo(res.data))
      .catch((e) => console.warn(e.message));
  };
  const updateFriend = (email, data) => {
    axios.patch(
      `${config.BASE_URL}/user/${email}`, data,
    ).then((res) => alert(res.data))
      .catch((e) => alert(e.message));
  };
  const acceptFriendRequest = (data) => {
    // reset prev results
    const removeFromFriendRequest = userInfo.friendrequests.filter(({
      email }) => email === data.email);
    const removeFromFriendRequestIndex = userInfo.friendrequests.findIndex(({
      email }) => email === data.email);
    // const addFriend = [userSendingRequest, ...userGettingRequest.friendrequests];
    console.warn('REMOVE FROM FRIEND REQ=>', removeFromFriendRequestIndex);
    userInfo.friendrequests.splice(removeFromFriendRequestIndex, 1);
    console.warn('USER FRIEND REQ=>', userInfo.friendrequests);
    const addFriend = [...removeFromFriendRequest, ...userInfo.friends];
    // send friend request to the server to handle
    updateFriend(userInfo.email, {
      friendrequests: [...userInfo.friendrequests],
      friends: addFriend,
    });
    // update the friend that sends request
    axios.get(
      `${config.BASE_URL}/user/${data.email}`,
    ).then((res) => {
      const userSendingRequest = res.data;
      // console.warn('USER SENDING REQ RESP=>', userSendingRequest);
      const currentUserInfo = { name: userInfo.name, email: userInfo.email, image: userInfo.image };
      console.warn(currentUserInfo, 'CURRENT');
      // update the friend lists of the user that sent request
      const updateFriendList = [...currentUserInfo, ...userSendingRequest.friends];
      updateFriend(data.email, { friends: updateFriendList });
    });
  };

  React.useEffect(() => {
    getCurrentUserInfo();
  }, []);

  return (
    <View>
      {
        userInfo && userInfo.friendrequests.map(({ image, username, email }) => (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Image style={{ width: 30, height: 30 }} source={{ uri: image }} />
              <Text>{username}</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => acceptFriendRequest({ username, email, image })}
            >
              <Text style={styles.searchText}>Accept Request</Text>
            </TouchableOpacity>
          </View>
        ))
      }
    </View>
  );
};

export default FriendRequests;
