
// PRELOADER
	jQuery(window).load(function() {
        // will first fade out the loading animation
	jQuery(".sk-spinner").fadeOut();
        // will fade out the whole DIV that covers the website.
	jQuery(".preloader").delay(1000).fadeOut("slow");
});


// ISOTOPE FILTER
jQuery(document).ready(function($){
	// handlebars helps
	Handlebars.registerHelper('value', function (value, safeValue) {
	    var out = value || safeValue;
	    return out;
	});
	Handlebars.registerHelper('delay', function (unit, index, base) {
	    var delay = unit * (index + 1);
	    if (base > 0) {
	    	delay += base;
	    }
	    return delay;
	});
	var defaultConfigFile = "js/config";
	var configFile = defaultConfigFile;
	var langParam = null;
	var lang = null;
	// get query string
	langParam = getUrlParam("lang");
	if (langParam) {
		lang = langParam;
	} else {
		// get lang from cookie
		lang = $.cookie("lang");
	}
	if (lang != "en") {
		configFile += "-" + lang;
	}
	addScript(configFile, function() {
			init();	
			if (langParam && langParam != "en") {
				$.cookie("lang", langParam, { expires: Number.MAX_VALUE, path: '/' });
			}
		}, function() {
		if (defaultConfigFile != configFile) {
			addScript(defaultConfigFile, init);
			$.cookie("lang", null, { expires: -1, path: '/' });
		}
	});

	function init() {
		changeTitle();
		rendTemplate("home-template");
		rendTemplate("brief-template");
		rendTemplate("menu-template");
		rendTemplate("aboutus-template");
		rendTemplate("service-template");
		rendTemplate("team-template");
		rendTemplate("portfolio-template");
		rendTemplate("price-template");
		rendTemplate("client-template");
		rendTemplate("contact-template");
		navInit();
		serviceInit();
		imageloadInit();

		$.localScroll({filter:'.smoothScroll'});

		$('#messageForm').submit(function(e){
			if (!$("#customerName").val()) {
				alert(config.contact.email.form.invalid+": "+config.contact.email.form.name);
				$("#customerName").focus();
			} else if (!$("#customerEmail").val()) {
				alert(config.contact.email.form.invalid+": "+config.contact.email.form.email);
				$("#customerEmail").focus();
			} else if (!$("#messageSubject").val()) {
				alert(config.contact.email.form.invalid+": "+config.contact.email.form.subject);
				$("#messageSubject").focus();
			} else if (!$("#messageContent").val()) {
				alert(config.contact.email.form.invalid+": "+config.contact.email.form.message);
				$("#messageContent").focus();
			} else {
				return true;
			}
			return false;
    	});
	}

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

	function serviceInit() {
		var serviceBar = $('.service-bar');
		serviceBar.mouseenter(function() {
			var $this = $(this);
			$this.find('img').slideUp("fast");
			$this.find('.service-bar-detail').fadeIn("slow");
			$this.find('.fa-chevron-down').hide("fast");
		});

		serviceBar.mouseleave(function(e) {
			var $this = $(this);
		    var x=e.pageX;
		    var y=e.pageY;
			var divOffset = $this.offset();
			var divx1 = divOffset.left;
		    var divy1 = divOffset.top;
		    var divx2 = divx1 + $this.width();
		    var divy2 = divy1 + $this.height();
		    if( x < divx1 || x > divx2 || y < divy1 || y > divy2) {
		    	$this.find('img').slideDown("fast");
				$this.find('.service-bar-detail').fadeOut("fast");
				$this.find('.fa-chevron-down').show("fast");
		    }
		});
	}

    function imageloadInit() {

		// NIVO LIGHTBOX
		$('.iso-box-section a').nivoLightbox({
		        effect: 'fadeScale',
		    });

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
function addScript(scriptPath, callback, errorCallback) {
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", scriptPath + ".js");
	if (callback && typeof(callback) == "function") {
		script.onload = callback;
	}
	if (errorCallback && typeof(errorCallback) == "function") {
		script.onerror = errorCallback;
	}
	document.body.appendChild(script);
}

function rendTemplate(template) {
	var $templateItem = $("#" + template);
	var source  = $templateItem.html();
	var template = Handlebars.compile(source);
	$templateItem.parent().html(template(config));
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}


// WOW ANIMATED 
$(function()
{
    new WOW().init();
});