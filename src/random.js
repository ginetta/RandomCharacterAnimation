'use strict'

/**
 * @summary Helloworld.js is a VanillaJS plugin that generates random text effects.
 *
 * @version 0.1.0
 * https://github.com/vanderlanth/HelloWorld.js
 *
 * Copyright (c) 2015+ Nicolas Lanthemann aka. vanderlanth | Interactive Media Designer
 * vanderlanth@gmail.com
 *
 * @license
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * --------------------------------------------------------------------
 *
 * This documentation contains the informations about how to use the plugin
 * and how the plugin works globally.
 * Just send me a message if you have a question or else. Hope you like it !
 *
 * PS: It's my first documentation, please be nice :)
 *
 * @readonly
 *
 * --------------------------------------------------------------------
 *
 * @todo Write a 'not-so-bad' documentation
 * @todo Update the main class
 * @todo Change text during animation transition #magic for the official presentation doh
 * @todo Bower file
 * @todo Post on Github
 * @todo Open a beer
 *
 * --------------------------------------------------------------------
 *
 * @class main class of the plugin  |			| Assign the plugin to an element
 *
 * @param element 					| String	| Select DOM element
 *
 * @param minChanges & maxChanges 	| int		| Number min & max of random changes for each letters during the animation
 * @default							| 10 and 100
 *
 * @param type						| string	| Type of character that generate the animation
 * @default							| 'char'
 * @example							| 'int', 'char' or yourOwnVariableOrArrayIfYouWant
 *
 * @param restartKey				| int		| Keycode that allows to restart the animation
 * @default							| false
 *
 * @param kerning					| int		| Allow to adapt the letter-spacing
 * @default							| 55
 *
 * @param unity 					| string 	| Unity of the letter-spacing
 * @default							| 'px'
 * @example							| 'px', '%', 'rem', 'pizza', 'em'
 *
 */
var RandomCharacterAnimation = function(options) {

/**
 * @default value for each parameters
 *
 */

	var defaults = {
		d_element	: '',
		d_type		: 'char',
		d_min		: 10,
		d_max		: 100,
		d_kerning	: 10,
	}

	this.size;
	this.getLettersArray	= [];
	this.getLettersChanges	= [];
	this.kerningSize		= [];
	this.currentChange		= 0;
	this.char				= 'abcdefghijklmnopqrstuvwxyz0123456789!?*()@£$%^&_-+=[]{}:;\'"\\|<>,./~`×';
	this.charArray 			= [];
	this.requestId;


	// Create options by extending defaults with the passed in arguments
	if (arguments[0] && typeof arguments[0] === "object") {
      this.options = _extendDefaults(defaults, arguments[0]);
	}

}

/**
  * @function _extendDefaults
  * @description set defaults parameters if undefined
  * @param source 		| get defaults parameters
  * @param properties | choose & set the defaults
  * @private
  *
  */

function _extendDefaults(source, properties) {
	var property;
	for (property in properties) {
		if (properties.hasOwnProperty(property)) {
			source[property] = properties[property];
		}
	}
	return source;
}


