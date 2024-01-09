import { ObjectId } from "mongodb";

export default class {
  constructor(session) {
    this.datasets = session.collection("carts");
  }

  async create({ bid, pid, quantity }) {
    const cart = await this.datasets.findOne({
      bid: new ObjectId(bid),
      pid: new ObjectId(pid),
    });
    if (cart) {
      await this.datasets.updateOne(
        { _id: cart._id },
        { $inc: { quantity: Number(quantity) } }
      );
      return await this.get(cart._id);
    } else {
      const result = await this.datasets.insertOne({
        bid: new ObjectId(bid),
        pid: new ObjectId(pid),
        quantity: Number(quantity),
      });
      return await this.get(result.insertedId);
    }
  }

  async get(id) {
    return this.datasets.findOne({ _id: new ObjectId(id) });
  }

  async getByBId(bid) {
    return this.datasets.find({ bid: new ObjectId(bid) }).toArray();
  }

  async del(id) {
    await this.datasets.deleteOne({ _id: new ObjectId(id) });
  }

  async cleanByBId(bid) {
    await this.datasets.deleteMany({ bid: new ObjectId(bid) });
  }
}
