
function InlineInputChange(event){
	if(event.target.value.length){
		event.target.classList.add('input--inline--filled');
	} else {
		event.target.classList.remove('input--inline--filled');
	}
}

function InlineInputBind(Input){
	Input.addEventListener('change', InlineInputChange);
	InlineInputChange({
		target : Input
	});
}

(() => {
	const Inputs = document.querySelectorAll('.input--inline');
	Inputs.forEach(InlineInputBind);
})();