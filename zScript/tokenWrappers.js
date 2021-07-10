var getFirstSelectedToken = function (msg)
{
	if (!msg) return;
	var selected = msg.selected;
	if (!selected) return;

	return getObj("graphic", selected[0]._id);
};

//var getSelectedTokens = function (msg)
//{
//	if (!msg) return;
//	var selected = msg.selected;
//	if (!selected) return;
//
//	return getObj("graphic", selected[0]._id);
//};


var spawnTokenAtXY = function (tokenJSON, pageID, spawnX, spawnY)
{
	let baseObj = JSON.parse(tokenJSON);
	log(`Trying to place ${prettyPrintObj(baseObj)}`);

	// Cleanup in case we have the wrong imageURL...
	var imgSrc = baseObj.imgsrc || '';
	imgSrc = imgSrc.replace(/med.png/g, "thumb.png");
	baseObj.imgsrc = imgSrc;

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
		aura1_radius: 0,
		aura1_color: "#ffff00",
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