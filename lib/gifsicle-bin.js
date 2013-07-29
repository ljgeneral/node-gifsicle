'use strict';

var path = require('path');
var url = require('url');
var which = require('which');

var target = {
	name: 'gifsicle',
	url: 'https://raw.github.com/yeoman/node-gifsicle-bin/master/',
	pathPrefix: '../bin',
	urlPrefix: 'vendor',
	platforms: {
		darwin: {
			path: 'osx'
		},
		linux: {
			path: 'linux',
			arch: true
		},
		win32: {
			path: 'win',
			arch: true,
			suffix: 'exe'
		},
		freebsd: {
			path: 'freebsd',
			arch: true
		}
	}
};

function getPathToPackagedBinary(target) {
	var platform = target.platforms[process.platform];
	if (platform === undefined) {
		console.error('Unsupported platform:', process.platform, process.arch);
	} else {
		var targetPath = [];
		var exec = target.name;

		targetPath.push(target.pathPrefix);
		targetPath.unshift(__dirname);

		if (platform.suffix !== undefined) {
			exec += '.' + platform.suffix;
		}
		targetPath.push(exec);

		return path.join.apply(__dirname, targetPath);
	}
}

function getUrlToPackagedBinary(target) {
	var platform = target.platforms[process.platform];
	if (platform === undefined) {
		console.error('Unsupported platform:', process.platform, process.arch);
	} else {
		var targetPath = [];
		var arch = process.arch === 'x64' ? 'x64' : 'x86';
		var exec = target.name;

		targetPath.push(target.urlPrefix);
		targetPath.push(platform.path);

		if (platform.arch === true) {
			targetPath.push(arch);
		}
		if (platform.suffix !== undefined) {
			exec += '.' + platform.suffix;
		}
		targetPath.push(exec);

		return url.resolve(target.url, targetPath.join('/'));
	}
}

function setPath(target) {
	try {
		return which.sync(target.name);
	}
	catch (err) {
		return getPathToPackagedBinary(target);
	}
}

exports.path = setPath(target);
exports.url = getUrlToPackagedBinary(target);