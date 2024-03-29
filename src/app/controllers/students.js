const { date, grade } = require('../../lib/util')
const Student = require('../models/Student')


module.exports = {

  index(req, res) {

    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 2
    let offset = limit * (page - 1)

    let params = {
      filter,
      page,
      limit,
      offset,
      callback(students) {
        const pagination = {
          total: Math.ceil(students[0].total / limit),
          page
        }

        return res.render("students/index", { filter, students, pagination })
      }
    }

    Student.pagination(params)
  },
  create(req, res) {

    Student.teacherOptions(function (options) {
      return res.render("students/create", { teacherOptions: options })
    })



  },
  post(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }

    Student.create(req.body, function (student) {
      return res.redirect(`/students/${student.id}`)
    })


  },
  show(req, res) {



    Student.find(req.params.id, function (student) {
      if (!student) res.send('Student not found')

      student.birth_date = date(student.birth_date).birthDay
      student.year = grade(student.year)

      return res.render(`students/show`, { student })
    })

  },
  edit(req, res) {

    Student.find(req.params.id, function (student) {
      if (!student) res.send('Student not found')

      student.birth_date = date(student.birth_date).iso

      Student.teacherOptions(function (options) {
        return res.render("students/edit", { student, teacherOptions: options })
      })

    })

  },
  put(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }

    Student.update(req.body, function () {
      return res.redirect(`/students/${req.body.id}`)
    })

  },
  delete(req, res) {

    Student.delete(req.body.id, function () {
      return res.redirect('students')
    })

  },
}