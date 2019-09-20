
function ExpandAnswer(event){
	event.stopImmediatePropagation();
	const Question = event.target;
	const Answer = Question.nextElementSibling;
	Question.className = Question.className === 'open' ? '' : 'open';
	Answer.style.height = Answer.style.height === '0px' ? Question.dataset.answerheight + 'px' : '0px';
}

(() => {
	document.querySelectorAll('.faq dt').forEach((Question) => {
		if(!!Question.nextElementSibling){
			Question.dataset.answerheight = Question.nextElementSibling.clientHeight;
			Question.nextElementSibling.style.height = '0px';
			Question.addEventListener('click', ExpandAnswer);
			Question.addEventListener('tap', ExpandAnswer);
		}
	});
})();