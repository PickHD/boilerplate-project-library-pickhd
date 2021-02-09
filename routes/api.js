/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict'

const Book = require("../models/Book")

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const getAllBooks = await Book.find({})
        return res.json(getAllBooks)
      } catch (e) {
        return res.json({ error: e.message })
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async (req, res) => {
      const { title } = req.body
      try {
        if (await title === "" || title === undefined) { return res.send("missing required field title") }

        const newBook = await Book.create({ title: title })

        return res.json({
          _id: newBook._id,
          title: newBook.title
        })
      } catch (e) {
        return res.json({ error: e.message })
      }
      //response will contain new book object including atleast _id and title
    })

    .delete(async (req, res) => {
      try {
        await Book.deleteMany({})
        return res.send("complete delete successful")
      } catch (e) {
        return res.json({ error: e.message })
      }
      //if successful response will be 'complete delete successful'
    })


  app.route('/api/books/:bookid')
    .get(async (req, res) => {
      const { bookid } = req.params
      try {
        const getBook = await Book.findOne({ _id: bookid })
        if (!getBook) { return res.send("no book exists") }
        return res.json(getBook)
      } catch (e) {
        return res.json({ error: e.message })
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async (req, res) => {
      const { bookid } = req.params
      const { comment } = req.body
      try {
        if (await comment === "" || comment === undefined) { return res.send("missing required field comment") }

        const getBook = await Book.findOne({ _id: bookid })
        if (!getBook) { return res.send("no book exists") }

        getBook.comments.push(comment)
        getBook.commentcount = getBook.__v + 1
        await getBook.save()
        return res.json(getBook)

      } catch (e) {
        return res.json({ error: e.message })
      }
      //json res format same as .get
    })

    .delete(async (req, res) => {
      const { bookid } = req.params
      try {
        const delBook = await Book.deleteOne({ _id: bookid })
        if (delBook.deletedCount===0) { return res.send("no book exists") }
        return res.send("delete successful")
      } catch (e) {
        return res.json({ error: e.message })
      }
      //if successful response will be 'delete successful'
    })

}
