import dotenv from "dotenv";
dotenv.config();
import { make_response } from "./utils.js";
import { requireApiKey } from "./src/middlewares/requireApiKey.js";

import express from "express"
import morgan from "morgan";
import cors from "cors"
import path from 'path';
import { fileURLToPath } from 'url';
import Yaml from "yamljs";


import rateLimit from "express-rate-limit";

import provincesRoutes from "./src/routes/provincesRoutes.js";
import countryRoutes from "./src/routes/countryRoute.js"
import populationRoutes from "./src/routes/populationRoutes.js"
import indicatorRoutes from "./src/routes/indicatorRoutes.js"
import authRoutes from "./src/routes/authRoutes.js"

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.join(__dirname, 'swagger.yml');
const swaggerDoc = Yaml.load(swaggerPath);

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(
      make_response(false, 429, "Too many requests, please try again later", {
        "description": "RATE_LIMIT_EXCEEDED",
        "retry_after": 60
      }, [])
    )
  }
});

const authLimiter = rateLimit ({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>{
    res.status(429).json(make_response(false, 429, "Maximum number of attempts exceeded, please try again later", {"description": "RATE_LIMIT_EXCEEDED", "retry_after": 60}, []))
  }
})

// Track server startup time for uptime calculation
const serverStartTime = Date.now();

app.use(cors())
app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  const originalSend = res.send;
  let responseBody;

  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  res.on("finish", () => {
    if (res.statusCode >= 400) {
      const log = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        request_query: req.query,
        response: responseBody
      };
      console.log(log);
    }
  });

  next();
});

app.use((req, res, next) => {
  if (req.path.startsWith('/v1/docs')) {
    return next();
  }
  return apiLimiter(req, res, next);
});

app.set('trust proxy', 1);

app.use("/v1/country", requireApiKey, countryRoutes)
app.use("/v1/population", requireApiKey, populationRoutes)
app.use("/v1/indicators", requireApiKey, indicatorRoutes)
app.use("/v1/provinces", requireApiKey, provincesRoutes)
app.use("/auth", authLimiter, authRoutes)

import { readFileSync } from 'fs';

// Rota que retorna o JSON do swagger
app.get('/v1/docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerDoc);
});

// Rota que serve a UI com spec embutido
app.get('/v1/docs', (req, res) => {
  const htmlPath = path.join(__dirname, 'public', 'swagger-ui.html');
  let html = readFileSync(htmlPath, 'utf-8');
  
  // Injeta o spec diretamente no HTML
  html = html.replace(
    '"{{SWAGGER_SPEC}}"',
    JSON.stringify(swaggerDoc)
  );
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/health', (req, res) => {
  const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
  
  res.json({
    code: 200,
    status: 'ok',
    uptime: uptime,
    timestamp: new Date().toISOString()
  });
});

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.APP_PORT || 8080;
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}

// Exporta para Vercel
export default app;