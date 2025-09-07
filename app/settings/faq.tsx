import React, { useState } from "react";
import { View, Text, Pressable, LayoutAnimation, Platform, UIManager, ScrollView } from "react-native";
import GradientHeader from "@/components/headers/GradientHeader";
import { ChevronDown, ChevronUp, X } from "lucide-react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAqs = new Array(7).fill(0).map((_, i) => ({
  id: i + 1,
  q: "What is Unipaddy?",
  a:
    "Unipaddy is a comprehensive platform for paying school fees & dues, taking attendance, and calculating GPA/CGPA—built with React Native frontend and Laravel backend.",
}));

export default function FAQScreen() {
  const [open, setOpen] = useState<number | null>(2);

  const toggle = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => (o === id ? null : id));
  };

  return (
    <View className="flex-1 bg-white">
      <GradientHeader title="FAQ" height={90} />
      <ScrollView className="px-4 -mt-10">
        {FAqs.map((f) => {
          const isOpen = open === f.id;
          return (
            <View key={f.id} className="border-b border-gray-200 py-4">
              <Pressable className="flex-row items-center justify-between" onPress={() => toggle(f.id)}>
                <Text className="font-general text-gray-400 mr-3">{String(f.id).padStart(2, "0")}</Text>
                <Text className="flex-1 font-general-semibold text-gray-900">{f.q}</Text>
                {isOpen ? <ChevronUp size={18} color="#6B7280" /> : <ChevronDown size={18} color="#6B7280" />}
              </Pressable>
              {isOpen && (
                <Text className="ml-10 mt-3 text-gray-500 font-general">{f.a}</Text>
              )}
            </View>
          );
        })}
        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
