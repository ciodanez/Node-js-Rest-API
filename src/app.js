import express from "express";
import morgan from "morgan";
//routes
import serviciosRoutes from "./routes/servicios.routes"
const app = express();

//settings
app.set("port", 4000);

//middlewares
app.use(morgan("dev"));
app.use(express.json());//middleware para parsear json de la peticion

//routes
app.use("/api/servicios", serviciosRoutes);

export default app;