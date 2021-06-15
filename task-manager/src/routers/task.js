const express = require('express')
const Task = require('../models/task')

const router = new express.Router() 

//creation of tasks
router.post('/tasks',(req,res) =>{
    const task = new Task(req.body)
    task.save().then(() =>{
        res.status(201).send(task)
    }).catch((e) =>{
        res.status(400).send(e)
    })
})

//get tasks
router.get('/tasks', async(req, res) =>{
    try{
        const tasks= await Task.find({})
        res.send(tasks)
    }
    catch(e){
        res.status(500).send()
    }
})
//get task by id
router.get('/tasks/:id', async (req, res) =>{
    const _id=req.params.id
    try{
        const task= await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

//updating tasks
router.patch('/tasks/:id', async(req, res) =>{
    const updates=Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation =updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation)
    return res.status(400).send({error: 'Invalid Updates!'})

    try{
        const task = await Task.findByIdAndUpdate(req.params.id)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        if(!task)
        {
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//deleting task
router.delete('/tasks/:id', async (req, res) =>{
    try{
        const task= await Task.findByIdAndDelete(req.params.id)
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports=router