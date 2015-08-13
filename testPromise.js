var Q = require('q');
var Promise = require('bluebird');
var GitHubApi = require('github');

var github = new GitHubApi({
	version: '3.0.0'	
})

// var getUserAvatarWithCallback = function(user, callback){
// 	github.search.users({q:user},function (err, res) {
// 		if(err) {callback(err,null);}
// 		else{
// 			var avatarUrl = res.items[0].avatar_url;
// 			callback(null,avatarUrl);
// 		}
		
// 	});
// }
// getUserAvatarWithCallback('liuhahi',function (err, avatar) {
// 	console.log('got url with callback pattern',avatar);
// })

// var getUserAvatarWithBluebird = function (user) {
// 	// body...
// 	return new Promise(function(resolve,reject){
// 		github.search.users({q:user},function(err,res){
// 			if (err) { reject(err); }
// 			else{
// 				var avatarUrl = res.items[0].avatar_url;
// 				resolve(avatarUrl);
// 			}
// 		});
// 	});
// };

// getUserAvatarWithBluebird('liuhahi')
// .then(function(avatarURL){
// 	console.log('got url with bluebird Promise',avatarURL)
// })
// .catch(function(error){
// 	console.log('error getting avatar with bluebird',error);
// });

var getUserAvatarWithQ = function(user){
	var deferred = Q.defer();

	github.search.users({q:user},function (err, res) {
	if(err) {deferred.reject(err);}
	else{
		var avatarUrl = res.items[0].avatar_url;
		deferred.resolve(avatarUrl);
	}
		
	});
	return deferred.promise;
};
getUserAvatarWithQ('liuhahi')
.then(function(avatarURL){
	console.log('got url with q Promise',avatarURL)
})
.catch(function(error){
	console.log('error getting avatar with q',error);
});