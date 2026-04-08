import axios from "axios";
import { envVeriables } from "./env";

export const openRouterClient = axios.create({
  baseURL: "https://openrouter.ai/api/v1/",
  headers: {
    Authorization: `Bearer ${envVeriables.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "Travel Guide Bangladesh",
  },
});