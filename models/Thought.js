const { Schema, model } = require('mongoose');

// A function to format date
function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
  
    return month + '/' + day + '/' + year;
}

// Schema to create reaction embedded document
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            unique: true
        },
        
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },

        username: {
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
            get: formatDate // Use the formatDate function as a getter 
        }
       
    }
);

// Schema to create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlenght: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
        getters: true,
        },
    }
    );

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;