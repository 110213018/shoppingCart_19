import { ObjectId } from "mongodb";

export default class {
  constructor(session) {
    this.datasets = session.collection("users");
  }

  async create({ username, password, role }) {
    const result = await this.datasets.insertOne({
      username,
      password,
      role: Number(role),
    });

    return await this.get(result.insertedId);
  }

  async login({ username, password }) {
    return await this.datasets.findOne({ username, password });
  }

  async get(id) {
    return this.datasets.findOne({ _id: new ObjectId(id) });
  }
}
