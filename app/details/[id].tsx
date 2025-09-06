import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";
import { getMenuById } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useCartStore } from "@/store/cart.store";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
	ActivityIndicator,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = require("react-native").Dimensions.get("window");

const MenuDetails = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { items, addItem, increaseQty, decreaseQty, getTotalPrice } =
		useCartStore();

	// Find if this menu item is already in cart
	const cartItem = items.find(
		(i) => i.id === id && (!i.customizations || i.customizations.length === 0)
	);
	const quantity = cartItem ? cartItem.quantity : 0;

	if (!id) return <Text>Menu not found</Text>;
	const { data, loading, error } = useAppwrite({
		fn: ({ $id }) => getMenuById($id),
		params: { $id: id, limit: 1, offset: 0 }, // pass the id as an object
	});

	console.log(data);

	if (loading)
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#000" />
			</View>
		);
	if (error) return <Text>Error loading menu details</Text>;
	if (!data) return <Text>No menu found</Text>;

	return (
		<SafeAreaView className="px-8 relative h-full">
			<CustomHeader />
			<View className="flex-row items-center">
				<View className="flex-col gap-5">
					<Text className="text-2xl font-bold text-dark-100">{data.name}</Text>
					<Text>chesseburger</Text>
					<View className="flex flex-row justify-start items-center gap-2">
						<View className="flex flex-row justify-start items-center gap-0">
							<Image
								source={images.star}
								className="size-4"
								resizeMode="contain"
							/>
							<Image
								source={images.star}
								className="size-4"
								resizeMode="contain"
							/>
							<Image
								source={images.star}
								className="size-4"
								resizeMode="contain"
							/>
							<Image
								source={images.star}
								className="size-4"
								resizeMode="contain"
							/>
							<Image
								source={images.star}
								className="size-4"
								resizeMode="contain"
							/>
						</View>
						<Text className="text-gray-600">{data.rating}/5</Text>
					</View>
					<Text className="text-xl text-orange-600 font-quicksand-bold">
						$<Text className="text-dark-100 ">{data.price}</Text>
					</Text>

					<View className="flex-row items-center gap-6">
						<View className="flex-col gap-2">
							<Text className="text-gray-600">Calories</Text>
							<Text className="text-dark-100 font-quicksand-bold">
								{data.calories} Cal
							</Text>
						</View>
						<View className="flex-col gap-2">
							<Text className="text-gray-600">Protein</Text>
							<Text className="text-dark-100 font-quicksand-bold">
								{data.protein}g
							</Text>
						</View>
					</View>
					<View className="flex-col gap-2">
						<Text className="text-gray-600">Bun Type</Text>
						<Text className="text-dark-100 font-quicksand-bold">
							Whole Wheat
						</Text>
					</View>
				</View>
				<Image
					source={{ uri: data.image_url }}
					style={{ width: 280, height: 300, borderRadius: 10 }}
					resizeMode="contain"
					className="ml-auto"
				/>
			</View>

			<View className="bg-orange-50 p-3 rounded-full flex-row justify-between items-center">
				<View className="flex-row justify-start gap-1 items-center">
					<Image
						source={images.dollar}
						className="size-6"
						resizeMode="contain"
					/>
					<Text className="text-dark-100 font-quicksand-semibold text-sm">
						Free Delivery
					</Text>
				</View>

				<View className="flex-row justify-start gap-1 items-center">
					<Image
						source={images.clock}
						className="size-4"
						resizeMode="contain"
					/>
					<Text className="text-dark-100 font-quicksand-semibold text-sm">
						20 - 30 mins
					</Text>
				</View>

				<View className="flex-row justify-start gap-1 items-center">
					<Image source={images.star} className="size-4" resizeMode="contain" />
					<Text className="text-dark-100 font-quicksand-semibold text-sm">
						{data.rating}
					</Text>
				</View>
			</View>

			<Text className="mt-4">{data.description}</Text>

			<View className="absolute bottom-10 w-full px-6" style={{ width: width }}>
				<View className="mx-auto bg-white-100 p-4 rounded-3xl shadow-inherit w-full flex-row justify-between items-center">
					{/* Quantity Controls */}
					<View className="flex flex-row items-center gap-x-4">
						<TouchableOpacity
							onPress={() => decreaseQty(data.$id, [])}
							className="cart-item__actions">
							<Image
								source={images.minus}
								className="size-1/2"
								resizeMode="contain"
								tintColor={"#FF9C01"}
							/>
						</TouchableOpacity>

						<Text className="base-bold text-dark-100">{quantity}</Text>

						<TouchableOpacity
							onPress={() => increaseQty(data.$id, [])}
							className="cart-item__actions">
							<Image
								source={images.plus}
								className="size-1/2"
								resizeMode="contain"
								tintColor={"#FF9C01"}
							/>
						</TouchableOpacity>
					</View>

					{/* Add to Cart Button */}
					<TouchableOpacity
						onPress={() =>
							addItem({
								id: data.$id,
								name: data.name,
								price: data.price,
								image_url: data.image_url,
								customizations: [], // you can later pass selected options
							})
						}
						className="flex-row items-center bg-orange-500 px-6 py-3 rounded-2xl">
						<Image
							source={images.bag}
							className="size-5 mr-2"
							resizeMode="contain"
							tintColor="#fff"
						/>
						<Text className="text-white font-quicksand-bold">
							Add to Cart • ${((quantity || 1) * data.price).toFixed(2)}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default MenuDetails;
