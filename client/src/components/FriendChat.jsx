/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  KeyboardAvoidingView,
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
const FriendChat = ({ currentFriend, sender }) => {
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
      if (message.user._id === sender.email || receiver._id === sender.email) {
        setMessages((prevMessages) => GiftedChat.append(prevMessages, message));
      }
    });
    axios.put(`${pusherConfig.serverEndpoint}/users/${sender.email}`, { name: sender.username });
    // get previous messages
    (async () => {
      const { data } = await axios.get(`${pusherConfig.serverEndpoint}/users/messages/?sender=${sender.email}&receiver=${currentFriend.email}`);
      setMessages(data);
    })();
  }, [currentFriend]);

  const onSend = React.useCallback((messages = []) => {
    const receiver = { _id: currentFriend.email, name: currentFriend.username || '', avatar: currentFriend.image };
    const message = messages[0];
    axios.post(`${pusherConfig.serverEndpoint}/users/messages`, { message, receiver });
  }, []);
  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
      <View style={{ flex: 2 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          // keyboardVerticalOffset={90}
        >
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{ _id: sender.email, name: sender.username, avatar: sender.image }}
            showUserAvatar
          />
        </KeyboardAvoidingView>

      </View>
    </TouchableWithoutFeedback>
  );
};
export default FriendChat;
