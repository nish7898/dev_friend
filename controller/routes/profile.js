var User = require('../../models/user.js')
var activeProject = require('../../models/activeProject.js');

module.exports = function(router){

    router.put('/updateUserData',function(request,response){
        var linkedIn = request.body.linkedIn;
        var userName = request.body.userName;
        var github = request.body.github;
        var userId = request.body.userId;
        console.log(request.user);
        User.findOne({_id : userId},function(error,currentUser){
            if(error)
            throw error;

            console.log(currentUser)

            currentUser.linkedIn = linkedIn;
            currentUser.github = github;

            if(currentUser.google.name){
                currentUser.google.name = userName;
            }
            else{
                currentUser.facebook.name = userName;
            }

            currentUser.save(function(err){
                response.send(true);
            });

        });
        
    });

    router.put('/updateUserDescription',function(request,response){
        var userDescription = request.body.description;
        var userId = request.body.userId;

        User.findOneAndUpdate({_id : userId},{$set : {description : userDescription}},function(error){
            if(error)
            throw error;

            response.send(true);
        });
    });

    router.put('/addUserSkill',function(request,response){

        var userId = request.body.userId;
        var skillName = request.body.skill;

        User.findOne({_id : userId},function(error,currentUser){

            var skillFound = false;

            console.log(currentUser);

            for(var index=0; index < currentUser.skills.length; index = index + 1){
                if(currentUser.skills[index].skillName === skillName){
                    skillFound = true;
                    break;
                }
            }

            if(skillFound === true){
                response.send(false);
            }
            else{
                currentUser.skills.push({'skillName' : skillName});
                currentUser.save(function(err){
                    response.send(true);
                });
            }
        });
    });

    router.delete('/removeUserSkill',function(request,response){
        var userId = request.body.userId;
        var skillName = request.body.skill;

        User.findOne({_id : userId},function(error,currentUser){

            var indexSkill = -1;
            for(var index=0; index < currentUser.skills.length; index = index + 1){
                if(currentUser.skills[index].skillName === skillName){
                    indexSkill = index;
                    break;
                }
            }

            if(indexSkill>-1)
            currentUser.skills.splice(indexSkill,1);

            currentUser.save(function(err){
                response.send(true);
            })
        });
    });

    router.put('/getMyProject',function(request,response){
        activeProject.findOne({'project_id' : request.body.project_id},function(error,currentProject){
            if(error)
            throw error;

            response.send(currentProject);
        })
    })
}