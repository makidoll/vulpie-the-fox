var snaps = new (require("../snaps.js"))("https://metaverse.highfidelity.com");

(async ()=>{

	let avatarUrl;
	let latestSnaps;

	// with image
	avatarUrl = await snaps.getAvatarUrl("Maki");
	console.log("Maki: "+avatarUrl);

	// default image
	avatarUrl = await snaps.getAvatarUrl("billmar");
	console.log("billmar: "+avatarUrl);

	// no user
	avatarUrl = await snaps.getAvatarUrl("aksjdklasd");
	console.log("aksjdklasd: "+avatarUrl);

	// latest snap
	latestSnaps = await snaps.getLatestSnaps();
	console.log(latestSnaps.user_stories[0]);

})();