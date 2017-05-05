
// PRELOADER
	jQuery(window).load(function() {
        // will first fade out the loading animation
	jQuery(".sk-spinner").fadeOut();
        // will fade out the whole DIV that covers the website.
	jQuery(".preloader").delay(1000).fadeOut("slow");
});

// NIVO LIGHTBOX
$('.iso-box-section a').nivoLightbox({
        effect: 'fadeScale',
    });

// ISOTOPE FILTER
jQuery(document).ready(function($){
	// handlebars helps
	Handlebars.registerHelper('value', function (value, safeValue) {
	    var out = value || safeValue;
	    return out;
	});
	Handlebars.registerHelper('delay', function (unit, index, base) {
	    var delay = unit * (index % 3 + 1);
	    if (base > 0) {
	    	delay += base;
	    }
	    return delay;
	});

	var configFile = "js/config";
	var il8n = "en";
	if (il8n != "en") {
		configFile += il8n;
	}
	configFile += ".js";
	addScript(configFile, function() {
		changeTitle();
		rendTemplate("home-template");
		rendTemplate("brief-template");
		rendTemplate("menu-template");
		rendTemplate("aboutus-template");
		rendTemplate("team-template");
		rendTemplate("price-template");
		rendTemplate("contact-template");
		navInit();
		imageloadInit();
	});

	function navInit() {
			// MAIN NAVIGATION
		 $('.main-navigation').onePageNav({
		        scrollThreshold: 0.2, // Adjust if Navigation highlights too early or too late
		        scrollOffset: 75, //Height of Navigation Bar
		        filter: ':not(.external)',
		        changeHash: true
		    }); 

		    /* NAVIGATION VISIBLE ON SCROLL */
		    mainNav();
		    $(window).scroll(function () {
		        mainNav();
		    });

		    function mainNav() {
		        var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
		        if (top > 40) $('.sticky-navigation').stop().animate({
		            "opacity": '1',
		            "top": '0'
		        });
		        else $('.sticky-navigation').stop().animate({
		            "opacity": '0',
		            "top": '-75'
		        });
		    }


		// HIDE MOBILE MENU AFTER CLIKING ON A LINK
		    $('.navbar-collapse, a').click(function(){
		        $(".navbar-collapse").collapse('hide');
		    });
	}


	function changeTitle() {
		if (config.home.title) {
			document.title = config.home.title;
		}
	}

    function imageloadInit() {
		if ( $('.iso-box-wrapper').length > 0 ) { 

		    var $container 	= $('.iso-box-wrapper'), 
		    	$imgs 		= $('.iso-box img');

		    $container.imagesLoaded(function () {

		    	$container.isotope({
					layoutMode: 'fitRows',
					itemSelector: '.iso-box'
		    	});

		    	$imgs.load(function(){
		    		$container.isotope('reLayout');
		    	})

		    });

		    //filter items on button click

		    $('.filter-wrapper li a').click(function(){

		        var $this = $(this), filterValue = $this.attr('data-filter');

				// don't proceed if already selected 

				if ( $this.hasClass('selected') ) { 
					return false; 
				}

				$container.isotope({ 
					filter: filterValue,
					animationOptions: { 
					    duration: 750, 
					    easing: 'linear', 
					    queue: false, 
					}              	 
				});	            

				var filter_wrapper = $this.closest('.filter-wrapper');
				filter_wrapper.find('.selected').removeClass('selected');
				$this.addClass('selected');

		        return false;
		    }); 

		}
	}

});

// functions
function addScript(scriptPath, callback) {
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", scriptPath);
	if (callback && typeof(callback) == "function") {
		script.onload = callback;
	}
	document.body.appendChild(script);
}

function rendTemplate(template) {
	var $templateItem = $("#" + template);
	var source  = $templateItem.html();
	var template = Handlebars.compile(source);
	$templateItem.parent().html(template(config));
}

// WOW ANIMATED 
$(function()
{
    new WOW().init();
});