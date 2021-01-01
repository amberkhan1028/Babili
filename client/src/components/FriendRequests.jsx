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

const FriendRequests = ({ userInfo }) => {
  const updateFriend = (email, data) => {
    axios.patch(
      `${config.BASE_URL}/user/${email}`, data,
    ).then((res) => console.log('done'))
      .catch((e) => alert(e.message));
  };
  const acceptFriendRequest = (data) => {
    // reset prev results
    const removeFromFriendRequest = userInfo.friendrequests.filter(({
      email }) => email === data.email);
    const removeFromFriendRequestIndex = userInfo.friendrequests.findIndex(({
      email }) => email === data.email);

    userInfo.friendrequests.splice(removeFromFriendRequestIndex, 1);
    const addFriend = [...removeFromFriendRequest, ...userInfo.friends || []];
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
      const currentUserInfo = { name: userInfo.name, email: userInfo.email, image: userInfo.image };
      // update the friend lists of the user that sent request
      const updateFriendList = [currentUserInfo, ...userSendingRequest.friends];
      axios.patch(
        `${config.BASE_URL}/user/${data.email}`, { friends: updateFriendList }
      ).then(() => alert("Done with all!!!"))
      //updateFriend(data.email, { friends: updateFriendList});
    });
  };

  const declineFriendRequest = data => {
    // const removeFromFriendRequest = userInfo.
  };

  return (
    <View>
      {
        (userInfo && userInfo.friendrequests.length > 0) ?
         userInfo.friendrequests.map(({ image, username, email }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Image style={{ width: 30, height: 30 }} source={{ uri: image }} />
              <Text>{username}</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => acceptFriendRequest({ username, email, image })}
            >
              <Text style={styles.searchText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
            >
              <Text style={styles.searchText}>Decline</Text>
            </TouchableOpacity>
          </View>
        ))
          : (<Text>No Friend Requests Yet!</Text>)
      }
    </View>
  );
};

export default FriendRequests;
