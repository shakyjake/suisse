
function ExpandAnswer(event){
	event.stopImmediatePropagation();
	const Question = event.target;
	const Answer = Question.nextElementSibling;
	const IsOpen = Question.getAttribute('aria-expanded') === 'true';
	
	Question.classList.toggle('question-open');
	Question.setAttribute('aria-expanded', IsOpen ? 'false' : 'true');
	Answer.style.height = IsOpen ? '0px' : Question.dataset.answerHeight + 'px';
}

(() => {
	document.querySelectorAll('.question').forEach((Question) => {
		if(!!Question.nextElementSibling){
			Question.dataset.answerHeight = Question.nextElementSibling.scrollHeight;
			Question.nextElementSibling.style.height = '0px';
			Question.addEventListener('click', ExpandAnswer);
			Question.addEventListener('tap', ExpandAnswer);
		}
	});
})();