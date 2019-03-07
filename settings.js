module.exports = {
	token: require("fs").readFileSync("./token.txt", "utf8"),
	roadmap: {
		url: "http://roadmap.highfidelity.com",
		//url: "https://i-have-no-company.canny.io",
		icon: "https://canny.io/images/cc546bc6e9e4c267452a433b426f6644.jpg",
		mins: 10,
		channels: {
			"bugs": "553016215036100637",
			"feature-requests": "553016215036100637",
			"this-is-my-board": "553016215036100637",
		},
	},
};