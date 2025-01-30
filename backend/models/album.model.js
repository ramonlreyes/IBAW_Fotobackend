import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  image: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  album_id:  {
    type: mongoose.Types.ObjectId,
    ref: Album
  }
}, {
  timestamps: true // createdAt, updatedAt
});

const Album = mongoose.model('Album', albumSchema)

export default Album;