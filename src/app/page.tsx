"use client"
import { useEffect, useState } from "react";

function getCurrentDate(){
  
}

export default function Home() {
  const date = getCurrentDate();
  const [weatherData,setWeatherData] = useState(null);
  const [city,setCity] = useState("Mumbai");

  async function fetchData(cityName : string){
    try{
      const response = await fetch("http://localhost:3000/api/weather?address="+cityName);

      const jsonData = (await response.json()).data;

      setWeatherData(jsonData);

    }catch(error){
      console.log(error)
    }
  }
useEffect (
  ()=>{
    fetchData("Mumbai")
  },[]
);

  return (
    <div>
      <h1>Weather App</h1>
    </div>
  );
}
