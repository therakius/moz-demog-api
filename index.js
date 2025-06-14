import dotenv from "dotenv";
dotenv.config();

import express from "express"
import morgan from "morgan";

import provincesRoutes from "./src/routes/provincesRoutes.js";

import countryRoutes from "./src/routes/countryRoute.js"

import indicatorRoutes from "./src/routes/indicatorRoute.js"

const port = 3000;
const app = express();

app.use(morgan('dev'));
app.use(express.json())


app.use("/api/provinces", provincesRoutes)
app.use("/api/country", countryRoutes)
app.use("/api/indicators", indicatorRoutes)


app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})