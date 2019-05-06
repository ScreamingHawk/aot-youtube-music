var nativefier = require('nativefier').default;
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var async = require('async');

var buildFolder = 'build';
var builtPath = '';
var newPathEnd = 'youtube-music-app';
var newPath = path.join(buildFolder, newPathEnd);

function clearBuildFolder(callback){
	rimraf(buildFolder, function(err){
		if (err){
			console.log('Unable to clear build folder');
			console.log(err);
			return;
		}
		callback();
	});
}

function nativefy(callback){
	// Config
	var options = {
		// Youtube Music URL
		targetUrl: 'https://music.youtube.com',
		out: buildFolder,
		// No source
		asar: false,
		// Display and quality of life
		singleInstance: true,
		alwaysOnTop: true,
		// Size and border
		minWidth: "1044px",
		minHeight: "400px",
		width: "1044px",
		height: "400px",
		// Allow app to navigate
		internalUrls: '*',
		// Additional config
		inject: [
			"src/inject.css",
		],
	};

	// Run it
	nativefier(options, function(error, appPath) {
		builtPath = appPath;
		if (error) {
			console.error(error);
			return;
		}
		callback();
	});
}

function renameBuildFolder(callback){
	// Rename folder
	fs.rename(builtPath, newPath, function(err){
		if (err){
			console.log('Unable to rename folder');
			console.log(err);
			return;
		}
		callback();
	});
}

function createSymLink(callback){
	// Create sym link
	fs.symlink(path.join(newPathEnd, 'YouTubeMusic.exe'), path.join(buildFolder, 'YouTubeMusic'), function(err){
		if (err){
			console.log('Unable to create symbolic link');
			console.log(err);
			return;
		}
		callback();
	});
}

// Run these things
async.waterfall([
			clearBuildFolder,
			nativefy,
			renameBuildFolder,
			createSymLink
		], function(){
	console.log('App created successfully')
})
