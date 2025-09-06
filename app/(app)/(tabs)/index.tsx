import cn from "clsx";
import { Fragment, useEffect, useState } from "react";
import {
	FlatList,
	Image,
	Pressable,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CartButton from "@/components/CartButton";
import EmptyState from "@/components/EmptyState";
import Filter from "@/components/Filter";
import MenuCard from "@/components/MenuCard";
import Searchbar from "@/components/Searchbar";
import { images, offers } from "@/constants";
import { getCategories, getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import useAuthStore from "@/store/auth.store";
import { MenuItem } from "@/type";
import { useLocalSearchParams, useRouter } from "expo-router";
import Modal from "react-native-modal";

const { width, height } = require("react-native").Dimensions.get("window");

export default function Index() {
	const { user } = useAuthStore();
	const [isSearchModalVisible, setSearchModalVisible] = useState(false);
	const router = useRouter();
	const { category, query } = useLocalSearchParams<{
		query: string;
		category: string;
	}>();

	const { data, refetch, loading } = useAppwrite({
		fn: getMenu,
		params: { category, query, limit: 6 },
	});

	const { data: categories } = useAppwrite({ fn: getCategories });

	useEffect(() => {
		refetch({ category, query, limit: 6 });
	}, [category, query]);

	const toggleSearchModal = () => {
		setSearchModalVisible(!isSearchModalVisible);
	};

	console.log(user);
	return (
		<SafeAreaView className="flex-1 bg-white">
			<StatusBar barStyle="dark-content" backgroundColor="transparent" />

			<Modal
				isVisible={isSearchModalVisible}
				animationIn="slideInUp"
				animationOut="slideOutDown"
				style={{
					backgroundColor: "#fff",
					width: width,
					height: height,
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					position: "absolute",
					bottom: -150,
					left: -20,
				}}
				backdropOpacity={0.5}
				onBackdropPress={toggleSearchModal}>
				<FlatList
					data={data}
					renderItem={({ item, index }) => {
						const isFirstRightColItem = index % 2 === 0;

						return (
							<View
								className={cn(
									"flex-1 max-w-[48%]",
									!isFirstRightColItem ? "mt-10" : "mt-0"
								)}>
								<MenuCard
									item={item as unknown as MenuItem}
									onPress={() => setSearchModalVisible(false)}
								/>
							</View>
						);
					}}
					keyExtractor={(item) => item.$id}
					numColumns={2}
					columnWrapperClassName="gap-7"
					contentContainerClassName="gap-7 px-5 pb-32"
					ListHeaderComponent={() => (
						<View className="my-5 gap-5">
							<View className="flex-between flex-row w-full">
								<View className="flex-start">
									<Text className="small-bold uppercase text-primary">
										Search
									</Text>
									<View className="flex-start flex-row gap-x-1 mt-0.5">
										<Text className="paragraph-semibold text-dark-100">
											Find your favorite food
										</Text>
									</View>
								</View>

								<CartButton />
							</View>

							<Searchbar />

							<Filter
								categories={
									categories
										? categories.map((cat: any) => ({
												$id: cat.$id,
												name: cat.name,
												description: cat.description,
												$sequence: cat.$sequence,
												$collectionId: cat.$collectionId,
												$databaseId: cat.$databaseId,
												$createdAt: cat.$createdAt,
												$updatedAt: cat.$updatedAt,
												$permissions: cat.$permissions, // Add missing property
											}))
										: []
								}
							/>
						</View>
					)}
					ListEmptyComponent={() =>
						!loading && (
							<EmptyState
								title="Nothing matched your search"
								subtitle="Try a different search term or check for typos"
							/>
						)
					}
				/>
			</Modal>
			<FlatList
				data={offers}
				renderItem={({ item, index }) => {
					const isEven = index % 2 === 0;

					return (
						<View>
							<Pressable
								onPress={() => {
									router.push({
										pathname: "/search",
										params: { category: item.categoryId },
									});
								}}
								className={cn(
									"offer-card",
									isEven ? "flex-row-reverse" : "flex-row"
								)}
								style={{ backgroundColor: item.color }}
								android_ripple={{ color: "#fffff22" }}>
								{({ pressed }) => (
									<Fragment>
										<View className={"h-full w-1/2"}>
											<Image
												source={item.image}
												className={"size-full"}
												resizeMode={"contain"}
											/>
										</View>

										<View
											className={cn(
												"offer-card__info",
												isEven ? "pl-10" : "pr-10"
											)}>
											<Text className="h1-bold text-white leading-tight">
												{item.title}
											</Text>
											<Image
												source={images.arrowRight}
												className="size-10"
												resizeMode="contain"
												tintColor="#ffffff"
											/>
										</View>
									</Fragment>
								)}
							</Pressable>
						</View>
					);
				}}
				contentContainerClassName="pb-28 px-5"
				ListHeaderComponent={() => (
					<View className="flex-between flex-row w-full my-5">
						<View className="flex-start">
							<Text className="small-bold text-primary">
								Welcome {user?.name}
							</Text>
							<TouchableOpacity
								className="flex-center flex-row gap-x-1 mt-0.5"
								onPress={toggleSearchModal}>
								<Text className="paragraph-bold text-dark-100">
									What do you want to eat?
								</Text>
								<Image
									source={images.arrowDown}
									className="size-3"
									resizeMode="contain"
								/>
							</TouchableOpacity>
						</View>

						<Image
							source={{ uri: user?.avatar }}
							className="size-5 w-10 h-10 rounded-full"
							resizeMode="contain"
						/>
					</View>
				)}
			/>
		</SafeAreaView>
	);
}
