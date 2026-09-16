var II = II || {};

II.Video = II.Video || {
    id: null,
    scrollTop: null,
    isIE8orLess: null
};


//-- this is mainly for Forward/Back support --//
$(window).bind( 'hashchange', function(event) {  
    var fragment = $.deparam.fragment();
    
    //-- if there was a video requested... --//
    if(fragment.vid) {
        II.Video.id = fragment.vid;       
        showPlayer();
    } else {    	
        //-- only hide the overlay if already displayed --//
        var alreadyOpen = ( $('#ihd_player_overlay').css('marginLeft') === "0px" ) ? true : false;
        if(alreadyOpen === true) {
            hidePlayer();
        } else {
            showResults(fragment);
        }
    }
    
});


$(document).ready( function() {
    
    //-- is this IE 6, 7, or 8? --//
    if($.browser.msie &&
            $.browser.version === "6.0" || $.browser.version === "7.0" || $.browser.version === "8.0") {
        II.Video.isIE8orLess = true;
    } else {
        II.Video.isIE8orLess = false;
    }
	
    //-- add the background class to the content wrapper if they are logged in --//
    //if( $('#site_tools').length > 0 ) $('#channel-content_wrapper').addClass('with_back');
    
	/*-- Main Carousel :: START --*/
    var imagesPerSet = 1;
    
	$('.mycarousel').jcarousel({
        scroll: imagesPerSet,
        wrap: 'circular',
        itemFallbackDimension: 300,
        setupCallback: function(inst) {
            //-- move the indicators to within the carousel container --//
            // $('.carousel_page_wrapper').appendTo('.jcarousel-container');
            
            inst.sets = Math.ceil(inst.size() / imagesPerSet);
            
            //-- create the indicators based on the number of sets --//
            var $indicatorCollection = $('<div class="carousel_page_wrapper"></div>');
            var $indicatorTemplate = $('<span class="carousel_page_indicator" title="Page 1">&bull;</span>');
            for(var i = 1; i <= inst.sets; i++) {
                var clone = $indicatorTemplate.clone();
                clone.attr('title', "Page " + i);
                //-- apply the active state to the first indicator --//
                if(i == 1) clone.addClass('indicator_active').css('color', '#777777');
                //-- add the current indicator to the collection --//
                $indicatorCollection.append(clone);
            }
            
            $indicatorCollection.find('.carousel_page_indicator').each( function(i, el) {
                //-- assign the click event handler to make these secondary controls --//
                $(this).click( function(event) {
                    inst.scroll((i * imagesPerSet) + 1);
                });
            });

            //-- insert the collection of indicators to the page --//
            $(inst.container)
                .append($indicatorCollection)
                .find('.carousel_page_wrapper')
                    //-- calculate the widths of the pagination indicator container for proper centering --//
                    .width( function() {
                        return $(this).find('.carousel_page_indicator').eq(0).outerWidth(true) * $(this).find('.carousel_page_indicator').length;
                    })
                .end()
            ;
            
            //-- relocate the 'all resorts' and 'all destinations' links --//
            $(inst.container).closest('.carousel_wrap_inner').find('.ihd_carousel_all_destinations').appendTo( $(inst.container) );
            
            //-- fade in the carousel contents, now that it's loaded --//
            inst.container.closest('.jcarousel-skin-tango')
                .css({marginLeft: 0})
                .animate({
                    opacity: 1
                }, 1000)
            ;
            
            if(II.Video.isIE8orLess === true) {
                
                $(inst.container).find('.ihd_carousel_thumbnails_play').animate({
                    opacity: 0.7
                }, 0, function() {
                    $(this).css('filter', '');
                });

                $(inst.container).find('.ihd_carousel_thumbnails_grey').animate({
                    opacity: 0
                }, 1000);
            }
        },
        itemLoadCallback: {
            onBeforeAnimation: function(inst, state) {
                if(state === "init") return;
                
                //-- we have to jump through some hoops to get the pagination indicator correct, when using wrap: 'circular' --//
                var currentIndex = inst.container.find('.indicator_active').index();
                
                //-- disable pagination controls while animating --//
                inst.container.find('.indicator_active')
                    .animate({
                        color: "#d2d2d2"
                    })
                    .removeClass('indicator_active')
                ;

                //-- set the next indicator active --//
                var nextIndex = currentIndex;
                
                if(inst.first > inst.size()) {
                    if(state === "next") {
                        nextIndex = currentIndex === (inst.sets - 1) ? 0 : currentIndex + 1;
                    } else if(state === "prev") {
                        nextIndex = currentIndex === 0 ? inst.sets - 1 : currentIndex - 1;
                    }
                } else {
                    nextIndex = (inst.last / imagesPerSet) - 1;
                }
                
                inst.container.find('.carousel_page_indicator').eq(nextIndex)
                    .animate({
                        color: "#777777"
                    })
                    .addClass('indicator_active')
                ;
            }
        }
    });
    /*-- Main Carousel :: END --*/
   
       
	/*--DROP MENU--*/	
	$('.ihd_toggle').click( function() {
        var selector;
        
        //-- only toggle the related content --//
        if( $(this).hasClass('ihd_header_tabs_resort') ) {
            selector = '.ihd_expanded_menu.resort_list';
        } else if( $(this).hasClass('ihd_header_tabs_tutorial') ) {
            selector = '.ihd_expanded_menu.tutorial_list';
        }
        
        //-- set/unset the active state for the tab --//
        if( $(selector).is(':visible') ) {
            $(this).removeClass('active');
            $(selector).slideUp();
        } else {
            $('.ihd_toggle').removeClass('active');
            $('.ihd_expanded_menu:visible').slideUp();
            $(selector).slideDown();
            $(this).addClass('active');
        }
        
	    });

    $('.ihd_expanded_menu_x').click( function() {
        $('.ihd_expanded_menu').slideUp();
        $('.ihd_toggle').removeClass('active');
    });
	
    //-- set the video ID, and start the player --//        
    $(".player_show").click( function() {
        // II.Video.id = $(this).attr('href');    	
        showPlayer();       
    });
    
    //-- dismisses the player overlay --//        
    $(".player_hide").click( function() {
    	window.location.hash = "#hdhome";
    });
    
    //-- if there is a video ID in the URL, immediately open the player and play it --//
    var fragment = $.deparam.fragment();
    if(fragment.vid) {
        II.Video.id = fragment.vid;
        showPlayer();       
    } else if(fragment.show && fragment.areaCode && fragment.areaName) {
    	//-- if there was a resort or destination requested... --//
        showResults(fragment);
    }
    
    hoverFade();
        
    //-- make sure the wrapper always fills the browser window --//
    $(window).bind('resize', adjustOverlay);
    adjustOverlay();
    $('.fader').css({'opacity': '0'});
	
	preDeepLinkDate();

});


