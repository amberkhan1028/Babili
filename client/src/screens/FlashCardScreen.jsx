import React from 'react';
import { View, Text } from 'react-native';
import {
  Card, Button, Icon,
} from 'react-native-elements';

const users = [
  {
    name: 'brynn',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
  },
  {

  },
];

const FlashCardScreen = () => (
  <View>
    {
      users.map(() => (
        <View>
          <Card>
            <Card.Title>HELLO WORLD</Card.Title>
            <Card.Divider />
            <Card.Image source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg' }}>
              <Text style={{ marginBottom: 10 }}>
                The idea with React Native Elements is more about component str
              </Text>
              <Button
                icon={<Icon name="code" color="#ffffff" />}
                buttonStyle={{
                  borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,
                }}
                title="VIEW NOW"
              />
            </Card.Image>
          </Card>
        </View>

      ))
}
  </View>
);

export default FlashCardScreen;
