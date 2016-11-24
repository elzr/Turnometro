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
	format:function(start) {
		var count = start || TM.get();
		count = count > 10 ? Math.ceil( count / 10 )*10 : count;
		out = count;

		T.text( out );

		if( Math.abs(count) > 60 ) {
			var seconds = (Math.abs(count) % 60);
			seconds = seconds < 10 ? '0'+seconds : seconds;
			out = (count < 0 ? '-' : '') + Math.floor(Math.abs(count)/60) +':'+ seconds;
		} else if((count >= 0) && (count < 10) && (T.text().length == 1)) {
			out = 0 + T.text();
		}
		T.text( out );

		return out;
	},
	tick:function() {
		TM.interval = setInterval(function() {
			TM.decrement();
			TM.setTitle( TM.get() );
			$('.bar .progress').css('height', Math.ceil((TM.get() / TM.start)*100)+'%');
			TM.style();
		}, 1000);
	},
	style:function() {
		var count = TM.get(), b = $('body');
		var half = Math.ceil( TM.start/2 );

		TM.resetClasses();

		if ( count <= 60 ) {
		}

		if( count > half ) {
			b.addClass('running');
			b.addClass();
		} else if( (count > 0) && (count <= half) && (count > 10)) {
			b.addClass('half');
		} else if(count <= 10) {
			b.addClass('almost');
			if((count <= 0) && (count > -10)) {
				b.toggleClass('over');
			}
			if(count == 0) {
				TM.zero();
			}
			if(count <= -10) {
				b.toggleClass('over');
			}
			if(count <= -599) {
				//clearInterval(TM.interval);
			}
		}

		TM.resize( TM.countToFit( count ));
	},
	countToFit:function(count) {
		var fit = 0;
		if(Math.abs(count) > 60) {
			fit = 3;
		} else {
			fit = 1.2;
		}
		if((count <= 0) && (count > -10)) {
			fit = 1.2
		}
		if(count <= -10) {
			fit = 1.9
		}
		if(count < -60) {
			fit = 2.3
		}
		return fit;
	},
	zero:function() {
		TM.sound.play();
	},
	turnUp:function() { //for what?
		var turns = $('.clock .tally .turns');
		turnsInt = (turns.data('count')||0)+1;
		turns.data( 'count', turnsInt );
		turns.find('em').text( turnsInt );
	},
	play:function(event) {
		// (this.nodeName.toLowerCase() == 'body') && // attempt to fix event bubbling
		if( $('body').hasClass('paused') ) {
			TM.turnUp();
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
		TM.setTitle( TM.start );
	},
	resetClasses:function() {
		$('body').removeClass('paused running half almost over');
	},
	resize:function(fit) {
		var h = $(window).height(), w = $(window).width();
		var fitted = Math.min(h*0.8, (TM.heightWidthProportion*w)/fit);

		//if(fit > 2) {
			//fitted *= 0.7
		//}

		T.css( {
			height:h+'px',
			width:w+'px',
			fontSize:fitted+'px',
		  	lineHeight:h+'px'
		});
		return fitted;
	},
	setTitle:function(count) {
		document.title = (count ? (TM.format(count)+' | ') : '') + "Turnometro"
	},
	boot:function() {
		TM.start = parseInt(window.location.hash.substr(1)) || 60;

		TM.setTitle( TM.start );
		T.text(TM.start);
		TM.set( TM.start );

		$('body, .playStop').click( TM.play ).dblclick( TM.reset );
		TM.heightWidthProportion = 10/($('span').width()/(TM.start > 60 ? 4 : 2));
		TM.resize( TM.countToFit(TM.start) );
	}
};

$(function() {
	T = $('span.digits');
	TM.boot();
});
