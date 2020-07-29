
$(function(){

    var projectSearch = [], userSearch =[], projectRequests = [];

    var currentUser = JSON.parse($('#variableJSON').text());
    $('#variableJSON').remove();
    console.log(currentUser);

    if(currentUser.github.length === 0 || currentUser.linkedIn.length === 0)
    {
        $("#user-info").hide();
        $("#user-info-update").show();

        if(currentUser.github.length === 0){
            $("#github-update").attr("placeholder","Github profile link");
        }

        if(currentUser.linkedIn.length === 0){
            $("#linkedin-update").attr("placeholder","LinkedIn profile link");
        }

        if(currentUser.google){
            $("#user-name-update").attr("value",currentUser.google.name);
        }
        else{
            $("#user-name-update").attr("value",currentUser.facebook.name);
        }
    }

    else{
        $("#github-link").text(currentUser.github);
        $("#linkedin-link").text(currentUser.linkedIn);

        if(currentUser.google){
            $("#user-name").text(currentUser.google.name);
        }
        else{
            $("#user-name").text(currentUser.facebook.name);
        }
    }

    if(!currentUser.description){
        $("#update-about-start").hide();
        $("#about-div").hide();
        $("#about-div-update").show();

        $("#update-about-text").attr("placeholder","Enter about yourself");
    }
    else{
        $("#about-description").text(currentUser.description);
    }

    for(var index=0; index < currentUser.skills.length; index = index + 1){
        $("#skill-set").append("<button class='btn btn-large btn-secondary remove-skill'>"+currentUser.skills[index].skillName+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>");
    }

    for(var index=0; index < currentUser.projects.length; index = index + 1){
        $("#my-projects").append("<p class='my-project-names' style='cursor: pointer;'>"+currentUser.projects[index]+"</p>");
    }

    $("body").on("click",".my-project-names",function(){
        var project_id = $(this).text().trim();

        $.ajax({
            url : '/getMyProject',
            method : 'put',
            data : {
                'project_id' : project_id
            },
            success : function(response){

                console.log()
                $('#view-my-project').show();
                $('body, html').animate({
                    scrollTop: $("#view-my-project").offset().top
                }, 800);


                $("#my-project-name").text(response.project_id);
                $("#my-project-description").text(response.description);

                $("#skill-set-my-project-present").find(".remove-skill-my-project-present").remove();
                for(var index=0;index < response.skillsPresent.length; index = index + 1){
                    var skillName = response.skillsPresent[index];
                    $("#skill-set-my-project-present").append("<button class='btn btn-large btn-secondary remove-skill-my-project-present'>"+skillName+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>");
                }

                $("#skill-set-my-project-required").find(".remove-skill-my-project-required").remove();
                for(var index=0;index < response.skillsRequired.length; index = index + 1){
                    var skillName = response.skillsRequired[index];
                    $("#skill-set-my-project-required").append("<button class='btn btn-large btn-secondary remove-skill-my-project-required'>"+skillName+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>");
                }
                console.log(response);
                if(response.userRequested){
                    $("#request-my-project").find("p").remove();
                    $("#request-my-project").find("button").remove();
                    $("#request-my-project").find("br").remove();
                    projectRequests = [];
                    response.userRequested.forEach(function(element){
                        var userNameRequest = element.userName;
                        $("#request-my-project").append("<p class='view-request-user' id='user-name-request-"+projectRequests.length+"' style='cursor: pointer;'>"+userNameRequest+"</p>")
                        element.userSkills.forEach(skill =>{
                            $("#request-my-project").append("<button class='btn btn-md btn-secondary'>"+skill+"</button>");
                        });
                        $("#request-my-project").append("<br><br><button class='btn btn-lg btn-secondary accept-user-request' id='accept-user-request"+projectRequests.length+"'>"+"Accept Request"+"</button>");
                        projectRequests.push(element);
                    });

                    console.log(projectRequests);
                }

            }
        })
    });

    $("body").on("click",".remove-skill-my-project-present",function(){
        var skillName = $(this).text().trim();
        var project_id = $("#my-project-name").text().trim();
        $(this).remove();
        $.ajax({
            url : '/removePresentSkillMyProject',
            method : 'delete',
            data : {
                'skillName' : skillName,
                'project_id' : project_id
            },
            success : function(response){

            }
        })
    });

    $("body").on("click",".remove-skill-my-project-required",function(){
        var skillName = $(this).text().trim();
        var project_id = $("#my-project-name").text().trim();
        console.log(project_id,skillName);
        $(this).remove();
        $.ajax({
            url : '/removeRequiredSkillMyProject',
            method : 'delete',
            data : {
                'skillName' : skillName,
                'project_id' : project_id
            },
            success : function(response){

            }
        })
    });

    $("body").on("click","#update-start",function(){
        $("#user-info").hide();

        var userName = $("#user-name").text().trim();
        var githubLink = $("#github-link").text().trim();
        var linkedin = $("#linkedin-link").text().trim();

        console.log(userName,githubLink,linkedin)

        $("#user-name-update").attr("value",userName);
        $("#github-update").attr("value",githubLink);
        $("#linkedin-update").attr("value",linkedin);

        $("#user-info-update").show();
    });

    $("body").on("click","#update-done",function(){
        $("#user-info-update").hide();

        var userName = $("#user-name-update").val();
        var githubLink = $("#github-update").val();
        var linkedinLink = $("#linkedin-update").val();

        console.log(userName,githubLink,linkedinLink)

        $.ajax({
            url : '/updateUserData',
            method : 'put',
            data : {
                'linkedIn' : linkedinLink,
                'github' : githubLink,
                'userName' : userName,
                'userId' : currentUser._id
            },
            success : function(response){
                if(response===true){
                    $("#user-name").text(userName);
                    $("#github-link").text(githubLink);
                    $("#linkedin-link").text(linkedinLink);

                    $("#user-info").show();
                }
            }
        })
    });

    $("body").on("click","#update-about-start",function(){
        console.log("Clicked!");
        $("#update-about-start").hide();
        $("#about-div").hide();
        $("#about-div-update").show();

        var description = $("#about-description").text();
        console.log(description);
        $("#update-about-text").val(description);
    });

    $("body").on("click","#update-description-done",function(){
        var userDescription = $("#update-about-text").val();

        $.ajax({
            url : '/updateUserDescription',
            method : 'put',
            data : {
                'description' : userDescription,
                'userId' : currentUser._id
            },
            success : function(response){
                if(response===true){
                    $("#update-about-start").show();
                    $("#about-div").show();
                    $("#about-div-update").hide();
                    $("#about-description").text(userDescription);
                }
            }
        })
    });

    $("body").on("click","#add-new-skills",function(){
        
        $("#add-new-skills").hide();
        $("#update-skills").show();

    });

    $("body").on("click","#update-skill-button",function(){
        
        var skillName = $("#update-skill-text").val();
        $.ajax({
            url : '/addUserSkill',
            method : 'put',
            data : {
                'skill' : skillName,
                'userId' : currentUser._id
            },
            success : function(response){
                if(response===true){
                    $("#update-skill-text").val("");
                    $("#skill-set").append("<button class='btn btn-large btn-secondary remove-skill'>"+skillName+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>");
                }
                else{
                    alert("Skills already exists");
                }
            }
        });
        

    });

    $("body").on("click","#save-changes-button",function(){
        
        $("#add-new-skills").show();
        $("#update-skills").hide();

    });

    $("body").on("click",".remove-skill",function(){
        
        var skillName = $(this).text().trim();
        console.log(skillName);

        $.ajax({
            url : '/removeUserSkill',
            method : 'delete',
            data : {
                'userId' : currentUser._id,
                'skill' : skillName
            },
            success : function(response){
                
            }
        })

        $(this).remove();

    });

    $("body").on("click","#add-new-skills-project-present",function(){
        $("#add-new-skills-project-present").hide();
        $("#update-skills-project-present").show();
    });

    $("body").on("click","#update-skill-project-present-button",function(){
        console.log("Clicked!");
        var skillName = $("#update-skill-project-present-text").val();
        $("#update-skill-project-present-text").val("");
        var response = checkExistingSkillProject(skillName.toLowerCase());
        if(response.found === false)
        $("#skill-set-project-present").append("<button class='btn btn-large btn-secondary remove-skill-project-present'>"+skillName+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>");
        else
        alert(response.message);
    });

    $("body").on("click","#save-changes-button-project-present",function(){
        $("#update-skills-project-present").hide();
        $("#add-new-skills-project-present").show();
    });

    $("body").on("click",".remove-skill-project-present",function(){
        $(this).remove();
    });

    
    $("body").on("click","#add-new-skills-project-required",function(){
        $("#add-new-skills-project-required").hide();
        $("#update-skills-project-required").show();
    });

    $("body").on("click","#update-skill-project-required-button",function(){
        console.log("Clicked!");
        var skillName = $("#update-skill-project-required-text").val();
        $("#update-skill-project-required-text").val("");
        var response = checkExistingSkillProject(skillName.toLowerCase());
        if(response.found === false)
        $("#skill-set-project-required").append("<button class='btn btn-large btn-secondary remove-skill-project-required'>"+skillName+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>");
        else
        alert(response.message);
    });

    $("body").on("click","#save-changes-button-project-required",function(){
        $("#update-skills-project-required").hide();
        $("#add-new-skills-project-required").show();
    });

    $("body").on("click",".remove-skill-project-required",function(){
        $(this).remove();
    });

    function checkExistingSkillProject(skillNameCheck){

        var skillNamePresent = [], skillNameRequired = [];

        $('.remove-skill-project-required').each(function(){
            skillNameRequired.push($(this).text().trim().toLowerCase());
        });

        $('.remove-skill-project-present').each(function(){
            skillNamePresent.push($(this).text().trim().toLowerCase());
        });

        var response = {
            found : false,
            message : ""
        };
        for(var index = 0; index < skillNamePresent.length; index=index+1){
            if(skillNamePresent[index] === skillNameCheck){
                response.found = true;
                response.message = "Skills already added in skill present section!";
                return response;
            }
        }
        for(var index = 0; index < skillNameRequired.length; index=index+1){
            if(skillNameRequired[index] === skillNameCheck){
                response.found = true;
                response.message = "Skills already added in skill required section!";
                return response;
            }
        }
        return response;
    }

    $("body").on("click","#add-new-project-button",function(){
        $("#new-project").show();
        $('body, html').animate({
            scrollTop: $("#new-project").offset().top
          }, 800);
    })

    $("body").on("click","#add-new-project",function(){
        
        var projectName = $("#new-project-name").val().trim();
        var projectDescription = $("#new-project-description").val().trim();

        console.log(projectName,projectDescription);

        if(projectName.length === 0){
            alert("Enter a name for the project!");
            return;
        }
        
        if(projectDescription.length === 0){
            alert("Enter a description for the project!");
            return;
        }

        var skillNamePresent = [], skillNameRequired = [];

        $('.remove-skill-project-required').each(function(){
            skillNameRequired.push($(this).text().trim().toLowerCase());
        });

        $('.remove-skill-project-present').each(function(){
            skillNamePresent.push($(this).text().trim().toLowerCase());
        });

        if(skillNameRequired.length === 0){
            alert("Enter atleast one required skill!");
            return;
        }

        console.log(projectName,projectDescription,skillNameRequired,skillNamePresent);
        
        $.ajax({
            url : '/addNewProject',
            method : 'put',
            data : {
                'project_id' : projectName,
                'description' : projectDescription,
                'skillsPresent' : skillNamePresent,
                'skillsRequired' : skillNameRequired,
                'userId' : currentUser._id
            },
            success : function(response){
                if(response === false){
                    alert("Project name already exists. Choose another name!");
                    return;
                }
                else{
                    $("#new-project").hide();
                    $('body, html').animate({
                        scrollTop: $("#profile-header").offset().top
                    }, 800);
                }
            }
        })
    });

    $("body").on("click","#add-new-skills-my-project-present",function(){
        $("#add-new-skills-my-project-present").hide();
        $("#update-skills-my-project-present").show();
    });

    $("body").on("click","#update-skill-my-project-present-button",function(){
        var skillName = $("#update-skill-my-project-present-text").val();
        var project_id = $("#my-project-name").text().trim();
        var response = checkExistingSkillMyProject(skillName.toLowerCase());
        $("#update-skill-my-project-present-text").val("")
        if(response.found === false){
            $.ajax({
                url : '/addPresentSkillMyProject',
                method : 'put',
                data : {
                    'skillName' : skillName,
                    'project_id' : project_id
                },
                success : function(response){
                    $("#skill-set-my-project-present").append("<button class='btn btn-large btn-secondary remove-skill-my-project-present'>"+skillName+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>");
                }
            })
        }
        
        else
        alert(response.message);
    });

    $("body").on("click","#save-changes-button-my-project-present",function(){
        $("#add-new-skills-my-project-present").show();
        $("#update-skills-my-project-present").hide();
    });


    
    $("body").on("click","#add-new-skills-my-project-required",function(){
        $("#add-new-skills-my-project-required").hide();
        $("#update-skills-my-project-required").show();
    });

    $("body").on("click","#update-skill-my-project-required-button",function(){
        var skillName = $("#update-skill-my-project-required-text").val();
        var response = checkExistingSkillMyProject(skillName.toLowerCase());
        var project_id = $("#my-project-name").text().trim();
        $("#update-skill-my-project-required-text").val("");
        if(response.found === false){
            $.ajax({
                url : '/addRequiredSkillMyProject',
                method : 'put',
                data : {
                    'skillName' : skillName,
                    'project_id' : project_id
                },
                success : function(response){
                    $("#skill-set-my-project-required").append("<button class='btn btn-large btn-secondary remove-skill-my-project-required'>"+skillName+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>");
                }
            })
        }
        else
        alert(response.message);
    });

    $("body").on("click","#save-changes-button-my-project-required",function(){
        $("#add-new-skills-my-project-required").show();
        $("#update-skills-my-project-required").hide();
    });


    function checkExistingSkillMyProject(skillNameCheck){

        var skillNamePresent = [], skillNameRequired = [];

        $('.remove-skill-my-project-required').each(function(){
            skillNameRequired.push($(this).text().trim().toLowerCase());
        });

        $('.remove-skill-my-project-present').each(function(){
            skillNamePresent.push($(this).text().trim().toLowerCase());
        });

        var response = {
            found : false,
            message : ""
        };
        for(var index = 0; index < skillNamePresent.length; index=index+1){
            if(skillNamePresent[index] === skillNameCheck){
                response.found = true;
                response.message = "Skills already added in skill present section!";
                return response;
            }
        }
        for(var index = 0; index < skillNameRequired.length; index=index+1){
            if(skillNameRequired[index] === skillNameCheck){
                response.found = true;
                response.message = "Skills already added in skill required section!";
                return response;
            }
        }
        return response;
    }

    $("body").on("click","#add-new-skills-search-person",function(){
        $("#add-new-skills-search-person").hide();
        $("#update-skills-search-person").show();
    });

    $("body").on("click","#save-changes-button-search-person",function(){
        $("#add-new-skills-search-person").show();
        $("#update-skills-search-person").hide();
    });

    $("body").on("click","#update-skill-search-person-button",function(){
        var skillName = $("#update-skill-search-person-text").val().trim();
        $("#update-skill-search-person-text").val("");
        var response = checkExistingSkillSearchUser(skillName);
        if(response.found === false)
        $("#skills-search-user").append("<button class='btn btn-large btn-secondary remove-skill-search-user'>"+skillName+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>")
        else
        alert(response.message);
    });

    $("body").on("click",".remove-skill-search-user",function(){
        $(this).remove();
    });

    function checkExistingSkillSearchUser(skillNameCheck){

        var skillNamePresent = [];

        $('.remove-skill-search-user').each(function(){
            skillNamePresent.push($(this).text().trim().toLowerCase());
        });

        var response = {
            found : false,
            message : ""
        };
        for(var index = 0; index < skillNamePresent.length; index=index+1){
            if(skillNamePresent[index] === skillNameCheck){
                response.found = true;
                response.message = "Skills already added!";
                return response;
            }
        }
        
        return response;
    }

    $("body").on("click","#search-user-button",function(){
        var nameSearch = $("#user-name-search-text").val().toLowerCase();
        if(nameSearch.length===0)
        nameSearch = "";

        var skillNames = [];
        $('.remove-skill-search-user').each(function(){
            skillNames.push($(this).text().trim().toLowerCase());
        });

        console.log(nameSearch,skillNames,currentUser._id);

        $.ajax({
            url : '/searchUser',
            method : 'put',
            data : {
                'userName' : nameSearch,
                'skillNames' : skillNames,
                'userId' : currentUser._id
            },
            success : function(response){
                console.log(response);
                if(response.length > 0){
                    $("#show-user-results").show();
                    $("#show-user-results").find(".view-user-names").remove();
                }
                userSearch = [];
                response.forEach(element => {
                    var searchedUser = element.user.google ? element.user.google.name : element.user.facebook.name;
                    $("#show-user-results").append("<p class='view-user-names' id='search-user-"+userSearch.length+"' style='cursor: pointer;'>"+(searchedUser)+"</p>")
                    userSearch.push(element.user);
                });
            }
        })
    });

    $("body").on("click",".view-user-names",function(){
        var idUser = $(this).attr("id");
        console.log(idUser);
        var positionUser = Number(idUser[idUser.length-1]);
        console.log(userSearch[positionUser]);
        var showUser = userSearch[positionUser];
        var showUserName = showUser.google ? showUser.google.name : showUser.facebook.name;
        
        $("#view-user").show();
        $("#user-name-view-user").text(showUserName);

        $("#github-link-view-user").text(showUser.github);

        $("#linkedin-link-view-user").text(showUser.linkedIn);

        $("#description-view-user").text(showUser.description);
        $("#skills-view-user").find("button").remove();
        showUser.skills.forEach(element =>{
            $("#skills-view-user").append("<button class='btn btn-lg btn-secondary' disabled>"+element.skillName+"</button>")
        });

        $("#projects-view-user").find("p").remove();
        showUser.projects.forEach(element =>{
            $("#projects-view-user").append("<p class='project-view-user' style='cursor: pointer;'>"+element+"</p>")
        })
    });

    $("body").on("click",".project-view-user",function(){
        var project_id = $(this).text().trim();
        $.ajax({
            url : '/findProject',
            method : 'put',
            data : {
                'project_id' : project_id
            },
            success : function(response){
                console.log(response);


                $("#view-search-project").show();
                $('body, html').animate({
                    scrollTop: $("#view-search-project").offset().top
                }, 800);
                $("#add-request-skill-set").find(".remove-skill-project-request").remove();
                $("#view-project-skill-required").find('.btn').remove();
                $("#view-project-skill-present").find('.btn').remove();
                $("#view-search-project-name").text(project_id);
                $("#view-search-project-description").text(response.description);
                for(var index = 0;index < response.skillsRequired.length;index++){
                    $("#view-project-skill-required").append("<button class='btn btn-large btn-secondary skill-required-view-project' disabled>"+response.skillsRequired[index]+"</button>")
                    for(var j=0;j<currentUser.skills.length;j++){
                        if(currentUser.skills[j].skillName.toLowerCase() === response.skillsRequired[index].toLowerCase()){
                            $("#add-request-skill-set").append("<button class='btn btn-large btn-secondary remove-skill-project-request'>"+currentUser.skills[j].skillName.toLowerCase()+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>")
                        }
                    }
                }
                for(var index = 0;index < response.skillsPresent.length;index++){
                    $("#view-project-skill-present").append("<button class='btn btn-large btn-secondary' disabled>"+response.skillsPresent[index]+"</button>")
                }

            }
        })
    });

    $("body").on("click","#add-new-skills-search-project",function(){
        $("#add-new-skills-search-project").hide();
        $("#update-skills-search-project").show();
    });

    $("body").on("click","#save-changes-button-search-project",function(){
        $("#add-new-skills-search-project").show();
        $("#update-skills-search-project").hide();
    });

    $("body").on("click","#update-skill-search-project-button",function(){
        var skillName = $("#update-skill-search-project-text").val().trim();
        $("#update-skill-search-project-text").val("");
        var response = checkExistingSkillSearchProject(skillName);
        if(response.found === false)
        $("#skills-search-project").append("<button class='btn btn-large btn-secondary remove-skill-search-project'>"+skillName+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>")
        else
        alert(response.message);
    });

    $("body").on("click",".remove-skill-search-project",function(){
        $(this).remove();
    });

    function checkExistingSkillSearchProject(skillNameCheck){

        var skillNamePresent = [];

        $('.remove-skill-search-project').each(function(){
            skillNamePresent.push($(this).text().trim().toLowerCase());
        });

        var response = {
            found : false,
            message : ""
        };
        for(var index = 0; index < skillNamePresent.length; index=index+1){
            if(skillNamePresent[index] === skillNameCheck){
                response.found = true;
                response.message = "Skills already added!";
                return response;
            }
        }
        
        return response;
    }

    $("body").on("click","#search-project-button",function(){
        var nameSearch = $("#project-name-search-text").val().toLowerCase();
        if(nameSearch.length===0)
        nameSearch = "";

        var skillNames = [];
        $('.remove-skill-search-project').each(function(){
            skillNames.push($(this).text().trim().toLowerCase());
        });

        console.log(nameSearch,skillNames,currentUser._id);

        $.ajax({
            url : '/searchProject',
            method : 'put',
            data : {
                'projectName' : nameSearch,
                'skillNames' : skillNames,
                'userId' : currentUser._id
            },
            success : function(response){
                projectSearch = [];
                console.log(response);
                $("#show-project-results").show();
                response.forEach(element => {
                    projectSearch.push(element);
                    $("#show-project-results").append("<p class='view-project-names' style='cursor: pointer;'>"+element.user.project_id+"</p>")
                });
            }
        })
    });

    $("body").on("click",".view-project-names",function(){
        var projectName = $(this).text();
        console.log(projectSearch);
        projectSearch.forEach(function(element){
            if(element.user.project_id === projectName){
                $("#view-search-project").show();
                $('body, html').animate({
                    scrollTop: $("#view-search-project").offset().top
                }, 800);
                $("#add-request-skill-set").find(".remove-skill-project-request").remove();
                $("#view-project-skill-required").find('.btn').remove();
                $("#view-project-skill-present").find('.btn').remove();
                $("#view-search-project-name").text(projectName);
                $("#view-search-project-description").text(element.user.description);
                for(var index = 0;index < element.user.skillsRequired.length;index++){
                    $("#view-project-skill-required").append("<button class='btn btn-large btn-secondary skill-required-view-project' disabled>"+element.user.skillsRequired[index]+"</button>")
                    for(var j=0;j<currentUser.skills.length;j++){
                        if(currentUser.skills[j].skillName.toLowerCase() === element.user.skillsRequired[index].toLowerCase()){
                            $("#add-request-skill-set").append("<button class='btn btn-large btn-secondary remove-skill-project-request'>"+currentUser.skills[j].skillName.toLowerCase()+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>")
                        }
                    }
                }
                for(var index = 0;index < element.user.skillsPresent.length;index++){
                    $("#view-project-skill-present").append("<button class='btn btn-large btn-secondary' disabled>"+element.user.skillsPresent[index]+"</button>")
                }
            }
        })
    });

    $("body").on("click",".remove-skill-project-request",function(){
        $(this).remove();
    });

    $("body").on("click","#update-skill-request-project-button",function(){
        var skillName = $("#update-skill-request-project-text").val();
        if(skillName.length === 0){
            alert("Enter skill name!");
            return;
        }
        var isPresent = false;

        $(".remove-skill-project-request").each(function(){
            console.log($(this).text());
            if($(this).text().trim().toLowerCase() === skillName){
                alert("Skill already added!");
                isPresent = true;
                return;
            }
        })

        if(isPresent === true)
        return;

        var skillsRequired = [];
        
        $('.skill-required-view-project').each(function(){
            skillsRequired.push($(this).text().trim().toLowerCase());
        });

        skillsRequired.forEach(function(element){
            if(element === skillName){
                isPresent = true;
            }
        });

        if(isPresent === false)
        alert("Skills not required!");
        else{
            $("#update-skill-request-project-text").val("");
            $("#add-request-skill-set").append("<button class='btn btn-large btn-secondary remove-skill-project-request'>"+skillName.toLowerCase()+" <span><i class='fa fa-times' aria-hidden='true'></i></span></button>")
        }
    });

    $("body").on("click","#add-request-button",function(){
        var skillRequest = [];
        $(".remove-skill-project-request").each(function(){
            skillRequest.push($(this).text().trim().toLowerCase());
        });

        if(skillRequest.length === 0){
            alert("Add atleast one required skill!");
            return;
        }

        var projectName = $("#view-search-project-name").text();
        var currentUserName = currentUser.google ? currentUser.google.name : currentUser.facebook.name;
        $.ajax({
            url : '/addRequestProject',
            method : 'put',
            data : {
                'userId' : currentUser._id,
                'skillNames' : skillRequest,
                'project_id' : projectName,
                'userName' : currentUserName
            },
            success : function(response){
                console.log(response);
                alert("Request Added!");
            }
        })
    });


    $("body").on("click",".view-request-user",function(){
        var idUser = $(this).attr("id");
        console.log(idUser);
        var positionUser = Number(idUser[idUser.length-1]);
        console.log("We are here!");
        var searchUserProfile = projectRequests[positionUser].user_id;
        
        $.ajax({
            url : '/findProfile',
            method : 'put',
            data : {
                'profile_id' : searchUserProfile
            },
            success : function(response){
                console.log("User found!",response);
                $("#view-user").show();
                var userName = response.google ? response.google.name : response.facebook.name;
                $("#user-name-view-user").text(userName);

                $("#github-link-view-user").text(response.github);

                $("#linkedin-link-view-user").text(response.linkedIn);

                $("#description-view-user").text(response.description);
                $("#skills-view-user").find("button").remove();
                response.skills.forEach(element =>{
                    $("#skills-view-user").append("<button class='btn btn-lg btn-secondary' disabled>"+element.skillName+"</button>")
                });

                $("#projects-view-user").find("p").remove();
                response.projects.forEach(element =>{
                    $("#projects-view-user").append("<p class='project-view-user' style='cursor: pointer;'>"+element+"</p>")
                })
            }
        })
        
    });
})