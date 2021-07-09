/*
	msg
		"{\"content\":\"<div style='width: 100%; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; text-align: center; vertical-align: middle; padding: 3px 0px; margin: 0px auto; border: 1px solid #000; color: #000; background-image: -webkit-linear-gradient(-45deg, #a7c7dc 0%,#85b2d3 100%);'><b>API READY</b></div\",\"playerid\":\"API\",\"target\":\"gm\",\"target_name\":\"GM\",\"type\":\"whisper\",\"who\":\"HealthColors\"}"
		"{\"content\":\"<div style='border: 3px solid #808080; background-color: #4B0082; color: white; padding: 1px 1px;'><div style=\\\"text-align: left;  margin: 5px 5px;\\\"><a style=\\\"position:relative;z-index:1000;float:left; background-color:transparent;border:0;padding:0;margin:0;display:block;\\\" href=\\\"!tm ping-target -Mc2tJUUVZH0c674A2j1\\\"><img src='https://s3.amazonaws.com/files.d20.io/images/152819033/7KQNEBUvnRkDkwml2UDJEQ/thumb.png?1595639986555555' style='width:70px; height:70px; padding: 0px 2px;' /></a><span style='font-family: Baskerville, \\\"Baskerville Old Face\\\", \\\"Goudy Old Style\\\", Garamond, \\\"Times New Roman\\\", serif;text-decoration: underline;font-size: 130%;'>Urmrratx'h</span>'s turn is done.</div><div style=\\\"text-align: right; margin: 5px 5px; position: relative; vertical-align: text-bottom;\\\"><a style=\\\"position:relative;z-index:1000;float:right; background-color:transparent;border:0;padding:0;margin:0;display:block;\\\" href=\\\"!tm ping-target -Mc2tJUtSn7GhJ8XgZlo\\\"><img src='https://s3.amazonaws.com/files.d20.io/images/218370078/iyrF-ActWWMerIcNiW8ABQ/thumb.png?161940672455555' style='width:70px; height:70px; padding: 0px 2px;' /></a><span style=\\\"position:absolute; bottom: 0;right:76px;\\\"><span style='font-family: Baskerville, \\\"Baskerville Old Face\\\", \\\"Goudy Old Style\\\", Garamond, \\\"Times New Roman\\\", serif;text-decoration: underline;font-size: 130%;'>Professor</span>, it's now your turn!</span><div style=\\\"clear:both;\\\"></div></div><a style=\\\"position:relative;z-index:10000; top:-1em;float: right;font-size: .6em; color: white; border: 1px solid #cccccc; border-radius: 1em; margin: 0 .1em; font-weight: bold; padding: .1em .4em;\\\" href=\\\"!eot\\\">EOT &#x21e8;</a><div style=\\\"padding: 5px;text-align: center;font-size: 100%;background-color: #ff00ff;text-shadow: -1px -1px 1px #000, 1px -1px 1px #000,-1px  1px 1px #000, 1px  1px 1px #000;letter-spacing: 3px;line-height: 130%;\\\">PROFESSOR</div><div style=\\\"clear:both;\\\"></div></div>\",\"playerid\":\"API\",\"type\":\"direct\",\"who\":\"\"}"
		"{\"content\":\"test\",\"playerid\":\"-M9ep3SVVPHGFbunQN4I\",\"type\":\"general\",\"who\":\"Zachary B. (GM)\"}"
		"{\"content\":\"bacon\",\"playerid\":\"-M9ep3SVVPHGFbunQN4I\",\"type\":\"general\",\"who\":\"Zachary B. (GM)\"}"
		"{\"content\":\"$[[0]]\",\"inlinerolls\":[{\"expression\":\"1d4\",\"results\":{\"resultType\":\"sum\",\"rolls\":[{\"dice\":1,\"results\":[{\"v\":2}],\"rollid\":\"-Me77B2CsnD81D9LzjD4\",\"sides\":4,\"type\":\"R\"}],\"total\":2,\"type\":\"V\"},\"rollid\":\"-Me77B2CsnD81D9LzjD4\",\"signature\":\"7f420dbd4751c0d8f06f5215c260eb68072d5443b5b2071ebfb853c23536a32eaf75d951f0c01fa411e18b7f37fe0e64e015315bf4e8052ad6e7e4a94fb6c50b\",\"tdseed\":3389880423984014000}],\"playerid\":\"-M9ep3SVVPHGFbunQN4I\",\"type\":\"general\",\"who\":\"Zachary B. (GM)\"}"
		"SPEAKINGAS: Example, MESSAGE: foo, CALLBACK: undefined, OPTIONS: undefined"
		"zbeyer Main {\"content\":\"!foo\",\"playerid\":\"-M9ep3SVVPHGFbunQN4I\",\"type\":\"api\",\"who\":\"Zachary B. (GM)\"}"
		"{\"content\":\"foo\",\"playerid\":\"API\",\"type\":\"general\",\"who\":\"Example\"}"
 */

