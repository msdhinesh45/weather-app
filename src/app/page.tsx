/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

export default function Home() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchData(city);
    }
  };

  useEffect(() => {
    fetchData("Mumbai");
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Weather App</h1>
    </div>
  );
}
