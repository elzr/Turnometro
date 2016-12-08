//Clock related functionality
var TM_CLOCK = {
	duration:60,
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
			TM.turnTime.interval = setInterval( TM.turnTime._tick, 1000);
		},
		_tick:function() {
			TM.turnTime.set( TM.turnTime.get() - 1 );

			TM.clock.setTitle( TM.turnTime.get() );
			$('#bar .progress').css('height', Math.ceil((TM.turnTime.get() / TM.duration)*100)+'%');
			TM.clock.style();
		},
		zero:function() {
			if(!TM.sound.muted) {
				TM.sound.beep.play();
			}
		},
		jump:function(sec) { //jump into the river of time
			var subSecDelta = sec - Math.floor(sec);
			setTimeout(function() {
				console.log('subSecDelta!', subSecDelta);
				TM.turnTime.set( TM.duration - sec );

				TM.turnTime._tick();
				TM.turnTime.tick();
			}, subSecDelta*1000);
		}
	},
	turnUp:function(localRemote) { //for what? :P
		var turns = $('#clock .tally .turns');
		turnsInt = (turns.data('count')||0)+1;
		turns.data( 'count', turnsInt );
		turns.find('em').text( turnsInt );

		if(localRemote != 'remote') {
			TM.F.turn.update('start');
		}
	},

	// times *********************************************8
	clock:{
		boot:function() { var duration = TM.duration;

			TM.clock.setTitle( duration );
			TM.turnTime.set( duration );
			$('.maxDuration').text( TM.clock.format(duration)+'' );

			var customResize = function() {TM.clock.resize( TM.clock.countToFit(duration) )};
			customResize();
			$(window).resize( customResize );

		},
		format:function(duration) {
			var count = duration || TM.turnTime.get();
			count = count > 10 ? Math.ceil( count / TM.step )*TM.step : count;
			out = count;
			//console.log( 'count', count );

			if( Math.abs(count) > 60 ) {
				var seconds = (Math.abs(count) % 60);
				seconds = (seconds < 10) ? ('0'+seconds) : seconds;
				out = (count < 0 ? '-' : '') +
					Math.floor(Math.abs(count)/60) + 
					':' +
					seconds;
			} else if((count >= 0) && (count < 10)) {
				out = count;
			}

			return out;
		},
		style:function() {
			var count = TM.turnTime.get(), 
				b = $('body'),
				half = Math.ceil( TM.duration/2 ),
				almost = TM.duration <= 20 ? TM.duration*0.25 : 10;

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
			} else if(count>=10) {
				fit = 1.25;
			} else if((count>=0) && (count<10)) {
				fit = 0.8;
			}

			if((count < 0) && (count > -10)) {
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
				fitted = Math.min(h*0.8, w/fit),
				adjust = 1;

			$('body').removeClass('landscape portrait narrowLandscape').
				addClass( h < w ? 'landscape' : 'portrait').
				addClass( w/h > 1.5 ? 'narrowLandscape' : '' );

			$('.screen, .fork').css({
				height:h+'px',
				width:w+'px'
			});
			
			if( ($('body').attr('id') == 'moderator') && (h > w) ) { //portrait
				//console.log('am moderator');
				//adjust *= 0.5;
				//TM.c.find('#bar').height('50%');
			}

			$('#digits').css( {
				height:(h*adjust)+'px',
				width:w+'px',
				fontSize:(fitted*adjust)+'px',
				lineHeight:((h*0.9)*adjust)+'px'
			} );
			$('#settings').css('height', 'auto');
			return fitted;
		},
		reset:function(localRemote) {
			clearInterval( TM.turnTime.interval );
			TM.turnTime.set( TM.duration );
			$('#digits').css('marginTop', 0);
			$('#bar .progress').css('height', '100%');
			TM.clock.style();

			TM.clock.resetClasses();
			$('body').addClass('paused');
			TM.clock.setTitle( TM.duration );
			if(localRemote != 'remote') {
				TM.F.turn.update('end');
				TM.F.turn.add();
			}
		},
		resetClasses:function() {
			$('body').removeClass('paused running half almost over');
		},
		moderatorClickGuard:function(fun) {
			return function() {
				if( $('body').attr('id') == 'moderator' ) {
					fun();
				}
			};
		},
		playReset:function(event) {
			if( $('body').hasClass('paused') ) {
				TM.turnUp('local');
				TM.clock.style();
				TM.turnTime.tick();
			} else {
				TM.clock.reset('local');
			}
		},
		setTitle:function(count) {
			document.title = (count ? (TM.clock.format(count) +' | ') : '') + "Turnometro";
		}
	}
};
