module.exports = function(router){

    //Home Page route
    router.get('/',function(request,response){
        response.send("Hello there!");
    })
}