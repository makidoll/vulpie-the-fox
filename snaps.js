var request = require("request");

module.exports = function(url) {
	this.getLatestSnaps = ()=>new Promise((resolve,reject)=>{
		request("https://metaverse.highfidelity.com/api/v1/user_stories?include_actions=snapshot&per_page=10", (err,res,body)=>{
			if (err) return reject(err);
			
			let json = undefined;
			try { json = JSON.parse(body); }
			catch(err) { return reject(err); }

			return resolve(json);
		});
	});

	this.getAvatarUrl = (username)=>new Promise((resolve,reject)=>{
		request("https://highfidelity.com/users/"+username, (err,res,body)=>{
			if (err) return reject(undefined);
			let avatarUrl = (/<img class=['"]users-img['"] src="(.*?)[?'"]/gi.exec(body));
			if (avatarUrl==null) reject(undefined);

			avatarUrl = avatarUrl[1];
			if (avatarUrl.substring(0,8)=="/assets/") avatarUrl = "https://highfidelity.com"+avatarUrl;
			return resolve(avatarUrl[1]);
		});
	});

	this.listenOnNewSnaps = (events)=>{
		let recentSnaps = [];

		let checkForNewSnaps = (dontEmit)=>{
			this.getLatestSnaps().then(snaps=>{
				snaps.user_stories.forEach(async snap=>{
					if (recentSnaps.includes(snap.id)) return;
					recentSnaps.push(snap.id);

					if (dontEmit) return;

					let avatarUrl = undefined;
					try { avatarUrl = await this.getAvatarUrl(snap.username); }
					catch(err) { avatarUrl = "https://highfidelity.com/assets/users/hero-default-user-d5a4727d1ad1fb9d9cd26383e26e2697dfd9f4d2f3f81da86c4990771ca8810d.png"; }

					events.emit("hifi.newSnap", {
						id: snap.id,
						username: snap.username,
						placeName: snap.place_name,
						path: snap.path,
						imageUrl: snap.details.image_url,
						avatarUrl: avatarUrl,
					});
				});
			}).catch(err=>{
				console.log(err);
			});
		}

		checkForNewSnaps(true);
		setInterval(checkForNewSnaps, 1000*60*global.settings.mins.snaps);
		global.log("Listening to new hifi snaps, interval "+global.settings.mins.snaps+"m");
	}
}