/* eslint-disable react/prop-types */
import React from 'react';
import { View } from 'react-native';
import { Slider } from 'react-native-elements';

export default function MemoryGameSlider({ setColumns, setRows, rows }) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        justifyContent: 'center',
        flex: 0.2,
        alignItems: 'stretch',
      }}
    >
      <Slider
        step={0.2}
        thumbStyle={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,

          elevation: 3,
        }}
        trackStyle={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,

          elevation: 3,
        }}
        thumbTintColor="#ffbb33"
        onValueChange={(current) => {
          const v = parseInt(current * 10, 8) + 2;
          const newv = Math.floor(v / 2) + 1;
          setRows(newv);
          setColumns(newv);
        }}
        value={rows / 10}
      />
    </View>
  );
}
