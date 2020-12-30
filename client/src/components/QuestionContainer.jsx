/* eslint-disable react/prop-types */
import React from 'react';
import { SafeAreaView } from 'react-native';

export default function QuestionContainer({ children }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      { children }
    </SafeAreaView>
  );
}
