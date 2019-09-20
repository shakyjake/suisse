function AnimateScroll(Element, TargetScroll, Duration, StartScroll, StartTime){
	Duration = typeof(Duration) === 'number' ? Duration : 100;
	StartScroll = typeof(StartScroll) === 'number' ? StartScroll : Element.scrollLeft;
	StartTime = typeof(StartTime) === 'number' ? StartTime : Date.now();
	
	const Ratio = Math.min((Date.now() - StartTime) / Duration, 1);
	
	Element.scrollLeft = StartScroll + ((TargetScroll - StartScroll) * Ratio);
	
	if(Ratio < 1){
		window.requestAnimationFrame(function(){
			AnimateScroll(Element, TargetScroll, Duration, StartScroll, StartTime);
		});
	}
	
}

function MovePrevious(event){
	event.stopImmediatePropagation();
	
	const Carousel = event.target.parentNode.querySelector('.carousel');
	let ToScroll = parseInt(Carousel.dataset.scrollMagnitude);
	if(isNaN(ToScroll)){
		ToScroll = 1;
	}
	
	let TargetScroll = Carousel.scrollLeft - ((Carousel.scrollWidth / Carousel.children.length) * ToScroll);
	
	if(Carousel.scrollLeft <= 0){
		TargetScroll = Carousel.scrollLeftMax;
	} else if(TargetScroll < 0){
		TargetScroll = 0;
	}
	
	AnimateScroll(Carousel, TargetScroll);
}

function MoveNext(event){
	event.stopImmediatePropagation();
	
	const Carousel = event.target.parentNode.querySelector('.carousel');
	let ToScroll = parseInt(Carousel.dataset.scrollMagnitude);
	if(isNaN(ToScroll)){
		ToScroll = 1;
	}
	
	let TargetScroll = Carousel.scrollLeft + ((Carousel.scrollWidth / Carousel.children.length) * ToScroll);
	
	if(TargetScroll >= Carousel.scrollWidth || (TargetScroll >= Carousel.scrollLeftMax && ToScroll === 1)){
		TargetScroll = 0;
	} else if(TargetScroll >= Carousel.scrollLeftMax){
		TargetScroll = Carousel.scrollLeftMax;
	}
	
	AnimateScroll(Carousel, TargetScroll);
}

function AddArrows(Container){
	
	const Previous = document.createElement('button');
	Previous.appendChild(document.createTextNode('‹'));
	Previous.className = 'previous carousel-arrow';
	Previous.type = 'button';
	Previous.addEventListener('click', MovePrevious);
	Previous.addEventListener('tap', MovePrevious);
	Container.parentNode.insertBefore(Previous, Container);
	
	const Next = document.createElement('button');
	Next.appendChild(document.createTextNode('›'));
	Next.className = 'next carousel-arrow';
	Next.type = 'button';
	Next.addEventListener('click', MoveNext);
	Next.addEventListener('tap', MoveNext);
	Container.parentNode.insertBefore(Next, Container);
	
}

(() => {
	document.querySelectorAll('.carousel').forEach((Carousel) => {
		AddArrows(Carousel);
	});
})();