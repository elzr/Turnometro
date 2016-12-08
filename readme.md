# Turnometro

**Turnometro is a web tool for more effective & inclusive assemblies.** It wants to be useful for any kind of face-to-face deliberation by promoting brevity & structure, a more equal & balanced use of the right to speak, and the airing & recording of (dis)agreements & emotions.

## Usage description

Start small with Turnometro and use the parts of it that make sense for your event. Turnometro can help you as a:

1. A simple, specialized **countdown** to timebox speaking turns. Touch the numbers to start counting down, touch again to reset, that's it!
    * Countdown goes negative to keep the pressure on the speaker but allow for flexibility. Digits are as big as possible and as visual cues, there's a sand-timer bar going down and traffic-light coloring (_green_ for &gt;50% time, _yellow_ for &lt;=50% time, _orange_ for &lt;=10s left &amp; _red_ for overtime). You can adjust a turn duration, the time steps, the coloring and several other things in the settings.
    * You will notice that no matter how badly someone speaks, with a timebox around it, it's easy to endure. You'll hear from shy people who didn't use to speak before.  Excellent speakers will sharpen their speaking and dazzle you with how much it is possible to say in 60 seconds or less. The pace &amps; diversity of participations should increase noticeably. Consistently timing your participations is a bit like finally playing tennis with the net up :)

2. A **synched** countdown on multiple screens for your event. Make the timeboxes almost _self-enforceable_ by being sure that everyone, listeners _and_ speakers, can always see the time. This often requires several screens. Synch the other Turnometros simply by entering the auto-generated event PIN.

3. As a listener at the event, **express (dis)agreement & emotions** on a speaker's turn that will appear as bubbles in real-time on the other Turnometros. If a lot of people express the same emotion at about the same time, a big bubble appears.

4. As a participant that wants to speak at the event, **queue for your turn** just by pressing a button. To avoid repetitive turns, only 5 persons can queue at the same time. When it's your turn to speak, your Turnometro shows you your time remaining and your name will be shown on the other Turnometros.

5. At the end of the event, have a **report** of how much (or how little) every participant spoke and the main reactions expressed during the event.

---

## Technical details:

[Google's Firebase](https://www.firebase.com/) is used extensively for its Realtime Database and to do the heavylifting of synching. The website itself is static HTML, JS ([jQuery](https://jquery.com/) 3.1.1 & [UnderscoreJS](http://underscorejs.org/#objects)) & CSS ([SASS](http://sass-lang.com/)).

There is one global object, `TM` (which stands for TurnoMetro of course). Most custom javascript code lives on `code.js`, except for the initialization of Firebase & Google Analytics which happens on `index.html` and the code for the clock ticking which is on `clock.js`. There are a few shortcut variables created at the end of `code.js` that are a bit cryptic but convenient. `TM.settings` which hosts the code in Turnometro related to settings has the `TM.S` shortcut (notice the _uppercase_), while `TM.s` (notice the _lowercase_) stands for `$(#settings)'` which is the HTML div with the `#settings` id where most settings are displayed.

---

## Sponsors

Made during the __Collective Intelligence for Democracy__ workshop in [**MediaLab Prado**](http://medialab-prado.es/) from 18nov to 2dic, 2016. [Project presentation](http://inteligenciacolectiva.cc/post/153339455592/turn%C3%B3metro-eliazar-parra-m%C3%A9xico-es-uno-de-los). [Group photo](http://inteligenciacolectiva.cc/post/153603856797/turn%C3%B3metro-pretende-aumentar-los-procesos-de)

It was further developed at the [_2016 OGP Summit Hackathon_](https://hackathon.ogpsummit.org/) from 7-9dic 2016 in Paris, France. It comes out of 3 years of experimentation at [Wikipolitica](https://www.facebook.com/WikipoliticaJalisco/).
