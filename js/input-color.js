
let ColourPicker = function(InputNode){
	
	const _ = this;
	
	_.Input = InputNode;
	
	_.Updating = false;
	
	_.Stagger = function(CallBack){
		try {
			window.requestAnimationFrame(CallBack);
		} catch(e){
			setTimeout(CallBack, 50);/* Old browser; probable old hardware; target 20fps */
		}
	};
	
	_.FullOffsetLeft = function(Node){
		if(!Node.offsetParent){
			return Node.offsetLeft;
		}
		
		if(Node.offsetParent.nodeName.toLowerCase() === 'body'){
			return Node.offsetLeft;
		}
		
		return Node.offsetLeft + _.FullOffsetLeft(Node.offsetParent);
	};
	
	_.FullOffsetTop = function(Node){
		if(!Node.offsetParent){
			return Node.offsetTop;
		}
		
		if(Node.offsetParent.nodeName.toLowerCase() === 'body'){
			return Node.offsetTop;
		}
		
		return Node.offsetTop + _.FullOffsetTop(Node.offsetParent);
	};
	
	_.GetShade = function(event){
		
		let Coord = event.pageX - _.FullOffsetLeft(_.Shade);
		Coord = Math.max(Coord, 0);
		Coord = Math.min(Coord, _.Shade.clientWidth);
		
		let Shade = Math.floor(((Coord / _.Shade.clientWidth) * 255)).toString(16);
		
		if(Shade.length === 1){
			Shade = '0' + Shade;
		}
		_.Input.value = '#' + Shade + Shade + Shade;
		_.ColourChanged();
		
	};
	
	_.GetColour = function(event){
		
		const PaletteDimensions = [_.Palette.offsetWidth, _.Palette.offsetHeight];
		
		const PaletteOffset = [_.FullOffsetLeft(_.Palette), _.FullOffsetTop(_.Palette)];
		
		const CursorPoints = [event.pageX - PaletteOffset[0], event.pageY - PaletteOffset[1]];
		
		CursorPoints[0] = Math.max(CursorPoints[0], 0);
		if(CursorPoints[0] > PaletteDimensions[0]){
			CursorPoints[0] = 0;
		}
		
		CursorPoints[1] = Math.max(CursorPoints[1], 0);
		CursorPoints[1] = Math.min(CursorPoints[1], PaletteDimensions[1]);
		
		const RGBA = _.ShadowContext.getImageData(parseInt((CursorPoints[0] / PaletteDimensions[0]) * _.ShadowPalette.width), parseInt((CursorPoints[1] / PaletteDimensions[1]) * _.ShadowPalette.height), 1, 1).data;
		
		_.Input.value = _.RGBToHex(RGBA[0], RGBA[1], RGBA[2]);
		
		_.ColourChanged();
		
	};
	
	_.IntToHex = function(Int){
		Int = Int.toString(16);
		if(Int.length === 1){
			Int = '0' + Int;
		}
		return Int;
	};
	
	_.RGBToHex = function(RR, GG, BB){
		RR = _.IntToHex(RR);
		GG = _.IntToHex(GG);
		BB = _.IntToHex(BB);
		return '#' + RR + GG + BB;
	};
	
	_.ColourChanged = function(){
		
		let Value = _.Input.value;
		
		if(Value !== Value.toLowerCase()){
			Value = Value.toLowerCase();
		}
		
		const ColourMatch = new RegExp(/^#[\da-f]{6}$/);
		
		if(!ColourMatch.test(Value)){
			const ShortColourMatch = new RegExp(/^#([\da-f])([\da-f])([\da-f])$/);
			if(ShortColourMatch.test(Value)){
				Value = Value.replace(ShortColourMatch, '#$1$1$2$2$3$3');
			} else {
				Value = '#000000';
			}
		}
		_.Input.value = Value;
		_.VisualOutput.style.backgroundColor = Value;
		_.Updating = false;
	};
	
	_.ColourMouseUp = function(){
		document.removeEventListener('mousemove', _.ColourMouseMove);
		document.removeEventListener('mouseup', _.ColourMouseUp);
	};
	
	_.ColourMouseMove = function(event){
		if(!_.Updating){
			_.Updating = true;
			_.Stagger(function(){
				_.GetColour(event);
			});
		}
	};
	
	_.ColourMouseDown = function(){
		document.addEventListener('mousemove', _.ColourMouseMove);
		document.addEventListener('mouseup', _.ColourMouseUp);
	};
	
	_.ShadeMouseUp = function(){
		document.removeEventListener('mousemove', _.ShadeMouseMove);
		document.removeEventListener('mouseup', _.ShadeMouseUp);
	};
	
	_.ShadeMouseMove = function(event){
		if(!_.Updating){
			_.Updating = true;
			_.Stagger(function(){
				_.GetShade(event);
			});
		}
	};
	
	_.ShadeMouseDown = function(){
		document.addEventListener('mousemove', _.ShadeMouseMove);
		document.addEventListener('mouseup', _.ShadeMouseUp);
	};
	
	_.Setup = function(){
		
		const Panel = document.createElement('div');
		Panel.className = 'colour-picker';
		
		_.Palette = document.createElement('div');
		_.Palette.className = 'picker picker--rgb';
		Panel.appendChild(_.Palette);
		
		_.Shade = document.createElement('div');
		_.Shade.className = 'picker picker--shade';
		Panel.appendChild(_.Shade);
		
		const Output = document.createElement('div');
		Output.className = 'colour-picker-output';
		
		_.Input.type = 'text';
		_.Input.addEventListener('change', _.ColourChanged);
		_.Input.className = 'input--color-output';
		
		_.VisualOutput = document.createElement('div');
		_.VisualOutput.className = 'active-colour';
		Output.appendChild(_.VisualOutput);
		
		Panel.appendChild(Output);
		
		_.Input.parentNode.appendChild(Panel);
		Output.appendChild(_.Input);
		
		_.ShadowPalette = document.createElement('canvas');
		_.ShadowPalette.width = 1000;
		_.ShadowPalette.height = 1000;
		_.ShadowContext = _.ShadowPalette.getContext('2d');
		
		const GradientColour = _.ShadowContext.createLinearGradient(0, 0, 1000, 0);
		GradientColour.addColorStop(0, '#f00');
		GradientColour.addColorStop(1/6, '#ff0');
		GradientColour.addColorStop(2/6, '#0f0');
		GradientColour.addColorStop(3/6, '#0ff');
		GradientColour.addColorStop(4/6, '#00f');
		GradientColour.addColorStop(5/6, '#f0f');
		GradientColour.addColorStop(1, '#f00');
		
		_.ShadowContext.fillStyle = GradientColour;
		_.ShadowContext.fillRect(0, 0, 1000, 1000);
		
		const GradientBlack = _.ShadowContext.createLinearGradient(0, 0, 0, 1000);
		GradientBlack.addColorStop(0, 'rgba(0,0,0,0)');
		GradientBlack.addColorStop(1/2, 'rgba(0,0,0,0)');
		GradientBlack.addColorStop(1, 'rgba(0,0,0,1)');
		
		_.ShadowContext.fillStyle = GradientBlack;
		_.ShadowContext.fillRect(0, 0, 1000, 1000);
		
		const GradientWhite = _.ShadowContext.createLinearGradient(0, 0, 0, 1000);
		GradientWhite.addColorStop(0, 'rgba(255,255,255,1)');
		GradientWhite.addColorStop(1/2, 'rgba(255,255,255,0)');
		GradientWhite.addColorStop(1, 'rgba(255,255,255,0)');
		
		_.ShadowContext.fillStyle = GradientWhite;
		_.ShadowContext.fillRect(0, 0, 1000, 1000);
		
		_.Palette.addEventListener('click', _.GetColour);
		_.Palette.addEventListener('mousedown', _.ColourMouseDown);
		_.Shade.addEventListener('click', _.GetShade);
		_.Shade.addEventListener('mousedown', _.ShadeMouseDown);
	
		_.ColourChanged();
		
	};
	
	_.Setup();
	
};
	
(() => {
	
	const ColourInputs = document.querySelectorAll('.input--color');
	
	ColourInputs.forEach((Input) => {
		new ColourPicker(Input);
	});
	
})();