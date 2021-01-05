/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow-text';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { Audio } from 'expo-av';
import firebase from 'firebase';
import {
  Platform, ActivityIndicator, StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import config from '../../../config';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'white',
    marginBottom: 5,
    width: '90%',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    flexDirection: 'row',
  },
});

export default function MessagesScreen() {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [, setQuery] = useState('');

  const recordingOptions = {
  // android not currently in use, but parameters are required
    android: {
      extension: '.m4a',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  const deleteRecordingFile = async () => {
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI());
      await FileSystem.deleteAsync(info.uri);
    } catch (error) {
      console.warn('There was an error deleting recording file', error);
    }
  };

  const getTranscription = async () => {
    setIsFetching(true);
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI());
      console.warn(`FILE INFO: ${JSON.stringify(info)}`);
      const { uri } = info;
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'audio/x-wav',
        name: 'speech2text',
      });
      const response = await fetch(`https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${config.OCR}`, {
        method: 'POST',
        body: {
          audio: {
            content: info,
          },
          config: {
            enableAutomaticPunctuation: true,
            encoding: 'LINEAR16',
            languageCode: 'en-US',
            model: 'default',

          },

        },
      });
      const data = await response.json();
      console.warn(data);
      setQuery(data.transcript);
    } catch (error) {
      console.warn('There was an error reading file', error);
      stopRecording();
      resetRecording();
    }
    setIsFetching(false);
  };

  const startRecording = async () => {
    const { status } = await Permissions.getAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') return;

    setIsRecording(true);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    });
    const recording = new Audio.Recording();

    try {
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
    } catch (error) {
      console.warn(error);
      stopRecording();
    }

    setRecording(recording);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
    // Do nothing -- we are already unloaded.
    }
  };

  const resetRecording = () => {
    deleteRecordingFile();
    setRecording(null);
  };

  const handleOnPressIn = () => {
    startRecording();
  };

  const handleOnPressOut = () => {
    stopRecording();
    getTranscription();
  };

  const BOT_USER = {
    _id: 2,
    name: 'Devi',
    avatar: 'https://cdn2.vectorstock.com/i/1000x1000/84/56/chatbot-cute-female-robot-in-chat-bubble-icon-vector-23798456.jpg',
  };

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      config.DIALOG_FLOW_CLIENT_EMAIL,
      config.DIALOG_FLOW_PRIVATE_KEY,
      Dialogflow_V2.LANG_ENGLISH_US,
      config.DIALOG_FLOW_PROJECT_ID,
    );
    registerForPushNotificationsAsync();
  });

  useEffect(() => {
    setMessages([
      {
        _id: Math.round(Math.random() * 1000000),
        text: "Hi I'm Devi! I'm here to help you learn how to converse in English. What would you like to talk about today?",
        createdAt: new Date(),
        user: BOT_USER,
      },
    ]);
  }, []);

  useEffect(() => {
    Permissions.askAsync(Permissions.AUDIO_RECORDING);
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        // ask for permission
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
        // if they deny permission
        if (finalStatus !== 'granted') {
          console.warn('Failed to get push token for push notification!');
          return;
        } // if they give permission
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.warn(token);
        const currentUser = await firebase.auth().currentUser;
        firebase
          .database()
          .ref(`users/${currentUser.uid}/push_token`)
          .set(token);
      } else { // they've already given permission previously
        console.warn('User has already given permission');
      }
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      const currentUser = await firebase.auth().currentUser;
      firebase
        .database()
        .ref(`users/${currentUser.uid}/push_token`)
        .set(token);
    } else {
      console.warn('Must use physical device for Push Notifications');
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

    }
  };

  const sendBotResponse = (text) => {
    const msg = {
      _id: Math.round(Math.random() * 1000000),
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    setMessages((previousMessages) => GiftedChat.append(previousMessages, [msg]));
  };

  const handleGoogleResponse = (result) => {
    const text = result.queryResult.fulfillmentMessages[0].text.text[0];
    sendBotResponse(text);
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));

    const message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      (result) => handleGoogleResponse(result),
      (error) => console.warn(error),
    );
  }, []);

  const renderBubble = (props) => (
    <Bubble
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#0f9535',
        },
      }}
    />
  );

  return (
    <View style={{ flex: 5 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={handleOnPressIn}
          onPressOut={handleOnPressOut}
          activeOpacity={1}
        >
          {isRecording ? (
            <FontAwesome name="microphone" size={25} color="#F42B03" />
          )
            : (
              <>
                <FontAwesome name="microphone" size={25} color="#Ffc857" />

              </>
            )}
          {isFetching && <ActivityIndicator color="#0f9535" size="large" />}
          { !isFetching
            && <Text style={{ paddingLeft: 10, fontSize: 20 }}>Hold for talk to text</Text> }
        </TouchableOpacity>
      </View>

    </View>
  );
}
