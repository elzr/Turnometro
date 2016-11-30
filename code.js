var TM = {
	version:'0.71',

	// SETTINGS --------------------------------------------
	settings:{ //TM.S
		boot:function() { var D = TM.S.duration;
			$('.goToSettings').click( TM.S.enter );
			$('.exit').click( TM.S.exit );

			TM.s.find('a').attr('href', 'javascript:void(0)').end().
				find('.durations a').click( D.set ).end().
				find('.steps a').click( TM.S.setStep ).end().
				find('.soundToggle').click( TM.S.toggleSound ).end().
				find('.colorToggle').click( TM.S.toggleColor ).end().
				find('.durations .edit').
					focus( D.focus ).
					blur( D.blur );

			if(TM.start == 60) {
				TM.s.find('.durations a[data-duration=60]').addClass('selected');
			} else {
				TM.s.find('.durations a.custom').css('display','inline-block').
					addClass('selected').data('duration', TM.start).text( TM.clock.format(TM.start) );
			}
		},
		enter:function() {
			TM.s.show();
			$('#welcome, #clock').hide();

			TM.s.find('.exit').html('Back to event &rarr;');
			TM.clock.reset();
		},
		exit:function() {
			TM.s.hide();
			TM.c.show();
		},
		duration:{
			set:function() {
				TM.start = $(this).data('duration');
				TM.s.find('.durations a').removeClass('selected');
				$(this).addClass('selected');
				TM.clock.boot();
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
			edit:function() { var d = TM.settings.duration.parse( TM.s.find('.durations input.edit').val() );
				if( (d > 0) && (d < 6000)) {
					$('.durations div.custom').prepend(
						'<a href="javascript:void(0)">'+TM.clock.format(d)+'</a>'
					);
					$('.durations div.custom a:first').data('duration', d).click( TM.S.duration.set ).click();
				}

				TM.s.find('.durations input.edit').val('');

				event.preventDefault();
				return false;
			},
			focus:function() {
				$(this).val('');
				TM.s.find('.durations img.edit').css('display', 'inline-block');
			},
			blur:function() {
				$(this).val('Edit');
				TM.s.find('.durations img.edit').css('display', 'none');
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
			TM.s.find('.steps a').removeClass('selected');
			$(this).addClass( 'selected' );
		}
	},

	// WELCOME --------------------------------------------
	welcome:{ ////TM.W
		boot:function() {
			$('#welcome').show().find('.startEvent a').click( TM.W.startEvent ).end().
				find('.enterEvent input').focus( TM.welcome.focus ).blur( TM.welcome.blur ).
				keyup( TM.welcome.keyup );
		},
		startEvent:function() {
			TM.w.hide();
			$('body').attr('id', 'moderator');
			TM.s.show();
			TM.S.boot();
			TM.F._event.create();
		},
		focus:function() {
			$('#welcome .enterEvent').addClass('editing');
		},
		keyup:function() {
			var pin = $(this).val()||'', count = pin.length;
			if( pin.match(/^\s*\d+\s*$/) ) {
				if(count == 4) {
					TM.F._event.find( pin );
				}
				$('.warning').text('');
			} else {
				$('.warning').text('Invalid PIN');
			}
		},
		blur:function() {
			if( $(this).val() == '' ) {
				$('#welcome .enterEvent').removeClass('editing');
			}
		},
		enterEvent:function() {
			TM.w.hide();
			TM.n.show();
			TM.N.boot();
		}
	},

	// NAME --------------------------------------------
	name:{///TM.N
		boot:function() {
			TM.n.find('.justWatch').click( TM.N.justWatch ).end().
				find('.label.button').click( TM.N.enterEventWithName ).end().
				find('form').submit( TM.N.enterEventWithName ).
				find('input').focus( TM.N.focus ).blur( TM.N.blur ).end()
		},
		value:'',
		enterEventWithName:function() {
			TM.N.value = TM.n.find('input').val();

			TM.S.boot();
			TM.participant.boot();

			TM.n.hide();
			TM.c.show();
			$('body').attr('id', 'participant');
		},
		focus:function() {
			$(this).val('');
		},
		blur:function() {
			if( $(this).val() == '' ) {
				TM.n.find('input').val('Name');
			}
		},
		justWatch:function() {
			TM.n.hide();
			$('body').attr('id', 'presenter');
			TM.c.show();
			TM.settings.boot();
		}
	},

	// PARTICIPANT --------------------------------------------
	participant: {
		boot:function(name) {
			TM.F.participant.add( name );
			TM.c.find('.justWatch').click( TM.name.justWatch );
		},
		justWatch:function() {
			TM.n.hide();
			$('body').attr('id', 'presenter');
			TM.c.show();
			TM.S.boot();
		}
	},

	// FIREBASE --------------------------------------------
	firebase: { //TM.F
		boot:function() {
			//TM.F.eventListRef = TM.F.db.ref('/events');
		},
		_event:{
			current:{},
			create:function() { var cEvent = TM.F._event.current;
				var newEventRef = TM.F.db.ref('events').push(),
					pad ="0000";
					pin = TM.F.pin.create()+'',
					paddedPin = pad.substring(0, pad.length - pin.length) + pin;

				cEvent.pin = paddedPin;
				cEvent.key = newEventRef.key;

				newEventRef.set({
					pin: paddedPin,
					created_at:firebase.database.ServerValue.TIMESTAMP
				});

				//ref('events/'+newEventRef.key+'/participants').on('child_added', TM.F.participant.added);

				TM.s.find('.pin strong').text( paddedPin );
			},
			find:function( pin ) {
				TM.F.db.ref('events').orderByChild('pin').equalTo( pin ).once('value').then(function(snapshot) {
					var cEvent = TM.F._event.current;
					cEvent.key = _.keys(snapshot.val())[0]
					cEvent.pin = pin;

					var turnListRef = TM.F.db.ref('events/'+cEvent.key+'/turns');
					turnListRef.on('child_added', TM.F.turn.added);
					turnListRef.on('child_changed', TM.F.turn.ended);

					TM.welcome.enterEvent();
				});
			}
		},
		turn:{
			current:undefined,
			add:function() { var cEvent = TM.F._event.current;
				if( $('body').attr('id') == 'moderator' ) {
					var newTurnRef = TM.F.db.ref('events/'+cEvent.key+'/turns').push();
					newTurnRef.set({
						started_at:firebase.database.ServerValue.TIMESTAMP
					});
					TM.F.turn.current = newTurnRef;
				}
			},
			end:function() {
				if( $('body').attr('id') == 'moderator' ) {
					TM.F.turn.current.update({ended_at:firebase.database.ServerValue.TIMESTAMP});
				}
			},
			added:function(data) {
				console.log('testing turn added', data.val());
				if( !data.val().ended_at ) {
					TM.clock.playReset();
					console.log('turn added', data.key, data.val());
				}
			},
			ended:function(data) {
				TM.clock.reset();
				console.log('turn ended', data.key, data.val());
			}
		},
		participant:{
			add:function() {
			},
			added:function(data) {
				console.log('data', data.key, data.val());
			}
		},
		pin: {
			create:function() {
				TM.F.pin.code = Math.floor(Math.random()*9999);
				return TM.F.pin.code;
			},
			code:0
		}
	},

	boot:function() {
		TM.start = parseInt( window.location.hash.substr(1) ) || 60;

		$('.version').text( TM.version );
		$('a.button').attr('href', 'javascript:void(0)');

		TM.W.boot();
		TM.F.boot();

		TM.eventTime.tick();
		TM.clock.boot();

		$('#digits').click( TM.clock.moderatorClickGuard( TM.clock.playReset )).
			dblclick( TM.clock.moderatorClickGuard( TM.clock.reset ));
	}
};

$(function() {
	_.extend(TM, TM_CLOCK);

	TM.c = $('#clock');
	TM.N = TM.name;
		TM.n = $('#name');
	TM.W = TM.welcome;
		TM.w = $('#welcome');
	TM.S = TM.settings;
		TM.s = $('#settings');
	TM.F = TM.firebase

	TM.boot();
});
