const express = require('express');
const router = express.Router();

const validateCourse = require('../middleware/validateCourse');

let courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
]

router.use((req,res,next)=>{
    console.log('loggin...')
    next();
})

router.use((req,res,next)=>{
    console.log('authenticating...')
    next();
})


router.get('/', (req, res) => {
    res.send('Hello world!!!')
})

router.get('/', (req, res) => {
    res.send(courses);
})

router.get('/:id', (req, res) => {
    let course = courses.find((c) => c.id === parseInt(req.params.id))
    if (!course) res.status(404).send('The course with the give ID was not found ...')
    res.send(course);
})

router.post('', (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})

router.put('/:id', (req, res) => {
    const course = courses.find((f) => f.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the give id is not found...')

    const { error } = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return
    }

    course.name = req.body.name;
    res.status(200).send(courses);

})

router.delete('/:id', (req, res) => {
    let course = courses.find((f) => f.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Couldnt find course with the given id..');


    courses = courses.filter((f) => f.id !== parseInt(req.params.id));
    res.status(200).send(courses);

})

module.exports = router;
