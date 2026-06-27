import { useEffect, useState } from "react";
import images from "../../assets/images";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=jammu&aqi=no`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Weather request failed (${response.status})`);
        }

        setWeather(await response.json());
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Weather is currently unavailable.");
          console.error(err);
        }
      }
    };

    fetchWeather();

    return () => controller.abort();
  }, []);

  if (error) return <div className="weather-data">{error}</div>;
  if (!weather) return <div className="weather-data">Loading weather...</div>;

  return (
    <div className="weather-data">
      <div>
        <img
          style={{ width: "70px", height: "60px" }}
          src={weather.current?.condition?.icon}
          alt="weather-icon"
        />
        <p style={{ textAlign: "center" }}>
          {weather.current?.condition?.text}
        </p>
      </div>
      <div className="vl"></div>
      <div style={{ display: "flex", alignContent: "center" }}>
        <div>
          <img
            style={{ width: "20px", height: "20px", paddingTop: "70px" }}
            src={images.pressure}
            alt="pressure_icon"
          />
        </div>
        <div>
          <p style={{ fontSize: "44.462px" }}>{weather.current?.temp_c}°C</p>
          <p style={{ textAlign: "center" }}>
            {weather.current?.pressure_mb} mbar
          </p>
          <p style={{ textAlign: "center" }}>pressure</p>
        </div>
      </div>

      <div className="vl"></div>

      <div>
        <div style={{ display: "flex", alignContent: "center" }}>
          <div style={{ marginTop: "15px" }}>
            <img
              style={{ width: "20px", height: "20px", paddingRight: "10px" }}
              src={images.wind}
              alt="wind_icon"
            />
          </div>
          <div>
            <p>{weather.current?.wind_kph} km/h</p>
            <p>Wind</p>
          </div>
        </div>
        <div style={{ display: "flex", alignContent: "center" }}>
          <div style={{ marginTop: "25px" }}>
            <img
              style={{ width: "20px", height: "20px", paddingRight: "10px" }}
              src={images.humidity}
              alt="humidity_icon"
            />
          </div>
          <div>
            <p style={{ marginTop: "15px" }}>{weather.current?.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
