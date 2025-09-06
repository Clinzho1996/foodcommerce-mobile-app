import { images } from "@/constants";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const EmptyState = ({
	title,
	subtitle,
}: {
	title: string;
	subtitle: string;
}) => {
	return (
		<View className="flex-center h-full flex-col gap-5">
			<Image
				source={images.emptyState}
				className="size-full"
				resizeMode="contain"
				style={{ height: 130, width: 200 }}
			/>

			<Text className="base-semibold text-dark-100">{title}</Text>

			<Text className="paragraph-medium text-gray-100">{subtitle}</Text>
		</View>
	);
};

export default EmptyState;

const styles = StyleSheet.create({});
