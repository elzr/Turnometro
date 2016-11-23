var TIME = {
	start:60,
	set:function(t) {
		T.data('seconds', t);
		TIME.format();
	},
	decrement:function(t) {
		TIME.set( TIME.get() - 1 );
	},
	get:function() {
		return parseInt( T.data('seconds') );
	},
	format:function() {
		var count = TIME.get();
		T.text( count );

		if( count > 60 ) {
			var seconds = (count % 60);
			seconds = seconds < 10 ? '0'+seconds : seconds;
			T.text( Math.floor(count/60) +':'+ seconds );
		} else if((count >= 0) && (count < 10) && (T.text().length == 1)) {
			T.text( 0+T.text() );
		}
	},

	tick:function() {
		TIME.interval = setInterval(function() {
			TIME.decrement();
			document.title = "Turno " + TIME.get();
			$('.bar .progress').css('height', Math.ceil((TIME.get() / TIME.start)*100)+'%');
			TIME.style();
		}, 1000);
	},
	style:function() {
		var count = TIME.get();
		var half = Math.ceil(TIME.start/2);

		TIME.resetClasses();

		TIME.resize( count > 60 ? 3 : 2 );
		if ( count <= 60 ) {
			//console.log( '2!' );
		}

		if( count > half ) {
			$('body').addClass('running');
		} else if( (count > 0) && (count <= half) && (count > 10)) {
			$('body').addClass('half');
		} else if(count <= 10) {
			$('body').addClass('almost');
			if((count <= 0) && (count > -10)) {
				TIME.resize(2);
				$('body').toggleClass('over');
			} 
			if(count <= -10) {
				TIME.resize(3);
				$('body').toggleClass('over');
			}
			if(count <= -99) {
				clearInterval(TIME.interval);
			}
		}
	},
	play:function() {
		if($('body').hasClass('paused')) {
			TIME.style();
			TIME.tick();
		} else {
			TIME.reset();
		}
	},
	reset:function() {
		clearInterval(TIME.interval);
		TIME.set( TIME.start );
		T.css('marginTop', 0);
		$('.bar .progress').css('height', '100%');
		TIME.style();

		TIME.resetClasses();
		$('body').addClass('paused');
	},
	resetClasses:function() {
		$('body').removeClass('paused running half almost over');
	},
	resize:function(fit) {
		var fitted = Math.min($(window).height()*0.8, (TIME.heightWidthProportion*$(window).width())/fit);
		if(fit > 2) {
			fitted *= 0.7
		}
		T.css({
			fontSize: fitted,
			marginTop: ($(window).height() - fitted)/( fit == 3 ? 3 : 5) //hack to get the margin better
		});
		return fitted;
	},
	boot:function() {
		TIME.start = parseInt(window.location.hash.substr(1)) || 60;
		document.title = "Turno " + TIME.start;
		$('span').text(TIME.start);
		TIME.set( TIME.start );
		$('body').click( TIME.play ).dblclick( TIME.reset );
		TIME.heightWidthProportion = 10/($('span').width()/(TIME.start > 60 ? 4 : 2));
		TIME.resize( TIME.start > 60 ? 3 : 2 );
	}
};
$(function() {
	T = $('span.digits');
	TIME.boot();
});