RandomCharacterAnimation.prototype = {

	// Private functions

	/**
	 * @function _random
	 * @description generate a random number
	 * @param minNb & maxNb 	| allows to generate the number between 20 and 50 for example
	 * @private
	 *
	 */

	_random: function(minNb, maxNb) {
		return Math.floor(Math.random() * (maxNb - minNb) + minNb);
	},

	/**
	 * @function _getElementSize
	 * @description get the length of the DOM element and push in an array
	 * @param minNb & maxNb 	| allows to generate the number between 20 and 50 for example
	 * @private
	 *
	 */

	_getElementSize: function() {
		var i, thisLetter;
		var element_selected = document.querySelector(this.options.d_element).textContent;

			for (i in element_selected) {
				thisLetter = element_selected[i];
				this.getLettersArray.push(thisLetter);
			}
			return this.getLettersArray;

	},

	/**
	 * @function _setStructure
	 * @description display a span for every letter that will allow the animation
	 * @private
	 *
	 */

	_setStructure: function() {
		var element = document.querySelector(this.options.d_element);
		element.innerHTML = '';

		var i, j, characterContainer, thisContainer, array, kerningSize;

		for (i in this.getLettersArray) {
			characterContainer = document.createElement('span');
			array = this.getLettersArray[i];

			// display a whitespace
			if (array === ' ') {
					characterContainer.innerHTML = '&nbsp';
			}

			characterContainer.classList.add('randomCharacter');
			element.appendChild(characterContainer);

			var letter = document.createTextNode(array);

			// ♫ one mooore hack ♫
			characterContainer.appendChild(letter);
			characterContainer.style.opacity = '0';
		}

	},

	/**
	 * @function _setKerning
	 * @description adapt the letter spacing
	 * @description very useful if you're not using a monospace font
	 * @description don't try to delete this function
	 * @description except if you want new eyes
	 * @private
	 *
	 */

	_setKerning: function() {

		var kerning = this.options.d_kerning;
		var elem = document.querySelector(this.options.d_element);

		var i, j, thisContainer, array, kerningSize;

		for (i = 0; i < this.getLettersArray.length; i++) {
			j = i + 1; //hack
			thisContainer = elem.querySelector('.randomCharacter:nth-child(' + j + ')');
			thisContainer.style.padding = (Math.sqrt(kerning) / thisContainer.offsetWidth)-2 + 'px';
			kerningSize = thisContainer.offsetWidth;
			this.kerningSize.push(kerningSize);
			thisContainer.style.width = kerningSize+(Math.sqrt(kerningSize)) + 'px';
		}
	},

	/**
	 * @function _convertStringToArray
	 * @description transform every string to an array
	 * @description useful if you want to use your own character to generate the animation
	 * @param charType 	| type of character
	 * @private
	 *
	 */

	_convertStringToArray: function(charType) {
		var i, thisChar;
		for (i = 0; i < this.char.length; i++) {
				thisChar = this.char[i];
				this.charArray.push(thisChar);
		}
	},

	/**
	 * @function _setChange
	 * @description set when each letter will change until the end of the animation
	 * @private
	 *
	 */

	_setChange: function() {
		var i, setChange;

		for (i in this.getLettersArray) {
				setChange = this._random(this.options.d_min, this.options.d_max);
				this.getLettersChanges.push(setChange);
		}
	},

	/**
	 * @function _generateRandomCharacter
	 * @description the core of the animation
	 * @description generate a new character randomly
	 * @descritpion everytime the function is called
	 * @param charType 	| type of character
	 * @private
	 *
	 */

	_generateRandomCharacter: function() {

		var charType = this.options.d_type;
		var elem = document.querySelector(this.options.d_element);

		this.currentChange++;

		var chooseRandomLetter = this._random(0, this.getLettersArray.length);
		var generateContent, setContent, getChar;
		var changesPlaces = elem.querySelector('.randomCharacter:nth-child(' + (chooseRandomLetter + 1) + ')');

		if (charType === 'int') {
				generateContent = this._random(0, 9);
		} else if (charType === 'char') {
				getChar = this._random(0, this.charArray.length);
				generateContent = this.charArray[getChar];
		} else {
				getChar = this._random(0, charType.length);
				generateContent = charType[getChar];
		}

		changesPlaces.innerHTML = generateContent;
		changesPlaces.style.opacity = '1';
		elem.style.opacity = '1'

	},

	/**
	 * @function _checkNbChanges
	 * @description check the current number of changes
	 * @descritpion everytime the function is called
	 * @description and display the original letter asap.
	 * @private
	 *
	 */

	_checkNbChanges: function() {
		var i, j, k, thisChar, setContent, thisContainer;
		var elem = document.querySelector(this.options.d_element);

		for (i = 0; i < this.getLettersArray.length; i++) {
			j = i + 1; //hack
			thisChar = this.getLettersChanges[i];
			thisContainer = elem.querySelector('.randomCharacter:nth-child(' + j + ')');
			setContent = this.getLettersArray[i];

			if (this.currentChange > thisChar) {
					thisContainer.innerHTML = setContent;
			}
		}
	},

	/**
	 * @function _loop
	 * @description requestAnimationFrame
	 * @private
	 *
	 */

	_loop: function() {

	var self = this;

	this.requestId = requestAnimationFrame(function() {
			self._loop();

			if (self.currentChange > self.options.d_max*1.5) {
					self.stop();
			}

		});

		self._generateRandomCharacter(self.options.d_type);
		self._checkNbChanges();

	},

	// Public functions

	/**
	 * @function restart
	 * @description allows to restart the animation.
	 * @description useful for hover or else
	 * @param key 	| allows a key to restart the animation
	 * @default 		| false
	 * @public
	 *
	 */

	restart: function() {
		this.currentChange = 0;
		this._setChange();
		this._loop();
	},

	/**
	 * @function start
	 * @description trigger the animation
	 * @public
	 *
	 */

	start: function() {

		this._getElementSize();
		this._setStructure();
		this._setKerning();
		this._setChange();
		this._convertStringToArray();

		this._loop();

	},

	/**
	 * @function stop
	 * @description stop the requestAnimaionFrame #notEnoughObvious ♫ ♫
	 * @public
	 *
	 */

	stop: function() {
		window.cancelAnimationFrame(this.requestId);
	}

};


