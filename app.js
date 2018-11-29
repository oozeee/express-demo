const express = require ('express'); // load express module using require
const app = express(); // call the express function that returns object of type express. Convention is to call this object 'app'
app.use(express.json());

Joi = require('joi'); // returns a class so start the class name with upper case 'J'

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}    
]
//app.post();
//app.put();
//app.delete();

// npm i nodemon
// npm i -g nodemon

//all the properties available here http://expressjs.com/en/4x/api.html#req
app.get('/', (req, res)=>{
    res.send('Hello world...');
});

app.get('/api/courses', (req, res)=>{
    res.send(courses);
});

// use let and const instead of var

app.get('/api/courses/:id', (req, res)=>{
    const course = courses.find((element) => element.id === parseInt(req.params.id));
    if (!course)
        res.status(404).send(`The course with id ${req.params.id} was not found`);
    
    res.send(course);
});

app.post('/api/courses', (req,res) => {

    const {error} = validateCourse(req.body)
    if (error){
        res.status(400).send(JSON.stringify(error.name + ' - Error message: ' + error.details[0].message));
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    
    // Look up the course, if not existing return 404
    const course = courses.find((element) => element.id === parseInt(req.params.id));
    if (!course)
        res.status(404).send(`The course with id ${req.params.id} was not found`);
    
    
    // Validate. If, invalid return 400 - Bad request
    const schema = {
        name: Joi.string().min(3).required()
    }
    
    
    const result = validateCourse(req.body);
    // object destructuring
    const { error } = validateCourse(req.body); // result.error - Use error instead of result.error
    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // Return the updated course
    course.name = req.body.name;
    res.send(course);
})

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    
    return Joi.validate(course, schema);
 
}

// route parameters for essential/required values
// query parameters for optional values - additional values

app.get('/api/list/:year/:month', (req, res)=>{
    //res.send(req.params);
    res.send(req.query);
    //res.send(JSON.stringify([1, 2, 3]));
});

// environment variables (PORT) are part of the env in which application runs 
//Set env varioable - windows: set PORT=5000 mac: export PORT=5000

const port = process.env.port || 3000
app.listen(port, ()=> console.log(`Listening on port ${port}...`))

