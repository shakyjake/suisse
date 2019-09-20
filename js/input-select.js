
function Relevance(Search, Value){

	const IgnoreCase = true;
	const IgnorePunctuation = true;
	
	let Needle = Search;
	let Haystack = Value;
	
	if(IgnoreCase){
		Needle = Needle.toLowerCase();
		Haystack = Haystack.toLowerCase();
	}
	
	if(IgnorePunctuation){
		Needle = Needle.replace(/[^\da-z]+/, '');
		Haystack = Haystack.replace(/[^\da-z]+/, '');
	}
	
	if(!Search.length) {
		return 10001;
	}
	
	if(!Value.length) {
		return 10002;
	}

	if(Needle === Haystack){
		return 0;
	}
	
	if(Haystack.length > Needle.length && Haystack.substring(0, Needle.length) === Needle){
		return 100 + Haystack.length - Needle.length;
	}
	
	let i = Needle.length - 1;
	let Trim = Needle;
	while(i){
		Trim = Trim.substring(0, i);
		i -= 1;
		if(Haystack.length > Trim.length && Haystack.substring(0, Trim.length) === Trim.length){
			return 2000 + Haystack.length - Trim.length;
		}
	}
	
	let RE = new RegExp('[^' + Needle + ']+', 'g');
	
	Trim = Haystack.replace(RE, '');
	
	if(Trim.length < Haystack.length){
		return 4000 + (1000 - Trim.length);
	}
	
	return 10003;

}

function OptionSearch(event){

	const Search = event.target;
	
	const Options = Search.parentNode.querySelectorAll('.panel a');
	
	const NewOrder = [];
	
	Options.forEach((Option) => {
		NewOrder.push({
			"Node" : Option,
			"Text" : Option.textContent,
			"NewOrder" : Relevance(Search.value, Option.textContent)
		});
	});
	
	NewOrder.sort((a, b) => {
		if(a.NewOrder === b.NewOrder){
			return parseInt(a.Node.dataset.defaultOrder) - parseInt(b.Node.dataset.defaultOrder);
		}
		return a.NewOrder - b.NewOrder;
	});
	
	NewOrder.forEach((Option) => {
		Option.Node.parentNode.appendChild(Option.Node);
	});

}

function OptionSelect(event){
	
	event.stopImmediatePropagation();
	
	const Link = event.target;
	
	const Search = Link.parentNode.parentNode.querySelector('[type=search]');
	
	Search.value = Link.innerHTML;
	
	const Value = Link.parentNode.parentNode.querySelector('[type=hidden]');
	
	Value.value = Link.dataset.value;
	
}

function BetterSelect(Select){
	
	const ID = Select.id;
	const Name = Select.name;
	
	const Wrap = document.createElement('span');
	Wrap.className = 'select-ish';
	
	Select.parentNode.insertBefore(Wrap, Select.nextSibling);

	const Search = document.createElement('input');
	Search.type = 'search';
	Search.name = Name + '_Search';
	Search.id = ID + '_Search';
	Search.addEventListener('input', OptionSearch);
	if(Select.selectedOptions.length){
		Search.value = Select.selectedOptions[0].innerHTML;
	}
	
	Wrap.appendChild(Search);
	
	const Panel = document.createElement('span');
	Panel.className = 'panel';
	Select.childNodes.forEach((Option, DefaultOrder) => {
		if(Option.nodeName.toLowerCase() === 'option'){
			const Link = document.createElement('a');
			Link.dataset.value = Option.value;
			Link.dataset.defaultOrder = DefaultOrder;
			Link.addEventListener('click', OptionSelect);
			Link.addEventListener('tap', OptionSelect);
			Link.appendChild(document.createTextNode(Option.textContent));
			Panel.appendChild(Link);
		}
	});
	
	Wrap.appendChild(Panel);

	const Value = document.createElement('input');
	Value.type = 'hidden';
	if(Select.selectedOptions.length){
		Value.value = Select.selectedOptions[0].value;
	}
	
	Select.parentNode.removeChild(Select);
	
	Value.name = Name;
	Value.id = ID;
	Wrap.appendChild(Value);

}

(() => {

	const Selects = document.querySelectorAll('.select');
	Selects.forEach(BetterSelect);

})();