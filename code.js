var TM = {
	start:60,
	sound: new Audio('http://soundbible.com/grab.php?id=1815&type=mp3'),
		//sound: new Audio('http://www.w3schools.com/html/horse.mp3'),
	set:function(t) {
		T.data('seconds', t);
		TM.format();
	},
	decrement:function(t) {
		TM.set( TM.get() - 1 );
	},
	increment:function(t) {
		TM.eventTime.data('seconds', TM.eventTime.data('seconds')+1);
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
			out = (count < 0 ? '-' : '') + Math.floor(Math.abs(count)/60) +':<b></b>'+ seconds;
		} else if((count >= 0) && (count < 10) && (T.text().length == 1)) {
			out = 0 + T.text();
		}
		T.html( out );

		return out;
	},
	heartbeat:function() {
		TM.heartbeatInterval = setInterval(function() {
			TM.increment();
			TM.eventTime.find('em').text( Math.floor(TM.eventTime.data('seconds')/60) );
		}, 1000);
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
				clearInterval(TM.interval);
			}
		}

		TM.resize( TM.countToFit( count ));
	},
	countToFit:function(count) {
		var fit = 0;
		if(Math.abs(count) > 60) {
			fit = 2.6;
		} else {
			fit = 1.25;
		}
		if((count <= 0) && (count > -10)) {
			fit = 1.25
		}
		if(count <= -10) {
			fit = 1.9
		}
		if(count < -60) {
			fit = 3.1
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
		var h = $(window).height(), w = $(window).width(),
			fitted = Math.min(h*0.8, w/fit);

		$('body').removeClass('landscape portrait').addClass( h < w ? 'landscape' : 'portrait');

		T.css( {
			height:h+'px',
			width:w+'px',
			fontSize:fitted+'px',
		  	lineHeight:h+'px'
		});
		return fitted;
	},
	setTitle:function(count) {
		document.title = (count ? (TM.format(count).replace(/<[^>]+>/g,'') +' | ') : '') + "Turnometro"
	},
	boot:function() {
		TM.start = parseInt(window.location.hash.substr(1)) || 60;

		TM.eventTime = $('.eventTime').data('seconds', 0);
		TM.heartbeat();

		TM.setTitle( TM.start );
		T.text(TM.start);
		TM.set( TM.start );
		$('.maxDuration').text( TM.format(TM.start) );

		$('body').click( TM.play ).dblclick( TM.reset );
		var customResize = function() {TM.resize( TM.countToFit(TM.start) )};
		customResize();
		$(window).resize( customResize );
	}
};

$(function() {
	T = $('span.digits');
	TM.boot();
});
