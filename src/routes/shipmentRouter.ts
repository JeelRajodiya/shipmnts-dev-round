import express, { type Request, type Response, type Router } from "express";
import { User, Shipment, Flight } from "../utils/models";
import dbConnect from "../utils/db";
import z from "zod";
const router: Router = express.Router();
// /shipment route

router.post("/create", async (req: Request, res: Response) => {
  const body = req.body;

  const shipmentSchema = z.object({
    origin: z.string(),
    destination: z.string(),
    shipment_number: z.string(),
  });
  try {
    const shipmentData = shipmentSchema.parse(body);
    const insertOperation = await Shipment.create({
      shipment_number: shipmentData.shipment_number,
      hops: [shipmentData.origin, shipmentData.destination],
    });
    return res.status(201).json({
      success: true,
      message: "Shipment created successfully.",
      data: insertOperation,
    });
  } catch (e) {
    const err = e as Error;
    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

router.post(
  "/:shipment_number/hops/add",
  async (req: Request, res: Response) => {
    const body = req.body;

    const shipmentSchema = z.object({
      previous_hop: z.string(),
      next_hop: z.string(),
      new_hop: z.string(),
    });
    const { shipment_number } = req.params;

    try {
      const shipmentData = shipmentSchema.parse(body);
      const shipmentRecord = await Shipment.findOne({ shipment_number });
      console.log(shipmentRecord);
      if (!shipmentRecord) {
        return res.status(404).json({
          success: false,
          message: "Shipment with ID not found.",
        });
      }
      let indexOfStartHop = 0;
      const arrayLen = shipmentRecord.hops.length;
      for (let i = 0; i < arrayLen; i++) {
        if (shipmentRecord.hops[i] === shipmentData.new_hop) {
          indexOfStartHop = i;
          break;
        }
      }
      console.log(indexOfStartHop);
      const slice1 = shipmentRecord.hops.slice(0, indexOfStartHop + 1);
      const slice2 = shipmentRecord.hops.slice(indexOfStartHop + 1);
      console.log(slice1, slice2);
      shipmentRecord.hops = [...slice1, shipmentData.new_hop, ...slice2];
      await shipmentRecord.save();
      return res.status(201).json({
        success: true,
        message: "Hop added successfully.",
        data: shipmentRecord,
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
  }
);

router.post(
  "/:shipment_number/flights/add",
  async (req: Request, res: Response) => {
    const body = req.body;

    const flightSchema = z.object({
      carrier: z.string(),
      from: z.string(),
      to: z.string(),
      flight_number: z.string(),
      departure: z.string(), // TimeStamp. (OR DATE)
      arrival: z.string(),
      status: z.string().optional().default("in-transit"),
    });
    const { shipment_number } = req.params;

    try {
      const shipmentRecord = await Shipment.findOne({ shipment_number });

      if (!shipmentRecord) {
        return res.status(404).json({
          success: false,
          message: "Shipment with ID not found.",
        });
      }

      const flightData = flightSchema.parse(body);
      const insertion = Flight.create(flightData);
      const hops = shipmentRecord.hops;
      const arrayLen = hops.length;
      const fromLocation = flightData.from;
      const toLocation = flightData.to;
      const fromIdx = hops.indexOf(fromLocation);
      const toIdx = hops.indexOf(toLocation);
      if (toIdx + 1 == fromIdx) {
        return res.status(400).json({
          success: false,
          message:
            "Unable to add a flight. The 'from' and 'to' locations are not consecutive hops for this shipment.",
        });
      }
      const newPath =
        fromLocation + "-" + flightData.carrier + "-" + toLocation;

      const flightInsertion = await Flight.insertOne({
        shipment_number: Number(shipment_number),
        flight_number: flightData.flight_number,
        flight_path: newPath,
        departure: new Date(Number(flightData.departure)),
        arrival: new Date(Number(flightData.arrival)),
        status: flightData.status, // default status.
      });
      return res.status(201).json({
        success: true,
        message: "Flight information added successfully",
        data: flightInsertion,
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
  }
);

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
