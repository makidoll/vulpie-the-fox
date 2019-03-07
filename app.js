var Mitt = require("mitt");
var Canny = require("./canny");
var events = new Mitt();
var Discord = require("discord.js");
var bot = new Discord.Client();
var moment = require("moment");

global.log = msg=>console.log("["+moment().format("YY-MM-DD HH:mm:ss")+"] "+msg);
global.settings = require("./settings");

// roadmap
var roadmap = (()=>{
	let recentPosts = {};
	let recentBoards = [];
	let roadmap = new Canny(global.settings.roadmap.url);
	
	roadmap.getBoards().then(boards=>{
		//console.log(boards);
		Object.keys(boards).forEach(key=>{
			let board = boards[key];
			recentBoards.push({
				_id: board._id,
				name: board.name,
				urlName: board.urlName,
			});

			recentPosts[board._id] = [];
		});

		function checkForNewPosts(dontEmit) {
			recentBoards.forEach(board=>{
				roadmap.getPosts(board.urlName).then(posts=>{
					if (posts[board._id] == undefined) return;
					posts = posts[board._id];
					//console.log(posts);

					Object.keys(posts).forEach(key=>{
						let post = posts[key];

						if (recentPosts[board._id].includes(post._id)) return;
						recentPosts[board._id].push(post._id);

						if (dontEmit) return;
						events.emit("roadmap", {
							_id: post._id,
							title: post.title,
							urlName: post.urlName,
							details: post.details,
							created: post.created,
							board: board,
						});
					});

				});
			});
		}

		checkForNewPosts(true);
		setInterval(checkForNewPosts, 1000*60*global.settings.roadmap.mins);

	}).catch(err=>{
		console.log(err);
	});
});

// discord
bot.on("ready", function() {
	global.log("Bot is online!");
	bot.user.setPresence({game: {name: "with her tail", type: 0}});

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
	events.on("roadmap", post=>{
		let chanID = global.settings.roadmap.channels[post.board.urlName];
		if (chanID == undefined) return;
		let chan = guild.channels.get(chanID);
		if (chan == undefined) return;

		let url = global.settings.roadmap.url+"/"+post.board.urlName+"/p/"+post.urlName;

		//console.log(post);
		global.log("New canny post: "+post.board.name);
		chan.send(new Discord.RichEmbed({
			title: post.title,
			description: post.details,
			url: url,
			author: {
				name: post.board.name,
				icon_url: global.settings.roadmap.icon,
				url: url,
			},
			//footer: {text: moment(post.created).format("HH:mm - MM/DD/YY")},
			timestamp: moment(post.created).toDate(),
			color: 0x00B4EF,
		}));
	});

	// init modules
	roadmap();
});

bot.login(global.settings.token);