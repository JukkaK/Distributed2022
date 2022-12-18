import { Schema, model, connect } from "mongoose";

//This library implementes calls to CosmosDB instances. It fetches connection string from Func App configuration (created with IAC-code).
//The connection string has a hint on which CosmosDB instance this function should primarily direct it's operations to.

let db=null;

const itemSchema = new Schema(
  { name: String, amount: Number, ean: Number},
  { timestamps: true }
);
const itemModel = model("item", itemSchema, "Store");

export const init = async () => {
  if(!db) {
    console.log("connecting to mongodb with:" + process.env["CosmosDbConnectionString"]);
    db = await connect(process.env["CosmosDbConnectionString"]);
  }
};
export const addItem = async (doc) => {
  const modelToInsert = new itemModel();
  modelToInsert["name"] = doc.name;
  modelToInsert["saldo"] = doc.saldo;

  return await modelToInsert.save();
};
export const findItemByEan = async (ean) => {
  return await itemModel.find({ean: ean});
};
export const findItems = async (query = {}) => {
  return await itemModel.find({});
};
export const deleteItemById = async (id) => {
  return await itemModel.findByIdAndDelete(id);
};
export const updateItemSaldo = async (doc) => {
  const filter = {ean: doc.ean};
  const update = { amount: doc.amount };
  const res =  await findItemByEan(doc.ean);
  const amount = res[0].amount - doc.amount
  return await itemModel.findOneAndUpdate({ean: doc.ean}, {amount: amount}, {
    new: true}
  );
};