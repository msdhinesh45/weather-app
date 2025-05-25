/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [city, setCity] = useState("Mumbai");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchData(cityName: string) {
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
      }
    } catch (error) {
      setError("Failed to fetch weather data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
      });
    }
  }, []);

  function getCurrentDate() {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getWeatherIcon(description: string) {
    const desc = description.toLowerCase();
    if (desc.includes("rain")) return "wi wi-day-rain";
    if (desc.includes("fog")) return "wi wi-day-fog";
    if (desc.includes("cloud")) return "wi wi-day-cloudy";
    if (desc.includes("clear")) return "wi wi-day-sunny";
    if (desc.includes("snow")) return "wi wi-day-snow";
    return "wi wi-day-cloudy";
    console.log(description)
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
          />
          <button className={styles.search_button} type="submit">
            Search
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
                <span>{weatherData.main?.temp}°C</span>
                <div className={styles.weatherCondition}>
                  {weatherData.weather[0].description.toUpperCase()}
                </div>
                <div className={styles.place}>{weatherData.name}</div>
                <div className={styles.date}>{date}</div>
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
            </div>
          )
        )}
      </article>
    </main>
  );
}
