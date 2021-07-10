var prettyPrintObj = function (object)
{
	// return JSON.stringify(object, null, "\t"); // stringify with tabs inserted at each level
	return JSON.stringify(object);
};

var printText = function (SPEAKINGAS, MESSAGE, CALLBACK, OPTIONS)
{
	log('SPEAKINGAS: ' + SPEAKINGAS + ', MESSAGE: ' + MESSAGE + ', CALLBACK: ' + CALLBACK + ', OPTIONS: ' + OPTIONS);
	sendChat(SPEAKINGAS, MESSAGE, CALLBACK, OPTIONS);
};
