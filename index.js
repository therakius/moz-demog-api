import dotenv from "dotenv";
dotenv.config();

import express from "express"
import morgan from "morgan";

import provincesRoutes from "./src/routes/provincesRoutes.js";

import countryRoutes from "./src/routes/countryRoute.js"

const port = 3000;
const app = express();

app.use(morgan('dev'));
app.use(express.json())


app.use("/api/provinces", provincesRoutes)

app.use("/api/provinces", provincesRoutes)

app.use("/api/country/all", countryRoutes)


app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})