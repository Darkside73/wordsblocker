
// add "trim" function
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};

// extend jquery
$.fn.tagName = function() {
    return this.get(0).tagName;
};


function cleanUpWords(words) {

	var findWords = function(textNode,regObjects) {
		// get text from text node
		text = textNode.text();
		for (index in regObjects) {
			if (regObjects[index].test(text)) {
				console.log('Found '+regObjects[index].toString()+' in '+text);
				// block parent element
				textNode.parent().hide();
				// block images from two parents levels
				node = textNode.parent();
				for (i=1;i<=3;i++) {
					node.find('img').hide();
					node = node.parent();
				}
				//textNode.parent().css('border','5px solid red').css('color','red'); - test for satisfy of blocking
				// breaking
				return false;
			}
		};
	};

	var loopDom = function(node,regObjects) {
		// skip some elements
		if (node.tagName()=='SCRIPT' || node.tagName()=='IFRAME' || node.tagName()=='NOSCRIPT') {
			return false;
		}
//			console.log('Tag name: '+node.tagName());
		node.contents()
			.filter(function() {
				return this.nodeType == Node.TEXT_NODE;
			})
			.each(function(index){
				findWords($(this),regObjects);
			});
		node.children().each(function(index){
			loopDom($(this),regObjects);
		});
	};

//		console.log(words);
	if (words) {
		// create array of RegExp objects
		var regObjects = [];
		$.each(words.split(','),function(index,value){
			value = value.trim();
			if (value) {
				var expr = '(\\s+|^)';
				splitted = value.split(' ');
				$.each(splitted,function(index,value){
					expr = expr+value.trim()+'[\\S]*[\\s]*';
				});
				regObjects.push(new RegExp(expr,'i'));
			}
		});
		// walk throw DOM elements
		loopDom($("body"),regObjects);
	}

}

chrome.storage.sync.get("words", function (data) {
	cleanUpWords(data.words);
});
