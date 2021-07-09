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

var spawnTokenAtXY = function (tokenJSON, pageID, spawnX, spawnY)
{
	let baseObj = JSON.parse(tokenJSON);
	baseObj.pageid = pageID;
	baseObj.left = spawnX;
	baseObj.top = spawnY;
	return createObj('graphic', baseObj);
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

/**
 * 	// https://app.roll20.net/forum/post/8991150/callback-function-question-for-defaulttoken
 * @param name
 * @returns {*}
 */
var spawnCharacterTokenNamed = function (inputName, msg)
{
	//let chars = findObjs({_type: "character", name: 'Magnum opus'}, {caseInsensitive: true});
	//console.log(`chars: ${JSON.stringify(chars)}`);
	//
	//let defaultTokenString = 'waiting...';
	//chars[0].get("_defaulttoken", (defaultToken) =>
	//{
	//	log(`CALLBACK: ${JSON.stringify(defaultToken)}`);
	//
	//	defaultTokenString = JSON.parse(defaultToken);
	//	log(`IN THE CALLBACK: defaultTokenString = ${defaultTokenString}`);
	//});

	var selected = msg.selected;
	if (selected === undefined)
	{
		sendChat("API", "Please select a character.");
		return;
	}

	//set spawn point from selected  token properties
	let tok = getObj("graphic", selected[0]._id);
	let spawnPageID = tok.get("pageid");
	let spawnLeft = tok.get("left") + 70;    //spawn to adjacent right of selected token (currently hardcoded, expand later with args?)
	let spawnTop = tok.get("top");

	let args = msg.content.split(/\s+--/);
	args.shift();

	if (inputName || (args.length >= 1))
	{
		inputName = inputName || args[0];
		var check = findObjs({_type: "character", name: inputName}, {caseInsensitive: true})[0];

		if (typeof check == 'undefined')
		{
			sendChat(msg.who, "Character named \"" + inputName + "\" not found.");
		} else
		{
			var chars = findObjs({_type: "character", name: inputName}, {caseInsensitive: true});
			chars[0].get("_defaulttoken", function (defaultToken)
			{
				spawnTokenAtXY(defaultToken, spawnPageID, spawnLeft, spawnTop);
			});
		}
	}
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

var spawnSpellBook = function (msg)
{
	var token = getFirstSelectedToken(msg.selected);
	if (!token) return;
	// OLD
	// var newToken = spawnTokenForToken({
	// 	token: token, name: 'Book', imgSrc: ZBEYER_IMAGE_LIB.jakeBook
	// });
	spawnCharacterTokenNamed('Magnum opus', msg);
	spawnFxOnToken(token, "burn-charm");
	spawnFxOnToken(token, "burst-charm");
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
			spawnSpellBook(msg);
			break;
		case COMMAND_LIB.SUMMON_SPIRIT_WEAPON.toLowerCase():
			spawnHolyWeapon(primaryToken);
			break;
		case COMMAND_LIB.TEST.toLowerCase():
			break;
		default:
			//printText('command not found: ' + cleanCommand);
			break;
	}
};

/**
 * time to listen...
 */
on("ready", function ()
{
	//const tokenMarkers = JSON.parse(Campaign().get("token_markers"));
	//log(tokenMarkers);
	on("chat:message", function (msg)
	{
		var commandIndex = msg.content.indexOf("!");
		if (msg.type == "api" && (commandIndex !== -1))
		{
			zbeyerMain(msg);
		}
	});
});
