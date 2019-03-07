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

	this.getPosts = (boardUrl)=>new Promise((resolve,reject)=>{
		getData(url+"/"+boardUrl).then(data=>{
			return resolve(data.posts)
		}).catch(err=>{
			return reject(err);
		})
	});
}