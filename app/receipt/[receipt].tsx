// app/receipt/[receipt].tsx
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { ArrowLeft, Check, Share2 } from "lucide-react-native";
import { useRef, useState } from "react";
import { Alert, Image, Pressable, Share, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot, { captureRef } from "react-native-view-shot";
import GradientButton from "../../components/ui/GradientButton";

const formatNaira = (n: number) =>
  `₦${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function ReceiptScreen() {
  // 👇 now also accepts dynamic params from payment screen
  const {
    receipt,               // Paystack reference (used as the dynamic route segment)
    title,                 // dues title (used as purpose)
    amount,
    charge,
    total,
    method,                // "Card" | "Transfer" | "USSD"
    time,                  // ISO or formatted time
    sender,                // optional
  } = useLocalSearchParams<{
    receipt?: string;
    title?: string;
    amount?: string;
    charge?: string;
    total?: string;
    method?: string;
    time?: string;
    sender?: string;
  }>();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  // 🔒 Capture ONLY this node (the receipt card)
  const cardShotRef = useRef<View>(null);

  // --- ORIGINAL MOCK (kept as fallback) ---
  const fallback = {
    total: 1400,
    amount: 1200,
    fee: 200,
    ref: "000085752257",
    time: "25-02-2023, 13:22:16",
    method: "Transfer",
    sender: "Travis Scott",
    purpose: "SUG Dues",
  };

  // --- Params → payload (use fallback if any field is missing) ---
  const payloadFromParams = {
    total: Number(total ?? NaN),
    amount: Number(amount ?? NaN),
    fee: Number(charge ?? NaN),
    ref: receipt || fallback.ref,
    time:
      time ||
      new Date().toLocaleString(), // you can send a formatted time from payment screen
    method: method || fallback.method,
    sender: sender || "You",
    purpose: title || fallback.purpose,
  };

  // merge with fallback safely
  const payload = {
    total: isFinite(payloadFromParams.total) ? payloadFromParams.total : fallback.total,
    amount: isFinite(payloadFromParams.amount) ? payloadFromParams.amount : fallback.amount,
    fee: isFinite(payloadFromParams.fee) ? payloadFromParams.fee : fallback.fee,
    ref: payloadFromParams.ref,
    time: payloadFromParams.time,
    method: payloadFromParams.method,
    sender: payloadFromParams.sender,
    purpose: payloadFromParams.purpose,
  };

  const captureToPng = async () => {
    const uri = await captureRef(cardShotRef, { format: "png", quality: 1 });
    const fileUri = `${FileSystem.cacheDirectory}receipt-${Date.now()}.png`;
    await FileSystem.copyAsync({ from: uri, to: fileUri });
    return fileUri;
  };

  const handleShare = async () => {
    try {
      setSharing(true);
      const fileUri = await captureToPng();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "image/png",
          dialogTitle: "Share Receipt",
          UTI: "public.png",
        });
      } else {
        await Share.share({ url: fileUri, message: "My dues payment receipt", title: "Share Receipt" });
      }
    } catch {
      Alert.alert("Share failed", "Could not share the receipt. Please try again.");
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = async () => {
    try {
      setSaving(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please allow Photos permission to save the receipt.");
        return;
      }
      const fileUri = await captureToPng();
      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert("Saved", "Receipt image saved to your Photos.");
    } catch {
      Alert.alert("Error", "Could not save receipt. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
        {/* Header with sky-blue bg; image doesn't block touches */}
        <LinearGradient colors={["#E8F0FF", "#ffffff"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} className="w-full">
          <View style={{ paddingTop: insets.top + 9 }} className="h-52 w-full relative">
            <View pointerEvents="none" className="absolute top-0 left-0 w-full h-full">
              <Image
                source={require("@/assets/images/unipaddy/bg-skyblue.png")}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className="px-5 flex-row items-center justify-between">
              <Pressable onPress={() => router.back()} className="h-10 w-10 rounded-full bg-white/70 items-center justify-center">
                <ArrowLeft size={20} color="#111827" />
              </Pressable>
              <Pressable onPress={handleShare} className="h-10 w-10 rounded-full bg-white/70 items-center justify-center" disabled={sharing}>
                <Share2 size={18} color="#111827" />
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View className="-mt-16 px-5 pb-6">
          <ViewShot ref={cardShotRef} options={{ format: "png", quality: 1 }}>
            <View
              className="bg-white rounded-3xl px-5 pb-6 pt-10"
              style={{ shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}
            >
              {/* Success tick */}
              <View className="items-center -mt-14 mb-2">
                <View className="h-16 w-16 rounded-full bg-emerald-500 items-center justify-center">
                  <Check size={28} color="white" />
                </View>
              </View>

              <Text className="text-center font-general text-[22px] text-gray-900 font-semibold">Payment Success!</Text>
              <Text className="text-center font-general text-sm text-gray-400">Your payment was successful!</Text>

              {/* Total */}
              <View className="mt-6 border-t border-gray-100 pt-6">
                <Text className="text-center font-general text-sm text-gray-500">Total Payment</Text>
                <Text className="text-center font-general text-3xl text-gray-900 font-extrabold mt-1">
                  {formatNaira(payload.total)}
                </Text>
              </View>

              {/* Fields */}
              <View className="mt-6">
                <Line label="Ref Number" value={payload.ref} />
                <Line label="Time" value={payload.time} />
                <Line label="Payment Method" value={payload.method} />
                <Line label="Sender Name" value={payload.sender} />
                <Line label="Payment Purpose" value={payload.purpose} />
                <View className="border-t border-gray-100 my-3" />
                <Line label="Amount" value={formatNaira(payload.amount)} />
                <Line label="Charges" value={formatNaira(payload.fee)} />
                <Line label="Total" value={formatNaira(payload.total)} />
              </View>

              {/* Ticket scallops */}
              <View className="mt-8 flex-row justify-between px-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <View key={i} className="h-3 w-3 rounded-full bg-gray-100" />
                ))}
              </View>
            </View>
          </ViewShot>

          <View className="">
            <GradientButton title={saving ? "Saving..." : "Download Receipt"} onPress={handleDownload} />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const Line = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row items-center justify-between py-2">
    <Text className="font-general text-sm text-gray-400">{label}</Text>
    <Text className="font-general text-base text-gray-700">{value}</Text>
  </View>
);
