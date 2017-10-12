import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Message = new mongoose.Schema({
  date: { type: String },
  message: { type: String }
})


export default mongoose.model('message', Message)
