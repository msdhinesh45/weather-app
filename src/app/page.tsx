"use client"
import { useState } from "react";

export default function Home() {
  const [weatherData,setWeatherData] = useState(null);
  const [city,setCity] = useState("Mumbai")
  return (
    <div>
      <h1>Weather App</h1>
    </div>
  );
}
