import React, { useRef, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Animated } from "react-native";
import { white, blue, grey } from "../constants/Colors";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../types";
import { Button, Slide } from "../components";
import { width, height } from "../constants/Layout";
import { slides } from "../data/slides";

const DOT_SIZE = 12;

const Walkthrough = ({
  navigation,
}: StackScreenProps<HomeStackParamList, "Walkthrough">) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>();
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          if (Math.round(event.nativeEvent.contentOffset.x / width) === 0) {
            setActiveSlideIndex(0);
          } else if (
            Math.round(event.nativeEvent.contentOffset.x / width) === 1
          ) {
            setActiveSlideIndex(1);
          } else {
            setActiveSlideIndex(2);
          }
        }}
      >
        {slides.map((slide, index) => {
          return <Slide key={index} slide={slide} />;
        })}
      </ScrollView>
      <View style={styles.pagination}>
        {slides.map((slide, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const backgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: [grey, blue, grey],
            extrapolate: "clamp",
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.75, 1, 0.75],
            extrapolate: "clamp",
          });

          return (
            <View style={{ position: "relative" }} key={index}>
              <Animated.View
                style={{
                  ...styles.dot,
                  backgroundColor,
                  transform: [{ scale }],
                }}
              ></Animated.View>
              {index === 2 && <View style={{ ...styles.line }} />}
            </View>
          );
        })}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          label={activeSlideIndex === 2 ? "Get Started" : "Continue"}
          onPress={
            activeSlideIndex === 2
              ? () => navigation.navigate("HomeScreen")
              : () => {
                  console.log((activeSlideIndex + 1) * width);
                  scrollRef.current?.scrollTo({
                    x: (activeSlideIndex + 1) * width,
                    animated: true,
                  });
                }
          }
        />
      </View>
    </View>
  );
};

export default Walkthrough;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: white,
  },
  buttonContainer: {
    width: width,
    height: height * 0.25,
    justifyContent: "center",
  },
  pagination: {
    width: width,
    height: height * 0.05,
    // backgroundColor: blue,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginHorizontal: 4,
    backgroundColor: blue,
    position: "relative",
  },
  line: {
    position: "absolute",
    width: width / 2,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: grey,
    top: DOT_SIZE / 2 - 1,
    left: DOT_SIZE / 2,
    zIndex: -1,
  },
});
