// Fijarse que la ruta de partida ahora es la colección eventos:
var firebase=new Firebase('https://turnometro-a2faf.firebaseio.com/eventos');

var eventos={};

// Eventos de lectura sobre Firebase
// https://www.firebase.com/docs/web/guide/retrieving-data.html

/*
Evento: value

The value event is used to read a static snapshot of the contents at a given database path,
as they existed at the time of the read event. It is triggered once with the initial data and again every time the data changes.
The event callback is passed a snapshot containing all data at that location, including child data. In our code example above,
value returned all of the blog posts in our app. Everytime a new blog post is added, the callback function will return all of the posts.
*/

firebase.on('value',function(datos)
{
	// Eliminamos el contenido del listado para actualizarlo.
	$("#listado div.row").remove();

	eventos=datos.val();

	// Recorremos los eventos y los mostramos
	$.each(eventos, function(indice,valor)
	{
		var datodata='<div class="row" id="'+indice+'"><div class="col-md-3 cabeceraProducto">';

		datodata+='<h2>'+valor.milisegundosRestantes+'</h2></div>';


		$(datodata).appendTo('#listado');
});

},function(objetoError){
	console.log('Error de lectura:'+objetoError.code);
});

function editarProducto(id)
{
	// Para pasar el ID a otro proceso lo hacemos a través de window.name
	window.name= id;

	// Cargamos la página editarproducto.html
	location.assign('editar.html');
}