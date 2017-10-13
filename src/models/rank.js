import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Rank = new mongoose.Schema({
  type: { type: String , unique: true },
  rank: [{ type: ObjectId, ref: 'novel'}],
})

Rank.statics = {
  getAllTypesList: function (){
    return this
      .find({})
      .populate('rank')
      .exec()
  },
  getTypeList: function (type){
    return this
      .find({type})
      .populate('rank')
      .exec()
  },
}

export default mongoose.model('rank', Rank)
