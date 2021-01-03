/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import Pusher from 'pusher-js/react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';
import pusherConfig from '../../../pusher.json';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f5f2D0',
  },
});
const FriendChat = ({ currentFriend, me }) => {
  const [messages, setMessages] = React.useState([]);
  React.useEffect(() => {
    const pusher = new Pusher(pusherConfig.key, pusherConfig);
    const chatChannel = pusher.subscribe('chat_channel');
    chatChannel.bind('pusher:subscription_succeeded', () => {
      console.warn('subscription to channel ok!');
    });
    chatChannel.bind('pusher:subscription_error', () => {
      console.warn('subscription to channel error!');
    });
    chatChannel.bind('join', ({ name }) => console.warn(`${name} joined the chat`));
    chatChannel.bind('message', ({ message, receiver }) => {
      // update messages anytime there's a new message
      if (message.user._id === me.email || receiver._id === me.email) {
        setMessages((prevMessages) => GiftedChat.append(prevMessages, message));
      }
    });
    axios.put(`${pusherConfig.serverEndpoint}/users/${me.email}`, { name: me.username });
    // get previous messages
    (async () => {
      const { data } = await axios.get(`${pusherConfig.serverEndpoint}/users/messages/?sender=${me.email}&receiver=${currentFriend.email}`);
      setMessages(data);
    })();
  }, []);
  const onSend = React.useCallback((messages = []) => {
    const receiver = { _id: currentFriend.email, name: currentFriend.username || '', avatar: currentFriend.image };
    const message = messages[0];
    axios.post(`${pusherConfig.serverEndpoint}/users/messages`, { message, receiver });
  }, []);
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{ _id: me.email, name: me.username, avatar: me.image }}
      showUserAvatar
    />
  );
};
export default FriendChat;
