import * as React from 'react';
import { moderateScale } from 'react-native-size-matters';
import Svg, { Path, Circle } from 'react-native-svg';

export default () => (
  <Svg width={moderateScale(74)} height={moderateScale(74)} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={10} stroke="#f42b03" strokeWidth={1} />
    <Path
      d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"
      fill="#f42b03"
      stroke="#f42b03"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
