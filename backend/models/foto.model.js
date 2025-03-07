import mongoose from "mongoose";

const fotosSchema = new mongoose.Schema({
  albumId: { type: mongoose.Schema.Types.ObjectId,
  ref: 'Album',
  require: true },
  images: [{
    type: String,
    require: true
  }],
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

const Fotos = mongoose.model('Fotos', fotosSchema)

export default Fotos;