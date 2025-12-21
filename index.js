import dotenv from "dotenv";
dotenv.config();
import { make_response } from "./utils.js";

import express from "express"
import morgan from "morgan";
import cors from "cors"
import swaggerUi from 'swagger-ui-express'
import path from 'path';
import { fileURLToPath } from 'url';
import Yaml from "yamljs";

import rateLimit from "express-rate-limit";

import provincesRoutes from "./src/routes/provincesRoutes.js";
import countryRoutes from "./src/routes/countryRoute.js"
import populationRoutes from "./src/routes/populationRoutes.js"
import indicatorRoutes from "./src/routes/indicatorRoutes.js"

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
      }, {})
    )
  }
});

app.use(cors())
app.use(morgan('dev'));
app.use(express.json())

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

app.use("/v1/country", countryRoutes)
app.use("/v1/population", populationRoutes)
app.use("/v1/indicators", indicatorRoutes)
app.use("/v1/province-info", provincesRoutes)

app.use(
  '/v1/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    customSiteTitle: 'Documentation',
    customCss: '.swagger-ui .topbar { display: none }'
  })
);

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  const port = 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}

// Exporta para Vercel
export default app;