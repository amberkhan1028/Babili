/* eslint-disable react/prop-types */
import React from 'react';
import { Dimensions } from 'react-native';
import { Box, Text } from './Theme';

const { width } = Dimensions.get('window');

export default function QuestionSlide({ question, questionNr }) {
  return (
    <Box {...{ width }} style={{ alignItems: 'center', padding: 10 }}>
      <Text style={{
        fontSize: 35,
        color: 'white',
        marginTop: 10,
      }}
      >
        Question Number
        {' '}
        {questionNr}
      </Text>
      <Text style={{
        fontSize: 20,
        lineHeight: 25,
        color: 'white',
        marginTop: 40,
        textAlign: 'center',
      }}
      >
        {question}
      </Text>
    </Box>
  );
}
