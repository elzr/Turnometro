var TM = {
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

			if(TM.duration == 60) {
				TM.s.find('.durations a[data-duration=60]').addClass('selected');
			} else {
				TM.s.find('.durations a.custom').css('display','inline-block').
					addClass('selected').data('duration', TM.duration).text( TM.clock.format(TM.duration) );
			}
		},
		enter:function() {
			TM.s.show();
			$('#welcome, #clock').hide();

			TM.s.find('.exit').html('Back to event &rarr;');
			TM.clock.reset();
		},
		exit:function() {
			TM.F.turn.update();
			TM.s.hide();
			TM.c.show();
		},
		duration:{
			set:function() {
				TM.duration = $(this).data('duration');
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
				TM.s.find('.durations img.edit').css('visibility', 'hidden');
			},
			blur:function() {
				TM.s.find('.durations img.edit').css('visibility', 'visible');
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
			$('#welcome').show().
				find('.startEvent a').click( TM.W.startEvent ).end().
				find('.enterEvent input').focus( TM.welcome.focus ).blur( TM.welcome.blur ).
				keyup( TM.welcome.keyup );
		},
		startEvent:function() {
			TM.w.hide();
			$('body').attr('id', 'moderator');
			TM.s.show();
			TM.S.boot();
			TM.F._event.add();
			TM.F.turn.add();
			TM.F.participant.add();
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
				TM.w.find('.warning').text('');
			} else {
				TM.w.find('.warning').text('Invalid PIN!');
			}
		},
		blur:function() {
			if( $(this).val() == '' ) {
				$('#welcome .enterEvent').removeClass('editing');
			}
		},
		enterEvent:function() {
			TM.w.hide(); TM.c.hide(); TM.n.show();
			TM.N.boot();
		}
	},

	// NAME --------------------------------------------
	name:{///TM.N
		boot:function() {
			TM.n.find('.justWatch').click( TM.N.justWatch ).end().
				find('.enterAsAParticipant').click( TM.N.enterEventWithName ).end().
				find('input').focus( TM.N.focus ).blur( TM.N.blur ).focus();
		},
		enterEventWithName:function() {
			var name = TM.n.find('input').val();
			TM.participant.boot('entering');
		},
		finishEnteringEventWithName:function() {
			TM.S.boot();

			TM.n.hide();
			TM.c.show();
			$('body').attr('id', 'participant');
		},
		focus:function() {
			TM.n.find('.enterYourName').addClass('editing');
		},
		blur:function() {
			if( $(this).val() == '' ) {
				TM.n.find('.enterYourName').removeClass('editing');
			}
		},
		justWatch:function() {
			TM.n.hide();
			$('body').attr('id', 'presenter');
			TM.c.show();
			TM.settings.boot();
			TM.presenter.boot();
		}
	},

	// PARTICIPANT --------------------------------------------
	participant: {
		name:undefined,
		boot:function() {
			TM.F.participant.add('entering');
			TM.reactions.boot();
		},
		participate:function() {
			if( TM.participant.name ) {
				$('body').attr('id', 'participant');
			} else {
				TM.W.enterEvent();
			}
		},
		justWatch:function() {
			TM.n.hide();
			$('body').attr('id', 'presenter');
			TM.c.show();
			TM.S.boot();
		}
	},

	// REACTIONS --------------------------------------------
	reactions: {
		boot:function() {
			$('#interactions img').click( TM.reactions.click );
		},
		click:function() {
			var reaction = $(this).attr('class');
			TM.F.reaction.add( reaction );
		}
	},

	// PRESENTER --------------------------------------------
	presenter:{
		boot:function() {
			console.log('presenting!');
			TM.F.reaction.listen();
		}
	},

	// FIREBASE --------------------------------------------
	firebase: { //TM.F
		boot:function() {
			//TM.F.eventListRef = TM.F.db.ref('/events');
		},
		_event:{
			current:{},
			add:function() { var cEvent = TM.F._event.current;
				var newEventRef = TM.F.db.ref('events').push(),
					pad ="0000",
					pin = TM.F.pin.create()+'',
					paddedPin = pad.substring(0, pad.length - pin.length) + pin;

				cEvent.pin = paddedPin;
				cEvent.key = newEventRef.key;

				newEventRef.set({
					pin: paddedPin,
					created_at:firebase.database.ServerValue.TIMESTAMP,
				});

				TM.s.find('.pin strong').text( paddedPin );
				TM.F.participant.listen();
			},
			find:function( pin ) {
				TM.F.db.ref('events').orderByChild('pin').equalTo( pin ).once('value').then(function(snapshot) {
					if(snapshot.val()) {
						TM.w.find('.warning').text('');

						var cEvent = TM.F._event.current, val = snapshot.val();
						cEvent.key = _.keys(val)[0]
						cEvent.pin = pin;

						TM.F.turn.listen();
						TM.welcome.enterEvent();
					} else {
						TM.w.find('.warning').text('Invalid PIN!');
					}
				});
			}
		},
		turn:{
			current:undefined,
			listen:function() {
				var listRef = TM.F.db.ref('events/'+TM.F._event.current.key+'/turns');
				listRef.on('child_added', TM.F.turn.added);
				listRef.on('child_changed', TM.F.turn.changed);
			},
			add:function() { var cEvent = TM.F._event.current;
				if( $('body').attr('id') == 'moderator' ) {
					console.log('adding');

					var newRef = TM.F.db.ref('events/'+cEvent.key+'/turns').push();
					var props = {
						created_at: firebase.database.ServerValue.TIMESTAMP,
						duration: TM.duration,
						step: TM.step,
						colorMuted: TM.color.muted,
						soundMuted: TM.sound.muted
					};
					newRef.set( props );
					TM.F.turn.current = newRef;
				}
			},
			update:function( updateStartEnd) {
				if( $('body').attr('id') == 'moderator' ) {
					console.log('updating');
					var props = {
						duration: TM.duration,
						step: TM.step,
						colorMuted: TM.color.muted,
						soundMuted: TM.sound.muted
					};
					if(updateStartEnd == 'start') {
						props.started_at = firebase.database.ServerValue.TIMESTAMP;
					}
					if(updateStartEnd == 'end') {
						props.ended_at = firebase.database.ServerValue.TIMESTAMP;
					}
					TM.F.turn.current.update( props );
				}
			},
			added:function(data) { var turn = data.val();
				console.log('added');
				if( !turn.ended_at ) {
					TM.F.turn.synchLocal(turn);
				}
			},
			changed:function(data) { var turn = data.val();
				if( turn.ended_at ) {
					TM.clock.reset();
					console.log('turn ended', data.key, turn);
				} else {
					console.log('turn changed', data.key, turn);
					TM.F.turn.synchLocal(turn);
					if( turn.started_at ) {
						TM.clock.playReset();
					}
				}
			},
			synchLocal:function(turn) {
				TM.step = turn.step;
				TM.duration = turn.duration;
				TM.color.muted = turn.colorMuted;
				TM.sound.muted = turn.soundMuted;
				$('body')[(TM.color.muted ? 'add':'remove')+'Class']('colorMuted');
				TM.clock.boot();
			}
		},
		reaction:{
			add:function(r) { var cEvent = TM.F._event.current;
				console.log( 'creating reaction', r);

				var newRef = TM.F.db.ref('reactions').push();

				newRef.set({
					reaction:r,
					event_key: cEvent.key,
					participant_key: TM.F.participant.current.key,
					created_at: firebase.database.ServerValue.TIMESTAMP
				});
			},
			listen:function() {
				console.log( 'listening for reactions');
				TM.F.db.ref('reactions').orderByChild('event_key').equalTo( TM.F._event.current.key ).
					on('child_added', TM.F.reaction.added);
			},
			added:function(data) { var r = data.val(), localTime = (new Date).getTime();
				var delta = Math.abs((r.created_at - localTime)/(60*1000));
				console.log( delta );
				if( delta <= 1 ) {
					var bubble = $('<img class="'+r.reaction+'" src="img/'+r.reaction+'.png" />').
							css({left: (Math.random()*80)+'%', bottom:(Math.random()*10)+'%'}).
							animate({ bottom:$(window).height(), opacity:0 }, 3000);
					
					TM.c.find('#bubbles').prepend( bubble );
				}
			}
		},
		queue:{
		},
		topics:{
		},
		participant:{
			current:undefined,
			list:[],
			listen:function() {
				var listRef = TM.F.db.ref('events/'+TM.F._event.current.key+'/participants');
				listRef.on('child_added', TM.F.participant.added);
			},
			add:function(isEntering) {var cEvent = TM.F._event.current,
					name = TM.n.find('input').val(),
					isModerator = $('body').attr('id') ==  'moderator';

				console.log('name', name);
				if( isModerator ){
					name = 'moderator'
				} else if(name == 'moderator') {
					TM.n.find('.warning').text('Invalid name!');
				} else if(!name.match(/^[0-9a-zA-Z]+$/)) {
					TM.n.find('.warning').text('Invalid chars!');
				} else if(name) {
					TM.F.db.ref('events/'+TM.F._event.current.key+'/participants').
						orderByChild('name').equalTo( name ).once('value').then(function(snapshot) {
							if(!snapshot.val()) {
								TM.n.find('.warning').text('');
								TM.participant.name = name;
								var newRef = TM.F.db.ref('events/'+cEvent.key+'/participants').push(),
									props = {
										name:name||'',
										started_at: firebase.database.ServerValue.TIMESTAMP,
									};
								if( isModerator ){
									props.moderator =true
								}
								newRef.set(props);
								TM.F.participant.current = newRef;
								TM.F.participant.list += [newRef];
								TM.N.finishEnteringEventWithName;
							} else {
								TM.n.find('.warning').text('Name already exists!');
							}
						});
				}
			},
			added:function(data) { var participant = data.val();
				TM.F.participant.list += [participant];
				var thatsYou = participant.name == 'moderator' ? " (that's you!)" : ''
				TM.s.find('.participants ul').prepend( 
					'<li><em>'+participant.name+'</em>'+ thatsYou +'</li>' );
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
	exitSplash:function() {
		if( $(this).hasClass('splash') ) {
			window.setTimeout(function() {
				TM.w.find('.fork').removeClass('splash').addClass('afterSplash');
			}, 0);
		}
	},
	boot:function() {
		TM.duration = parseInt( window.location.hash.substr(1) ) || 60;

		$('a.button').attr('href', 'javascript:void(0)');
		
		TM.c.find('.justWatch').click( TM.name.justWatch ).end().
			find('.participate').click( TM.participant.participate );

		TM.W.boot();
		TM.F.boot();

		TM.eventTime.tick();
		TM.clock.boot();

		$('.fork.splash').click( TM.exitSplash );
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
	TM.F = TM.firebase;

	TM.boot();
});