/**
 * Utilities
 **/

var ZBEYER_IMAGE_LIB = {
	jakeBook: 'https://s3.amazonaws.com/files.d20.io/images/222853205/Ig0Okq-ZXy1lWYiAjPLmjA/thumb.png?16212210255'
};

var COMMAND_LIB = {
	SUMMON_BOOK: ('knowledgeIsPower').toLowerCase(),
	SUMMON_SPIRIT_WEAPON: ('spiritIsWilling').toLowerCase(),
	TEST: ('foo').toLowerCase(),
};

var successObject = function ()
{
	return {
		success: 1,
		status: "Okay"
	};
};

var getFirstSelectedToken = function (selected)
{
	if (!selected) return;
	return getObj("graphic", selected[0]._id);
};

var spawnFxOnToken = function (tok, type)
{
	type = type || "burst-holy";
	spawnFx(tok.get("left"), tok.get("top"), type, tok.get("pageid"));
};

var spawnTokenForToken = function (params)
{
	if (!params) return;
	var token = params.token;
	var imgSrc = params.imgSrc;
	var name = params.name;

	if (!token) return;
	var character = getObj("character", token.get("represents"));
	var playerlist = (character && character.get("controlledby")) || token.get("controlledby");

	name = token.get("name") + "'s " + (name || "Spiritual Weapon");
	imgSrc = imgSrc || "https://s3.amazonaws.com/files.d20.io/images/104629087/ZzHGu7CiyzL0sZTuB8KfJA/thumb.png?15816820805";

	return createObj("graphic", {
		left: token.get("left") + 45,
		top: token.get("top"),
		height: 70,
		width: 70,
		pageid: token.get("pageid"),
		layer: "objects",
		imgsrc: imgSrc,
		name: name,
		controlledby: playerlist ? playerlist : null,
		//aura1_radius: 0,
		//aura1_color: "#ffff00",
		showplayers_aura1: true
	});
};

var prettyPrintObj = function (object)
{
	// return JSON.stringify(object, null, "\t"); // stringify with tabs inserted at each level
	return JSON.stringify(object);
};

var stringByRemovingSubstring = function (string, subString)
{
	//const substrings = 'Hello World'.split('Wo'); // ['Hello ', 'rld']
	const substrings = string.split(subString);
	return substrings.join(''); // 'Hello rld';
};

var doesKeyExistInObj = function (key, obj)
{
	var keys = Object.keys(obj);
	log('keys: ' + prettyPrintObj(keys));

	return (keys.indexOf(key) !== -1);
};

var propertyOnObject = function (property, obj)
{
	var keys = Object.keys(obj);
	var index = -1;
	keys.forEach(function (key, i)
	{
		var val = obj[key];
		if (val === property) index = i;
	});

	var result;
	if (index !== -1)
	{
		result = successObject();
		result.data = {
			keyIndex: index,
			key: keys[index],
			property: property,
		};
	}

	return result;
};

