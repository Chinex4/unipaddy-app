import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BackHeader from "../../components/BackHeader";
import GradientButton from "../../components/ui/GradientButton";
import SelectModal from "../../components/SelectModal";
import { Mail, Eye, EyeOff, Lock, IdCard } from "lucide-react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";

/** ---------- Faculty / Department Map ---------- */
const FACULTY_MAP: Record<string, string[]> = {
  "FACULTY OF AGRICULTURE": [
    "Agriculture Extension",
    "Fisheries & Aquaculture",
    "Agronomy",
    "Agricultural Economics",
    "Animal Science",
    "Forestry and Wildlife Establishments",
  ],
  "FACULTY OF ARTS": [
    "English and Literary Studies",
    "Fine and Applied Arts",
    "History and Intl Studies",
    "Music",
    "Religious Studies / Philosophy",
    "Languages and Linguistics",
    "Theatre Arts",
  ],
  "FACULTY OF BASIC MEDICAL SCIENCES": [
    "Anatomy and Cell Biology",
    "Medical Biochemistry",
    "Nursing Science",
    "Pharmacology",
    "Physiology",
  ],
  "FACULTY OF BASIC CLINICAL SCIENCES": [
    "Anatomic Pathology",
    "Chemical Pathology",
    "Haematology & Blood Transfusion",
    "Medical Microbiology and Parasitology",
    "Pharmacology and Therapeutics",
    "Morbid Anatomy/Histopathology",
  ],
  "FACULTY OF CLINICAL MEDICINE": [
    "Medicine",
    "Surgery",
    "Anesthesia",
    "Community Medicine",
    "Family Medicine",
    "Obstetrics and Gynecology",
    "Pediatrics",
    "Psychiatric and Mental Health",
    "Radiology",
  ],
  "FACULTY OF COMMUNICATION AND MEDIA STUDIES": [
    "Public Relations & Advertising",
    "Journalism and Media Studies",
    "Mass Communication and Film",
  ],
  "FACULTY OF DENTISTRY": [
    "Dentistry",
    "Child Dental Health/Orthodontics",
    "Oral Medicine/Oral Pathology",
    "Oral Biology",
    "Preventive/Community Dentistry",
    "Restorative Dentistry",
    "Oral & Maxillofacial Surgery",
  ],
  "FACULTY OF EDUCATION": [
    "Business Education",
    "Educational Management and Foundations",
    "Guidance and Counselling",
    "Health and Safety Education",
    "Human Kinetics, Recreation and Sport Science Edu.",
    "Science Education",
    "Social Science Education",
    "Technical Education",
    "Vocational Education",
    "Institute of Education",
  ],
  "FACULTY OF ENGINEERING": [
    "Chemical Engineering",
    "Civil and Environmental Engineering",
    "Electrical and Electronic Engineering",
    "Mechanical Engineering",
    "Petroleum and Gas Engineering",
  ],
  "FACULTY OF LAW": [
    "Commercial and Property Law",
    "Jurispudence and International Law",
    "Private Law",
    "Public Law",
  ],
  "FACULTY OF MANAGEMENT SCIENCES": [
    "Accounting",
    "Banking and Finance",
    "Business Administration",
    "Marketing and Entrepreneurship",
    "Public Administration",
  ],
  "FACULTY OF SCIENCES": [
    "Animal and Environmental Biology",
    "Biochemistry",
    "Botany",
    "Chemistry",
    "Computer Science",
    "Geology",
    "Mathematics",
    "Medical Laboratory Science",
    "Microbiology",
    "Physics",
    "Science Laboratory Technology",
  ],
  "FACULTY OF PHARMACY": [
    "Pharmacy",
    "Clinical Pharmacy & Administration",
    "Pharmaceutical Chemistry & Medicinal Chemistry",
    "Pharmaceutical Microbiology & Biotechnology",
    "Pharmaceutics & Industrial Pharmacy",
    "Pharmacognosy & Traditional Medicine",
    "Pharmacology & Toxicology",
  ],
  "FACULTY OF SOCIAL SCIENCES": [
    "Economics",
    "Geography and Regional Planning",
    "Mass Communication",
    "Library & Information Science",
    "Political Science",
    "Psychology",
    "Sociology",
  ],
};

