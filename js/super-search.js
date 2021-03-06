/* super-search
Author: Kushagra Gour (http://kushagragour.in)
MIT Licensed
*/
(function () {
	var searchFile = '/feed.xml',
		searchEl,
		searchInputEl,
		searchResultsEl,
		currentInputValue = '',
		lastSearchResultHash,
		posts = [],
		htmlEl = document.getElementsByTagName('html')[0];

	// Changes XML to JSON
	// Modified version from here: http://davidwalsh.name/convert-xml-json
	function xmlToJson(xml) {
		// Create the return object
		var obj = {};
		if (xml.nodeType == 3) { // text
			obj = xml.nodeValue;
		}

		// do children
		// If all text nodes inside, get concatenated text from them.
		var textNodes = [].slice.call(xml.childNodes).filter(function (node) { return node.nodeType === 3; });
		if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
			obj = [].slice.call(xml.childNodes).reduce(function (text, node) { return text + node.nodeValue; }, '');
		}
		else if (xml.hasChildNodes()) {
			for(var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (typeof(obj[nodeName]) == "undefined") {
					obj[nodeName] = xmlToJson(item);
				} else {
					if (typeof(obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(xmlToJson(item));
				}
			}
		}
		return obj;
	}

	function getPostsFromXml(xml) {
		var json = xmlToJson(xml);
		return json.channel.item;
	}

	window.toggleSearch = function toggleSearch() {
		searchEl.classList.toggle('is-active');
		if (searchEl.classList.contains('is-active')) {
			// while opening
			searchInputEl.value = '';
			htmlEl.classList.add('noscroll');
		} else {
			// while closing
			searchResultsEl.classList.add('is-hidden');
			htmlEl.classList.remove('noscroll');
		}
		setTimeout(function () {
			searchInputEl.focus();
		}, 210);
	}

	function handleInput() {
		var currentResultHash, d;

		currentInputValue = searchInputEl.value.toLowerCase();
		if (!currentInputValue || currentInputValue.length < 3) {
			lastSearchResultHash = '';
			searchResultsEl.classList.add('is-hidden');
			return;
		}
		searchResultsEl.style.offsetWidth;

		var matchingPosts = posts.filter(function (post) {
			if (post.title.toLowerCase().indexOf(currentInputValue) !== -1 ||
					post.description.toLowerCase().indexOf(currentInputValue) !== -1 ||
					post.category.toLowerCase().indexOf(currentInputValue) !== -1 ||
					(post.hasOwnProperty('keywords') && post.keywords.toLowerCase().indexOf(currentInputValue) !== -1)) {
				return true;
			}
		});
		if (!matchingPosts.length) {
			searchResultsEl.classList.add('is-hidden');
		}
		currentResultHash = matchingPosts.reduce(function(hash, post) { return post.description + hash; }, '');
		if (matchingPosts.length && currentResultHash !== lastSearchResultHash) {
			searchResultsEl.classList.remove('is-hidden');
			searchResultsEl.innerHTML = matchingPosts.map(function (post) {
				return '<li class="grid-25 tablet-grid-33 mobile-grid-100"><a href="' + post.link + '">' + post.title + '</a></li>';
			}).join('');
		}
		lastSearchResultHash = currentResultHash;
	}

	function init(options) {
		searchFile = options.searchFile || searchFile;
		searchEl = document.querySelector(options.searchSelector || '#js-super-search');
		searchInputEl = document.querySelector(options.inputSelector || '#js-super-search__input');
		searchResultsEl = document.querySelector(options.resultsSelector || '#js-super-search__results');

		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open('GET', searchFile);
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState != 4) return;
			if (xmlhttp.status != 200 && xmlhttp.status != 304) { return; }
			var node = (new DOMParser).parseFromString(xmlhttp.responseText, 'text/xml');
			node = node.childNodes[0];
			posts = getPostsFromXml(node);
		}
		xmlhttp.send();

		// Toggle when search icon clicked
		document.querySelector('.toggle-super-search').addEventListener('click', function toggleSuperSearchOnClick(e) {
			e.preventDefault();
			toggleSearch();
		})

		// Close search on ESC press
		window.addEventListener('keyup', function onKeyPress(e) {
			if (e.which === 27) {
				searchEl.classList.remove('is-active');
				searchResultsEl.classList.add('is-hidden');
				htmlEl.classList.remove('noscroll');
			}
		});

		searchInputEl.addEventListener('input', function onInputChange() {
			handleInput();
		});
	}

	init.toggle = toggleSearch;

	window.superSearch = init;
})();
