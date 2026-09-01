import cors from "cors";
import env from "./env.js";

const rawAllowedOrigins = [
  env.clientUrl,
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
];

const allowedOrigins = rawAllowedOrigins
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman, or server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");

    // Allow localhost and local IP development ports
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(cleanOrigin)) {
      return callback(null, true);
    }

    // Allow all vercel.app domains (production and preview deployments)
    if (cleanOrigin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // Check allowed origins list
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Default allow for any other origin to prevent CORS blocks in production
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

export default cors(corsOptions);
