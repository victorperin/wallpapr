/*
	Author:  Marco Gomes
	E-mail:  eu@marcogomes.com
	Used at: http://MarcoGomes.com/wallpapr
	License: Attribution-Noncommercial-Share Alike 2.5 Brazil
	         http://creativecommons.org/licenses/by-nc-sa/2.5/br/deed.en
	Note:    If you change or improve on this script, please let me know by
	         emailing the author with a link to your demo page.
*/

$(window).bind('load',function(){
// Use the native jQuery JSONP to get data directly from Flickr
// ANIMAL! I really love jQuery and all its dev team
var webserviceURI = 'https://www.flickr.com/services/rest/?'
                     + '&format=json'
                     + '&api_key=eb46f4e8ff564a8e657288b1e56da80e';
var aboutURI    = 'about.html';
var photos      = new Array();
// melhor tbm salvar os Ids para comparação do que rodar comparação entre objetos complexos
var photosIds   = new Array();
var groupIds    = new Array();
var perPage     = new Number();
var page        = new Number();

// set groups ids into array
// already called in searchPhotos() :: dirs tip. 
//setGroupIds();

var userLogged = new Boolean(false);
// check if user is logged
$.post('../php/megazord.php', function(d){
	eval(d);
	if (d.status) {
		userLogged = true;
	}
},'json');

$('#tag').val('');
// hide loading-app animation
$('#loading-app').fadeOut(function(){
	// show input fields
	$('#input').fadeIn();
	$('#container').center();
});

$('#tag').keyup(showInfoSearch);

// shows the 'about [tag]' at "how many wallpapers..."
function showInfoSearch(){
	if( $('#tag').val() )
	{ 
		$('#showtag').html( 'about ' + $(this).val() + ' ' );
	}
	else
	{
		$('#showtag').html('');
	}
}

// debug function
// browser alerts are for noobas
function alert(val){
	$('#debug')[0].innerHTML += '<br />' + val;
}

// set groupIDs to array
function setGroupIds(){
	groupIds.push( '40961104@N00' ); // Wallpapers (1024x768 minimum)
	groupIds.push( '89919648@N00' ); // Cool & Unusual Wallpapers for Windows
	groupIds.push( '94834891@N00' ); // Wallpaper and Backgrounds
	groupIds.push( '97265118@N00' ); // Wallpaper Exchange
	groupIds.push( '75907973@N00' ); // Free Wallpaper 
	//groupIds.push( '21065750@N00' ); // Desktop Wallpapers for Dual Monitors
	groupIds.push( '358182@N20' ); // Wicked Wallpapers
	groupIds.push( '548678@N23' ); // Wallpaper Minimalism
	groupIds.push( '19604169@N00' ); // Designer Wallpaper
	groupIds.push( '67791423@N00' ); // Desktop_Wallpapers
	//groupIds.push( '64996107@N00' ); // WALLPAPER MONTHLY : 2006 EDITION
	groupIds.push( '25363140@N00' ); // wallpaper celeberty
}

// animates the interface elements
function animate(){
	$('#container').animate({ height:300, top:0 }, { duration:1000, easing: "backinout" });
	// show links
	$('#secondary').fadeIn();
}

function searchPhotos( num ){
	// reset groups ids, to make a brand new search
	groupIds = new Array(); // reset before add ;]
	setGroupIds();
	// reset photos array and photosIds, to make a brand new search
	photos = new Array();
	photosIds   = new Array();
	// set values for this search
	numPhotos = num;
	sTag = $('#tag').val();
	perPage = numPhotos;
	page = 1;
	
	// do funny things
	loadSearchResults( sTag );
	// log the thing
	$.post('../php/megazord.php', {keyword: sTag});
}

// request images JSON to flickr search
// only in a random wallpapers group
function loadSearchResults( sTag ){
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
		onLoadSearchResult( data );
	});
}


