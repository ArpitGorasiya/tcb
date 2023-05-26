import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Course Title is Required"],
        minLength: [4, 'Course Title length is minimum 4 characters'],
        maxLength: [40, 'Course Title length is maximum 40 characters'],
    },
    description: {
        type: String,
        required: [true, "Course Description is Required"],
        minLength: [25, 'Course description length is minimum 25 characters'],
    },
    lectures: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            video: {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        }
    ],
    poster: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    views: {
        type: Number,
        default: 0
    },
    numOfVideos: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: [true, 'Course Creator Name is Required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Course = mongoose.model('Course', schema)