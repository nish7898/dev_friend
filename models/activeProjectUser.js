var mongoose = require('mongoose');

var projectModel = mongoose.Schema({
    project_id : {
        type : String,
        unique : true
    },

    project_owner : {
        type : String,
        unique : true
    },

    userRequest : [{
        user_id : {
            type : String
        },

        userSkills : [{
            skillName : {
                type : String
            }
        }]
    }],

    userAccepted : [{
        user_id : {
            type : String
        },

        userSkills : [{
            skillName : {
                type : String
            }
        }]
    }]
})