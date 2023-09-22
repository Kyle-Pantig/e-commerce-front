import { mongooseConnect } from "@/lib/mongoose";
import { Setting } from "@/models/Settings";

export default async function handle(req, res) {
  await mongooseConnect();
  const { method } = req;

  if (method === "GET") {
    const { name } = req.query;
    res.json(await Setting.findOne({ name }));
  }
}
