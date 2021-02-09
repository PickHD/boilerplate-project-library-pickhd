const mongoose = require("mongoose")

const BookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: [String],
  commentcount: {
    type: Number,
    default: 0
  }
})

const Book = mongoose.model("Book", BookSchema)

module.exports = Book