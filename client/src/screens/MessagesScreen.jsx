/* eslint-disable no-shadow */
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

export default function MessagesScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hi I'm Devi, I'll be your english tutor. What category of words would you like to learn today?",
        createdAt: new Date(),
        quickReplies: {
          type: 'checkbox', // or 'checkbox',
          keepIt: true,
          values: [
            {
              title: '🍔 Food',
              value: 'yes',
            },
            {
              title: '🌆 Places',
              value: 'yes_picture',
            },
            {
              title: "😞 I don't feel like practicing today ",
              value: 'no',
            },
          ],
        },
        user: {
          _id: 2,
          name: 'Devi',
          avatar: 'https://cdn2.vectorstock.com/i/1000x1000/84/56/chatbot-cute-female-robot-in-chat-bubble-icon-vector-23798456.jpg',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
        name: 'Aiesha',
        avatar: 'https://www.kindpng.com/picc/m/163-1636340_user-avatar-icon-avatar-transparent-user-icon-png.png',
      }}
    />
  );
}
