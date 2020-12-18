import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './src/screens/LoginScreen';

const navigator = createStackNavigator({
  Login: LoginScreen,
}, {
  initialRouteName: 'Login',
  defaultNavigationOptions: {
    title: 'Babili',
  },
});

export default createAppContainer(navigator);
