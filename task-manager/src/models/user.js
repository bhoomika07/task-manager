const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
    type: String,
    required:true,
    trim:true
},
email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    validate(val){
        if(!validator.isEmail(val)){
            throw new Error('Please enter a valid email address.')
        }
    }
},
password:{
    type:String,
    required:true,
    trim:true,
    minlength:7,
    validate(val){
        if(val.toLowerCase().includes('password')){
            throw new Error("Your password cannot contain 'password'.")
        }
    }
},
age:{
    type: Number,
    default:0, 
    validate(val){
        if(val<0){
            throw new Error('Please enter a valid age.');
        }

    }
},
tokens: [{
    token: {
        type:String,
        required:true
    }
}]
})

userSchema.methods.generateAuthToken = async function () {
    const user=this
    const token =jwt.sign({ _id: user._id.toString() }, 'taskmanager')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token 
}

//logging in users
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to log in.')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('Unable to log in.')
    }
    return user
}
//hash plain text password
userSchema.pre('save', async function(next) {
    const user= this
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password, 12)
    }
    next()
})
const User = mongoose.model('User',userSchema)

module.exports=User