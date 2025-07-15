const mongoose = require( 'mongoose' );
const timeSchema = require( './Time' );

/**
 * In MongoDB, the documents can store related information together
 * For example, we can store the sessions (topics) for a particular workshop
 *      1. in the workshop document as an array, say "sessions" (preferred way)
 *      2. in a separate collection (say, Sessions), and store the array of related session ids
 */
const workshopsSchema = new mongoose.Schema(
  {
    // name: String, // if we do not want validation except type validation, we can do this

    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: [
            "frontend",
            "backend",
            "database",
            "devops",
            "language",
            "mobile"
        ]
    },
    // id: Number,
    description: {
        type: String,
        required: true,
        maxLength: 1024
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    startTime: {
        type: timeSchema,
        required: true
    },
    endTime: {
        type: timeSchema,
        required: true
    },
    location: {
        address: String,
        city: String,
        state: String
    },
    modes: {
        inPerson: Boolean,
        online: Boolean
    },
    imageUrl: String,
    speakers: {
        type: [ String ],
        required: true
    },

    // 1. store sessions as an array - preferred way
    // sessions: {
    //     type: [
    //         sessionSchema
    //     ]
    // }

    // 2. store session ids
    // sessions: {
    //     type: [ mongoose.Schema.Types.ObjectId ]
    // },
  }
);

// The name of the collection is the plural form of the name of the Model
mongoose.model( 'Workshop', workshopsSchema );