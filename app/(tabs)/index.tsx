import React from "react";
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    FlatList,
  } from "react-native";
  import { useRouter } from "expo-router";
  
  import useFetch from "@/services/usefetch";
  import { fetchMovies } from "@/services/api";
  import { getTrendingMovies } from "@/services/appwrite";
  
  import { icons } from "@/constants/icons";
  import { images } from "@/constants/images";
  
  import SearchBar from "@/components/SearchBar";
  import MovieCard from "@/components/MovieCard";
  import TrendingCard from "@/components/TrendingCard";
  
  const Index = () => {
    const router = useRouter();
  
    const {
      data: trendingMovies,
      loading: trendingLoading,
      error: trendingError,
    } = useFetch(getTrendingMovies);
  
    const {
      data: movies,
      loading: moviesLoading,
      error: moviesError,
    } = useFetch(() => fetchMovies({ query: "" }));

    // Filter out duplicates from trending movies
    const uniqueTrendingMovies = trendingMovies?.filter(
      (movie, index, self) =>
        index === self.findIndex((m) => m.movie_id === movie.movie_id)
    );

    // Filter out duplicates from regular movies
    const uniqueMovies = movies?.filter(
      (movie, index, self) =>
        index === self.findIndex((m) => m.id === movie.id)
    );
      
  
    return (
      <View className="flex-1 bg-primary">
        <Image
          source={images.bg}
          className="absolute w-full z-0"
          resizeMode="cover"
        />
  
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
  
          {moviesLoading || trendingLoading ? (
            <ActivityIndicator
              size="large"
              color="#AB8BFF"
              className="mt-10 self-center"
            />
          ) : moviesError || trendingError ? (
            <Text className="text-light-100">Error: {moviesError?.message || trendingError?.message}</Text>
          ) : (
            <View className="flex-1 mt-5">
              <SearchBar
                onPress={() => {
                  router.push("/search");
                }}
                placeholder="Search for a movie"
              />
  
              {trendingMovies && (
                <View className="mt-10">
                  <Text className="text-lg text-light-100 font-bold mb-3">
                    Trending Movies
                  </Text>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-4 mt-3"
                    data={uniqueTrendingMovies}
                    contentContainerStyle={{
                      gap: 26,
                    }}
                    renderItem={({ item, index }) => (
                      <TrendingCard movie={item} index={index} />
                    )}
                    keyExtractor={(item) => `trending-${item.movie_id}`}
                    ItemSeparatorComponent={() => <View className="w-4" />}
                  />
                </View>
              )}
  
              <>
                <Text className="text-lg text-light-100 font-bold mt-5 mb-3">
                  Latest Movies
                </Text>
  
                <FlatList
                  data={uniqueMovies}
                  renderItem={({ item, index }) => <MovieCard {...item} />}
                  keyExtractor={(item, index) => `movie-grid-${index}`}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10,
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false}
                />
              </>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };
  
  export default Index;