import express from "express";
import fetch from "node-fetch";
import ical from "node-ical";

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // CORS
  next();
});

app.get("/api/booking-calendar", async (req, res) => {
  const icalURL = decodeURIComponent(req.query.url || "");

  if (!icalURL) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    const data = await ical.async.fromURL(icalURL);
    const events = Object.values(data)
      .filter((e) => e.type === "VEVENT")
      .map((e) => ({
        start: e.start,
        end: e.end,
        title: "Booked",
      }));
    res.json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error parsing iCal" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