function hoverFade() {
    /*-- hover effect for the thumbnails --*/
    $(".fader").hover(
        function () {
            $(this).stop().animate({opacity: 0.7});
        },
        function () {
            $(this).stop().animate({opacity: 0});
        }
    );
}


function showResults(fragment) {
  
    //-- first we move the home page content, if that's what's currently loaded --//
    if( $('#ihd_video_area #ihd_home_wrap').length > 0 ) {
    	
        $('#ihd_video_area #ihd_home_wrap').appendTo('body');
    }
    
    if($.param.fragment().length == 0) {
        //-- if there was nothing specific requested, show the home content --//
        $('#ihd_video_area').fadeOut('fast', function() {
            $(this).html( $('#ihd_home_wrap') ).fadeIn();
        });
    } else if(fragment.show && fragment.areaCode && fragment.areaName) {
    	//-- show the requested content --//
        var url = "/web/my/hd/" + fragment.show + "?areaCode=" + fragment.areaCode + "&areaName=" + escape(fragment.areaName);
        $.get(url, function(data) {
            $('#ihd_video_area').fadeOut('fast', function() {
                $(this).html(data).fadeIn(function() {
                    hoverFade();
                });
            });
        });
    } else {
    	//-- invalid requests just return false --//
        return false;
    }
    
}


