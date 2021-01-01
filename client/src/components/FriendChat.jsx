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
      console.log('subscription to my channel ok!');
    });

    chatChannel.bind('pusher:subscription_error', () => {
      console.log('subscription to my channel error!');
    });

    chatChannel.bind('join', ({ name }) => console.log(`${name} joined the chat`));

    chatChannel.bind('message', ({ message, receiver }) => {
      // Anytime there's a new message
      // Update message
      if (message.user._id === me.email || receiver._id === me.email) {
        setMessages((prevMessages) => GiftedChat.append(prevMessages, message)); }
    });

    // SET THE CURRENT USER ONLINE
    axios.put(`${pusherConfig.serverEndpoint}/users/${me.email}`, { name: me.username });

    // Get prev messages
    (async () => {
      const { data } = await axios.get(`${pusherConfig.serverEndpoint}/users/messages/?sender=${me.email}&receiver=${currentFriend.email}`);
      setMessages(data);
    })();
  }, []);

  const onSend = React.useCallback((messages = []) => {
    // Send message to pusher server

    const receiver = { _id: currentFriend.email, name: currentFriend.username || '', avatar: currentFriend.image };
    const message = messages[0];
    axios.post(`${pusherConfig.serverEndpoint}/users/messages`, { message, receiver });

    // Update messages
    // setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
  }, []);

  return (

    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{ _id: me.email, name: me.username, avatar: me.image }}
    />
  );
};

export default FriendChat;
