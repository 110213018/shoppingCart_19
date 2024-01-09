import { ObjectId } from "mongodb";

export default class {
  constructor(session) {
    this.datasets = session.collection("products");
  }

  async create({ sid, name, intro, stock, price }) {
    const result = await this.datasets.insertOne({
      sid: new ObjectId(sid),
      name,
      intro,
      stock: Number(stock),
      price: Number(price),
    });
    return await this.get(result.insertedId);
  }

  async get(id) {
    return this.datasets.findOne({ _id: new ObjectId(id) });
  }

  async getAll() {
    return this.datasets.find().toArray();
  }

  async getBySId(sid) {
    return this.datasets.find({ sid: new ObjectId(sid) }).toArray();
  }

  async update({ id, name, intro, stock, price }) {
    await this.datasets.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, intro, stock, price } }
    );
    return await this.get(id);
  }

  async updateStock({ id, stock }) {
    await this.datasets.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { stock: -Number(stock) } }
    );
    return await this.get(id);
  }

  async del(id) {
    await this.datasets.deleteOne({ _id: new ObjectId(id) });
  }
}
