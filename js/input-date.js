
function IsLeapYear(Year){
	if(Year % 4){
		return false;
	}
	if(!(Year % 400)){
		return true;
	}
	if(!(Year % 100)){
		return false;
	}
	return true;
}

function MonthChanged(event){
	
	const MonthDays = [31,28,31,30,31,30,31,31,30,31,30,31];
	
	const MonthSelect = event.target;
	const Month = parseInt(MonthSelect.selectedOptions[0].value);
	const YearSelect = MonthSelect.parentNode.parentNode.querySelector('.year-select');
	let Year = parseInt(YearSelect.value);
	
	if(!isNaN(Year)){
		if(IsLeapYear(Year)){
			MonthDays[1] = 29;
		}
	}
	
	const DaySelect = MonthSelect.parentNode.parentNode.querySelector('.day-select');
	DaySelect.max = MonthDays[Month - 1];
	if(parseInt(DaySelect.value) > MonthDays[Month - 1]){
		DaySelect.value = MonthDays[Month - 1];
	}
	
	let Final = ['' + Year];
	Final.push(('' + Month).length === 1 ? '0' : '');
	Final[1] += Month;
	Final.push(('' + DaySelect.value).length === 1 ? '0' : '');
	Final[2] += DaySelect.value;
	
	const RealValue = MonthSelect.parentNode.parentNode.querySelector('.date-input-hidden');
	
	RealValue.value = Final.join('-');
	
}

function DayChanged(event){
	const MonthSelect = event.target.parentNode.parentNode.querySelector('.month-select');
	MonthChanged({target : MonthSelect});
}

function YearChanged(event){
	const MonthSelect = event.target.parentNode.parentNode.querySelector('.month-select');
	MonthChanged({target : MonthSelect});
}

function DateValid(DateString){
	const RE = new RegExp('^\\d{4}\\-\\d{2}\\-\\d{2}$');
	return RE.test(DateString);
}

function SetDateInitial(MonthChooser){

	let CurrentValue = MonthChooser.parentNode.parentNode.querySelector('.date-input-hidden').value;
	
	let CurrentDate = new Date();
	
	if(CurrentValue.length){
		if(DateValid(CurrentValue)){
			const Parts = CurrentValue.split('-');
			CurrentDate = new Date(parseInt(Parts[0]), parseInt(Parts[1]) - 1, parseInt(Parts[2]));
		}
	}
	
	MonthChooser.selectedOptions[0].selected = false;
	MonthChooser.children[CurrentDate.getMonth()].selected = true;
	
	const DayChooser = MonthChooser.parentNode.parentNode.querySelector('.day-select');
	DayChooser.value = CurrentDate.getDate();
	
	const YearChooser = MonthChooser.parentNode.parentNode.querySelector('.year-select');
	YearChooser.value = CurrentDate.getFullYear();

}

(() => {
	
	const DayChoosers = document.querySelectorAll('.day-select');
	DayChoosers.forEach((Day) => {
		Day.addEventListener('change', DayChanged);
	});
	
	const MonthChoosers = document.querySelectorAll('.month-select');
	MonthChoosers.forEach((Month) => {
		Month.addEventListener('change', MonthChanged);
		SetDateInitial(Month);
	});
	
	const YearChoosers = document.querySelectorAll('.year-select');
	YearChoosers.forEach((Year) => {
		Year.addEventListener('change', YearChanged);
		YearChanged({target : Year});
	});
	
})();