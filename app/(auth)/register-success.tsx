import React, { useCallback } from "react";
import SuccessTemplate from "../../components/SuccessTemplate";
import { useRouter } from "expo-router";

export default function RegisterSuccess() {
  const router = useRouter();
  const toHome = useCallback(() => router.replace("/home"), [router]);

  return (
    <SuccessTemplate
      title="Account Created Successfully!"
      subtitle="Welcome to Unipaddy!!!"
      image={require("../../assets/images/unipaddy/password-change-success.png")}
      primaryCtaLabel="Continue "
      onPrimaryPress={toHome}
      backTargetHref="/home"
    />
  );
}
