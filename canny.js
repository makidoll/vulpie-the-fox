var request = require("request");

function getData(url) {
	return new Promise((resolve,reject)=>{
		request(url, (err,res,body)=>{
			if (err) return reject(err);

			let match = /window\.__data = ({[\s\S].*});<\/script>/g.exec(body);
			if (match.length<2) return reject();

			let data = undefined;
			try { data = JSON.parse(match[1]);
			} catch(err) { return reject(err); }

			return resolve(data); 
		});
	});
}

module.exports = function(url) {
	this.getBoards = ()=>new Promise((resolve,reject)=>{
		getData(url).then(data=>{
			return resolve(data.boards.items);
		}).catch(err=>{
			return reject(err);
		});
	});

	this.getLatestPosts = (boardUrl)=>new Promise((resolve,reject)=>{
		getData(url+"/"+boardUrl+"?sort=new").then(data=>{
			return resolve(data.posts);
		}).catch(err=>{
			return reject(err);
		})
	});

	this.listenOnNewPosts = (events)=>{
		let recentPosts = {};
		let recentBoards = [];

		this.getBoards().then(boards=>{
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

			let checkForNewPosts = (dontEmit)=>{
				recentBoards.forEach(board=>{
					this.getLatestPosts(board.urlName).then(posts=>{
						if (posts[board._id] == undefined) return;
						posts = posts[board._id];
						//console.log(posts);

						Object.keys(posts).forEach(key=>{
							let post = posts[key];

							if (recentPosts[board._id].includes(post._id)) return;
							recentPosts[board._id].push(post._id);

							if (dontEmit) return;
							events.emit("canny.newPost", {
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
			};

			checkForNewPosts(true);
			setInterval(checkForNewPosts, 1000*60*global.settings.mins.canny);
			global.log("Listening to new canny posts, interval "+global.settings.mins.canny+"m");
		}).catch(err=>{
			console.log(err);
		});
	}
}