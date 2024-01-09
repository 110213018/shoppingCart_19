import { ObjectId } from "mongodb";

export default class {
  constructor(session) {
    this.datasets = session.collection("orders");
  }

  async create({ bid, sid, products, status, review }) {
    const result = await this.datasets.insertOne({
      bid: new ObjectId(bid),
      sid: new ObjectId(sid),
      products: products.map((p) => {
        return {
          quantity: Number(p.quantity),
          id: new ObjectId(p.id),
        };
      }),
      status: Number(status),
      review: Number(review),
    });
    return await this.get(result.insertedId);
  }

  async get(id) {
    return this.datasets.findOne({ _id: new ObjectId(id) });
  }

  async getByBId(bid) {
    return this.datasets.find({ bid: new ObjectId(bid) }).toArray();
  }

  async getBySId(sid) {
    return this.datasets.find({ sid: new ObjectId(sid) }).toArray();
  }

  async getByLogistic() {
    return this.datasets.find({ status: { $gte: 2 } }).toArray();
  }

  async updateReview(id, review) { // 處理評價
    await this.datasets.updateOne(
      { _id: new ObjectId(id) },
      { $set: { review: Number(review) } }
    );
  }

  async updateStatus(id, status) { // 處理狀態
    await this.datasets.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: Number(status) } }
    );
  }
}
