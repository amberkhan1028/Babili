import React from 'react';
import { View, Text } from 'react-native';
// import { StreamChat } from 'stream-chat';
// import {
//   Chat, Channel, MessageList, MessageInput,
// } from 'stream-chat-expo';
import config from '../../../config';

// const chatClient = new StreamChat('f8wwud5et5jd');
// const userToken
// =
// 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoicmVkLXdhdGVyLTQifQ
// .pa1nzLoZ2 - UkF4bohlHeC78GTgNA - 4F9aZkWPHheUd4';

// const user = {
//   id: 'red-water-4',
//   name: 'Red water',
//   image: 'https://getstream.io/random_png/?id=red-water-4&amp;name=Red+water',
// };

// chatClient.connectUser(user, userToken);
// const channel = chatClient.channel('messaging', 'curly-cake-8');

// const ChannelScreen = React.memo(() => (
//   <SafeAreaView>
//     <Chat client={chatClient}>
//       {/* Setting keyboardVerticalOffset as 0, since we don't have any header yet */}
//       <Channel channel={channel} keyboardVerticalOffset={0}>
//         <View style={{ flex: 1 }}>
//           <MessageList />
//           <MessageInput />
//         </View>
//       </Channel>
//     </Chat>
//   </SafeAreaView>
// ));

export default function MessagesScreen() {
  console.warn(process.env.EXPO_PUSHER_CLUSTER);
  return (
    <View>
      <Text>{`HELLO ${config.PUSHER_APP_ID}`}</Text>
      {/* <ChannelScreen /> */}
    </View>
  );
}
