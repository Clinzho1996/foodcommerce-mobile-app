import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser, getCurrentUser } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Text,
	View,
} from "react-native";

const SignUp = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { setIsAuthenticated, setUser } = useAuthStore();
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",
		address: "",
	});

	const submit = async () => {
		const { name, email, password, phone, address } = form;

		if (!name || !email || !password || !phone || !address)
			return Alert.alert(
				"Error",
				"Please enter valid email address & password."
			);

		setIsSubmitting(true);

		try {
			await createUser({ email, password, name, phone, address });

			// fetch user immediately after login
			const user = await getCurrentUser();
			if (user) {
				setIsAuthenticated(true);
				// Map DefaultDocument to User type
				const mappedUser = {
					name: user.name ?? "",
					email: user.email ?? "",
					phone: user.phone ?? "",
					address: user.address ?? "",
					avatar: user.avatar ?? "",
					...user,
				};
				setUser(mappedUser);
			}

			Alert.alert("Success", "Account created successfully");

			router.replace("/");
		} catch (error: any) {
			Alert.alert("Error", error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<KeyboardAvoidingView
			className="gap-10 bg-white rounded-lg p-5 mt-5"
			behavior={Platform.OS === "ios" ? "padding" : "height"}>
			<CustomInput
				placeholder="Enter your full name"
				value={form.name}
				onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
				label="Full name"
			/>
			<CustomInput
				placeholder="Enter your email"
				value={form.email}
				onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
				label="Email"
				keyboardType="email-address"
			/>
			<CustomInput
				placeholder="Enter your phone number"
				value={form.phone}
				onChangeText={(text) => setForm((prev) => ({ ...prev, phone: text }))}
				label="Phone number"
				keyboardType="phone-pad"
			/>
			<CustomInput
				placeholder="Enter your address"
				value={form.address}
				onChangeText={(text) => setForm((prev) => ({ ...prev, address: text }))}
				label="Delivery Address"
			/>

			<CustomInput
				placeholder="Enter your password"
				value={form.password}
				onChangeText={(text) =>
					setForm((prev) => ({ ...prev, password: text }))
				}
				label="Password"
				secureTextEntry={true}
			/>

			<CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />

			<View className="flex justify-center mt-5 flex-row gap-2">
				<Text className="base-regular text-gray-100">
					Already have an account?
				</Text>
				<Link href="/sign-in" className="base-bold text-primary">
					Sign In
				</Link>
			</View>
		</KeyboardAvoidingView>
	);
};

export default SignUp;
