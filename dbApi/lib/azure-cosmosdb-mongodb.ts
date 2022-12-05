import { Schema, model, connect } from "mongoose";

let db=null;

const itemSchema = new Schema(
  { itemName: String, saldo: Number, ean: Number},
  { timestamps: true }
);
const itemModel = model("item", itemSchema, "Store");

export const init = async () => {
  if(!db) {
    db = await connect(process.env["CosmosDbConnectionString"]);
  }
};
export const addItem = async (doc) => {
  const modelToInsert = new itemModel();
  modelToInsert["itemName"] = doc.name;
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
    return await itemModel.findOneAndUpdate({query: {ean: doc.ean}, update: {amount: doc.order}});
};