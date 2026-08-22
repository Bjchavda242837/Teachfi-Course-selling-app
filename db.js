const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


//user Schema 
const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

//user Schema 
const adminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

//user Schema 
const courseSchema = new Schema({
  title: String,
  description: String,
  price: String,
  imageUrl: String,
  creatorId: ObjectId,
});

//user Schema 
const purchaseSchema = new Schema({
  userId: ObjectId,
  courseId: ObjectId,
});

//mongoose models which will be exports in to index.js
const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel,
};
