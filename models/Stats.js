import mongoose from "mongoose"

const schema = new mongoose.Schema({
    user: {
        type: Number,
        default: 0
    },
    subscripiton: {
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

export const Stats = mongoose.model("Stats", schema)