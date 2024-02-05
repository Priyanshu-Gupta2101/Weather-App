import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as Splashscreen from "expo-splash-screen";
import Tabs from "./src/navigation/navigate";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}
