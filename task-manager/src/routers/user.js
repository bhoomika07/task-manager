const express = require('express')
const User = require('../models/user')
const auth =require('../middleware/auth')
const router = new express.Router() 

//create users 
router.post('/users', async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token =await user.generateAuthToken()
        res.status(201).send({user, token})

    }
    catch(e){
        res.status(400).send(e)
    }
})
//get users
router.get('/users/me',auth, async(req,res) =>{
    res.send(req.user)
})

//logging in users
router.post('/users/login', async (req, res) => {
    try{
        const user= await User.findByCredentials(req.body.email, req.body.password)
        const token =await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

//logging out users 
router.post('/users/logout', auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//logout all
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

//get user by id
router.get('/users/:id', async (req, res) =>{
    const _id=req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

//updating users
router.patch('/users/:id', async (req, res) => {
    const updates =Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation =updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation)
    return res.status(400).send({error: 'Invalid Updates!'})
    try{
        const user = await User.findByIdAndUpdate(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        
        if(!user)
        {
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

//deleting user
router.delete('/users/:id', async (req, res) =>{
    try{
        const user= await User.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})
module.exports= router