function showPlayer() {
    
    //-- clear particular Exchange/Getaway search form values --//
    $('input[name="searchCriteria"], input[name="areaCode"]').val("");
    
    var vReference = getVidReferenc();
   
    if(vReference == 'tutorial'){
    	$('#ihd_player_header_search').hide();
    }else{
    	$('#ihd_player_header_search').show();	
    }
    
    //-- set new Exchange/Getaway search form values based on search type --//
    $.get("/web/my/hd/videoResort?externalRef=" + getVidId(), function(data) {
        if (data.length && data.length == 3) {
            $('input[name="searchType"]').val( 'ResortSearch');
            $('input[name="searchCriteria"]').val( data);
        } else {
            $.get("/web/my/hd/videoArea?externalRef=" + getVidId(), function(aData) {
                $('input[name="searchType"]').val( 'MapSearch');
                $('input[name="areaCode"]').val( aData);
            });
        }
    });
    
    //-- load the video name --//
    $.get(
        "/web/my/hd/videoName?externalRef=" + getVidId() + "&vname=" + getVidName(),
        function(data) {
          if (data.indexOf("undefined") == -1)
        	$('#videoName').html(data);
        }
    );

    var alreadyOpen = ($('#ihd_player_overlay').css('marginLeft') === "0px") ? true : false;
    // console.log("alreadyOpen: " + alreadyOpen);
    
    //-- record the location of the scroll bar, and then bring it to the top --//
    II.Video.scrollTop = $(window).scrollTop();
    if(alreadyOpen === false) $(window).scrollTop(0);
    
        
    //-- initially hides, and then later fades in elements in stages --//
    $('.delay_fourth').animate({
        opacity: 0
    }, 'fast');
    
    if(alreadyOpen === false) {
        $('.delay_first, .delay_second').animate({
            opacity: 0
        }, 'fast');
    }

    //-- slide in the overlay --//
    $('#ihd_player_overlay').animate({marginLeft: 0}, II.Video.isIE8orLess === true ? 0 : 'normal', function() {
        // console.log("inside - alreadyOpen: " + alreadyOpen);
        
        //-- now that the slide animation is complete, bring in the player and related elements --//
        //-- if the player is already loaded, queue up the new video --//
        var alreadyLoaded = (player_frame.location.pathname === "/html/channelPlayer.html") ? true : false;
        if (alreadyLoaded === true) {
            player_frame.pauseVideo(); 
        }
        
        hoverFade();
        
        //-- retrieve the related content, and kick off all of the related events --//
        $.get("/web/my/hd/player?externalRef=" + getVidId(), function(data) {
            //-- these things don't need to happen if the player is already loaded
            if(alreadyOpen === false) {
                
                //-- binds the player carousel thumbnails --//
                $(data).find('.ihd_resort_item').click(function(event) {
                    event.preventDefault();
                    var url = "/web/my/hd/destinations?areaCode=" + event.target.id + "&areaName=" + escape(event.target.name);
                    $.get(url, function(data) {
                        $('#ihd_video_area').html(data);
                    });
                });
                
                //-- we need this to workaround a jQueryUI CSS issue --//
                // $(data).find('#ihd_player_tabs').attr('class', "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
                
                //-- insert the data returned into the player in the DOM, and bind related events --//
                $('#ihd_player_tabs_wrap')
                    .html(data)
                    /*-- this is lost when new content is pulled in dynamically, so we must add it back --*/
                    .find('#ihd_player_tabs')
                        .attr('class', "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all")
                    .end()
                    .find('.ihd_resort_item').click( function(event) {
                        $.get("/web/my/hd/destinations?areaCode=" + event.target.id +"&areaName=" + escape(event.target.name),
                            function(data) {
                                $('#ihd_video_area').html(data);
                            }
                        );
                    }).end()
                ;
                
            }
        
            $(".delay_first").delay(500).animate({opacity: 1}, 'slow');
            
            $(".delay_second").delay(1000).animate({opacity: 1}, 'slow', function() {
                // console.log("second - carousel tabs");
                //-- these things don't need to happen if the player is already loaded --//
                if (alreadyOpen === false) {
                    
                    $('#ihd_player_tabs_wrap').tabs({
                        fx: {
                            // opacity: 'toggle',
                            height: 'toggle'
                        },
                        create: function(event, ui) {
                            //-- put back the content (IE accommodation) --//
                            if(II.Video.isIE8orLess === true) {
                                $('.ihd_tab_content').css('marginLeft', 0);
                            }
                        }
                    });
                    
                    //-- if there are less then 5 thumbnails, we will suppress the circular wrap --//
                    var numOfThumbs = $(this).find('.carousel_player li').length;
                    
                    $(this).find('.carousel_player')
                        //-- now that the markup is in-place, load the player carousel --//
                   
                        .jcarousel({
                            scroll: 3,
                            wrap: null,
                            setupCallback: function(inst) {                            	
                                //-- put back the content (IE accommodation) --//
                                if(II.Video.isIE8orLess === true) {
                                    $('.ihd_tab_content').css('marginLeft', 0);
                                }
                                
                                //-- fade in the carousel contents, now that it's loaded --//
                                inst.container.closest('.carousel_wrap_inner').animate(
                                    {opacity: 1}, 'slow', function() {
                                        //-- put back the content (IE workaround) --//
                                        $(this).css('filter', '');
                                        
                                        //-- adjust opacity on hover of thumbnails --//
                                        inst.list.animate({
                                            opacity: 1
                                        }, 'normal', function() {
                                            if(II.Video.isIE8orLess === true) {
                                                //-- for IE7 and 8 opacity issue --//
                                                $('#ihd_player_tabs_wrap .jcarousel-skin-tango, #ihd_player_tabs_wrap .carousel_content').css('filter', '');
                                            }
                                        })
                                        .find('li .fader')
                                            .hover(
                                                function() {
                                                	
                                                	
                                                    $(this)
                                                        .stop()
                                                        .css({boxShadow: "none"})
                                                    ;
                                                    $(this)
                                                        .stop()
                                                        .animate({opacity: 0.7})
                                                   ;
                                                },
                                                function() {
                                                    $(this)
                                                        .stop()
                                                        .css({boxShadow: "0 0 0 #000"})
                                                    ;
                                                    $(this)
                                                        .stop()
                                                        .animate({opacity: 0.0})
                                                    ;
                                                }
                                            )
                                            
                                        ;
                                    }
                                );
                                
                            },
                            itemFallbackDimension: 300
                        })
                    .add( $(this).find('.jcarousel-prev, .jcarousel-next, .vid_info_wrapper, .vid_info_wrapper_2_line, .ihd_destination_label, .ihd_destination_label_fold') )
                        .css({opacity: 0.1})
                    ;
                }
            })
            //-- hover over the entire carousel --//
            .hover(
                function() {
                    $(this)
                        .find('.jcarousel-prev, .jcarousel-next, .vid_info_wrapper, .vid_info_wrapper_2_line, .ihd_destination_label, .ihd_destination_label_fold')
                            .stop()
                            .animate({opacity: 1}, 'fast')
                        .end()
                       // .find('.fader').stop().animate({opacity: 0.5}, 'fast').end()
                    ;
                },
                function() {
                    $(this)
                        .find('.jcarousel-prev, .jcarousel-next, .vid_info_wrapper, .vid_info_wrapper_2_line, .ihd_destination_label, .ihd_destination_label_fold')
                            .stop()
                            .animate({opacity: 0.2}, 'normal')
                        .end()
                       // .find('.fader').stop().animate({opacity: 0.9}).end()
                    ;
                }
            );
            
            $(".delay_third").delay(0).animate({opacity: 1}, 0, function() {
               player_frame.location.replace("/html/channelPlayer.html");
            });
            
            $(".delay_fourth").delay(1000).animate({opacity: 1}, 'slow', function() {});
            
        });
        
        //-- for IE --//
        // $('body').css({overflowX: 'auto'});       
    });   
	
}

