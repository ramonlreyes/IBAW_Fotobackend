import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  images: [
    {
    data: {type: Buffer, required: true},
    contentType: {type: String, required: true}
    },
  ],
  title: {
    type: String,
    require: true,
  },
  album_id:  {
    type: mongoose.Types.ObjectId,
    ref: 'Album'
  }
}, {
  timestamps: true // createdAt, updatedAt
});

const Album = mongoose.model('Album', albumSchema);

export default Album;