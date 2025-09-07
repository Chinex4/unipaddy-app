// app/onboarding.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import GradientButton from "@/components/ui/GradientButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Experience Easy Mode of Dues Payment",
    subtitle:
      "Enjoy a fast, seamless, and hassle-free way to pay your dues with ease and convenience!",
    image: require("../../assets/images/unipaddy/onb1.png"),
    buttonText: "Continue",
  },
  {
    id: "2",
    title: "Sign up for Class Attendance Effortlessly",
    subtitle:
      "Easily sign up for class attendance with a fast, hassle-free, and accurate system—no paperwork, no delays!",
    image: require("../../assets/images/unipaddy/onb1.png"),
    buttonText: "Continue",
  },
  {
    id: "3",
    title: "Calculate your GPA & CGPA Seamlessly",
    subtitle:
      "Easily calculate your GPA & CGPA with a seamless & accurate tool. Track your academic progress easily!",
    image: require("../../assets/images/unipaddy/onb1.png"),
    buttonText: "Get Started",
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/(auth)/login"); // go to splash or home after onboarding
    }
  };

  const handleSkip = () => {
    setCurrentIndex(slides.length - 1);

    // Safer than scrollToIndex (avoids crashes when item not measured yet)
    flatListRef.current?.scrollToOffset({
      offset: (slides.length - 1) * width,
      animated: true,
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top row with indicators + Skip */}
      <View className="flex flex-row justify-between items-center relative top-20 px-6">
        {/* Indicator Dots */}
        <View className="flex-row justify-center items-center">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-3 w-2 mx-1 rounded-full ${
                index === currentIndex ? "bg-blue-600 h-5" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
        {/* Skip Button */}
        {currentIndex < slides.length - 1 && (
          <Pressable className="z-30" onPress={handleSkip}>
            <Text className="text-gray-400 text-lg font-general font-semibold">
              Skip
            </Text>
          </Pressable>
        )}
      </View>

      {/* Slides */}
      <FlatList
        data={slides}
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View
            style={{ width }}
            className="flex-1 items-center justify-center px-6"
          >
            <Image
              source={item.image}
              style={{ width: 350, height: 350 }}
              resizeMode="contain"
            />
            <Text className="text-[30px] text-center mb-3 font-general-bold">
              {item.title}
            </Text>
            <Text className="text-gray-500 text-[16px] text-center font-general">
              {item.subtitle}
            </Text>
            <GradientButton title={item.buttonText} onPress={handleNext} />
          </View>
        )}
      />
    </View>
  );
}
