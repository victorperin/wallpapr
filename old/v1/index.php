<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Wallpapr - A cool wallpaper search with Flickr API</title>
<meta name="generator" content="Bluefish 1.0.5"/>
<meta name="author" content="Marco Gomes"/>
<meta name="description" content="A cool wallpaper search with Flickr API"/>
<meta name="keywords" content="wallpaper, search, flickr, ajax, group"/>
<script type="text/javascript">
//<![CDATA[
try{if (!window.CloudFlare) {var CloudFlare=[{verbose:0,p:0,byc:0,owlid:"cf",bag2:1,mirage2:0,oracle:0,paths:{cloudflare:"/cdn-cgi/nexp/dok9v=abba2f56bd/"},atok:"a7318824665457e08006d6e4621e6e6c",petok:"acc603d4887875dd5e16bd15bde7d4025741b02c-1401477160-1800",zone:"marcogomes.com",rocket:"0",apps:{"ga_key":{"ua":"UA-2191265-1","ga_bs":"2"}}}];!function(a,b){a=document.createElement("script"),b=document.getElementsByTagName("script")[0],a.async=!0,a.src="//ajax.cloudflare.com/cdn-cgi/nexp/dok9v=97fb4d042e/cloudflare.min.js",b.parentNode.insertBefore(a,b)}()}}catch(e){};
//]]>
</script>
<link rel="stylesheet" type="text/css" href="style.css?v=0.1"/>
<script type="text/javascript" src="jslibs/prototype.js?v=0.1"></script>
<script type="text/javascript" src="jslibs/scriptaculous.js?v=0.1"></script>
<script type="text/javascript" src="functions.js?v=0.2"></script>
<script type="text/javascript">
/* <![CDATA[ */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-2191265-1']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function(b){(function(a){"__CF"in b&&"DJS"in b.__CF?b.__CF.DJS.push(a):"addEventListener"in b?b.addEventListener("load",a,!1):b.attachEvent("onload",a)})(function(){"FB"in b&&"Event"in FB&&"subscribe"in FB.Event&&(FB.Event.subscribe("edge.create",function(a){_gaq.push(["_trackSocial","facebook","like",a])}),FB.Event.subscribe("edge.remove",function(a){_gaq.push(["_trackSocial","facebook","unlike",a])}),FB.Event.subscribe("message.send",function(a){_gaq.push(["_trackSocial","facebook","send",a])}));"twttr"in b&&"events"in twttr&&"bind"in twttr.events&&twttr.events.bind("tweet",function(a){if(a){var b;if(a.target&&a.target.nodeName=="IFRAME")a:{if(a=a.target.src){a=a.split("#")[0].match(/[^?=&]+=([^&]*)?/g);b=0;for(var c;c=a[b];++b)if(c.indexOf("url")===0){b=unescape(c.split("=")[1]);break a}}b=void 0}_gaq.push(["_trackSocial","twitter","tweet",b])}})})})(window);
/* ]]> */
</script>
</head>
<body id="en" onload="init();"><script type="text/javascript">//<![CDATA[try{(function(a){var b="http://",c="marcogomes.com",d="/cdn-cgi/cl/",e="img.gif",f=new a;f.src=[b,c,d,e].join("")})(Image)}catch(e){}//]]></script>
<div id="container">
<div id="header">
<h1><a href="http://marcogomes.com/wallpapr">Wallpapr</a></h1>
<p id="slogan">A cool wallpaper search with <a href="https://www.flickr.com/services/api/"><strong>Flickr API</strong></a></p>
<a id="portuguese" href="pt/index.php" title="Ver esta aplicação em português"><img src="br.png" alt="Bandeira do Brasil"/></a>
</div>
<div id="ads" style="display:none;">
<script type="text/javascript"><!--
			google_ad_client = "pub-8401183536374454";
			google_ad_width = 468;
			google_ad_height = 60;
			google_ad_format = "468x60_as";
			google_ad_type = "text_image";
			//2006-10-16: Anúncio do Wallpapr
			google_ad_channel = "6939515048";
			google_color_border = "FFFFFF";
			google_color_bg = "FFFFFF";
			google_color_link = "FF0084";
			google_color_text = "0063DC";
			google_color_url = "FF0084";
			//--></script>
<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>
</div>
<div id="primary">
<form id="searchform" action="index.php#" onsubmit="searchWallpapers( 20 ); return false;">
<ol>
<li><input class="text" type="text" id="s" accesskey="s" onkeyup="showFilter(this)" onblur="showFilter(this);"/></li>
<li><h2>How many <strong>cool wallpapers <span id="showtag"></span></strong>you want?</h2>
<ul>
<li><button type="button" onclick="searchWallpapers( 20 ); return false;">20</button></li>
<li><button type="button" onclick="searchWallpapers( 40 ); return false;">40</button></li>
<li><button type="button" onclick="searchWallpapers( 100 ); return false;">100</button></li>
</ul>
<img id="loading" style="display:none;" src="ajaxLoadingPink.gif" width="32" height="32" alt="Loading Data"/>
</li>
</ol>
</form>
<div id="result">
</div>
</div>
<div id="debug"></div>
<div id="secondarycontainer" style="display:none;">
<div id="aboutcontainer" class="secondarysubcontainer">
<button id="closesecondary" type="button" onclick="hideAbout()">X</button>
<b class="secondary">
<b class="secondary1"><b></b></b>
<b class="secondary2"><b></b></b>
<b class="secondary3"></b>
<b class="secondary4"></b>
<b class="secondary5"></b>
</b>
<div id="aboutcontent" class="secondarycontent">
 
</div>
<b class="secondary">
<b class="secondary5"></b>
<b class="secondary4"></b>
<b class="secondary3"></b>
<b class="secondary2"><b></b></b>
<b class="secondary1"><b></b></b>
</b>
</div>
</div>
<div id="menu"><a href="about.xml" onclick="showAbout(); return false;">About (<acronym title="Frenquntly Asqued Questions">F.A.Q.</acronym>)</a></div>
<div id="footer">
<div id="lista2.0br">Classifique esta aplicação na <a href="http://lista2.0br.com.br/">Lista 2.0 BR</a>.</div>
<p class="licence">Made in <a href="http://en.wikipedia.org/wiki/Brazil">Brazil</a> by <a rel="author" href="http://marcogomes.com/">Marco Gomes</a> (<strong>eu <em>at</em> marcogomes <em>dot</em> com</strong>) but under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/2.5/br/deed.en">Creative Commons Attribution-ShareAlike 2.5 Brazil License</a>.</p>
<p>Running at <a href="http://vilago.com.br" target="_blank">Vilago</a>, the best hosting service of the Universe.</p>
<noscript><p>Você vai precisar de JavaScript para utilizar este site.</p></noscript></p>
</div>
</div>
<script src="http://www.google-analytics.com/urchin.js" type="text/javascript">
</script>
<script type="text/javascript">
_uacct = "UA-2191265-4";
urchinTracker();
</script>
</body>
</html>
