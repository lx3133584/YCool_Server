import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Rank = new mongoose.Schema({
  type: {
    type: String
  },
  novel: {
    type: ObjectId,
    ref: 'novel'
  },
  num: {
    type: Number
  },
  key: {
    type: String,
    unique: true
  }
})

Rank.pre('save', function preSave(next) {
  let rank = this
  rank.key = rank.type + rank.num
  return next()
})

Rank.statics = {
  getAllTypesList: function() {
    return this.distinct('type').exec()
  },
  getTypeList: function(type) {
    return this.find({type}, ['novel', 'num']).sort({num: 1}).populate('novel').exec()
  }
}

export default mongoose.model('rank', Rank)
