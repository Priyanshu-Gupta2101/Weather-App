import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/outline";
import { CalendarDaysIcon, MapPinIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import * as Progress from "react-native-progress";
import { StatusBar } from "expo-status-bar";
import { weatherImages } from "../constants";
import { getData, storeData } from "../utils/asyncStorage";
import { fetchWeatherForecast, fetchLocations } from "../api/weather";

const theme = {
  bgWhite: (opacity) => `rgba(255,255,255, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    height: Dimensions.get("window").height,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    height: 50,
    marginHorizontal: 10,
    position: "relative",
    zIndex: 50,
  },
  searchInput: {
    paddingLeft: 6,
    height: 40,
    paddingBottom: 1,
    flex: 1,
    fontSize: 16,
    color: "white",
  },
  searchIcon: {
    borderRadius: 9999,
    padding: 12,
    margin: 4,
    backgroundColor: theme.bgWhite(0.3),
  },
  searchResultsContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: "gray",
    top: 50,
    borderRadius: 24,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  weatherContainer: {
    marginHorizontal: 10,
    justifyContent: "space-around",
    flex: 1,
    marginBottom: 8,
  },
  weatherText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  weatherImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  weatherInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  weatherInfoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherInfoText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 4,
  },
  dailyForecastContainer: {
    marginBottom: 8,
  },
  dailyForecastHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  dailyForecastHeaderText: {
    color: "white",
    fontSize: 16,
  },
  dailyForecastScrollView: {
    paddingHorizontal: 15,
  },
  dailyForecastItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    paddingVertical: 8,
    marginRight: 4,
    borderRadius: 12,
    backgroundColor: theme.bgWhite(0.15),
  },
  dailyForecastItemText: {
    color: "white",
  },
});

export default function Home() {
  const [showSearch, toggleSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({});

  const handleSearch = () => {
    if (searchText && searchText.length > 2) {
      fetchLocations({ cityName: searchText }).then((data) => {
        setLocations(data);
      });
    }
  };

  const handleLocation = (loc) => {
    setLoading(true);
    toggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setLoading(false);
      setWeather(data);
      storeData("city", loc.name);
    });
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData("city");
    let cityName = myCity ? myCity : "Mumbai";
    fetchWeatherForecast({
      cityName,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleTextChange = (text) => {
    setSearchText(text);
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [
    searchText,
  ]);

  const { location, current } = weather;

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Image
          blurRadius={70}
          source={require("../../assets/images/bg.png")}
          style={styles.backgroundImage}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
          </View>
        ) : (
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.searchContainer}>
              <View
                style={{
                  backgroundColor: showSearch
                    ? theme.bgWhite(0.2)
                    : "transparent",
                }}
              >
                {showSearch && (
                  <TextInput
                    value={searchText}
                    onChangeText={handleTextChange}
                    onSubmitEditing={handleTextDebounce}
                    placeholder="Search city"
                    placeholderTextColor={"lightgray"}
                    style={styles.searchInput}
                    autoFocus
                  />
                )}
                <TouchableOpacity
                  onPress={() => toggleSearch(!showSearch)}
                  style={styles.searchIcon}
                >
                  {showSearch ? (
                    <XMarkIcon size={25} color="white" />
                  ) : (
                    <MagnifyingGlassIcon size={25} color="white" />
                  )}
                </TouchableOpacity>
              </View>
              {locations.length > 0 && showSearch && (
                <View style={styles.searchResultsContainer}>
                  {locations.map((loc, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleLocation(loc)}
                      style={[
                        styles.searchResultItem,
                        index + 1 !== locations.length && {
                          borderBottomWidth: 2,
                          borderBottomColor: "gray",
                        },
                      ]}
                    >
                      <MapPinIcon size={20} color="gray" />
                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                          marginLeft: 8,
                        }}
                      >
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.weatherContainer}>
              <Text style={styles.weatherText}>
                {location?.name},
                <Text
                  style={{
                    ...styles.weatherText,
                    fontSize: 14,
                    fontWeight: "normal",
                    color: "gray",
                  }}
                >
                  {location?.country}
                </Text>
              </Text>
              <Image
                source={weatherImages[current?.condition?.text || "other"]}
                style={styles.weatherImage}
              />
              <View>
                <Text style={styles.weatherText}>{current?.temp_c}&#176;</Text>
                <Text
                  style={{
                    ...styles.weatherText,
                    fontSize: 16,
                    fontWeight: "normal",
                  }}
                >
                  {current?.condition?.text}
                </Text>
              </View>
              <View style={styles.weatherInfoContainer}>
                <View style={styles.weatherInfoItem}>
                  <Image
                    source={require("../../assets/icons/wind.png")}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={styles.weatherInfoText}>
                    {current?.wind_kph}km
                  </Text>
                </View>
                <View style={styles.weatherInfoItem}>
                  <Image
                    source={require("../../assets/icons/drop.png")}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={styles.weatherInfoText}>
                    {current?.humidity}%
                  </Text>
                </View>
                <View style={styles.weatherInfoItem}>
                  <Image
                    source={require("../../assets/icons/sun.png")}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={styles.weatherInfoText}>
                    {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.dailyForecastContainer}>
              <View style={styles.dailyForecastHeader}>
                <CalendarDaysIcon size={22} color="white" />
                <Text style={styles.dailyForecastHeaderText}>
                  Daily forecast
                </Text>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={styles.dailyForecastScrollView}
                showsHorizontalScrollIndicator={false}
              >
                {weather?.forecast?.forecastday?.map((item, index) => {
                  const date = new Date(item.date);
                  const options = { weekday: "long" };
                  let dayName = date.toLocaleDateString("en-US", options);
                  dayName = dayName.split(",")[0];

                  return (
                    <View key={index} style={styles.dailyForecastItem}>
                      <Image
                        source={
                          weatherImages[item?.day?.condition?.text || "other"]
                        }
                        style={{ width: 44, height: 44 }}
                      />
                      <Text style={styles.dailyForecastItemText}>
                        {dayName}
                      </Text>
                      <Text style={styles.dailyForecastItemText}>
                        {item?.day?.avgtemp_c}&#176;
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </SafeAreaView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
