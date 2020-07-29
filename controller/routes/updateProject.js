var ActiveProject = require('../../models/activeProject.js');
var User = require('../../models/user.js');

module.exports = function(router){

    router.put('/updateProjectName',function(request,response){
        var newNameProject = request.body.projectName;
        var projectId = request.body.projectId;
        activeProject.update({'projectId' : projectId},{$set : {'projectName' : newNameProject}},function(error){
            if(error)
            throw error;

            response.send(true);
        });
    });

    router.put('/updateProjectDescription',function(request,response){
        var newProjectDescription = request.body.description;
        var projectId = request.body.projectId;
        activeProject.update({'projectId' : projectId},{$set : {'description' : newProjectDescription}},function(error){
            if(error)
            throw error;

            response.send(true);
        });
    });

    router.put('/addSkills',function(request,response){
        var newSkill = request.body.newSkill;
        var projectId = request.body.projectId;

        var skillAdded = {
            'projectId' : projectId,
            'added' : false
        };

        ActiveProject.findOne({'projectId' : projectId, skillsPresent : {$elemMatch : {'nameSkill' : newSkill}}},function(error,availableProject){
            if(error)
            throw error;

            if(availableProject){
                skillAdded.added = false;
                response.send(skillAdded);
            }

            else{
                ActiveProject.findOneAndUpdate({'projectId':projectId},{$push : {skillsPresent : { nameSkill : newSkill}}},function(err){
                    if(err)
                    throw err;
                    
                    skillAdded.added = true;
                    response.send(skillAdded);
                });
            }
        });
    });

    router.delete('/removePresentSkillMyProject',function(request,response){
        var skillName = request.body.skillName;
        var projectId = request.body.project_id;


        ActiveProject.findOne({'project_id' : projectId},function(error,currentProject){
            var indexSkill = -1;
            for(var index=0; index < currentProject.skillsPresent.length; index = index + 1){
                if(currentProject.skillsPresent[index] === skillName){
                    indexSkill = index;
                    break;
                }
            }

            if(indexSkill>-1)
            currentProject.skillsPresent.splice(indexSkill,1);

            currentProject.save(function(err){
                response.send(true);
            })
        });
    });

    router.delete('/removeRequiredSkillMyProject',function(request,response){
        var skillName = request.body.skillName;
        var projectId = request.body.project_id;

        console.log(projectId,skillName);

        ActiveProject.findOne({'project_id' : projectId},function(error,currentProject){
            console.log(currentProject);
            var indexSkill = -1;
            for(var index=0; index < currentProject.skillsRequired.length; index = index + 1){
                if(currentProject.skillsRequired[index] === skillName){
                    indexSkill = index;
                    break;
                }
            }

            if(indexSkill>-1)
            currentProject.skillsRequired.splice(indexSkill,1);

            currentProject.save(function(err){
                response.send(true);
            })
        });
    });

    router.put('/addRequiredSkillMyProject',function(request,response){
        var skillName = request.body.skillName;
        var projectId = request.body.project_id;

        ActiveProject.findOne({'project_id' : projectId},function(error,currentProject){
            if(error)
            throw error;

            currentProject.skillsRequired.push(skillName);

            currentProject.save(function(err){
                response.send();
            })
        })
    });

    router.put('/addPresentSkillMyProject',function(request,response){
        var skillName = request.body.skillName;
        var projectId = request.body.project_id;

        ActiveProject.findOne({'project_id' : projectId},function(error,currentProject){
            if(error)
            throw error;

            currentProject.skillsPresent.push(skillName);

            currentProject.save(function(err){
                response.send();
            })
        })
    });

    router.put('/getProjectDetails',function(request,response){
        var projectId = request.body.projectId;

        ActiveProject.findOne({'project_id' : projectId},function(error,currentProject){
            if(error)
            throw error;

            response.send(currentProject);
        })
    })
}