// app/books/index.tsx
import React, { useMemo } from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

type BookItem = {
  id: string;
  title: string;
  amount: number; // NGN
};

const MOCK_BOOKS: BookItem[] = [
  { id: "book-1", title: "Book 1", amount: 1200 },
  { id: "book-2", title: "Book 2", amount: 1200 },
  { id: "book-3", title: "Book 3", amount: 1200 },
  { id: "book-4", title: "Book 4", amount: 1200 },
  { id: "book-5", title: "Book 5", amount: 1200 },
];

const formatNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    n
  );

export default function BooksIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const data = useMemo(() => MOCK_BOOKS, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <StatusBar style="dark" />

      {/* Header (sky-blue background) */}
      <LinearGradient
        colors={["#E8F0FF", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full"
      >
        <View style={{ paddingTop: insets.top + 9 }} className="h-64 w-full relative">
          {/* Decorative background stripes */}
          <View pointerEvents="none" className="absolute top-0 left-0 w-full h-full">
            <Image
              source={require("@/assets/images/unipaddy/bg-skyblue.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View className="px-5 flex-row items-center justify-between mt-10">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 rounded-full bg-white/70 items-center justify-center"
            >
              <ArrowLeft size={20} color="#111827" />
            </Pressable>
            {/* spacer to center the title block below like your mock */}
            <View className="w-10" />
          </View>

          <View className="px-5 items-center justify-center mt-4">
            <Text className="mt-4 text-center font-general-semibold text-3xl text-black">
              Books Payment
            </Text>
            <Text className="text-center mt-2 text-gray-500 font-general">
              Select Preferred Book
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* List */}
      <View className="px-5 -mt-4">
        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/dues/payment-method",
                  params: {
                    id: item.id,
                    title: item.title,
                    amount: String(item.amount),
                  },
                })
              }
              className="bg-gray-50 rounded-2xl px-5 py-5 flex-row items-center justify-between"
            >
              <View>
                <Text className="font-general text-base text-black">{item.title}</Text>
                <Text className="font-general text-sm text-gray-500 mt-1">
                  {formatNaira(item.amount)}
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </SafeAreaView>
  );
}
