module.exports = function(mongoose){
    var configDataBase = "mongodb://127.0.0.1:27017/devfriend";
    mongoose.connect(configDataBase);
}