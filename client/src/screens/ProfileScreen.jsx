import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import {
  View, Text, TextInput, StyleSheet, StatusBar, Button, Image,
} from 'react-native';
const BASE_URL = 'http://192.168.0.12:3000';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 400 / 2,
    alignSelf: 'center',
  },
  textInput: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 25,
    fontSize: 14,
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputContainer: {
    paddingTop: 15,
  },
});

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState(null);

  const fetchUser = () => {
    axios.get(
      `${BASE_URL}/api/users/1`,
    ).then((res) => setUserInfo(res.data))
      .catch((e) => alert(e.message));
  };

  const updateUser = (data)=>{
    axios.patch(
      `${BASE_URL}/api/users/1`, data
    ).then((res) => alert(res.data))
      .catch((e) => alert(e.message));
  }

  const {
    handleSubmit, control, errors, setValue,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data, 'data');
    updateUser(data);
  };


  useEffect(() => {
    fetchUser();
  }, []);

  return (

    <View style={styles.container}>
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
      <Text>Skill Level:</Text>
      <View
        style={styles.inputContainer}
      >
        <Text>Country of origin:</Text>
        <Controller
          name="country"
          control={control}
          render={({ onChange, value }) => (
            <TextInput
              onChangeText={(text) => onChange(text)}
              value={value}
              placeholder="insert country here"
              defaultValue={userInfo?.country}
              style={styles.textInput}
            />
          )}
        />
        <Button onPress={handleSubmit(onSubmit)} title="submit" />
        <Text>Native language(s):</Text>
        <Controller
          name="language"
          control={control}
          render={({ onChange, value }) => (
            <TextInput
              onChangeText={(text) => onChange(text)}
              value={value}
              placeholder="insert native language(s) here"
              defaultValue=""
              style={styles.textInput}
            />
          )}
        />
        <Button onPress={handleSubmit(onSubmit)} title="submit" />
        <Text>About me:</Text>
        <Controller
          name="aboutme"
          control={control}
          render={({ onChange, value }) => (
            <TextInput
              onChangeText={(text) => onChange(text)}
              value={value}
              placeholder="insert description here"
              defaultValue=""
              style={styles.textInput}
            />
          )}
        />
        <Button onPress={handleSubmit(onSubmit)} title="submit" />
      </View>
    </View>
  );
};
// const styles = StyleSheet.create({});

export default ProfileScreen;
