import "dotenv/config";

export default {
  expo: {
    name: "Unipaddy",
    slug: "unipaddy",
    // userInterfaceStyle: "automatic",
    extra: {
      paystackPublicKey: process.env.EXPO_PUBLIC_PAYSTACK_PK,
    },
  },
};
