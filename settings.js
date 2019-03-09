module.exports = {
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
			"bugs": "433315408532078622", // bugs
			"feature-requests": "433324910035730432", // feedback
			"this-is-my-board": "553016215036100637", // bot playground
		},
	},
	snaps: {
		//channel: "553016215036100637", // bot playground
		channel: "433028340736196608", // media
	},
};