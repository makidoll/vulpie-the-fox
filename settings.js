module.exports = {
	server: "563485021722247179",
	token: require("fs").readFileSync("./token.txt", "utf8"),
	mins: {
		canny: 10,
		snaps: 10,
	}, 
	canny: {
		url: "http://roadmap.highfidelity.com",
		//url: "https://i-have-no-company.canny.io",
		icon: "https://canny.io/images/cc546bc6e9e4c267452a433b426f6644.jpg",
		channels: {
			"bugs": "563489724451520543", // bugs
			"feature-requests": "563495843605381142", // feedback
			//"this-is-my-board": "", // bot playground
		},
	},
	snaps: {
		url: "https://metaverse.highfidelity.com",
		channel: "563497640667512834", // media
		//channel: "553016215036100637", // bot playground
	},
};
