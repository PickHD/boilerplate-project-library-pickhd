/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http')
const chai = require('chai')
const mongoose = require('mongoose')
const { assert } = chai
const app = require('../server')

const Book = require("../models/Book")

chai.use(chaiHttp)

suite('Functional Tests', () => {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(app)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200)
  //       assert.isArray(res.body, 'response should be an array')
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount')
  //       assert.property(res.body[0], 'title', 'Books in array should contain title')
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id')
  //       done()
  //     })
  // })
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', () => {
    let getId
    let fakeId = mongoose.Types.ObjectId()

    //!POST BOOK passed
    suite('POST /api/books with title => create book object/expect book object', () => {
      teardown((done) => {
        Book.deleteOne({ title: "Harri Pottah 8" })
          .then(() => done())
          .catch(e => done(e))
      })
      test('Test POST /api/books with title', (done) => {
        chai
          .request(app)
          .post("/api/books")
          .send({ title: "Harri Pottah 8" })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.type, "application/json")
            assert.property(res.body, "_id", "should contain _id")
            assert.property(res.body, "title", "should contain title")
            assert.equal(res.body.title, "Harri Pottah 8")
            done()
          })
      })

      test('Test POST /api/books with no title given', (done) => {
        chai
          .request(app)
          .post("/api/books")
          .end((err, res) => {
            assert.isUndefined(res.body.title)
            assert.notEqual(res.type, "application/json")
            assert.equal(res.text, "missing required field title")
            done()
          })
      })

    })

    //!GET BOOKS passed
    suite('GET /api/books => array of books', () => {
      setup((done) => {
        Book.create({ title: "A" })
          .then(() => done())
          .catch(e => done(e))
      })
      teardown((done) => {
        Book.deleteOne({ title: "A" })
          .then(() => done())
          .catch(e => done(e))
      })
      test('Test GET /api/books', (done) => {
        chai.request(app)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isArray(res.body, 'response should be an array')
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount')
            assert.property(res.body[0], 'title', 'Books in array should contain title')
            assert.property(res.body[0], '_id', 'Books in array should contain _id')
            done()
          })
      })

    })

    //!GET BOOK passed
    suite('GET /api/books/[id] => book object with [id]', () => {
      setup((done) => {
        Book.create({ title: "How to catch Lion" })
          .then((b) => {
            getId = b._id
            done()
          })
          .catch(e => done(e))
      })
      teardown((done) => {
        Book.deleteOne({ _id: getId })
          .then(() => done())
          .catch(e => done(e))
      })

      test('Test GET /api/books/[id] with id not in db', (done) => {
        chai
          .request(app)
          .get(`/api/books/${fakeId}`)
          .end((err, res) => {
            assert.equal(res.text, "no book exists")
            done()
          })
      })

      test('Test GET /api/books/[id] with valid id in db', (done) => {
        chai
          .request(app)
          .get(`/api/books/${getId}`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.type, "application/json")
            assert.property(res.body, 'commentcount', 'Should contain commentcount')
            assert.property(res.body, 'title', 'Should contain title')
            assert.property(res.body, '_id', ' should contain _id')
            assert.property(res.body, 'comments', 'should contain comments array')
            done()
          })
      })

    })

    //!POST COMMENT passed
    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      setup((done) => {
        Book.create({ title: "How to catch Snake" })
          .then((b) => {
            getId = b._id
            done()
          })
          .catch(e => done(e))
      })
      teardown((done) => {
        Book.deleteOne({ _id: getId })
          .then(() => done())
          .catch(e => done(e))
      })
      test('Test POST /api/books/[id] with comment', (done) => {
        chai
          .request(app)
          .post(`/api/books/${getId}`)
          .send({ comment: "What a wonderful book!" })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.type, "application/json")
            assert.property(res.body, 'commentcount', 'Should contain commentcount')
            assert.property(res.body, 'title', 'Should contain title')
            assert.property(res.body, '_id', ' should contain _id')
            assert.property(res.body, 'comments', 'should contain comments array')
            assert.equal(res.body.comments[0], "What a wonderful book!")
            done()
          })

      })

      test('Test POST /api/books/[id] without comment field', (done) => {
        chai
          .request(app)
          .post(`/api/books/${getId}`)
          .end((err, res) => {
            assert.equal(res.text, "missing required field comment")
            done()
          })
      })

      test('Test POST /api/books/[id] with comment, id not in db', (done) => {
        chai
          .request(app)
          .post(`/api/books/${fakeId}`)
          .send({ comment: "What a wonderful book!" })
          .end((err, res) => {
            assert.equal(res.text, "no book exists")
            done()
          })
      })

    })
    //!DELETE BOOK passed
    suite('DELETE /api/books/[id] => delete book object id', () => {
      setup((done) => {
        Book.create({ title: "How to catch Grizzle Bear" })
          .then((b) => {
            getId = b._id
            done()
          })
          .catch(e => done(e))
      })
      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai
          .request(app)
          .delete(`/api/books/${getId}`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, "delete successful")
            done()
          })
      })

      test('Test DELETE /api/books/[id] with  id not in db', (done) => {
        chai
          .request(app)
          .delete(`/api/books/${fakeId}`)
          .end((err, res) => {
            assert.equal(res.text, "no book exists")
            done()
          })
      })

    })

  })

})
