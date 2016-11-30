//Clock related functionality
var TM_CLOCK = {
	start:60,
	step:1,
	sound: {
		beep:new Audio('http://soundbible.com/grab.php?id=1815&type=mp3'),
		muted:false,
	},
	color:{
		muted:false,
	},

	// times *********************************************8
	eventTime:{
		sec:0,
		interval:undefined,
		tick:function() {
			TM.eventTime.interval = setInterval(function() {
				TM.eventTime.sec += 1;
				$('.eventTime').find('em').text( Math.floor(TM.eventTime.sec/60) );
			}, 1000);
		}
	},
	turnTime:{
		sec:0,
		get:function() {
			return parseInt( TM.turnTime.sec );
		},
		set:function(t) {
			TM.turnTime.sec = t;
			$('#digits').html( (TM.clock.format()+'').replace(':', ':<b>_</b>') );
		},
		interval:undefined,
		tick:function() {
			TM.turnTime.interval = setInterval(function() {
				TM.turnTime.set( TM.turnTime.get() - 1 );

				TM.clock.setTitle( TM.turnTime.get() );
				$('#bar .progress').css('height', Math.ceil((TM.turnTime.get() / TM.start)*100)+'%');
				TM.clock.style();
			}, 1000);
		},
		zero:function() {
			if(!TM.sound.muted) {
				TM.sound.beep.play();
			}
		}
	},

	turnUp:function() { //for what?
		var turns = $('#clock .tally .turns');
		turnsInt = (turns.data('count')||0)+1;
		turns.data( 'count', turnsInt );
		turns.find('em').text( turnsInt );
	},


	// times *********************************************8
	clock:{
		boot:function() { var start = TM.start;

			TM.clock.setTitle( start );
			TM.turnTime.set( start );
			$('.maxDuration').text( TM.clock.format(start)+'' );

			var customResize = function() {TM.clock.resize( TM.clock.countToFit(start) )};
			customResize();
			$(window).resize( customResize );

		},
		format:function(start) {
			var count = start || TM.turnTime.get();
			count = count > 10 ? Math.ceil( count / TM.step )*TM.step : count;
			out = count;
			//console.log( 'count', count );

			if( Math.abs(count) > 60 ) {
				var seconds = (Math.abs(count) % 60);
				seconds = seconds < 10 ? ('0'+seconds) : seconds;
				out = (count < 0 ? '-' : '') +
					Math.floor(Math.abs(count)/60) + 
					':' +
					seconds;
			} else if((count >= 0) && (count < 10)) {
				out = '0' + count;
			}

			return out;
		},
		style:function() {
			var count = TM.turnTime.get(), 
				b = $('body'),
				half = Math.ceil( TM.start/2 ),
				almost = TM.start <= 20 ? TM.start*0.25 : 10;

			TM.clock.resetClasses();

			if ( count <= 60 ) {
			}

			if( count > half ) {
				b.addClass('running');
				b.addClass();
			} else if( (count > 0) && (count <= half) && (count > almost)) {
				b.addClass('half');
			} else if(count <= almost) {
				b.addClass('almost');
				if(count == 0) {
					TM.turnTime.zero();
				}
				if(count <= 0) {
					b.toggleClass('over');
				}
				if(count <= -599) {
					clearInterval( TM.turnTime.interval );
				}
			}

			TM.clock.resize( TM.clock.countToFit( count ));
		},
		countToFit:function(count) {
			var fit = 0;
			if(count >= 600) {
				fit = 3.2;
			} else if(Math.abs(count) > 60) {
				fit = 2.6;
			} else {
				fit = 1.25;
			}
			if((count <= 0) && (count > -10)) {
				fit = 1.25;
			}
			if(count <= -10) {
				fit = 1.9;
			}
			if(count < -60) {
				fit = 3.1;
			}
			return fit;
		},
		resize:function(fit) {
			var h = $(window).height(), w = $(window).width(),
				fitted = Math.min(h*0.8, w/fit);

			$('body').removeClass('landscape portrait narrowLandscape').
				addClass( h < w ? 'landscape' : 'portrait').
				addClass( w/h > 1.5 ? 'narrowLandscape' : '' );

			$('#digits').css( {
				height:h+'px',
				width:w+'px',
				fontSize:fitted+'px',
				lineHeight:h+'px'
			} );
			$('#welcome .fork, .name').css({
				height:h+'px',
				width:w+'px'
			});
			return fitted;
		},
		reset:function() {
			if( $('body').attr('id') == 'moderator' ) {
				clearInterval( TM.turnTime.interval );
				TM.turnTime.set( TM.start );
				$('#digits').css('marginTop', 0);
				$('#bar .progress').css('height', '100%');
				TM.clock.style();

				TM.clock.resetClasses();
				$('body').addClass('paused');
				TM.clock.setTitle( TM.start );
			}
		},
		resetClasses:function() {
			$('body').removeClass('paused running half almost over');
		},
		playReset:function(event) {
			// (this.nodeName.toLowerCase() == 'body') && // attempt to fix event bubbling
			if( $('body').attr('id') == 'moderator' ) {
				if( $('body').hasClass('paused') ) {
					TM.turnUp();
					TM.clock.style();
					TM.turnTime.tick();
				} else {
					TM.clock.reset();
				}
			}
		},
		setTitle:function(count) {
			document.title = (count ? (TM.clock.format(count) +' | ') : '') + "Turnometro";
		}
	}
};
