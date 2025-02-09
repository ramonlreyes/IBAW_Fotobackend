import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  album_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Album'
  },
  title: {type: String, require: true},
  cover: {type: String, require: true},
  images: [{type: String, require: true}],
}, {
  timestamps: true // createdAt, updatedAt
});

const Album = mongoose.model('Album', albumSchema);

export default Album;