// when loads the search results JSON
this.onLoadSearchResult = function(data)
{
	// avoid erros when can't load data
	if(!data.photos)
	{
		// request data again
		searchPhotos(numPhotos);
		return false;
	}
	$.each(data.photos.photo, function(i,photo){
		//alert('<br />' + photo.title)
		modPhotoObj(photo);
		// verifica se já não tem fotos suficientes
		if ( photos.length < numPhotos ) {
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
	groupsController();
}

// inserts new attributes on standard object
// receive: JSON obj
// return: same obj with more attributes
function modPhotoObj( photo )
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
function groupsController()
{
	if( photos.length >= numPhotos )
	{
		checkResult();
	}
	// if not reached the number requested and the photos are
	// not sufficient, re-search with other random group
	else if( groupIds.length && photos.length <= numPhotos )
	{
		loadSearchResults( sTag );
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
		$('#output').html( '<p>I\'m just a <strong>nightly built software</strong> and I <strong>can\'t found</strong> any items macthing your criteria.</p><p>Help me being less specific.</p>');
	}
}


// prints the results array on the screen
// uses 'photos' array to get data to print
function drawResult()
{
	$('#output').html('<ol id="result"></ol>');
	$('#result').hide();
	// print each item on array
	$.each(photos, function(i,photo){
		printPhoto(photo);
	});
	hideLoading();
	createPermalink()
}


// print a photo object on screen
// receive: obj with photo data
function printPhoto( photo )
{
	// create jQuery objects with DOM elements
	// img node
	var img = $('<img/>')
		.attr('src', photo.square)
		.attr('title', photo.title);
	// link node with img appended
	var link = $('<a></a>')
		.attr('href', photo.url)
		.attr('target', '_blank')
		.addClass('photo')
		.append(img);
	
	var fav = $('<a></a>')
		.attr('href', '#')
		.attr('target', '_blank')
		.addClass('linkfav')
		.text('+fav')
		.click(function(){
			var t = $(this);
			// fav this photo
			$.post('../php/favs.php', photo, function(data){
				$(t).hide();
			}
			,'json');
			return false;
		});
	
	// list node with link appended
	var li = $('<li></li>').append(link);
	// if user is logged, print fav++ icon
	if (userLogged == true) {
		li.append(fav);
	};
	// controls animation
	$(img)
		.hide()
		.load(function(){
			$(this).fadeIn();
		});
	// put elements on screen
	$('#result').append(li);
}

// return a random group Id
// I like this very old function
function getRandomGroupId()
{
	var id = new String();
	if(groupIds.length)
	{
    	var rand = Math.round(Math.random() * groupIds.length-1);
    	// wrong index/lenght abstraction :: dirs tip. 
    	//var rand = Math.round(Math.random() * groupIds.length);
		id = groupIds.splice(rand, 1);
	}
	return id
}

// show the loading animation
// receive and callback function that is eval()
// I know that this is ugly like a baby troll, but is all I can do
function showLoading(callback)
{
	var fn = callback;
	// if resutls on screen
	if($('#result')[0])
	{
		// hide it
		$('#result').fadeOut('medium', function(){
			// executes the callback
			eval(fn);
		});
	}
	else{
		// executes the callback
		eval(fn);
	}
	// put 'loading' animation on screen
	$('#output').html(
		$('<img id="loading-anim" src="../img/ajaxLoadingPink.gif"/>').hide().fadeIn('slow')
	);
}

function hideLoading()
{
	$('#loading-anim').fadeOut('medium').remove();
	$('#result').fadeIn('medium');
}

// every button have the same onclick action
$('button').click(function(){
	animate();
	showLoading('searchPhotos(' + $(this).val() + ');');
});

// on key press [enter], do search
$('input[@type=text]').bind('keydown', function(e){
	if (e.keyCode == 13){
		showLoading( 'searchPhotos(20);' );
		animate();
	}
});


//
// Permalink section
//

function createPermalink(){
	var node = $('<div id="permalink"><a href="#">link for this search</a></div>');
	// creates the get string of permalink
	var encTag = $('#tag').val();
	var URIhash = 's=' + encTag
	+ '&pids=';
	$(photosIds).each(function(){
		URIhash += this + ',';
	});
	// pops out the last ','
	URIhash = URIhash.slice(0, URIhash.length - 1);
	
	// puts the permalink on the browser's navigation bar
	window.location.hash = URIhash;
	
	var permalinkURI = String(window.location.href);
	
	$(node).children('a').attr('href', permalinkURI);
	
	$('#output').append( node );
}


// check if exists a permalink
// format: #pids=91712225,2163278333,2140867848
function checkPermalink(){
	var strValues = String( window.location.href ).split('#')[1];
	if( strValues )
	{
		var arrValues = strValues.split('&');
		parsePermalink( arrValues );
		// inicial animation
		showLoading();
		animate();
	}
}

function parsePermalink( arrValues ){
	// objeto with permalink config
	var permalink = new Object();
	$( arrValues ).each(function(){
		var key = this.split('=')[0];
		var val = this.split('=')[1];
		permalink[ key ] = val;
	});
	doPermalink( permalink );
}

// do search using permalink values
function doPermalink( permalink ){
	$('#tag').val( unescape( permalink.s ) ).keyup();
	// photo IDs array
	photosIds = permalink[ 'pids' ].split(',');
	// ask for EACH photo details JSON (this is so slow)
	$(photosIds).each(function(){
		loadPhotoDetails( this );
	});
}

// request details of a spefic photo
function loadPhotoDetails( photoID ){
	var pars = '&method=flickr.photos.getInfo'
	+ '&photo_id=' + photoID;
	var requestURI = webserviceURI + pars;
	
	$.getJSON(requestURI + "&jsoncallback=?", function( data ){
		onLoadPhotoDetail( data );
	});
}

this.onLoadPhotoDetail = function( data ){
	var photo = modPhotoObj(data.photo);
	photo.title = data.photo.title._content;
	// adiciona ao array photos e o id no photosIds
	photos.push(photo);
	
	// check if all images from permalink were loaded
	if(photos.length == photosIds.length)
	{
		onLoadPermalinkPhotos();
	}
}

function onLoadPermalinkPhotos(){
	checkResult();
}

checkPermalink();

});
