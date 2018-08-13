function doBanner() {

	TweenMax.to([d('loader'),d('fader')], 0.5, {autoAlpha:0})

	function frame_1() {
		//d('interior').style.opacity ='1';
		TweenMax.to(d('textbacker'), 0.75, {y:"+=130", ease:Sine.easeInOut, delay:1});
		TweenMax.from(d('splitholder'), 0.75, {y:"-=50", ease:Sine.easeInOut, delay:1});
		TweenMax.to(d('interior'), 1, {autoAlpha:1, delay:1.25});
		TweenMax.to(d('interior'), 5.5, {scale:1.1, ease:Sine.easeIn, delay:1});
		TweenMax.to([d('logo'),d('ctaContainer')], 0.5, {autoAlpha:1, delay:2});
		TweenMax.to(d('headline1'), 0.5, {autoAlpha:1, delay:3});
		TweenMax.to(d('interior'), 1, {autoAlpha:0, delay:5.5});
		TweenMax.delayedCall(6, frame_2);
	};

	function frame_2() {
		TweenMax.to(d('carscene'), 1, {autoAlpha:1});
		TweenMax.to(d('carscene'), 5.5, {scale:1.1, ease:Sine.easeInOut});
		TweenMax.to(d('headline1'), 0.5, {autoAlpha:0, delay:0});
		TweenMax.to(d('headline2'), 0.5, {autoAlpha:1, delay:1});
		TweenMax.delayedCall(4, frame_3);
	}

	function frame_3() {
		TweenMax.to(d('headline2'), 0.5, {autoAlpha:0});
		TweenMax.to(d('headline3'), 0.5, {autoAlpha:1, delay:1});
		TweenMax.to(d('subhead3'), 0.5, {autoAlpha:1, delay:2});
		TweenMax.delayedCall(3.5, frame_4);
	}

	function frame_4() {
		TweenMax.to(d('textbacker'), 0.5, {y:"-=130", ease:Sine.easeInOut, delay:0});
		TweenMax.to(d('splitholder'), 0.5, {y:"-=50", ease:Sine.easeInOut, delay:0});
		TweenMax.to(d('carscene'), 1, {autoAlpha:1, delay:0});
		TweenMax.to([d('headline3'),d('subhead3')], 0.5, {autoAlpha:0, delay:0});
		TweenMax.to(d('headline4'), 0.5, {autoAlpha:1, delay:1});
		TweenMax.to(d('award4'), 0.5, {autoAlpha:1, delay:1});
		TweenMax.delayedCall(3.5, frame_5);
	}

	function frame_5() {
		TweenMax.to([d('headline4'),d('award4'),d('ctaContainer')], 0.5, {autoAlpha:0});
		TweenMax.to([d('headline5'),d('carsolo')], 0.5, {autoAlpha:1, delay:1});
		TweenMax.to([d('financeDetail'),d('caveatButton')], 0.5, {autoAlpha:1, delay:1.5});
		TweenMax.delayedCall(1.5, handleCaveat);
		TweenMax.delayedCall(4.5, frame_6);
	}

	function frame_6() {
		TweenMax.to([d('headline5'),d('financeDetail')], 0.5, {autoAlpha:0});
		TweenMax.to([d('headline6'),d('retailer')], 0.5, {autoAlpha:1, delay:1});
		TweenMax.to([d('ctaContainer'),d('caveatBtnContainer')], 0.5, {autoAlpha:1, delay:2});

	}

	frame_1();

}

/// HELPERS

function d(e) {
	return document.getElementById(e);
}

function handleCaveat() {

	d('caveatBtnContainer').addEventListener('click', cavOpen);
	d('closeBtn').addEventListener('click', cavClose);

	function cavOpen(e) { TweenMax.to(d('caveatPanel'), 0.2, {autoAlpha:1}); }
	function cavClose(e) { TweenMax.to(d('caveatPanel'), 0.2, {autoAlpha:0}); }
}