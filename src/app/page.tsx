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

      if (data.error) {
        setError(data.error);
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
    // fetchData("Mumbai");
  }, []);

  function getCurrentDate() {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <main className={styles.main}>
      <article className={styles.widget}>

      <form className={styles.weatherLocation}>
        <input type="text" 
        className={styles.input_field}
        placeholder="Enter a City name"
        id="cityName"
        onChange={(e)=>setCity(e.target.value)}
        
        />
      </form>

        {weatherData && weatherData.weather && weatherData.weather[0] ? (
          <>
            <div className={styles.icon_and_weatherInfo}>
              <div className={styles.weatherIcon}>
                {weatherData?.weather[0]?.description==="rain" ||
                weatherData?.weather[0]?.description==="fog" ?(
                  <i className={`wi wi-day-${weatherData?.weather[0]?.description}`}
                  
                  ></i>):(
                  <i className="wi wi-day-cloudy"></i>
                )}
                
              </div>
               <div className={styles.weatherInfo}>
                <div className={styles.temperature}>
                  <span>{weatherData.main?.temp}°C</span>
                  <div className={styles.weatherCondition}>
                    {weatherData.weather[0]?.description.toUpperCase()}
                  </div>
                  <div className={styles.place}>{weatherData?.name}</div>
                  <div className={styles.date}>{date}</div>
                </div>
              </div>
             
            </div>
          </>

        ) : (
          <div className={styles.place}><img className={styles.img} src="https://cdn.dribbble.com/users/760347/screenshots/7341673/media/b5af68cdf397db3063f89e5b466aab11.gif"/></div>
        )}
      </article>
    </main>
  );
}
