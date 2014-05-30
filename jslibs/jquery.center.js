// Created by Andreas Lagerkvist http://exscale.se
// A center-function (uses dimensions plugin)
//
// marcogomes: chaged to Y axis only
$.fn.center = function(show_info)
{
	return this.each(function()
	{
		$(this).css({position: 'absolute'});

		//var leftPos = ($(window).width() - $(this).outerWidth()) / 2 + $(window).scrollLeft();
		var topPos = ($(window).height() - $(this).outerHeight()) / 2 + $(window).scrollTop();

		if(topPos < 0) topPos = 0;
		//if(leftPos < 0) leftPos = 0;

		if(show_info)
			alert('Element Width: ' +$(this).outerWidth() +' | Element Height: ' +$(this).outerHeight() +' | Window Width: ' +$(window).width() +' | Window Height: ' +$(window).height() +' | Scroll Top: ' + $(window).scrollTop() +' | Scroll Left: ' +$(window).scrollLeft() +' | Top Pos: ' +topPos +' | Left Pos: ' +leftPos);

		$(this).css({top: topPos +'px', zIndex: '1000'});
		//$(this).css({left: leftPos +'px', top: topPos +'px', zIndex: '1000'});
	});
}