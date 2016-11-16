module.exports = function() {
	var Word = {
		word: "",
		type: "",
		firstPrimitive: "",   // 第一基本义原
		otherPrimitives: [],   // 其他基本义原
		structruralWords: [],   // 如果该数组非空，则该词是一个虚词。列表里存放的是该虚词的一个义原，部分虚词无中文虚词解释
		relationalPrimitive: [],   // 关系义原
		relationSimbolPrimitive: []   // 关系符号义原
	}; 

	return {
		setWord: function(word) {
			Word.word = word;
		},

		setType: function(type) {
			Word.type = type;
		},

		setFirstPrimitive: function(firstPrimitive) {
			Word.firstPrimitive = firstPrimitive;
		},

		setOtherPrimitives: function(otherPrimitives) {
			Word.otherPrimitives = otherPrimitives;
		},

		addOtherPrimitive: function(otherPrimitives) {
			Word.otherPrimitives.push(otherPrimitives);
		},

		setStructruralWords: function(structruralWords) {
			Word.structruralWords = structruralWords;
		},

		addStructruralWord: function(structruralWords) {
			Word.structruralWords.push(structruralWords);
		},

		addRelationalPrimitive: function(key, value) {
			for(let i=0, len=Word.relationalPrimitive.length; i<len; i++) {
				if (Word.relationalPrimitive[i].key == key) {
					Word.relationalPrimitive[i].value.push(value);
					return;
				}
			}
			Word.relationalPrimitive.push({key: key, value: [value]});
		},

		addRelationSimbolPrimitive: function(key, value) {
			for(let i=0, len=Word.relationSimbolPrimitive.length; i<len; i++) {
				if (Word.relationSimbolPrimitive[i].key == key) {
					Word.relationSimbolPrimitive[i].value.push(value);
					return;
				}
			}
			Word.relationSimbolPrimitive.push({key: key, value: [value]});
		},

		isStructruralWord: function() {
			return (Word.structruralWords.length != 0);
		},

		getWord: function() {
			return Word;
		}
	}
};