/** ---------- Validation ---------- */
const passwordRules = yup
  .string()
  .required("Password is required")
  .min(8, "At least 8 characters")
  .matches(/[a-z]/, "Must include a lowercase letter")
  .matches(/[A-Z]/, "Must include an uppercase letter")
  .matches(/[0-9]/, "Must include a number")
  .matches(/[^A-Za-z0-9]/, "Must include a special character");

const schema = yup.object({
  fullName: yup.string().trim().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  matNumber: yup
    .string()
    .matches(/^[A-Za-z]+\/\d{2}\/\d{2}\/\d{6}$/, "Format: ABC/23/24/123456")
    .required("Matriculation number is required"),
  faculty: yup.string().required("Faculty is required"),
  department: yup.string().required("Department is required"),
  password: passwordRules,
  confirmPassword: yup
    .string()
    .required("Confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

type FormData = yup.InferType<typeof schema>;

export default function Register() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      matNumber: "",
      faculty: "",
      department: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Live chips for password
  const pwd = useWatch({ control, name: "password" }) || "";
  const checks = useMemo(
    () => ({
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
      len8: pwd.length >= 8,
    }),
    [pwd]
  );
  const allPwdPassed =
    checks.upper &&
    checks.lower &&
    checks.number &&
    checks.special &&
    checks.len8;

  const faculties = Object.keys(FACULTY_MAP);
  const selectedFaculty = useWatch({ control, name: "faculty" }) || "";
  const departments = selectedFaculty ? FACULTY_MAP[selectedFaculty] : [];

  const onSelectFaculty = (f: string) => {
    setValue("faculty", f, { shouldValidate: true });
    // reset department when faculty changes
    setValue("department", "", { shouldValidate: true });
  };

  const onSelectDept = (d: string) => {
    setValue("department", d, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    // Simulate signup success: create a fake token + store user
    const fakeToken = `tok_${Math.random().toString(36).slice(2)}${Date.now()}`;
    const user = {
      id: Date.now(),
      name: data.fullName,
      email: data.email,
      matNumber: data.matNumber,
      faculty: data.faculty,
      department: data.department,
    };

    await AsyncStorage.multiSet([
      ["temp_signup_token", fakeToken],
      ["temp_signup_user", JSON.stringify(user)],
    ]);

    // go to OTP with email param
    // after saving to AsyncStorage
    const emailParam = encodeURIComponent(data.email);
    router.push(`/(auth)/otp-verification?email=${emailParam}&type=register`);
  };

  const Chip = ({ label, active }: { label: string; active: boolean }) => (
    <View
      className={`px-4 py-2 rounded-full mr-2 mb-3 flex-row items-center ${
        active ? "bg-primary-base" : "bg-white"
      } border ${active ? "border-primary-base" : "border-gray-300"}`}
    >
      <Text
        className={`text-[13px] ${
          active
            ? "text-white font-general-medium"
            : "text-gray-500 font-general"
        }`}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <>
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView
          className="flex-1 bg-white"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackHeader />

          {/* Title */}
          <View className="px-5 mt-4">
            <Text className="text-4xl text-black font-general-bold">
              Create Account
            </Text>
            <Text className="text-gray-500 mt-1 text-[14px] font-general">
              Fill in your details to get started.
            </Text>
          </View>

          {/* Form */}
          <View className="px-5 mt-6">
            {/* Full Name */}
            <Text className="text-sm text-gray-700 mb-1 font-general-medium">
              Full Name
            </Text>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Enter your full name"
                  className="border border-gray-300 rounded-lg px-3 py-3 font-general-medium"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.fullName && (
              <Text className="text-red-500 text-xs font-general mt-1">
                {errors.fullName.message}
              </Text>
            )}

            {/* Email */}
            <Text className="text-sm text-gray-700 mt-4 mb-1 font-general-medium">
              Email
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
              <Mail size={18} color="gray" />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Enter your email"
                    className="flex-1 px-2 py-3 font-general-medium"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 text-xs font-general mt-1">
                {errors.email.message}
              </Text>
            )}

            {/* Mat Number */}
            <Text className="text-sm text-gray-700 mt-4 mb-1 font-general-medium">
              Matriculation Number
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
              <IdCard size={18} color="gray" />
              <Controller
                control={control}
                name="matNumber"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="e.g. FOS/23/24/123456"
                    className="flex-1 px-2 py-3 font-general-medium"
                    autoCapitalize="characters"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
            {errors.matNumber && (
              <Text className="text-red-500 text-xs font-general mt-1">
                {errors.matNumber.message}
              </Text>
            )}

            {/* Faculty */}
            <SelectModal
              label="Faculty"
              value={selectedFaculty}
              options={faculties}
              onSelect={onSelectFaculty}
            />
            {errors.faculty && (
              <Text className="text-red-500 text-xs font-general -mt-3 mb-2">
                {errors.faculty.message}
              </Text>
            )}

            {/* Department */}
            <SelectModal
              label="Department"
              value={useWatch({ control, name: "department" }) || ""}
              options={departments}
              onSelect={onSelectDept}
              disabled={!selectedFaculty}
            />
            {errors.department && (
              <Text className="text-red-500 text-xs font-general -mt-3 mb-2">
                {errors.department.message}
              </Text>
            )}

            {/* Password */}
            <Text className="text-sm text-gray-700 mt-1 mb-1 font-general-medium">
              Password
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
              <Lock size={18} color="gray" />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Enter your password"
                    className="flex-1 px-2 py-3 font-general-medium"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPwd}
                  />
                )}
              />
              <Pressable onPress={() => setShowPwd((v) => !v)} hitSlop={8}>
                {showPwd ? (
                  <Eye size={18} color="gray" />
                ) : (
                  <EyeOff size={18} color="gray" />
                )}
              </Pressable>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-xs font-general mt-1">
                {errors.password.message}
              </Text>
            )}

            {/* Rule chips */}
            <View className="flex-row flex-wrap mt-3">
              <Chip label="Uppercase" active={checks.upper} />
              <Chip label="Lowercase" active={checks.lower} />
              <Chip label="Number" active={checks.number} />
              <Chip label="8 Characters" active={checks.len8} />
              <Chip label="Special Characters" active={checks.special} />
            </View>

            {/* Confirm Password */}
            <Text className="text-sm text-gray-700 mt-2 mb-1 font-general-medium">
              Confirm Password
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
              <Lock size={18} color="gray" />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Confirm your password"
                    className="flex-1 px-2 py-3 font-general-medium"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showConfirm}
                  />
                )}
              />
              <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={8}>
                {showConfirm ? (
                  <Eye size={18} color="gray" />
                ) : (
                  <EyeOff size={18} color="gray" />
                )}
              </Pressable>
            </View>
            {errors.confirmPassword && (
              <Text className="text-red-500 text-xs font-general mt-1">
                {errors.confirmPassword.message}
              </Text>
            )}

            {/* Submit */}
            <GradientButton
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || !allPwdPassed}
            />
          </View>

          {/* Or sign up using */}
          <View className="px-5 mt-8">
            <Text className="text-center text-gray-500 mb-3 font-general">
              Or Sign Up Using
            </Text>
            <Pressable
              className="flex-row items-center justify-center border border-gray-300 rounded-lg py-3"
              onPress={() => {}}
            >
              <Image
                source={require("../../assets/images/unipaddy/google.png")}
                className="w-5 h-5 mr-2"
              />
              <Text className="text-black font-general-medium">Google</Text>
            </Pressable>
          </View>

          {/* Already have account */}
          <View className="flex-row justify-center mt-8 mb-10">
            <Text className="text-gray-600 font-general">
              Already have an account?
            </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text className="text-primary-base font-general-semibold ml-1">
                Login
              </Text>
            </Pressable>
          </View>

        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}
