"use client"
import { useState } from "react";

function getCurrentDate(){
  
}

export default function Home() {
  const date = getCurrentDate();
  const [weatherData,setWeatherData] = useState(null);
  const [city,setCity] = useState("Mumbai");

  async function fetchData(cityName : string){
    try{
      const response = await fetch("")
    }catch(error){
      console.log(error)
    }
  }
  return (
    <div>
      <h1>Weather App</h1>
    </div>
  );
}
