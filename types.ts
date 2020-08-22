import { ImageRequireSource } from "react-native";

export type HomeStackParamList = {
  Walkthrough: undefined;
  HomeScreen: undefined;
};

export interface SlideObj {
  id: string;
  title: string;
  image: ImageRequireSource;
  subtitle: string;
}
