import axios from "axios";
import { API_KEY } from "@env";

const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    return {};
  }
};

export const fetchWeatherForecast = (params) => {
  let forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days}`;
  return apiCall(forecastUrl);
};

export const fetchLocations = (params) => {
  let locationsUrl = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`;
  return apiCall(locationsUrl);
};
