var mongoose = require('mongoose');

var activeProject = mongoose.Schema({
    userId : {
        type : String,
    },

    project_id : {
        type : String,
    },
    

    description : {
        type : String
    },

    skillsRequired : [{
            type : String
    }],

    skillsPresent : [{
        type : String
    }],

    userRequested : [{
        user_id : {
            type : String
        },

        userName : {
            type : String
        },

        userSkills : [{
                type : String
        }]
    }],

    userAccepted : [{
        user_id : {
            type : String
        },

        userSkills : [{
                type : String

        }]
    }]
});

module.exports = mongoose.model('activeProject',activeProject)