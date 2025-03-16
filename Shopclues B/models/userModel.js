const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema({
    userId:{
        type:Number,
        unique:true,
    },
    name :{
        type: String,
        required : true,
        trim :true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase: true,
        trim : true
    },
    mobile : {
        type : String, 
        required: true,
        unique: true,
        match:[/^\d{10}$/,"mobile number must be 10 digits"]
    },
    password:{
        type : String,
        required : true,
    },
},
{
    timestamps:true
}
);

userSchema.pre('save', async function (next) {
    if(!this.isNew) return next();

    try {
        const lastUser = await this.constructor.findOne().sort({userId:-1});
        this.userId = lastUser ? lastUser.userId  +1 :0;
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
        
    } catch (error) {

        next(error);
    }
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}


const User = mongoose.model('User',userSchema);
module.exports = User;