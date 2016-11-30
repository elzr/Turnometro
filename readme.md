# Turnometro

Web version of Turnometro.

## English description of the project:

Turnometro is an app for the web and for Android phones that allows you to visualize and order the participation times of several people during a face-to-face reunion. With Turnometro you can create an event and share it with several participants through their Android phones or any browser. You can ask for a turn to speak, track the time of every participation and see the emotional reactions of the group. The objective of Turnometro is to augment face-to-face reunions.


## Descripción en Español del proyecto:

Turnómetro es una página web y una app que te permite visualizar y organizar los tiempos de participación de varias personas durante una dinámica de discusión presencial. Con Turnómetro puedes crear un evento y compartirlo con varios participantes a través de sus celulares o computadoras. Puedes pedir turnos para tomar la palabra, observar el cronometraje de cada participación y mostrar reacciones emotivas ante las participaciones diversas del grupo. El objetivo de Turnómetro es aumentar y agilizar las dinámicas de participación presencial.

---

## Technical details:

[Google's Firebase](https://www.firebase.com/) is used for its Realtime Database. [jQuery](https://jquery.com/) 3.1.1 is used extensively. [UnderscoreJS](http://underscorejs.org/#objects) is used.

[SASS](http://sass-lang.com/) is used for the CSS.

There is one global object, `TM` (which stands for TurnoMetro of course). Most custom javascript code lives on `code.js`, except for the initialization of Firebase & Google Analytics which happens on `index.html` and the code for the clock ticking which is on `clock.js`. There are a few shortcut variables created at the end of `code.js` that are a bit cryptic but convenient. `TM.settings` which hosts the code in Turnometro related to settings has the `TM.S` shortcut (notice the _uppercase_), while `TM.s` (notice the _lowercase_) stands for `$(#settings)'` which is the HTML div with the `#settings` id where most settings are displayed.

---

Made during the __Collective Intelligence for Democracy__ workshop in [**MediaLab Prado**](http://medialab-prado.es/) from 18nov to 2dic, 2016. [Project presentation](http://inteligenciacolectiva.cc/post/153339455592/turn%C3%B3metro-eliazar-parra-m%C3%A9xico-es-uno-de-los). [Group photo](http://inteligenciacolectiva.cc/post/153603856797/turn%C3%B3metro-pretende-aumentar-los-procesos-de)