function hidePlayer() {
//    console.log("hidePlayer");
    
    //-- first pause the video... --//
    player_frame.videojs.getPlayers().videoPlayer.pause();
    
    //-- ...and then unload the player within the iframe --//
    $('.delay_second, .delay_fourth').animate({opacity: 0}, II.Video.isIE8orLess === true ? 0 : 'fast', function() {
    
        //-- now hide the overlay --//
        $('#ihd_player_overlay').animate({
            marginLeft: $('#ihd_player_overlay').width()
        }, II.Video.isIE8orLess === true ? 0 : 'normal', function() {
                //-- for IE --//
        });
    });
   
}

function getVidId() {
    return $.deparam.fragment().vid;
}

function getVidName() {
    return $.deparam.fragment().vname;
}

function getVidReferenc() {
    return $.deparam.fragment().vref;
}

/**
 * Ensures the overlay takes up the full width and height of the browser viewport
 */
function adjustOverlay() {
    //-- if the height or width of the document is greater then the content, leave it at 100% --//
    var width = $(document).width() > $('#ihd_player_wrap').width() ? '100%' : $(document).width();
    var height = $(document).height() > parseFloat( $('#ihd_player_overlay').css('minHeight') ) ? '100%' : $(document).height();
    
    //-- we may need to adjust the left margin of the overlay --//
    var overlayOpen = ($('#ihd_player_overlay').css('marginLeft') === "0px") ? true : false;
    
    $('#ihd_player_overlay')
        .height( height )
        .width( width )
        .css({
            marginLeft: overlayOpen === true ? 0 : $('#ihd_player_overlay').outerWidth()
        })
    ;
}

