import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  image: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: false
  },
  description: {
    type: String,
    require: false
  },
}, {
  timestamps: true // createdAt, updatedAt
});

const Photo = mongoose.model('Photo', photoSchema)

export default Photo;