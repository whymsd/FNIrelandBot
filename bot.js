var Discord = require("discord.js");
var logger = require("winston");
var conf = require(".././config.json");
var FNClient = require('fortnite');

var fortnite = new FNClient(conf.fort_auth);

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = "debug";

var client = new Discord.Client();

client.on("ready", () => {
    logger.info("Connected");
    logger.info("Logged in as: ");
    //console.log(evt);
});


client.on("message", (message) => {

    //console.log(message.content);
    var channelID = message.channel.id;
    var userID = message.author.id;
    var user = message.author.username;
    
    if (message.content.substring(0, 1) == conf.prefix) {
        var args = message.content.substring(1).split(" ");
        var cmd = args[0];
       
        //args = args.splice(1);
        switch(cmd) {
            // !ping
            case "customs":
                message.channel.send("Our next round of custom games are on Sunday 16th September at 8PM.");
            break;
            case "help":
                message.channel.send("```-customs \t\t\t\t\t\tInformation on the Fortnite Ireland Community games.\n-solos <Username> <Platform>\t Get the solos stats for a user.\n-duos <Username> <Platform>\t  Get the duos stats for a user.\n-squads <Username> <Platform>\tGet the squads stats for a user.\n-platform <Platform> \t\t\tChange your server role to the selected platform (PC/PS4/Xbox).```");
            break;
            case "solos":
            case "duos":
            case "squads":
                //console.log(args[2]);
                if(typeof(args[1]) == "undefined"){
                    message.channel.send("Please enter an Epic ID to get stats for!");
                }
                /*else if(args[2] != "pc" && args[2] != "ps4" && args[2] != "xb1" && typeof(args[2]) != undefined){
                    client.sendMessage({
                        to: channelID,
                        message: "Platform entered was invalid"
                    });
                }*/
                else{
                    var plat = args[args.length - 1];
                    var platLC = plat.toLowerCase();
                    var epicID = args.slice(1, args.length-1).join(" ");
                    //console.log(epicID);
                    if(platLC != "pc" && platLC != "xbox" && platLC != "ps4"){
                        if(args.length > 2){
                            epicID += (" " + plat); 
                        }
                        else{
                            epicID = args[1];
                        }
                        var myUser = message.guild.members.get(userID);
                        if(myUser.roles.find(ay => ay.name === "PS4")){
                            platLC = "ps4";
                        }
                        else if(myUser.roles.find(ay => ay.name === "Xbox 1")){
                            platLC = "xbox";
                        }
                        else{
                            platLC = "pc";
                        }
                    }
                    //console.log("Searching for " + epicID + ", " + plat);
                    statDelivery(epicID, platLC, cmd, message.channel);  
                }
            break;
            case "platform":
                if(args.length != 2){
                    message.channel.send("Please enter a valid platform (PC, PS4, Xbox)");
                }
                else{
                    var plat = args[1].toLowerCase();
                    var role;
                    switch(plat){
                        case "pc":
                            role = message.guild.roles.find(ay => ay.name  === "PC");
                        break;
                        case "ps4":
                            role = message.guild.roles.find(ay => ay.name  === "PS4");
                        break;
                        case "xbox":
                            role = message.guild.roles.find(ay => ay.name  === "Xbox 1");
                        break;
                    }
                    var myUser = message.guild.members.get(userID);
                    roleReset(myUser, message.guild.roles.find(ay => ay.name  === "PC"));
                    roleReset(myUser, message.guild.roles.find(ay => ay.name  === "PS4"));
                    roleReset(myUser, message.guild.roles.find(ay => ay.name  === "Xbox 1"));
                    myUser.addRole(role).catch(console.error);
                    message.channel.send("Server role was changed to " + role.name + "!");
                }
            break;
            case "test":
                //console.log(message.channel.guild.members.find(ay => ay.username === "Whymsy"));
                //console.log(evt);
                //client.getUser({"userID": userID}).
                //console.log(client.guilds); //still not returning the objects I want z z z
            break;
            default:
                message.channel.send("Sorry, your command was not recognized. Type '-help' to get a list of commands.");
            break;
         }
     }
});

client.login(conf.token);

function statDelivery(user, platform, mode, channel){
    console.log("Searching for " + user + ", " + platform);
    fortnite.user(user, platform).then((myUser) =>{
        //console.log("WE HERE: " + myUser.username);
        var myMode;
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
            channel.send("```User has no stats for this game mode!```");
        }
        else{
            channel.send("```Username: " + myUser.username + "\nMatches: " + myMode.matches + "\nWins: " + myMode.wins + "\nKills: " + myMode.kills + "```");
        }
    }).catch((error) => {
        channel.send("```Error retrieving stats, please try again later.```");
        console.log(error);
    });
}

function roleReset(member, thisRole){
    member.removeRole(thisRole).catch(console.error);
}