function preDeepLinkDate(){
    $("a[rel$='_dates']").click(function(){
    	$("input[id^='fromDate']").val('');
    	$("input[id^='toDate']").val('');
    	var type = $(this).attr("rel");
        var url = document.location.href;
        var startDate = url.split('startDate=').pop().split('&').shift(); 
        //console.log(startDate);
        var endDate = url.split('endDate=').pop().split('&').shift();
        //console.log(endDate);
           if(compareDate(type,startDate,endDate)){
                  $("input[id^='fromDate']").val(startDate);
                  $("input[id^='toDate']").val(endDate);
                  $("input[id^='toDate']").prop("disabled",false);
                  
           }
           
    });
}

function compareDate(type,startDate,endDate){
	startDate = new Date(startDate);
	endDate = new Date(endDate);
    var nowDate = new Date();
    var startDateTime = startDate.getTime();
    //the date format is mm-dd-yyyy
    var todayDate = (nowDate.getMonth()+1) + "/"+ nowDate.getDate() + "/" + nowDate.getFullYear();
    var nowDateTime = new Date(todayDate).getTime();
    var endDateTime = endDate.getTime();
    
    var gwMaxDate = new Date().setMonth(nowDate.getMonth() + 18);
    var exMaxDate = new Date().setFullYear(nowDate.getFullYear() + 2);
    
    //if type is gw
    if(type == "#getaway_dates"){
    	if(nowDateTime <= startDateTime && startDateTime <= gwMaxDate && endDateTime <= gwMaxDate ){
    		return true;
    	}
    }
    //if type is ex
    else if(type == "#exchange_dates"){
    		if(nowDateTime <= startDateTime && startDateTime <= exMaxDate && endDateTime <=exMaxDate){
        		return true;
    	}
   }else{
	   
	   return false;
   }
    return false;
    
}

