import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";
import { account, getCurrentUser } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
	const { data, loading, error } = useAppwrite({ fn: getCurrentUser });
	const { setIsAuthenticated, setUser } = useAuthStore();
	const [isLoading, setIsLoading] = React.useState(false);

	if (loading)
		return (
			<View className="flex-1 flex-center">
				<ActivityIndicator size="large" color="#000" />
			</View>
		);
	if (error) return <Text>Error loading profile</Text>;

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			await account.deleteSession("current");

			// Reset Zustand state
			setIsAuthenticated(false);
			setUser(null);

			Alert.alert("Success", "Logged out successfully");
			router.replace("/sign-in"); // replace instead of push
		} catch (error) {
			console.log("Error logging out:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SafeAreaView className="px-4 flex-1 bg-white-100">
			<CustomHeader title="Profile" />

			<View className="mt-10 items-center">
				<Image
					source={{ uri: data?.avatar }}
					style={{ width: 70, height: 70, borderRadius: 35 }}
				/>
			</View>

			<View
				className=" bg-white-100 rounded-lg  p-4 mt-10 flex-col gap-6"
				style={{
					shadowColor: "#1a1a1a",
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.1,
					shadowRadius: 4,
					elevation: 5,
				}}>
				<View className="flex flex-row justify-start items-center w-full gap-3">
					<View className="w-14 h-14 bg-orange-50 rounded-full flex-center mr-4">
						<Image
							source={images.user}
							className="size-8"
							resizeMode="contain"
							tintColor={"#FF9C01"}
						/>
					</View>

					<View>
						<Text className="text-gray-600">Full Name</Text>
						<Text className="text-lg font-bold text-dark-100">
							{data?.name}
						</Text>
					</View>
				</View>

				<View className="flex flex-row justify-start items-center w-full gap-3">
					<View className="w-14 h-14 bg-orange-50 rounded-full flex-center mr-4">
						<Image
							source={images.envelope}
							className="size-8"
							resizeMode="contain"
							tintColor={"#FF9C01"}
						/>
					</View>

					<View>
						<Text className="text-gray-600">Email</Text>
						<Text className="text-lg font-bold text-dark-100">
							{data?.email}
						</Text>
					</View>
				</View>

				<View className="flex flex-row justify-start items-center w-full gap-3">
					<View className="w-14 h-14 bg-orange-50 rounded-full flex-center mr-4">
						<Image
							source={images.phone}
							className="size-8"
							resizeMode="contain"
							tintColor={"#FF9C01"}
						/>
					</View>

					<View>
						<Text className="text-gray-600">Phone</Text>
						<Text className="text-lg font-bold text-dark-100">
							{data?.phone}
						</Text>
					</View>
				</View>

				<View className="flex flex-row justify-start items-center w-full gap-3">
					<View className="w-14 h-14 bg-orange-50 rounded-full flex-center mr-4">
						<Image
							source={images.location}
							className="size-8"
							resizeMode="contain"
							tintColor={"#FF9C01"}
						/>
					</View>

					<View>
						<Text className="text-gray-600">Address</Text>
						<Text className="text-lg font-bold text-dark-100">
							{data?.address}
						</Text>
					</View>
				</View>
			</View>

			<CustomButton
				isLoading={isLoading}
				title="Log Out"
				style="mt-10 bg-red-50 border border-red-600 "
				textStyle="!text-red-600 ml-2"
				leftIcon={<Image source={images.logout} className="size-6" />}
				onPress={handleLogout}
			/>
		</SafeAreaView>
	);
};

export default Profile;
