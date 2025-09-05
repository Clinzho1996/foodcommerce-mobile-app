import { images } from "@/constants";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CartButton = () => {
	const totalItems = 10;
	return (
		<TouchableOpacity className="cart-btn" onPress={() => {}}>
			<Image
				source={images.bag}
				className="size-5 text-white-100"
				resizeMode="contain"
				alt="cart"
			/>

			{totalItems > 0 && (
				<View className="cart-badge">
					<Text className="small-bold text-white ">{totalItems}</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

export default CartButton;

const styles = StyleSheet.create({});
