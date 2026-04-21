const mongoose = require("mongoose");
const { Schema } = mongoose;

const householdSchema = new Schema({
   name:{
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
   }
,
inviteCode:{
    type: String,
    required: true,
    unique: true,
    
},
members:[{type: Schema.Types.ObjectId, ref: "User"}],
createdAt:{
    type: Date,
    default: Date.now(),
}
})













// {
//   _id: ObjectId,
//   name: String,           // required, 3-30 chars
//   inviteCode: String,     // unique, 6 chars uppercase
//   members: [ObjectId],  // user references
//   wasteScore: Number,     // 0-100, default 0
//   createdAt: Date
// }