var Discord = require("discord.js");
var Mitt = require("mitt");
var events = new Mitt();
var bot = new Discord.Client();
var moment = require("moment");

global.log = msg=>console.log("["+moment().format("YY-MM-DD HH:mm:ss")+"] "+msg);
global.settings = require("./settings");

// modules
let canny = new (require("./canny"))(global.settings.canny.url);
let snaps = new (require("./snaps"))();

// discord
bot.on("ready", function() {
	global.log("Bot is online!");
	bot.user.setPresence({game: {name: "with her tail", type: 0}});
	global.log("\nhttps://discordapp.com/oauth2/authorize?client_id="+bot.user.id+"&scope=bot\n");


	// print joined guilds
	// let guilds = bot.guilds.array();
	// Object.keys(guilds).forEach(key=>{
	// 	console.log("\t"+guilds[key].name+" ("+guilds[key].id+")");
	// }); console.log("");
	let guild = bot.guilds.get("250331140991221760");
	if (guild) {
		global.log("Server found: "+guild.name+" ("+guild.id+")");
	} else {
		global.log("Server not found!");
		process.exit(1);
	}

	// attach events
	events.on("canny.newPost", post=>{
		let chanID = global.settings.canny.channels[post.board.urlName];
		if (chanID == undefined) return;
		let chan = guild.channels.get(chanID);
		if (chan == undefined) return;

		let url = global.settings.canny.url+"/"+post.board.urlName+"/p/"+post.urlName;

		//console.log(post);
		global.log("New canny post: "+post.board.name);
		chan.send(new Discord.RichEmbed({
			title: post.title,
			description: post.details,
			url: url,
			author: {
				name: post.board.name,
				icon_url: global.settings.canny.icon,
				url: url,
			},
			//footer: {text: moment(post.created).format("HH:mm - MM/DD/YY")},
			timestamp: moment(post.created).toDate(),
			color: 0x00B4EF,
		}));
	});

	events.on("hifi.newSnap", snap=>{
		let chanID = global.settings.snaps.channel;
		let chan = guild.channels.get(chanID);
		if (chan == undefined) return;

		// let snap = {
		// 	id: 68055,
		// 	username: "Monoglu",
		// 	placeName: "RoguesGallery",
		// 	path: "/-16.294,-11.516,64.4308/0,-0.384243,0,0.923232",
		// 	imageUrl: "https://hifi-metaverse.s3-us-west-1.amazonaws.com/snapshots/images/hifi-snap-original-65904.gif",
		// 	avatarUrl: "https://hifi-metaverse.s3-us-west-1.amazonaws.com/images/users/previews/c56/be3/8b-/hero/hifi-user-c56be38b-49b6-44f9-9627-1cd74a161119.png",
		// }

		global.log("New hifi snap: "+snap.username);
		chan.send(new Discord.RichEmbed({
			title: "Snapshot at "+snap.placeName,
			//description: post.details,
			url: "https://highfidelity.com/user_stories/"+snap.id,
			author: {
				name: snap.username,
				icon_url: snap.avatarUrl,
				url: "http://highfidelity.com/users/"+snap.username,
			},
			image: {url: snap.imageUrl},
			//thumbnail: {url: snap.avatarUrl},
			//footer: {text: moment(post.created).format("HH:mm - MM/DD/YY")},
			//timestamp: moment().toDate(),
			color: 0x00B4EF,
		}));
	});

	// init listeners
	canny.listenOnNewPosts(events); // canny.newPost
	snaps.listenOnNewSnaps(events); // hifi.newSnap
});

bot.login(global.settings.token);