/* eslint-disable react/prop-types */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Animated, { interpolate } from 'react-native-reanimated';
import GoodIcon from './GoodIcon';
import BadIcon from './BadIcon';
import { Box, Text } from './Theme';

const { height, width } = Dimensions.get('window');

const FinishedAlert = ({
  finished,
  onRestart,
  userAnswers,
}) => {
  const [percent, setPercent] = useState();
  const [correctCount, setCorrectCount] = useState(0);

  const opacity = interpolate(finished, {
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const zIndex = interpolate(finished, {
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const calculaterScore = () => {
    let correct = 0;
    for (const el of userAnswers) {
      if (el.answerIsCorrect) {
        correct++;
      }
    }
    setCorrectCount(correct);
    const got = (correct / 10);
    const percentage = got * 100;
    setPercent(percentage);
  };

  useEffect(() => {
    calculaterScore();
  }, [userAnswers]);

  return (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#00000090',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        zIndex,
        flex: 1,
      }}
    >
      <Box
        height={moderateScale(height * 0.7)}
        width={moderateScale(width * 0.85)}
        alignItems="center"
      >
        <Box
          style={{
            backgroundColor: 'white',
            height: moderateScale(120),
            width: moderateScale(120),
            position: 'absolute',
            zIndex: 1,
            borderRadius: 75,
            justifyContent: 'center',
            alignItems: 'center',
            top: moderateScale(12),
          }}
        >
          {percent >= 70 ? <GoodIcon /> : <BadIcon />}
        </Box>
        <Box height={height * 0.15} />
        <Box
          style={{
            flex: 1,
            alignItems: 'center',
            paddingTop: 50,
            padding: 10,
            backgroundColor: 'white',
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(25),
              color: 'black',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            {percent >= 70 ? 'You leveled up!' : 'You did not level up'}
          </Text>

          <Text
            style={{
              fontSize: moderateScale(15),
              color: percent >= 70 ? '#0f9535' : '#f42b03',
              textAlign: 'center',
              marginBottom: 10,

            }}
          >
            {percent}
            % SCORE
          </Text>

          <Text
            style={{
              fontSize: 15,
              lineHeight: 25,
              color: 'black',
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            {
  percent >= 70 ? 'Keep up the great Work!' : 'Practice more and try again'
}

          </Text>

          <Text
            style={{
              color: 'black',
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 10,
              lineHeight: 25,
            }}
          >
            There were
            {' '}
            {userAnswers.length}
            {' '}
            questions and you answered
            {' '}
            {correctCount}
            {' '}
            correctly.
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: '#2e86ab',
              width: 150,
              height: 50,
              justifyContent: 'center',
              borderRadius: 15,
              marginTop: 50,
            }}
            onPress={onRestart}
          >
            <Text style={{
              color: 'white', textTransform: 'uppercase', fontSize: 18, textAlign: 'center',
            }}
            >
              Okay
            </Text>
          </TouchableOpacity>

        </Box>
      </Box>
    </Animated.View>
  );
};

export default FinishedAlert;
