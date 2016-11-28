var TM = {
	version:'0.6',
	start:60,
	step:1,
	sound: {
		beep:new Audio('http://soundbible.com/grab.php?id=1815&type=mp3'),
		//sound: new Audio('http://www.w3schools.com/html/horse.mp3'),
		muted:false,
	},
	color:{
		muted:false,
	},
	set:function(t) {
		T.data('seconds', t);
		T.html( (TM.format()+'').replace(':', ':<b>_</b>') );
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
		var count = TM.get(), 
			b = $('body'),
			half = Math.ceil( TM.start/2 ),
			almost = TM.start <= 20 ? TM.start*0.25 : 10;

		TM.resetClasses();

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
				TM.zero();
			}
			if(count <= 0) {
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
	zero:function() {
		if(TM.sound.muted) {
		} else {
			TM.sound.beep.play();
		}
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

		$('body').removeClass('landscape portrait narrowLandscape').
			addClass( h < w ? 'landscape' : 'portrait').
			addClass( w/h > 1.5 ? 'narrowLandscape' : '' );

		T.css( {
			height:h+'px',
			width:w+'px',
			fontSize:fitted+'px',
		  	lineHeight:h+'px'
		} );
		$('.welcome .fork').css({
			height:h+'px',
			width:w+'px'
		});
		return fitted;
	},
	setTitle:function(count) {
		document.title = (count ? (TM.format(count) +' | ') : '') + "Turnometro";
	},
	pin: {
		create:function() {
			TM.pin.code = Math.floor(Math.random()*9999);
			return TM.pin.code;
		},
		code:0
	},

	// SETTINGS --------------------------------------------
	settings:{
		boot:function() { var s = TM.settings, d = s.duration;
			$('.goToSettings').click( s.enter );
			$('.exit').click( s.exit );

			var pin = TM.pin.create()+"", pad ="0000";
			$('.settings .pin strong').text( pad.substring(0, pad.length - pin.length) + pin );

			S.find('a').attr('href', 'javascript:void(0)');
			S.find('.durations a').click( d.set ).end().
				find('.steps a').click( s.setStep ).end().
				find('.soundToggle').click( s.toggleSound ).end().
				find('.colorToggle').click( s.toggleColor ).end().
				find('.durations .edit').
					focus( d.focus ).
					blur( d.blur );

			if(TM.start == 60) {
				S.find('.durations a[data-duration=60]').addClass('selected');
			} else {
				S.find('.durations a.custom').css('display','inline-block').
					addClass('selected').data('duration', TM.start).text( TM.format(TM.start) );
			}
		},
		enter:function() {
			S.css('visibility', 'visible');
			C.css('visibility', 'hidden');
			S.find('.exit').html('Back to event &rarr;');
			TM.reset();
		},
		exit:function() {
			//console.log('exit!');
			S.css('visibility', 'hidden');
			C.css('visibility', 'visible');
		},
		duration:{
			set:function() {
				TM.start = $(this).data('duration');
				S.find('.durations a').removeClass('selected');
				$(this).addClass('selected');
				TM.initialize();
			},
			parse:function(input) { input = (input||'').replace(/^\s*/,'').replace(/\s*$/,'');
				var out = '', match = function(regex) { return input.match(regex);},
					intMatch = function(regex) { return parseInt(match(regex)); };

				if( match(/^\d+$/) && parseInt( input ) ) {
					out = parseInt( input );
				} else if( match(/\d+:\d+/) ) {
					var m = intMatch(/^(\d+):/) * 60,
						s = intMatch(/:(\d+)$/);
					out = m + s;
				} else if( match(/^(\d+)m(in(ute)?)?$/) ) {
					var m = intMatch(/^(\d+)m(in(ute)?)?$/) * 60;
					out = m;
				} else if( match(/^(\d+)s(ec(onds)?)?$/) ) {
					var s = intMatch(/^(\d+)s(ec(onds)?)?$/);
					out = s;
				} else if( match(/^(\d+)m(in(ute)?)?(\d+)s(ec(onds)?)?$/) ) {
					var m = intMatch(/^(\d+)m(in(utes)?)?/) * 60,
						s = intMatch(/(\d+)s(ec(onds)?)?$/);
					out = m + s;
				}
				return out;
			},
			edit:function() { var d = TM.settings.duration.parse( S.find('.durations input.edit').val() );
				if( (d > 0) && (d < 6000)) {
					$('.durations div.custom').prepend(
						'<a href="javascript:void(0)">'+TM.format(d)+'</a>'
					);
					$('.durations div.custom a:first').data('duration', d).click( TM.settings.duration.set ).click();
				}

				S.find('.durations input.edit').val('');

				event.preventDefault();
				return false;
			},
			focus:function() {
				$(this).val('');
				S.find('.durations img.edit').css('display', 'inline-block');
			},
			blur:function() {
				$(this).val('Edit');
				S.find('.durations img.edit').css('display', 'none');
			}
		},
		toggleSound:function() {
			$('.soundToggle').text( TM.sound.muted ? 'YES' : 'NO' );
			TM.sound.muted = !TM.sound.muted;
		},
		toggleColor:function() {
			if(TM.color.muted) {
				$('.colorToggle').text('YES');
				$('body').removeClass('colorMuted');
			} else {
				$('.colorToggle').text('NO');
				$('body').addClass('colorMuted');
			}
			TM.color.muted = !TM.color.muted;
		},
		setStep:function() {
			TM.step = $(this).data('duration');
			S.find('.steps a').removeClass('selected');
			$(this).addClass( 'selected' );
		}
	},

	// WELCOME --------------------------------------------
	welcome:{
		boot:function() {
			$('.welcome').find('.startEvent a').click( TM.welcome.startEvent ).end().
				find('.enterEvent input').focus( TM.welcome.focus ).blur( TM.welcome.blur );
		},
		startEvent:function() {
			$('.welcome').css('visibility', 'hidden');
			S.css('visibility', 'visible');
			TM.settings.boot();
		},
		focus:function() {
			$('.welcome .enterEvent').addClass('editing');
		},
		blur:function() {
			if( $(this).val() == '' ) {
				$('.welcome .enterEvent').removeClass('editing');
			}
		},
		enterEvent:function() {
			$('.welcome').css('visibility', 'hidden');
			$('.name').css('visibility', 'visible');
		}
	},
	name:{
		//$('.name').find('.name a').click( TM.welcome.startEvent ).end();
	},
	initialize:function() {
		TM.setTitle( TM.start );
		T.text(TM.start);
		TM.set( TM.start );
		$('.maxDuration').text( TM.format(TM.start)+'' );

		var customResize = function() {TM.resize( TM.countToFit(TM.start) )};
		customResize();
		$(window).resize( customResize );
	},
	firebase: {
		boot:function() {
			TM.firebase.db = new Firebase('https://turnometro-a2faf.firebaseio.com/eventos');
		},
		test:function() {
			TM.firebase.db.on('value',function(datos) {
				console.log('firebase!');
				// Eliminamos el contenido del listado para actualizarlo.
				$("#listado div.row").remove();

				eventos=datos.val();

				// Recorremos los eventos y los mostramos
				$.each(eventos, function(indice,valor) {
				console.log('events!');
					var datodata='<div class="row" id="'+indice+'"><div class="col-md-3 cabeceraProducto">';
					datodata+='<h2>'+valor.milisegundosRestantes+'</h2></div>';

					$(datodata).appendTo('#listado');
				});
			});
		}
	},
	boot:function() {
		TM.start = parseInt(window.location.hash.substr(1)) || 60;
		$('.version').text( TM.version );

		TM.eventTime = $('.eventTime').data('seconds', 0);
		TM.heartbeat();

		TM.welcome.boot();
		TM.initialize();

		$('.digits').click( TM.play ).dblclick( TM.reset );
	}
};

$(function() {
	T = $('.digits');
	C = $('.clock');
	S = $('.settings');
	TM.boot();
});
