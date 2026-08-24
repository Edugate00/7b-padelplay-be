import express, { Request, Response } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import baseRouter from "./routes/routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// CORS setup
app.use(
  cors({
    origin: true, // Allow requests from any origin (e.g. frontend dev server)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token"],
  }),
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", baseRouter());

// Root Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Admin Padel Backend API" });
});

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
