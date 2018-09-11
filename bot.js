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
   token: conf.tokentest,
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
                    message: "```-customs \t\t\t\t\t\tInformation on the Fortnite Ireland Community games.\n-solos <Username> <Platform>\t Get the solos stats for a user.\n-duos <Username> <Platform>\t  Get the duos stats for a user.\n-squads <Username> <Platform>\tGet the squads stats for a user.```"
                })
                console.log(args[1]);
            break;
            case "solos":
            case "duos":
            case "squads":
                //console.log(args[2]);
                if(typeof(args[1]) == "undefined"){
                    client.sendMessage({
                        to: channelID,
                        message: "Please enter an Epic ID to get stats for!"
                    });
                }
                /*else if(args[2] != "pc" && args[2] != "ps4" && args[2] != "xb1" && typeof(args[2]) != undefined){
                    client.sendMessage({
                        to: channelID,
                        message: "Platform entered was invalid"
                    });
                }*/
                else{
                    var plat = args[args.length - 1];
                    var epicID = args.slice(1, args.length-1).join(" ");
                    //console.log(epicID);
                    if(plat != "pc" && plat != "xbox" && plat != "ps4"){
                        epicID += (" " + plat); 
                        plat = "pc";
                        //console.log("" + (args.length - 1));
                    }
                    console.log("Searching for " + epicID + ", " + plat);
                    statDelivery(epicID, plat, cmd, channelID);  
                }
            break;
            case "test":
                console.log(args.length);
                //var myRole = client.users.get(userID);
                //console.log(evt);
                //client.getUser({"userID": userID}).
                //console.log(client.guilds); //still not returning the objects I want z z z
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

function statDelivery(user, platform, mode, channelID){
    fortnite.user(user, platform).then((myUser) =>{
        //console.log("WE HERE: " + myUser.username);
        var myMode
        switch(mode){
            case "solos":
                myMode = myUser.stats.solo;
            break;
            case "duos":
                myMode = myUser.stats.duo;
            break;
            case "squads":
                myMode = myUser.stats.squad;
            break;
        }
        if(typeof(myMode) === "undefined"){
            client.sendMessage({
                to: channelID,
                message: "```User has no stats for this game mode!```"
            });
        }
        else{
            console.log(myMode.wins);
            client.sendMessage({
                to: channelID,
                message: "```Username: " + myUser.username + "\nMatches: " + myMode.matches + "\nWins: " + myMode.wins + "\nKills: " + myMode.kills + "```"
            });
        }
    }).catch((error) => {
        client.sendMessage({
            to: channelID,
            message: "```Error retrieving stats, please try again later.```"
        });
        console.log(error);
    });
    console.log("Mission complete.");
}
