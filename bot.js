var Discord = require("discord.io");
var logger = require("winston");
var conf = require(".././config.json");
var FNClient = require('fortnite');

var fortnite = new FNClient(conf.fort_auth);

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = "debug";

var client = new Discord.Client({
   token: conf.token,
   autorun: true
});
client.on("ready", function (evt) {
    logger.info("Connected");
    logger.info("Logged in as: ");
    logger.info(client.username + " - (" + client.id + ")");
    //console.log(evt);
});


client.on("message", function (user, userID, channelID, message, evt) {
    
    if (message.substring(0, 1) == conf.prefix) {
        var args = message.substring(1).split(" ");
        var cmd = args[0];
       
        //args = args.splice(1);
        switch(cmd) {
            // !ping
            case "customs":
                client.sendMessage({
                    to: channelID,
                    message: "Our next round of custom games are on Sunday 16th September at 8PM."
                });
            break;
            case "help":
                client.sendMessage({
                    to: channelID,
                    message: "```-customs\t\tInformation on the Fortnite Ireland Community games.\n-stats  \t\tGet Whymsy's stats to the console.```"
                })
                console.log(args[1]);
            break;
            case "stats":
                if(typeof(args[1]) == "undefined"){
                    client.sendMessage({
                        to: channelID,
                        message: "Please enter an Epic ID to get stats for!"
                    });
                }
                else{
                    fortnite.user("Whymsy", "pc").then(console.log); // this is the actual call for stats, it's actually so easy woo
                }
            break;
            case "test":
                //var myRole = client.users.get(userID);
                console.log(evt);
                //client.getUser({"userID": userID}).
                console.log(client.guilds); //still not returning the objects I want z z z
            break;
            default:
                client.sendMessage({
                    to: channelID,
                    message: "Sorry, your command was not recognized. Type '!help' to get a list of commands."
                });
            break;
         }
     }
});


