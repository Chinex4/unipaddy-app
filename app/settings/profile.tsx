import React, { useState } from "react";
import { View, Text, Image, Pressable, ScrollView, Alert } from "react-native";
import GradientHeader from "@/components/headers/GradientHeader";
import TextField from "@/components/ui/TextField";
import { AtSign, Phone, User, IdCard, CameraIcon } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [fullName, setFullName] = useState("Travis Scott");
  const [matric, setMatric] = useState("Del/23/300");
  const [sex, setSex] = useState<"male" | "female">("male");

  const onSave = async () => {
    await AsyncStorage.multiSet([
      ["up_profile_fullname", fullName],
      ["up_profile_matric", matric],
      ["up_profile_sex", sex],
    ]);
    Alert.alert("Saved", "Profile updated successfully");
  };

  return (
    <View className="flex-1 bg-white">
      <GradientHeader
        title="Profile"
        center={
          <View className="items-center">
            <View className="h-32 w-32 rounded-full bg-primary-base/10 items-center justify-center border-4 border-white">
              <Image source={require("@/assets/images/unipaddy/memoji.png")} className="h-28 w-28" resizeMode="contain"/>
            </View>
            <Pressable className="absolute right-0 bottom-0 h-10 w-10 rounded-full bg-white items-center justify-center border">
              {/* camera icon mimic */}
              <CameraIcon size={18} color="#6B7280" />
            </Pressable>
          </View>
        }
        height={130}
      />

      <ScrollView className="px-4 mt-3 pb-12">
        <TextField
          label="Full Name"
          icon={<User size={18} color="#6B7280" />}
          placeholder="Your name"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextField
          label="Matriculation Number"
          icon={<IdCard size={18} color="#6B7280" />}
          placeholder="DEL/23/300"
          value={matric}
          onChangeText={setMatric}
        />

        <TextField
          label="Email"
          icon={<AtSign size={18} color="#6B7280" />}
          placeholder="email"
          value="travisscott@gmail.com"
          disabled
        />

        <TextField
          label="Phone Number"
          icon={<Phone size={18} color="#6B7280" />}
          placeholder="090123456789"
          value="090123456789"
          disabled
          keyboardType="phone-pad"
        />

        <Text className="mt-2 mb-2 text-gray-700 font-general">Department</Text>
        <View className="w-full h-14 px-4 rounded-2xl bg-gray-100 flex-row items-center opacity-60 mb-4">
          <Text className="flex-1 font-general text-[15px] text-gray-400">Computer Science</Text>
        </View>

        <Text className="mt-1 mb-2 text-gray-700 font-general">Sex</Text>
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => setSex("male")}
            className={`flex-1 px-5 py-4 rounded-2xl ${sex==="male" ? "bg-primary-base" : "bg-gray-200"}`}
          >
            <Text className={`text-center font-general-semibold ${sex==="male" ? "text-white" : "text-gray-700"}`}>Male</Text>
          </Pressable>
          <Pressable
            onPress={() => setSex("female")}
            className={`flex-1 px-5 py-4 rounded-2xl ${sex==="female" ? "bg-primary-base" : "bg-gray-200"}`}
          >
            <Text className={`text-center font-general-semibold ${sex==="female" ? "text-white" : "text-gray-700"}`}>Female</Text>
          </Pressable>
        </View>

        <Pressable onPress={onSave} className="mt-8 mb-20 bg-primary-base rounded-2xl py-4">
          <Text className="text-center text-white font-general-semibold">Save Changes</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
