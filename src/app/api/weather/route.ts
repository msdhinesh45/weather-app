/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lon");

  const apiKey = "876047d79d630dd5c8547cfac2c1383c";
  let url = "";

  if (address) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&units=metric&appid=${apiKey}`;
  } else if (latitude && longitude) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  } else {
    return NextResponse.json(
      { error: "Please provide either address or latitude/longitude" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.cod !== 200) {
      return NextResponse.json({ error: data.message }, { status: data.cod });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}