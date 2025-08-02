import express, { type Request, type Response, type Router } from "express";
import { User } from "../utils/models";
import dbConnect from "../utils/db";
const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const body = req.body;

  const userModel = new User({
    name: body.name,
    email: body.email,
    age: body.age,
  });
  await userModel.save();
  res.status(201).json(userModel);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const userModel = await User.findByIdAndDelete(id);
  if (!userModel) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ message: "User deleted successfully" });
  res.send();
});

router.get("/", async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json(users);
  res.send();
});

router.get("/", async (req: Request, res: Response) => {
  const mongooseConn = await dbConnect();
  const db = mongooseConn.connection.db!;

  // create a test collection in it, and add a number. increment it by 1 each time the endpoint is hit

  const collection = db.collection<{ _id: string; count: number }>("test");
  const result = await collection.findOneAndUpdate(
    { _id: "counter" },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: "after" }
  );
  return res.send(`Counter: ${result?.count || 1}`);
});

export default router;
