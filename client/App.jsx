import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './src/screens/LoginScreen';
import MatchingGameScreen from './src/screens/MatchingGameScreen';

const navigator = createStackNavigator({
  Login: LoginScreen,
  Matching: MatchingGameScreen,
}, {
  initialRouteName: 'Matching',
  defaultNavigationOptions: {
    title: 'Babili',
  },
});

export default createAppContainer(navigator);
