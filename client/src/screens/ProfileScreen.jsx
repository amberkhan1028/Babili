/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import {
  View, Text, TextInput, StyleSheet, StatusBar, Button, Image, ScrollView,
  KeyboardAvoidingView, TouchableOpacity, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import config from '../../../config';
import FriendRequests from '../components/FriendRequests';

const styles = StyleSheet.create({
  container: {
    flex: 2,
    margin: 2,
    backgroundColor: '#E8E8E8',
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
    color: '#F42B03',
  },
  image: {
    width: '25%',
    height: '50%',
    borderRadius: 40,
    alignSelf: 'center',
  },
  textInput: {
    borderColor: '#CCCCCC',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    height: 25,
    fontSize: 14,
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputContainer: {
    paddingTop: 15,
  },
});

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);

  const fetchUser = () => {
    axios.get(
      `${config.BASE_URL}/user/`,
    ).then((res) => setUserInfo(res.data))
      .catch((e) => console.warn('1', e.message));
  };

  const updateUser = (data) => {
    axios.patch(
      `${config.BASE_URL}/user/${navigation.getParam('email')}`, data,
    ).then((res) => console.warn('2', res.data))
      .catch((e) => console.warn('3', e.message));
  };

  const {
    handleSubmit, control,
  } = useForm();

  const onSubmit = (data) => {
    updateUser(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (

    <View style={styles.container}>
      <View style={{ backgroundColor: '#ffc857', width: '100%', flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
        />
        <Text
          style={styles.header}
        >
          {' '}
          User Profile
        </Text>
        <Image
          source={{
            uri: 'https://i.redd.it/v0caqchbtn741.jpg',
          }}
          style={styles.image}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#F42B03', height: 50, justifyContent: 'center', display: 'flex', flexDirection: 'row',
        }}
        onPress={() => navigation.navigate('Quiz')}
      >

        <Icon
          name="trophy"
          style={{
            marginTop: 14, marginRight: 5, color: '#ffc857', fontSize: 18,
          }}
        />
        <Text style={{ color: 'white', fontSize: 18, marginTop: 10 }}>Novice</Text>
        <Text style={{
          position: 'absolute', right: 10, color: 'white', fontWeight: 'bold',
        }}
        >
          Level up!
        </Text>
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={{
          margin: 5, fontSize: 20, color: '#0f9535', fontWeight: 'bold',
        }}
        >
          🎌Country of origin
        </Text>
        <Controller
          name="country"
          control={control}
          render={({ onChange, value }) => (
            <TextInput
              onChangeText={(text) => onChange(text)}
              value={value}
              defaultValue={userInfo && userInfo.country}
              style={{ backgroundColor: 'white', margin: 5, borderRadius: 5 }}
            />
          )}
        />
        <Controller
          name="aboutme"
          control={control}
          render={({ onChange, value }) => (
            <TextInput
              onChangeText={(text) => onChange(text)}
              value={value}
              defaultValue=""
              placeholder="about me"
              multiline
              numberOfLines={10}
              style={{
                margin: 5, backgroundColor: 'white', borderRadius: 5, textAlign: 'center', fontSize: 20, color: '#0f9535',
              }}
            />
          )}
        />
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text style={{
            marginLeft: 5,
            backgroundColor: 'white',
            width: 85,
            height: 30,
            color: '#2E86ab',
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 5,
            borderRadius: 5,
          }}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <Button onPress={handleSubmit(onSubmit)} title="submit" />
      <Text>Friend Requests</Text>
      <ScrollView>
        <FriendRequests />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
