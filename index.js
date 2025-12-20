import dotenv from "dotenv";
dotenv.config();

import express from "express"
import morgan from "morgan";
import cors from "cors"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; // <- AQUI estás a importar dirname
import path from "path";

import provincesRoutes from "./src/routes/provincesRoutes.js";

import countryRoutes from "./src/routes/countryRoute.js"
import populationRoutes from "./src/routes/populationRoutes.js"
import indicatorRoutes from "./src/routes/indicatorRoutes.js"

const port = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors())
app.use(morgan('dev'));
app.use(express.json())

app.use((req, res, next) => {
  const originalSend = res.send;

  let responseBody;

  res.send = function (body) {
    responseBody = body;   // capturamos a resposta
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



// versao 1
app.use("/v1/country", countryRoutes)

app.use("/v1/population", populationRoutes)

app.use("/v1/indicators", indicatorRoutes)

app.use("/v1/province-info", provincesRoutes)


app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'docs.html'))
})
app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})