import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { getCurrentUser, signIn } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store"; // import your auth store
import * as Sentry from "@sentry/react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignIn = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setForm] = useState({ email: "", password: "" });

	const { setIsAuthenticated, setUser } = useAuthStore();

	const submit = async () => {
		const { email, password } = form;

		if (!email || !password) {
			return Alert.alert(
				"Error",
				"Please enter valid email address & password."
			);
		}

		setIsSubmitting(true);

		try {
			await signIn({ email, password });

			// fetch user immediately after login
			const user = await getCurrentUser();
			if (user) {
				setIsAuthenticated(true);
				// Map DefaultDocument to User type
				const mappedUser = {
					name: user.name ?? "",
					email: user.email ?? "",
					avatar: user.avatar ?? "",
					...user,
				};
				setUser(mappedUser);
			}

			router.replace("/");
		} catch (error: any) {
			Sentry.captureException(error);
			Alert.alert("Error", error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View className="gap-10 bg-white rounded-lg p-5 mt-5">
			<CustomInput
				placeholder="Enter your email"
				value={form.email}
				onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
				label="Email"
				keyboardType="email-address"
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

			<CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />

			<View className="flex justify-center mt-5 flex-row gap-2">
				<Text className="base-regular text-gray-100">
					Don't have an account?
				</Text>
				<Link href="/sign-up" className="base-bold text-primary">
					Sign Up
				</Link>
			</View>
		</View>
	);
};

export default SignIn;
