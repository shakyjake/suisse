
function SortTableRows(event){
	
	event.stopImmediatePropagation();
	
	const Header = event.target;
	
	let SortOrder = 1;/* ascending */
	
	const Current = Header.parentNode.querySelector('[data-sort]');
	if(!!Current){
		if(Current === Header){
			SortOrder = Header.dataset.sort === 'asc' ? -1 : 1;/* Toggle (As|De)scending */
		} else {
			Current.removeAttribute('data-sort');
		}
	}
	
	Header.setAttribute('data-sort', SortOrder === 1 ? 'asc' : 'desc');
	
	const Index = Header.cellIndex;
	
	const Rows = Header.parentNode.parentNode.nextElementSibling.children;
	
	const Values = [];
	
	let i = Rows.length;
	
	let TextMode = false;
	
	while(i){
		i -= 1;
		Values.push({
			"Row" : Rows[i],
			"Value" : Rows[i].children[Index].textContent,
			"OldIndex" : Rows[i].rowIndex
		});
		TextMode = TextMode || isNaN(parseFloat(Rows[i].children[Index].textContent));
	}
	
	if(TextMode){
	
		Values.sort((a, b) => {
			if(a.Value < b.Value){
				return -1 * SortOrder;
			}
			if(a.Value > b.Value){
				return 1 * SortOrder;
			}
			return 0;
		});
	
	} else {
	
		Values.sort((a, b) => {
			if(parseFloat(a.Value) < parseFloat(b.Value)){
				return -1 * SortOrder;
			}
			if(parseFloat(a.Value) > parseFloat(b.Value)){
				return 1 * SortOrder;
			}
			return 0;
		});
	
	}
	
	Values.forEach((Val) => {
		Val.Row.parentNode.appendChild(Val.Row);
	});
	
}

(() => {
	document.querySelectorAll('th[scope=col]').forEach((Header) => {
		Header.addEventListener('click', SortTableRows);
		Header.addEventListener('tap', SortTableRows);
	});
})();