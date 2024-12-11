import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import AuthRouter from "./routes/auth";
import otpRouter from "./routes/otp";
import { authenticateJWT } from "./middlewares/authJWT";
import { validateStats } from "./middlewares/authStats";
import ticketRouter from "./routes/ticket";
import queryRouter from "./routes/query";

const app = express();

app.use(cors({
  origin: "https://ticketportal-frontend.onrender.com",
  methods: ['GET', 'POST', 'PATCH', 'DELETE','PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'startdate', 'enddate'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'Authorization'],
}));

app.use(express.json());
app.use("/auth", AuthRouter);
app.use("/otp", authenticateJWT, validateStats, otpRouter);
app.use("/ticket", authenticateJWT, validateStats, ticketRouter);
app.use("/query", queryRouter);

app.get("/health-check", (req, res) => {
  res.status(200).json({ message: "Yeah, I'm Alive!!" });
});

const mongodb_uri = process.env.MONGODB_URI;

if (!mongodb_uri) {
  console.error("MONGODB_URI environment variable is not defined.");
} else {
  mongoose.connect(mongodb_uri, { dbName: "ticketPortal" });

  const db = mongoose.connection;

  db.once("open", () => {
    console.log("MongoDB connected");

    const PORT: number = parseInt(process.env.PORT || "3000", 10);

    app.listen(PORT, "0.0.0.0", () => {
      console.log("Server listening on port:", PORT);
    });
  });

  db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
}
