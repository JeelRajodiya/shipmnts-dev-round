import express, { type Request, type Response } from "express";
import dbConnect from "./utils/db";
import userRouter from "./routes/userRouter";
import shipmentRouter from "./routes/shipmentRouter";
import flightRouter from "./routes/flightsRouter";

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
const port = 3000;

app.use("/user", userRouter);
app.use("/shipments", shipmentRouter);
app.use("/flights", flightRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the User API");
});

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await dbConnect();
  console.log("Connected to MongoDB");
});
