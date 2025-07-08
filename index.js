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

import indicatorRoutes from "./src/routes/indicatorRoute.js"

const port = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
  origin: ['https://moz-demog-api.vercel.app', 'http://localhost:3000']
}))
app.use(morgan('dev'));
app.use(express.json())


app.use("/api/provinces", provincesRoutes)
app.use("/api/country", countryRoutes)
app.use("/api/indicators", indicatorRoutes)

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'docs.html'))
})
app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})