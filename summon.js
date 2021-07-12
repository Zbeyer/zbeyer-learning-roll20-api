/**
 * time to listen...
 */
on("ready", function ()
{
	on("chat:message", async function (msg)
	{
		var commandIndex = msg.content.indexOf("!");
		var zCommandIndex = msg.content.indexOf("!zSummon");
		if (msg.type == "api" && (commandIndex !== -1) && (zCommandIndex !== -1))
		{
			zSummonMain(msg);
		}
	});
});

var zSummonMain = function (msg)
{
	// Extract arguments from message
	let arguments = msg.content.split(/\s+--/);
	arguments.shift();

	// Convert args to param object...
	let params = {};
	arguments.forEach(function (arg)
	{
		arg = arg.replace(/[\"\''"]+/g, '');
		arg = arg.replace(/[\'\n\r}{]+/g, '');
		arg = arg.replace("<br/><br>", '');
		arg = arg.replace(/<\/?[^>]+(>|$)/g, "");

		let splitArg = arg.split(':');
		if (splitArg && splitArg.length > 0)
		{
			splitArg[0] = splitArg[0].trimStart().trimEnd();
			splitArg[1] = splitArg[1].trimStart().trimEnd();
			params[splitArg[0]] = splitArg[1];
		}
	});
	log(`params: ${JSON.stringify(params)}`);
	// Get Selected Token
	let selected = msg.selected;
	if (selected === undefined)
	{
		sendChat("API", "Please select a character.");
		return;
	}
	let tok = getObj("graphic", selected[0]._id);

	// Determine Character Sheet To Lookup
	let inputName = params.name && params.name.trim();
	if (!(inputName && inputName.length > 0))
	{
		sendChat("API", "you need a character name e.g. --name: Finger of Vylvira");
		return;
	}

	//set spawn point from selected  token properties
	let spawnPageID = tok.get("pageid");
	let spawnLeft = tok.get("left") + 70;    //spawn to adjacent right of selected token (currently hardcoded, expand later with args?)
	let spawnTop = tok.get("top");
	let fxType = params.fxType || "burst-holy" || "burn-charm";

	// Validate Character Exists
	var check = findObjs({_type: "character", name: inputName}, {caseInsensitive: true})[0];
	if (typeof check == 'undefined')
	{
		sendChat(msg.who, "Character named \"" + inputName + "\" not found.");
		return;
	}

	// Fetch Character(s)
	let chars = findObjs({_type: "character", name: inputName}, {caseInsensitive: true});

	// Fetch Default Token of matching character...
	chars[0].get("_defaulttoken", function (defaultToken)
	{
		let baseObj = JSON.parse(defaultToken);

		// Validate default token exists...
		if (!baseObj)
		{
			spawnFx(tok.get("left"), tok.get("top"), 'burn-blood', tok.get("pageid"));
			spawnFx(tok.get("left"), tok.get("top"), 'burst-blood', tok.get("pageid"));
			sendChat(msg.who, "Character named \"" + inputName + "\" has no defaultToken...");
			return;
		}

		// Cleanup in case we have the wrong imageURL: must be thumb.png...
		let imgsrc = baseObj.imgsrc;
		if (imgsrc)
		{
			imgsrc = imgsrc.replace(/med.png/g, "thumb.png");
			imgsrc = imgsrc.replace(/max.png/g, "thumb.png");
		}

		baseObj._type = "graphic";
		baseObj._subtype = "token";
		baseObj.layer = "objects";
		baseObj.pageid = spawnPageID;
		baseObj.left = spawnLeft;
		baseObj.top = spawnTop;
		baseObj.currentSide = baseObj.currentSide || 0;
		baseObj.imgsrc = imgsrc;

		// Create Token from default
		var newToken = createObj('graphic', baseObj);

		// Play FX on new token
		var fx = spawnFx(spawnLeft, spawnTop, fxType, spawnPageID);
	});
};