/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [date, setDate] = useState(getCurrentDate());
  const [weatherData, setWeatherData] = useState<any>(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchData(cityName: string) {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/weather?address=${cityName}`);
      const data = await response.json();

      if (data.error || !data.weather) {
        setError("City not found. Please try another.");
        setWeatherData(null);
      } else {
        setWeatherData(data);
        setDate(getCurrentDate());
      }
    } catch (error) {
      setError("Failed to fetch weather data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeatherByCoords(lat: number, lon: number) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await response.json();

      if (data.error || !data.weather) {
        setError("Could not fetch weather for your location");
      } else {
        setWeatherData(data);
        setCity(data.name);
        setDate(getCurrentDate());
      }
    } catch (error) {
      setError("Failed to fetch location weather");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Update date every minute
    const timer = setInterval(() => {
      setDate(getCurrentDate());
    }, 60000);

    // Get user's location weather
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to default city if geolocation fails
          fetchData("Mumbai");
        }
      );
    } else {
      // Geolocation not available
      fetchData("Mumbai");
    }

    return () => clearInterval(timer);
  }, []);

  function getCurrentDate() {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getWeatherIcon(description: string, hour = new Date().getHours()) {
    const desc = description.toLowerCase();
    const isDayTime = hour >= 6 && hour < 18;

    // Clear conditions
    if (desc.includes("clear")) {
      return isDayTime ? "wi wi-day-sunny" : "wi wi-night-clear";
    }

    // Rain conditions
    if (desc.includes("rain") || desc.includes("drizzle")) {
      if (desc.includes("light")) return isDayTime ? "wi wi-day-rain-mix" : "wi wi-night-alt-rain-mix";
      if (desc.includes("heavy")) return "wi wi-rain";
      return isDayTime ? "wi wi-day-rain" : "wi wi-night-alt-rain";
    }

    // Thunderstorm
    if (desc.includes("thunderstorm")) return "wi wi-thunderstorm";

    // Snow
    if (desc.includes("snow")) return "wi wi-snow";

    // Fog/mist/haze
    if (desc.includes("fog") || desc.includes("mist") || desc.includes("haze")) {
      return isDayTime ? "wi wi-day-fog" : "wi wi-night-fog";
    }

    // Cloudy conditions
    if (desc.includes("cloud")) {
      if (desc.includes("few") || desc.includes("scattered")) {
        return isDayTime ? "wi wi-day-cloudy-high" : "wi wi-night-alt-cloudy-high";
      }
      return isDayTime ? "wi wi-day-cloudy" : "wi wi-night-alt-cloudy";
    }

    // Extreme weather
    if (desc.includes("tornado")) return "wi wi-tornado";
    if (desc.includes("sand") || desc.includes("dust")) return "wi wi-dust";

    // Default icon
    return isDayTime ? "wi wi-day-cloudy" : "wi wi-night-alt-cloudy";
  }

  return (
    <main className={styles.main}>
      <article className={styles.widget}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(city);
          }}
          className={styles.weatherLocation}
        >
          <input
            type="text"
            className={styles.input_field}
            placeholder="Enter a City name"
            id="cityName"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
          />
          <button 
            className={styles.search_button} 
            type="submit"
            disabled={loading || !city.trim()}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              "Search"
            )}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {weatherData && weatherData.weather && weatherData.weather[0] ? (
          <div className={styles.icon_and_weatherInfo}>
            <div className={styles.weatherIcon}>
              <i className={getWeatherIcon(weatherData.weather[0].description)}></i>
            </div>
            <div className={styles.weatherInfo}>
              <div className={styles.temperature}>
                <span>{Math.round(weatherData.main?.temp)}°C</span>
                <div className={styles.weatherCondition}>
                  {weatherData.weather[0].description.toUpperCase()}
                </div>
                <div className={styles.place}>
                  {weatherData.name}, {weatherData.sys?.country}
                </div>
                <div className={styles.date}>{date}</div>
              </div>
              <div className={styles.additionalInfo}>
                <div>
                  <i className="wi wi-humidity"></i> {weatherData.main?.humidity}%
                </div>
                <div>
                  <i className="wi wi-strong-wind"></i> {weatherData.wind?.speed} km/h
                </div>
                <div>
                  <i className="wi wi-barometer"></i> {weatherData.main?.pressure} hPa
                </div>
              </div>
            </div>
          </div>
        ) : (
          !error && (
            <div className={styles.imageWrapper}>
              <img
                className={styles.img}
                src="https://cdn.dribbble.com/users/760347/screenshots/7341673/media/b5af68cdf397db3063f89e5b466aab11.gif"
                alt="weather waiting"
              />
              <div className={styles.loadingText}>Loading weather data...</div>
            </div>
          )
        )}
      </article>
    </main>
  );
}