/**
 * Scripts
 */
var spawnHolyWeapon = function (token)
{
	if (!token) return;

	var newToken = spawnTokenForToken({token: token});
	spawnFxOnToken(token);
	sendChat(token.get("name"), "I summoned a spiritual weapon.");
};

var spawnSpellBook = function (msg)
{
	var token = getFirstSelectedToken(msg.selected);
	if (!token) return;
	spawnCharacterTokenNamed('Magnum opus', msg);
	spawnFxOnToken(token, "burn-charm");
	spawnFxOnToken(token, "burst-charm");
	var skillName = "MANIFEST MIND";
	sendChat(token.get("name"), "activated " + skillName);
};

var spawnSwarm = function (msg, name)
{
	var token = getFirstSelectedToken(msg.selected);
	if (!token) return;
	spawnCharacterTokenNamed(name, msg);
	spawnFxOnToken(token, "burn-acid");
	spawnFxOnToken(token, "burst-acid");
	sendChat(token.get("name"), "called on " + name);
};

/**
 * Main
 */
var zbeyerMain = function (msg)
{
	var command = getCommand(msg);
	var cleanCommand = stringByRemovingSubstring(command, '!');
	// var cleanMessage = stringByRemovingSubstring(msg.content, command);
	if (!command) return;
	if (!cleanCommand) return;
	if (!propertyOnObject(cleanCommand, COMMAND_LIB))
	{
		log('command ' + cleanCommand + ' does not exist in COMMAND_LIB');
		return;
	}
	var primaryToken = getFirstSelectedToken();

	switch (cleanCommand)
	{
		case COMMAND_LIB.SUMMON_BOOK.toLowerCase():
			spawnSpellBook(msg);
			break;
		case COMMAND_LIB.SUMMON_SPIRIT_WEAPON.toLowerCase():
			spawnHolyWeapon(primaryToken);
			break;
		case COMMAND_LIB.SUMMON_BEN.toLowerCase():
			spawnSwarm(msg, 'Big Ben');
			break;
		case COMMAND_LIB.SUMMON_SOCRATES.toLowerCase():
			spawnSwarm(msg, 'Socrates');
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
