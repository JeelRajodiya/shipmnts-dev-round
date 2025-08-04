import express, { type Request, type Response, type Router } from "express";
import { User, Shipment, Flight } from "../utils/models";

import z from "zod";
const router: Router = express.Router();

router.put("/:flight_number/status", async (req: Request, res: Response) => {
  const body = req.body;

  const flightSchema = z.object({
    status: z.string(),
  });
  const { flight_number } = req.params;

  try {
    const flightData = flightSchema.parse(body);
    const FlightRecord = await Flight.updateOne(
      { flight_number },
      {
        $set: flightData,
      }
    );
    console.log(FlightRecord);
    if (!FlightRecord) {
      return res.status(404).json({
        success: false,
        message: "flight with ID not found.",
      });
    }
    res.json({
      success: true,
      message: "Flight status updated successfully.",
      data: {
        flight_number,
        status: flightData.status,
      },
    });
  } catch (e) {
    const err = e as Error;
    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/query", async (req: Request, res: Response) => {
  const body = req.query;
  console.log(req.query);

  const flightSchema = z.object({
    carrier: z.string(),
    start_date: z.string(),
    end_date: z.string(),
  });

  try {
    const flightData = flightSchema.parse(body);
    const FlightRecord = await Flight.find({
      departure: {
        $gte: flightData.start_date,
        $lte: flightData.start_date,
      },
      carrier: flightData.carrier,
    });

    if (!FlightRecord) {
      return res.status(404).json({
        success: false,
        message: "flight with ID not found.",
      });
    }
    res.json({
      success: true,
      message: "Flight status updated successfully.",
      data: FlightRecord,
    });
  } catch (e) {
    const err = e as Error;
    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// router.delete("/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const userModel = await User.findByIdAndDelete(id);
//   if (!userModel) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   res.status(200).json({ message: "User deleted successfully" });
//   res.send();
// });

// router.get("/", async (req: Request, res: Response) => {
//   const users = await User.find();
//   res.status(200).json(users);
//   res.send();
// });

// router.get("/", async (req: Request, res: Response) => {
//   const mongooseConn = await dbConnect();
//   const db = mongooseConn.connection.db!;

//   // create a test collection in it, and add a number. increment it by 1 each time the endpoint is hit

//   const collection = db.collection<{ _id: string; count: number }>("test");
//   const result = await collection.findOneAndUpdate(
//     { _id: "counter" },
//     { $inc: { count: 1 } },
//     { upsert: true, returnDocument: "after" }
//   );
//   return res.send(`Counter: ${result?.count || 1}`);
// });

export default router;