// var yourVar = new RandomCharacterAnimation({
//     //parameters
//     d_element : '.random',
//     d_kerning : 1650
// });

// yourVar.start();

/**
 * @example
 * @description usage of the plugin with a list of element in the same level
 *
 */

// Multiple Usage - For example for list
// var animations = [
// 	{
// 		d_element 	: '.Linkedin',
// 		d_min 		: 25,
// 		d_max		: 50,
// 	},
// 	{
// 		d_element 	: '.Dribbble',
// 		d_min 		: 25,
// 		d_max		: 50,
// 	},
// 	{
// 		d_element 	: '.Behance',
// 		d_min 		: 25,
// 		d_max		: 50,
// 	},
// 	{
// 		d_element 	: '.Codepen',
// 		d_min 		: 25,
// 		d_max		: 50,
// 	},
// 	{
// 		d_element 	: '.Github',
// 		d_min 		: 25,
// 		d_max		: 50,
// 	}
// ]

// var obj = [];

// for (var optionsAnim in animations) {
// 	var random = new RandomCharacterAnimation(animations[optionsAnim]);
// 	random.start();
// 	obj.push(random);
// }

/**
 * @function getIndexOfElementInParent
 * @param element 	| selected node element. best use is like is event.target.parentNode
 * because if you this function it means that most probably there are others same
 * element in the same level
 * @description this function get the index of the selected element
 * @public
 *
 */

// function getIndexOfElementInParent(element){
// 	var parent = element.parentNode;
// 	for (var index = 0; index <= parent.children.length - 1; index++){
// 		if(parent.children[index] === element){
// 			return index;
// 		}
// 	}
// };

// *
//  * @function newEvent
//  * @param selected_element_class 	| this is too obvious, and it's a string.
//  * @param _event 					| event, for example 'mouseenter'
//  * @description this function is just an example. Feel free to
//  * create your own function
//  * @public
//  *

// function newEvent(selected_element_class, _event){
// 	var items = document.querySelectorAll(selected_element_class);
// 	for (var i = 0; i <= items.length - 1; i++){
// 		items.item(i).addEventListener(_event, function(event) {
// 			// call getIndexOfElementInParent
// 			var currentItemIndex = getIndexOfElementInParent(event.target.parentNode)
// 			obj[currentItemIndex].restart();
// 		}, false);
// 	}
// };
// newEvent('.item-link','mouseenter');
