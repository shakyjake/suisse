(() => {
	
	let Held = false;
	
	function InputIncrement(Input, ToAdd, Recursive){
		Recursive = typeof(Recursive) === 'boolean' ? Recursive : false;
		let Value = '' + Input.value;
		if(!Value.length){
			let Min = '' + Input.min;
			if(!Min.length){
				Input.value = 0;
			} else {
				Input.value = Min;
			}
		} else {
			Value = parseFloat(Value);
			Value += ToAdd;
			let Min = '' + Input.min;
			if(!!Min.length){
				Min = parseFloat(Min);
				if(Value < Min){
					Value = Min;
					Recursive = false;
				}
			}
			let Max = '' + Input.max;
			if(!Max.length){
				Max = parseFloat(Max);
				if(Value > Max){
					Value = Max;
					Recursive = false;
				}
			}
			Input.value = Value;
		}
		if(Recursive && Held){
			window.requestAnimationFrame(function(){
				InputIncrement(Input, ToAdd, Recursive);
			});
		}
	}
	
	function PlusButtonClick(event){
		event.stopImmediatePropagation();
		const Input = event.target.previousSibling;
		let Step = '' + Input.step;
		if(Step.length){
			Step = parseFloat(Step);
		} else {
			Step = 1;
		}
		InputIncrement(Input, Step);
	}
	
	function PlusButtonMouseUp(event){
		event.stopImmediatePropagation();
		Held = null;
		document.removeEventListener('mouseup', PlusButtonMouseUp);
		document.removeEventListener('touchend', PlusButtonMouseUp);
	}
	
	function PlusButtonMouseDown(event){
		event.stopImmediatePropagation();
		Held = event.target.previousSibling;
		document.addEventListener('mouseup', PlusButtonMouseUp);
		document.addEventListener('touchend', PlusButtonMouseUp);
		let Step = '' + Held.step;
		if(Step.length){
			Step = parseFloat(Step);
		} else {
			Step = 1;
		}
		((Step) => {
			setTimeout(function(){
				InputIncrement(Held, Step, true);
			}, 300);
		})(Step);
	}
	
	function MinusButtonClick(event){
		event.stopImmediatePropagation();
		const Input = event.target.nextSibling;
		let Step = '' + Input.step;
		if(Step.length){
			Step = parseFloat(Step) * -1;
		} else {
			Step = -1;
		}
		InputIncrement(Input, Step);
	}
	
	function MinusButtonMouseUp(event){
		event.stopImmediatePropagation();
		document.removeEventListener('mouseup', MinusButtonMouseUp);
		document.removeEventListener('touchend', MinusButtonMouseUp);
		Held = null;
	}
	
	function MinusButtonMouseDown(event){
		event.stopImmediatePropagation();
		Held = event.target.nextSibling;
		document.addEventListener('mouseup', MinusButtonMouseUp);
		document.addEventListener('touchend', MinusButtonMouseUp);
		let Step = '' + Held.step;
		if(Step.length){
			Step = parseFloat(Step) * -1;
		} else {
			Step = -1;
		}
		((Step) => {
			setTimeout(function(){
				InputIncrement(Held, Step, true);
			}, 300);
		})(Step);
	}

	const NumberInputs = document.querySelectorAll('.input--number');
	
	NumberInputs.forEach((Input) => {
		
		/*
		
			Note: Don't change the input type - we just want to style the (de)?increment buttons, not break the semantics or accessibility
		
		*/
		
		const Minus = document.createElement('button');
		Minus.className = 'number-increment number-increment--negative';
		Minus.type = 'button';
		Minus.appendChild(document.createTextNode('-'));
		Minus.addEventListener('click', MinusButtonClick);
		Minus.addEventListener('tap', MinusButtonClick);
		Minus.addEventListener('mousedown', MinusButtonMouseDown);
		Minus.addEventListener('touchstart', MinusButtonMouseDown);
		Input.parentNode.insertBefore(Minus, Input);
		
		const Plus = document.createElement('button');
		Plus.className = 'number-increment number-increment--positive';
		Plus.type = 'button';
		Plus.appendChild(document.createTextNode('+'));
		Plus.addEventListener('click', PlusButtonClick);
		Plus.addEventListener('tap', PlusButtonClick);
		Plus.addEventListener('mousedown', PlusButtonMouseDown);
		Plus.addEventListener('touchstart', PlusButtonMouseDown);
		Input.parentNode.insertBefore(Plus, Input.nextSibling);
		
		Input.classList.add('input--number-js');
		
	});

})();