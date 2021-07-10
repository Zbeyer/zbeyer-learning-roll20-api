var spawnFxOnToken = function (tok, type)
{
	type = type || "burst-holy";
	spawnFx(tok.get("left"), tok.get("top"), type, tok.get("pageid"));
};
