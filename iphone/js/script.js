/*
Author:  Marco Gomes
E-mail:  eu@marcogomes.com
Used at: http://MarcoGomes.com/wallpapr/iphone
License: Creative Commons Attribution-ShareAlike 2.5 Brazil License
         http://creativecommons.org/licenses/by-sa/2.5/br/deed.en
Note:    If you change or improve on this script, please let me know,
         e-mail me with a link to your demo page.
*/

$(window).bind('load',function(){
// Use the native jQuery JSONP to get data directly from Flickr
// ANIMAL! I really love jQuery and all its dev team
var webserviceURI = 'http://www.flickr.com/services/rest/?'
                     + '&format=json'
                     + '&api_key=eb46f4e8ff564a8e657288b1e56da80e';
var aboutURI    = 'about.html';
var photos      = new Array();
// melhor tbm salvar os Ids para comparação do que rodar comparação entre objetos complexos
var photosIds   = new Array();
var groupIds    = new Array();
var perPage     = new Number(15);
var page        = new Number();

setUX();

function setUX(){
  $('#buttonrandom').click(function(){
    // limpa o valor do campo de busca POG
    $('#tag').val('');
    searchPhotos('random');
  });

  $('#searchForm').submit(function(){
    searchPhotos('search');
  });

  $('a[type="submit"]', '#searchForm').click(function(){
    searchPhotos('search');
  });  
}

// debug function
// browser alerts are for noobas
function alert(val){
	$('#debug')[0].innerHTML += '<br />' + val;
}


// set groupIDs to array
function setGroupIds(){
	groupIds.push( '344828@N24' ); //  iPhone Wallpapers
	groupIds.push( '907457@N21' ); //  iPhone - wallpapers
	groupIds.push( '549063@N25' ); //  Quality Iphone Wallpapers
	//groupIds.push( '1006915@N23' ); // iPhone Wallpapers 320x270 (few items)
	//groupIds.push( '407794@N20' ); // Best iPhone wallpapers ever! (few items)
	groupIds.push( '840891@N24' ); // MB's iPhone Wallpapers
	groupIds.push( '376129@N25' ); // iPhone Wallpapers! 320x480
	groupIds.push( '677060@N23' ); // Free iPhone Wallpapers
	//groupIds.push( '981348@N24' ); // Islamic iPhone Wallpapers(few items)
	groupIds.push( '595618@N20' ); // iPhone & iPodTouch - Wallpaper
	groupIds.push( '787238@N22' ); // iphone wallpapers Calais
	// groupIds.push( '' ); // 
}

function searchPhotos(action){
	// reset groups ids, to make a brand new search
	groupIds = new Array(); // reset before add ;]
	setGroupIds();
	// reset photos array and photosIds, to make a brand new search
	photos = new Array();
	photosIds   = new Array();
	// set values for this search
  var sTag = new String();
  // pega o valor do campo de busca
  sTag = $('#tag').val();
	page = 1;
	
	// limpa o formulario de resultado
	$('#results').html('');
	
	// do funny things
	loadSearchResults(sTag);
}

// request images JSON to flickr search
// only in a random wallpapers group
function loadSearchResults(sTag){
	var groupId = getRandomGroupId();
	var pars = '&method=flickr.photos.search'
	+ '&machine_tag_mode=all'
	+ '&privacy_filter=1'
	+ '&extras=original_format'
	+ '&group_id=' 	      + groupId
	+ '&text='            + sTag
	+ '&per_page='        + perPage
	+ '&page='            + page;
	var requestURI = webserviceURI + pars;
	//$('#debug')[0].innerHTML += '<br /><a href="' + requestURI + '" target="_blank">XEMELE de resposta ' + groupId + '</a> ';//debug
	$.getJSON(requestURI + "&jsoncallback=?", function( data ){
		onLoadSearchResult(data, sTag);
	});
}


// when loads the search results JSON
this.onLoadSearchResult = function(data, sTag)
{
	// avoid erros when can't load data
	if(!data.photos)
	{
		// request data again
		searchPhotos();
		return false;
	}
	$.each(data.photos.photo, function(i,photo){
		//alert('<br />' + photo.title)
		modPhotoObj(photo);
		// verifica se já não tem fotos suficientes
		if ( photos.length < perPage ) {
			// verifica se essa foto já não está lá (usando o id)
			// verifica se a foto não é protegida
			if ( photosIds.indexOf(photo.id) == -1
			 	&& photo.originalsecret ) {
				// adiciona ao array photos e o id no photosIds
				photos.push(photo);
				photosIds.push(photo.id);
			}			
		}	
	});
	//alert('<br />photos: ' + photos.length);
	//alert('<br />data: ' +  data.photos.photo.length);
	groupsController(sTag);
}

// inserts new attributes on standard object
// receive: JSON obj
// return: same obj with more attributes
function modPhotoObj(photo)
{
	// URIs to various dimensions of this photo
	var baseString = 'http://static.flickr.com/'
							+ photo.server
							+ '/'
							+ photo.id
							+ '_'
							+ photo.secret;
	
	photo.orig  = baseString + '_o.jpg';
	photo.thumb = baseString + '_t.jpg';
	photo.square = baseString + '_s.jpg';
	// file ex: url: http://static.flickr.com/112/257332642_6d8d16d42c_m.jpg
	
	// creates the photo link URI on Flickr
	// example: http://flickr.com/photo_zoom.gne?id=267591518&size=o
	// if the big photo is private, get the original photopage link
	// mod by @fzuardi <http://idomyownstunts.blogspot.com/>
	if (photo.originalsecret) {
    	photo.url = 'http://flickr.com/photo_zoom.gne?id=' + photo.id + '&size=o';
	} else {
    	photo.url = 'http://flickr.com/photos/' + photo.owner + '/' + photo.id;
	}
	
	return (photo);
}

// check if searched at all groups
function groupsController(sTag)
{
	if( photos.length >= perPage )
	{
		checkResult();
	}
	// if not reached the number requested and the photos are
	// not sufficient, re-search with other random group
	else if( groupIds.length && photos.length <= perPage )
	{
		loadSearchResults(sTag);
	}
	// if the system don't have more photos
	else
	{
		checkResult();
	}
}


// check the result of search
// printing the appropriated feedback
function checkResult()
{
	// if the search returned any items on all groups
	if( photos.length )
	{
		drawResult();
	}
	else
	{
	  // cria nos da tela de "desculpae"
		var $lisorry = $('<li>I\'m just a <strong>nightly built software</strong> and I <strong>can\'t found</strong> any items macthing your search term.</p><p>Help me being less specific.</li>');
		var $liback = $('<li><a href="#home">Back to home screen</a></li>');
		
		// imprime os nos
		$('#results')
		.append($lisorry)
		.append($liback);
	}
}

// prints the results array on the screen
// uses 'photos' array to get data to print
function drawResult()
{
	// print each item on array
	$.each(photos, function(i,photo){
		printPhoto(photo);
	});
}

// print a photo object on screen
// receive:
//  obj with photo data
//  context where to print image
function printPhoto(photo)
{
	// create jQuery objects with DOM elements
	// img node
	var img = $('<img/>')
	  .attr('class', 'wallpaperthumb')
	  .attr('src', photo.square)
	  .attr('title', photo.title);
	// title node
	var title = $('<span class="label" />')
	.text(photo.title);
	// link node with img appended
	var link = $('<a></a>')
		.attr('href', photo.url)
		.attr('target', '_blank')
		.addClass('photo')
		.append(img)
		.append(title);
	
	// list node with link appended
	var li = $('<li></li>').append(link);
	// animation controller
	$(img)
		.hide()
		.load(function(){
			$(this).fadeIn();
		});
	// put elements on screen
	$('#results').append(li);
}

// return a random group Id
// I like this very old function
function getRandomGroupId()
{
	var id = new String();
	if(groupIds.length)
	{
    	var rand = Math.round(Math.random() * groupIds.length - 1);
		id = groupIds.splice(rand, 1);
	}
	return id
}

});