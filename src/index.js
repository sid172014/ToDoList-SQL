import express from 'express' // Here we are using import instead of 'require' as in the 'package.json' file we have brought in a new property i.e 'types ; module'

import { rows, row, createNote, completeTask, deleteTask } from './databases/db.js';
const port = process.env.PORT;

const app = express();
app.use(express.json());

// Setting up the router that we want 

// Gets all the tasks that we have in the sql server
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await rows();
        res.send(tasks);
    }catch (e) {
        res.status(500).send(e);
    }
});

// Gets the task which has the id that we pass in through the body of the 'http' url which will be available in 'req.params.id'
app.get('/task/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const task = await row(id);
        res.send(task);
    }catch(e){
        res.status(404).send(e);
    }
})

// This will create a new task that is to be added to the mysql database
app.post('/tasks', async (req,res) => {
    try{
        const task = req.body.task;
        const create = await createNote(task);
        res.status(201).send(create);
    }catch(e){
        res.status(400).send(e);
    }
})

// This will update the task's completion based on the id of the task
app.patch('/tasks/:id', async (req,res) =>{ 
    try{
        const id = req.params.id;
        const checkExistence = await row(id);
        if(checkExistence.length == 0){
            throw "The given id does not exists in our SQL table"
        }
        const completionStatus = req.body.completed;
        const result = await completeTask(id,completionStatus); 
        res.send(result);
    }catch(e){
        res.status(404).send(e);
    }
});

// This will delete the task privided by the id
app.delete('/tasks/:id', async(req, res)=>{
    try{
        const id = req.params.id;
        const checkExistence = await row(id);
        if(checkExistence.length == 0){
            throw "The given id does not exists in our SQL table"
        }
        const result = await deleteTask(id);
        res.send("Success!");
    }catch(e){
        res.status(404).send(e);
    }
})

//Setting up the listen call 
app.listen(port, () => {
    console.log("Server started on port ", port);
})