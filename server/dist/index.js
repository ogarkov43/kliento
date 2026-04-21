import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import helmet from "helmet";
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://127.0.0.1:5173";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spaRoot = path.join(__dirname, "../../frontend/dist");
const spaIndex = path.join(spaRoot, "index.html");
const spaEnabled = existsSync(spaIndex);
const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "256kb" }));
app.use(cors({
    origin: [FRONTEND_ORIGIN, "https://web.telegram.org"],
    credentials: true,
}));
/**
 * Проверка живости API для Mini App и мониторинга.
 */
app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "monte-backend", ts: new Date().toISOString() });
});
/**
 * Заглушка под будущие турниры и запись.
 */
app.get("/api/v1/meta", (_req, res) => {
    res.json({ club: "MONTE", version: 1 });
});
if (spaEnabled) {
    app.use(express.static(spaRoot, { index: false }));
}
app.use((req, res) => {
    if (spaEnabled && req.method === "GET" && !req.path.startsWith("/api")) {
        res.sendFile(spaIndex);
        return;
    }
    res.status(404).json({ error: "not_found" });
});
app.listen(PORT, () => {
    console.log(`MONTE backend http://127.0.0.1:${PORT}${spaEnabled ? " (+ SPA)" : ""}`);
});
//# sourceMappingURL=index.js.map