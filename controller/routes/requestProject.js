var ActiveProject = require('../../models/activeProject.js');

module.exports = function(router){

    router.put('/addRequestProject',function(request,response){
        var userId = request.body.userId;
        var skillNames = request.body.skillNames;
        var project_id = request.body.project_id;
        var userName = request.body.userName;

        ActiveProject.findOne({'project_id' : project_id},function(error,currentProject){
            if(error)
            throw error;

            currentProject.userRequested.push({
                'user_id' : userId,
                'userSkills' : skillNames,
                'userName' : userName
            });

            currentProject.save(function(error){
                console.log("Added new request!");
                response.send(true);
            })
        })

    });

}