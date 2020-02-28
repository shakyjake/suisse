function AnimateScroll(Element, TargetScroll, Duration, StartScroll, StartTime){
	Duration = typeof(Duration) === 'number' ? Duration : 100;
	StartScroll = typeof(StartScroll) === 'number' ? StartScroll : Element.scrollLeft;
	StartTime = typeof(StartTime) === 'number' ? StartTime : Date.now();
	
	let Ratio;
	
	if(Duration){
		Ratio = Math.min((Date.now() - StartTime) / Duration, 1);
	} else {
		Ratio = 1;
	}
	
	Element.scrollLeft = StartScroll + ((TargetScroll - StartScroll) * Ratio);
	
	if(Ratio < 1){
		window.requestAnimationFrame(function(){
			AnimateScroll(Element, TargetScroll, Duration, StartScroll, StartTime);
		});
	}
	
}

function LegendClick(event){
	event.stopImmediatePropagation();
	const Legend = event.target;
	const Fieldset = Legend.parentNode;
	const Holder = Fieldset.parentNode;
	
	const ActiveFieldset = Holder.querySelector('.fieldset--active');
	if(ActiveFieldset){
		ActiveFieldset.classList.remove('fieldset--active');
	}
	
	const ActiveLegend = Holder.querySelector('.legend--active');
	if(ActiveLegend){
		ActiveLegend.classList.remove('legend--active');
	}
	
	Legend.classList.add('legend--active');
	Fieldset.classList.add('fieldset--active');
	
	localStorage.setItem('fieldset-' + Holder.parentNode.dataset.index, Fieldset.dataset.index);
	
	AnimateScroll(Holder, Fieldset.offsetLeft, 200);
}

function SetupFieldset(Fieldset, Index, All){
	
	Fieldset.classList.add('fieldset--js');
	Fieldset.dataset.index = Index;
	
	const Legend = Fieldset.querySelector('legend');
	Legend.style.width = ((1 / All.length) * 100) + '%';
	Legend.style.left = ((Index / All.length) * 100) + '%';
	Legend.classList.add('legend--js');
	Legend.addEventListener('click', LegendClick);
	Legend.addEventListener('tap', LegendClick);
	
	if(Fieldset.querySelectorAll('.validation-error').length){
		Legend.classList.add('fieldset-contains-errors');
	}
	
	if(!Index){
		Fieldset.classList.add('fieldset--active');
		Legend.classList.add('legend--active');
	}
}

function SetupFieldsets(Collection, Index){
	
	const Scroller = document.createElement('div');
	Scroller.className = 'auto-stage-fieldset-scroller';
	Collection.appendChild(Scroller);
	Collection.querySelectorAll('fieldset').forEach((Fieldset) => {
		Scroller.appendChild(Fieldset);
	});
	
	Collection.dataset.index = Index;
	Collection.classList.add('auto-stage-fieldset--js');
	Collection.querySelectorAll('fieldset').forEach(SetupFieldset);
	
	let WasActive = localStorage.getItem('fieldset-' + Index);/* persist form progress through refresh */
	if(WasActive){
		WasActive = parseInt(WasActive);
		if(WasActive){
			const InitFieldset = Collection.querySelector('.fieldset--active');
			if(InitFieldset){
				InitFieldset.classList.remove('fieldset--active');
			}
			const InitLegend = Collection.querySelector('.legend--active');
			if(InitLegend){
				InitLegend.classList.remove('legend--active');
			}
			
			const ActivateFieldset = Collection.querySelectorAll('.fieldset--js')[WasActive];
			if(ActivateFieldset){
				ActivateFieldset.classList.add('fieldset--active');
				const ActivateLegend = ActivateFieldset.querySelector('.legend--js');
				if(ActivateLegend){
					ActivateLegend.classList.add('legend--active');
					AnimateScroll(Collection.querySelector('.auto-stage-fieldset-scroller'), ActivateFieldset.offsetLeft, 0);
				}
			}
		}
	}
	
}

(() => {
	document.querySelectorAll('.auto-stage-fieldset').forEach(SetupFieldsets);
})();