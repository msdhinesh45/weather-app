/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest,NextResponse } from "next/server";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: any) {
    const {searchParams} = new URL(request.url);
    const address =searchParams.get("address");
    const latitude =searchParams.get("lat");
    const longitude =searchParams.get("london");
    
    let url = "";
    if(address){
        url=
        "https://api.openweathermap.org/data/2.5/weather?q="+ address +
        "&appid="+ "876047d79d630dd5c8547cfac2c1383c" 
    } else{
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=876047d79d630dd5c8547cfac2c1383c`
    }

    const res= await fetch(url);
    const data = await res.json();
    return NextResponse.json({data})
}