var activeProject = require('../../models/activeProject.js')
var User = require('../../models/user.js');

module.exports = function(router){

    router.put('/addNewProject',function(request,response){
        
        var newProject = new activeProject();

        newProject.userId = request.body.userId;
        newProject.project_id = request.body.project_id;
        newProject.description = request.body.description;
        newProject.skillsPresent = request.body.skillsPresent;
        newProject.skillsRequired = request.body.skillsRequired;

        console.log(newProject);

        activeProject.findOne({'project_id' : request.body.project_id},function(error,currentProject){
            if(error)
            throw error;

            if(currentProject){
                response.send(false);
            }
            else{
                newProject.save(function(err){
                    if(err)
                    throw err;

                    console.log("We are here!");

                    User.findOne({_id : request.body.userId},function(errorMessage, currentUser){
                        currentUser.projects.push(request.body.project_id);
                        console.log(currentUser);
                        currentUser.save(function(){
                            response.send(true);
                        })
                        
                    })
                    
                });
            }
        });

    });

}