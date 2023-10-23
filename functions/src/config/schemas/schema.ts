import mongoose from "mongoose";
import moment from "moment"

const userSchema = new mongoose.Schema({
    username : {
      type: String,
      required: true,
      unique: true
    },
    email : {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'guest',
        enum: ['admin','guest']
    }
  },{
    versionKey: false
  });
  
export const userModel = mongoose.model('users', userSchema);

const todoSchema = new mongoose.Schema({
    todo: {
        type : String,
        required : true
    },
    status: {
        type: String,
        default: "in progress",
        enum: ["in progress", "done"]
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true
    },
    dueDate: {
        type: Date,
        default: () => moment().add(3, 'days').format('YYYY/MM/DD'),
        required: true
    },
    maker: {
        type : String,
    },
    isDeleted: {
        type: Boolean
    }
},{
    timestamps: {
        currentTime: () => new Date().setUTCHours(0, 0, 0, 0)
    },
    versionKey: false
})

export const todoModel = mongoose.model("todos", todoSchema);