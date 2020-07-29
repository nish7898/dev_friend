var User = require('../../models/user.js');
var ActiveProject = require('../../models/activeProject.js');

module.exports = function(router){

    router.put('/searchUser',function(request,response){

        var userName = request.body.userName;
        var skillNames = request.body.skillNames;
        var userId = request.body.userId;

        User.find({},function(error,usersList){
            if(error)
            throw error;

            var results = [];

            for(var index=0; index < usersList.length; index=index+1){
                var currentUser = usersList[index];

                if(currentUser._id.toString() === userId){
                    console.log("Same user!");
                    continue;
                }

                var addUser = {
                    'nameAdded' : Boolean,
                    'skillsAdded' : {
                        type : Number,
                        default : 0
                    },
                    'user' : Object
                };

                var currentUserName;
                if(currentUser.google.name){
                    currentUserName = currentUser.google.name;
                }
                else{
                    currentUserName = currentUser.facebook.name;
                }

                if(userName){
                    var indexName = -1;
                    indexName = currentUserName.toLowerCase().indexOf(userName.toLowerCase());
                    if(index > -1){
                        addUser.nameAdded = true;
                        addUser.user = currentUser;
                    }

                    var numberSkills = 0;
                    if(skillNames){
                        for(var i=0;i<skillNames.length;i++){
                            for(var j=0;j<currentUser.skills.length;j++){
                                if(skillNames[i].toLowerCase() === currentUser.skills[j].skillName.toLowerCase()){
                                    numberSkills++;
                                    break;
                                }
                            }
                        }

                        if(numberSkills > 0){
                            addUser.skillsAdded = numberSkills;
                            addUser.user = currentUser;
                        }
                    }

                    if(addUser.nameAdded === true || addUser.skillsAdded > 0){
                        results.push(addUser);
                    }
                }
            }

            response.send(results);
        })

    })

    router.put('/searchProject',function(request,response){

        var projectName = request.body.projectName;
        var skillNames = request.body.skillNames;
        var userId = request.body.userId;

        ActiveProject.find({},function(error,projectList){
            if(error)
            throw error;

            var results = [];

            for(var index=0; index < projectList.length; index=index+1){
                var currentProject = projectList[index];

                if(currentProject.userId.toString() === userId){
                    console.log("Same user!");
                    continue;
                }

                var addProject = {
                    'nameAdded' :false,
                    'skillsRequiredAdded' : 0,
                    'skillsPresentAdded' : 0,
                    'user' : Object
                };

                var currentProjectName =  currentProject.project_id;

                if(projectName){
                    var indexName = -1;
                    indexName = currentProjectName.toLowerCase().indexOf(projectName.toLowerCase());
                    console.log(currentProjectName,projectName);
                    if(indexName > -1){
                        addProject.nameAdded = true;
                        addProject.user = currentProject;
                    }
                }

                    var numberSkillsRequired = 0;
                    if(skillNames){
                        for(var i=0;i<skillNames.length;i++){
                            for(var j=0;j<currentProject.skillsRequired.length;j++){
                                if(skillNames[i].toLowerCase() === currentProject.skillsRequired[j].toLowerCase()){
                                    numberSkillsRequired++;
                                    break;
                                }
                            }
                        }

                        if(numberSkillsRequired > 0){
                            addProject.skillsRequiredAdded = numberSkillsRequired;
                            addProject.user = currentProject;
                        }
                    }

                    var numberSkillsPresent = 0;
                    if(skillNames){
                        for(var i=0;i<skillNames.length;i++){
                            for(var j=0;j<currentProject.skillsPresent.length;j++){
                                if(skillNames[i].toLowerCase() === currentProject.skillsPresent[j].toLowerCase()){
                                    numberSkillsPresent++;
                                    break;
                                }
                            }
                        }

                        if(numberSkillsPresent > 0){
                            addProject.skillsPresentAdded = numberSkillsPresent;
                            addProject.user = currentProject;
                        }
                    }
                    console.log(addProject);
                    if(addProject.nameAdded === true || addProject.skillsPresentAdded > 0 || addProject.skillsRequiredAdded >0){
                        results.push(addProject);
                    }
                
            }
            console.log(results);
            response.send(results);
        });

    });

    router.put('/findProject',function(request,response){
        var project_id = request.body.project_id;
        ActiveProject.findOne({'project_id' : project_id},function(error, currentProject){
            if(error)
            throw error;

            response.send(currentProject);
        })
    });

    router.put('/findProfile',function(request,response){
        var profile_id = request.body.profile_id;
        User.findOne({_id : profile_id},function(error, currentUser){
            if(error)
            throw error;

            response.send(currentUser);
        })
    });

}