import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../weatherapp/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../weatherapp/dist", "index.html"));
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/weather', async (req, res) => {
  const { city } = req.body;

  if (!city || typeof city !== 'string' || city.trim() === '') {
    return res.status(400).json({ error: 'Invalid city name' });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(
      `${process.env.OPENWEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    const weatherData = response.data;
    res.json({
      city: weatherData.name,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Could not fetch weather data" });
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`App listening on port ${port}`);
});
