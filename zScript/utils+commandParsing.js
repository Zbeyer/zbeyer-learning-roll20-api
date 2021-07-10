var stringByRemovingSubstring = function (string, subString)
{
	//const substrings = 'Hello World'.split('Wo'); // ['Hello ', 'rld']
	const substrings = string.split(subString);
	return substrings.join(''); // 'Hello rld';
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