var getCommand = function (msg)
{
	var msgString = (msg && msg.content);
	if (!msgString) return;
	msgString = msgString.toLowerCase().trim();
	var endCommandIndex = msgString.indexOf(' ');
	if (endCommandIndex === -1) return msgString;

	var apiCommandFlag = '!';
	var commandIndex = msgString.indexOf(apiCommandFlag);

	return msgString.slice(apiCommandFlag, endCommandIndex);
};

var printText = function (SPEAKINGAS, MESSAGE, CALLBACK, OPTIONS)
{
	log('SPEAKINGAS: ' + SPEAKINGAS + ', MESSAGE: ' + MESSAGE + ', CALLBACK: ' + CALLBACK + ', OPTIONS: ' + OPTIONS);
	sendChat(SPEAKINGAS, MESSAGE, CALLBACK, OPTIONS);
};


/**
 * Scripts
 */
var spawnHolyWeapon = function (token)
{
	if (!token) return;
	log('token: ' + prettyPrintObj(token));

	var newToken = spawnTokenForToken({token: token});
	spawnFxOnToken(token);
	sendChat(token.get("name"), "I summoned a spiritual weapon.");
};

var spawnSpellBook = function (token)
{
	if (!token) return;
	log('token: ' + prettyPrintObj(token));

	var newToken = spawnTokenForToken({
		token: token, name: 'Book', imgSrc: ZBEYER_IMAGE_LIB.jakeBook
	});

	spawnFxOnToken(newToken, "burn-charm");
	spawnFxOnToken(newToken, "burst-charm");
	var skillName = "MANIFEST MIND";
	sendChat(token.get("name"), "activated " + skillName);
};

/**
 * Main
 */
var zbeyerMain = function (msg)
{
	var command = getCommand(msg);
	//log('command '+ command);

	var cleanCommand = stringByRemovingSubstring(command, '!');
	var cleanMessage = stringByRemovingSubstring(msg.content, command);
	if (!command) return;
	if (!cleanCommand) return;
	//log('cleanCommand: ' + cleanCommand);
	//log('cleanMessage: ' + cleanMessage);
	if (!propertyOnObject(cleanCommand, COMMAND_LIB))
	{
		log('command ' + cleanCommand + ' does not exist in COMMAND_LIB');
		return;
	}

	var primaryToken = getFirstSelectedToken(msg.selected);
	log('primaryToken: ' + prettyPrintObj(primaryToken));
	//var name = (primaryToken && primaryToken.get("name")) || 'Example';

	switch (cleanCommand)
	{
		case COMMAND_LIB.SUMMON_BOOK.toLowerCase():
			var token = getFirstSelectedToken(msg.selected);
			spawnSpellBook(primaryToken);
			break;
		case COMMAND_LIB.SUMMON_SPIRIT_WEAPON.toLowerCase():
			spawnHolyWeapon(primaryToken);
			break;
		case COMMAND_LIB.TEST.toLowerCase():
			var character = findObjs({
					type: 'character',
					name: 'Magnum opus'
				},
				//options
			)[0];

			var characterToken = findObjs({
					id: character._defaulttoken,
					//type: 'graphic',
				},
				//options
			)[0];
			log(prettyPrintObj(character));
			log(prettyPrintObj(characterToken));

			if (!primaryToken) return;
			//var character = getObj("character", token.get("represents"));
			//var playerlist = (character && character.get("controlledby")) || token.get("controlledby");

			//var newToken =
			//
			//	spawnTokenForToken({
			//	id: _defaulttoken
			//});

			//spawnFxOnToken(newToken, "burn-charm");
			//spawnFxOnToken(newToken, "burst-charm");
			//var skillName = "MANIFEST MIND";
			//sendChat(token.get("name"), "activated " + skillName);

			break;
		default:
			//printText('command not found: ' + cleanCommand);
			break;
	}
};

on("ready", function ()
{
	on("chat:message", function (msg)
	{
		var commandIndex = msg.content.indexOf("!");
		if (msg.type == "api" && (commandIndex !== -1))
		{
			zbeyerMain(msg);
		}
	});
});
