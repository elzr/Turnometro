var TM = {
	start:60,
	sound: new Audio('http://www.w3schools.com/html/horse.mp3'),
	set:function(t) {
		T.data('seconds', t);
		TM.format();
	},
	decrement:function(t) {
		TM.set( TM.get() - 1 );
	},
	get:function() {
		return parseInt( T.data('seconds') );
	},
	format:function() {
		var count = TM.get();
		T.text( count );

		if( Math.abs(count) > 60 ) {
			var seconds = (Math.abs(count) % 60);
			seconds = seconds < 10 ? '0'+seconds : seconds;
			T.text( (count < 0 ? '-' : '') + Math.floor(Math.abs(count)/60) +':'+ seconds );
		} else if((count >= 0) && (count < 10) && (T.text().length == 1)) {
			T.text( 0+T.text() );
		}
	},

	tick:function() {
		TM.interval = setInterval(function() {
			TM.decrement();
			document.title = "Turno " + TM.get();
			$('.bar .progress').css('height', Math.ceil((TM.get() / TM.start)*100)+'%');
			TM.style();
		}, 1000);
	},
	style:function() {
		var count = TM.get();
		var half = Math.ceil(TM.start/2);

		TM.resetClasses();

		TM.resize( count > 60 ? 3 : 2 );
		if ( count <= 60 ) {
			//console.log( '2!' );
		}

		if( count > half ) {
			$('body').addClass('running');
			$('body').addClass();
		} else if( (count > 0) && (count <= half) && (count > 10)) {
			$('body').addClass('half');
		} else if(count <= 10) {
			$('body').addClass('almost');
			if((count <= 0) && (count > -10)) {
				TM.resize(2);
				$('body').toggleClass('over');
			} 
			if(count == 0) {
				TM.zero();
			}
			if(count <= -10) {
				TM.resize(3);
				$('body').toggleClass('over');
			}
			if(count <= -599) {
				//clearInterval(TM.interval);
			}
		}
	},
	zero:function() {
		TM.sound.play();
	},
	play:function() {
		if($('body').hasClass('paused')) {
			TM.style();
			TM.tick();
		} else {
			TM.reset();
		}
	},
	reset:function() {
		clearInterval(TM.interval);
		TM.set( TM.start );
		T.css('marginTop', 0);
		$('.bar .progress').css('height', '100%');
		TM.style();

		TM.resetClasses();
		$('body').addClass('paused');
	},
	resetClasses:function() {
		$('body').removeClass('paused running half almost over');
	},
	resize:function(fit) {
		var fitted = Math.min($(window).height()*0.8, (TM.heightWidthProportion*$(window).width())/fit);
		if(fit > 2) {
			fitted *= 0.7
		}
		T.css({
			fontSize: fitted,
			marginTop: ($(window).height() - fitted)/( fit == 3 ? 3 : 5) //hack to get a better margin
		});
		return fitted;
	},
	boot:function() {
		TM.start = parseInt(window.location.hash.substr(1)) || 60;
		document.title = "Turno " + TM.start;
		$('span').text(TM.start);
		TM.set( TM.start );
		$('body, .playStop').click( TM.play ).dblclick( TM.reset );
		TM.heightWidthProportion = 10/($('span').width()/(TM.start > 60 ? 4 : 2));
		TM.resize( TM.start > 60 ? 3 : 2 );
	}
};

$(function() {
	T = $('span.digits');
	TM.boot();
});
