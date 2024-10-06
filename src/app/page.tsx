"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WeatherResponse } from "@/types/weather";
import LocationAutocomplete from "@/components/location-autocomplete";
import CurrentWeather from "@/components/current-weather";
import DailyForecast from "@/components/daily-forecast";
import WeatherChart from "@/components/weather-chart";

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = async (
    location: string,
    lat: number,
    lon: number
  ) => {
    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      let url;
      if (lat !== 0 && lon !== 0) {
        url = `/api/weather?lat=${lat}&lon=${lon}`;
      } else {
        url = `/api/weather?location=${encodeURIComponent(location)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && "weather" in data) {
        setWeatherData(data);
      } else {
        setError("error" in data ? data.error : "Failed to fetch weather data");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Weather App</h1>
      <LocationAutocomplete onLocationSelect={handleLocationSelect} />
      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading && <p className="text-center my-4">Loading weather data...</p>}
      {weatherData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <CurrentWeather data={weatherData} />
          <DailyForecast data={weatherData} />
          <WeatherChart data={weatherData} />
        </div>
      )}
    </main>
  );
}
