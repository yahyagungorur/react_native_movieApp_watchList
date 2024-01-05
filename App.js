import {createStackNavigator} from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import ListScreen from "./src/components/ListScreen/ListScreen";
import SecondScreen from "./src/components/SecondScreen/SecondScreen";
import AdminScreen from './src/components/AdminScreen/AdminScreen';
import MainScreen from "./src/components/MainScreen/MainScreen";

/**
 * @description Initializing the stack navigator.
 */

const NavStack = createAppContainer(createStackNavigator(
  {
    ListScreen: { screen: ListScreen },
    MainScreen: { screen: MainScreen },
    SecondScreen: { screen: SecondScreen },
    AdminScreen : { screen: AdminScreen },
  },
  {
    navigationOptions: {
      headerBackTitle: null,
      headerStyle: { backgroundColor: "#02ADAD" },
      headerTitleStyle: {
        color: "white",
        flex: 1,
        textAlign: "center",
        fontSize: 16
      },
     headerTintColor: "white"
    }
  }
));

const App = NavStack;

export default App;
