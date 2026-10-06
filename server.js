import express from 'express'
import students from './metadata.js'

const app = express()
const port = 3000

app.use(express.json())

app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.url)
    next()
})

app.get('/students', (req, res) => {
    res.json(students)
})

app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id === Number(req.params.id))

    if (!student) {
        return res.status(404).json({ message: 'Student Not Found' })
    }

    res.json(student)
})

app.post('/students', (req, res) => {
    const { name, course } = req.body

    if (!name || !course) {
        return res.status(400).json({ message: 'Name and Course are required' })
    }

    const lastStudent = students[students.length - 1]
    const newStudent = {
        id: lastStudent ? lastStudent.id + 1 : 1,
        name,
        course
    }

    students.push(newStudent)
    res.status(201).json({ message: 'New Student Created', student: newStudent })
})

app.put('/students/:id', (req, res) => {
    const { name, course } = req.body
    const id = Number(req.params.id)
    const index = students.findIndex(s => s.id === id)

    if (index === -1) {
        return res.status(404).json({ message: 'Student Not Found' })
    }

    if (!name || !course) {
        return res.status(400).json({ message: 'Name and Course are required' })
    }

    students[index] = { id, name, course }
    res.json({ message: 'Student Updated', student: students[index] })
})

app.delete('/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id === Number(req.params.id))

    if (index === -1) {
        return res.status(404).json({ message: 'Student Not Found' })
    }

    const [deleted] = students.splice(index, 1)
    res.json({ message: 'Student Deleted', student: deleted })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})