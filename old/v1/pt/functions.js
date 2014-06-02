/*
	Author:  Marco Gomes
	E-mail:  eu@marcogomes.com
	Used at: http://MarcoGomes.com/wallpapr
	License: Creative Commons Attribution-ShareAlike 2.5 Brazil License
	         http://creativecommons.org/licenses/by-sa/2.5/br/deed.en
	Note:    If you change or improve on this script, please let me know by
	         emailing the author with a link to your demo page.
*/
// Constants
var aboutURI  = 'about.xml';
var apiURI    = '../phpFlickr/tunnel.php';
var groupIds  = new Array();
var photos    = new Array();
var tag       = new String();
var numPhotos = new Number();
var perPage   = new Number();
var page      = new Number();
var virgin    = true;

function init()
{
	showFilter( $('s') );
}

// register the new values required for each search
// a REAL man would do this dinamucally, but I'm not real
function register()
{
	setGroups();
	//perPage       = Math.round( numPhotos / ( groupIds.length ) );
	perPage       = numPhotos;
	page          = 1;
}

// set the ids of groups to search
function setGroups()
{
	groupIds.push( '40961104@N00' );// Wallpapers (1024x768 minimum)
	groupIds.push( '89919648@N00' );// Cool & Unusual Wallpapers for Windows
	groupIds.push( '94834891@N00' );// Wallpaper and Backgrounds
	groupIds.push( '97265118@N00' );// Wallpaper Exchange
	groupIds.push( '75907973@N00' );// Free Wallpaper 
	groupIds.push( '21065750@N00' );// Desktop Wallpapers for Dual Monitors
}

// return a random group Id
function getRandomGroupId()
{
	var id = new String();
	if( groupIds.length )
	{
		var rand = Math.round( Math.random() * groupIds.length );
		id = groupIds.splice( rand, 1 );
	}
	return id
}

// shows "about" section
function showAbout()
{
	var myAjax = new Ajax.Updater( 'aboutcontent', aboutURI, { method: 'get' });
	Element.toggle( 'secondarycontainer' );
}
function hideAbout()
{
	Element.toggle( 'secondarycontainer' );
}

// shows the filter at phrase "how many wallpapers[...]"
function showFilter( field )
{
	if( field.value )
	{ 
		$('showtag').innerHTML = ' sobre ' + field.value + ' ';
	}
	else
	{
		$('showtag').innerHTML = ' ';
	}
}

// Indiana Jones and the Last Crusade (em busca pelo cálice sagrado)
function searchWallpapers( num )
{
	// on the firts search, pop-up the Google AdSense
	if( virgin )
	{
		virgin = false;
		Effect.toggle( 'ads'    , 'appear' );// pop-up the AdSense
	}
	Effect.toggle( 'loading', 'appear' );// shows the loading animation
	// set values for this search
	numPhotos = num;
	photos    = new Array();
	tag = $('s').value;
	// do funny things
	register();
	flickrRequest( tag );
}

// request the XML to the groups
function flickrRequest( tag )
{
	var groupId = getRandomGroupId();
	var method = 'flickr.groups.pools.getPhotos'
	var pars = 'method=' + method
	+ '&group_id='	     + groupId
	+ '&tags='           + tag
	+ '&per_page='       + perPage
	+ '&page='           + page;
	var myAjax = new Ajax.Request( apiURI, { method: 'get', parameters: pars, onComplete: onLoadGroupPool });
	
}
// when loads the pool's xml
function onLoadGroupPool( originalRequest )
{
	var resXML = originalRequest.responseXML;
	var photoNodes = resXML.getElementsByTagName('photo');
	populaFotos( photoNodes );
}

// insert 'photo' objects at 'photos' array
function populaFotos( photoNodes )
{
	// if the search returned any items on actual group
	if( photoNodes.length )
	{
		for( i = 0; i < photoNodes.length; i++ )
		{
			var photo = createPhotoObj( photoNodes[ i ] );
			addPhoto( photo );
		}
	}
	groupsController();
}

// insert photo on array
// check the array to previne repeated entries.
function addPhoto( photo )
{
	photos.push( photo );
	/*if( !isOnPhotos( photo ) )
	{
		photos.push( photo );
	}*/
}

// check if photo is on array
// OBS: This is too much recursive for browser...
// I need to rewrite this
function isOnPhotos( photo )
{
	var isOn = false;
	for( i = 0; i < photos.length; i ++ )
	{
		if( photo.id == photos[ i ].id )
		{
			isOn = true;
		}
	}
	return isOn;
}

// check if searched at all groups
function groupsController()
{
	if( photos.length >= numPhotos )
	{
		checkResult();
	}
	// if not reached the number requested and the photos are feel, re-search with other group
	else if( groupIds.length && photos.length <= numPhotos )
	{
		flickrRequest( tag );
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
		Effect.Fade( 'loading' );//esconde o loading
		$('result').innerHTML = "<p>Sou só um <strong>software feito em noites livres</strong>, <strong>não consigo encontrar</strong> nenhum item que satisfaça sua busca.</p><p>Me ajude, seja menos específico ou <strong>use termos em inglês</strong> =)</p>"
	}
}

// check if have groups to seach at
function haveGroups()
{
	if( groupsIds.length )
	{
		return true;
	}
	else
	{
		return false;
	}
}

// cria um objeto photo com os dados necessários
// recebe um nó xemele
// retorna um objeto serializado
function createPhotoObj( photoNode )
{
	// objeto a ser retornardo
	photoObj = new Function();
	// dados	
	photoObj.id     = photoNode.getAttribute( 'id' );
	photoObj.server = photoNode.getAttribute( 'server' );
	photoObj.secret = photoNode.getAttribute( 'secret' );
	photoObj.owner  = photoNode.getAttribute( 'owner' );
	photoObj.title  = photoNode.getAttribute( 'title' );
	// caminhos para versões da foto em várias dimensões
	photoObj.url = new Function();
	photoObj.url.baseString = 'https://static.flickr.com/'
							+ photoObj.server
							+ '/'
							+ photoObj.id
							+ '_'
							+ photoObj.secret;
	photoObj.url.orig =  photoObj.url.baseString + '_o.jpg';
	photoObj.url.thumb =  photoObj.url.baseString + '_t.jpg';
	photoObj.url.square =  photoObj.url.baseString + '_s.jpg';
	// file ex: url: http://static.flickr.com/112/257332642_6d8d16d42c_m.jpg
	photoObj.url.view = 'https://flickr.com/photo_zoom.gne?id='
	                    + photoObj.id
	                    + '&size=o';
	// link ex: http://flickr.com/photo_zoom.gne?id=267591518&size=o
	return ( photoObj );
}

// imprime a listagem de resultados na tela
// usa a array photos para pegar o que imprimir
function drawResult()
{
	Effect.Fade( 'loading' );//esconde o loading
	$('result').innerHTML = '<ol id="resultlist"></ol>';
	for( i = 0; i < numPhotos; i++ )
	{
		printPhoto( photos[ i ] );
		if( i == photos.length )
		{
			break;
		}
	}
}

// imprime foto na tela
// recebe objeto com dados da foto
function printPhoto( objPhoto )
{
	// não enche o saco, eu imprimo do jeito que eu quiser, são 02:38
	$('resultlist').innerHTML += '<li><a href="'
	                          + objPhoto.url.view
	                          + '" target="_blank"><span>'
	                          + objPhoto.title
	                          + '</span><img src="'
	                          + objPhoto.url.square
	                          + '" title="'
	                          + objPhoto.title
	                          + '" /></a></li>';
}
