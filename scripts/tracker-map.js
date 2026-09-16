$(document).ready(function() {
	initialize();
	$.getJSON("/web/my/info/mapData", function(resp){
		data = resp;
		for (var i = 0; i < 100; i++){
			var ele = data[i];
			$("#webticker").append("<li><div><h5>"+ele.fullName+"</h5><h3>"+ele.relinquishedResortName+"</h3><h5> "+ele.relinquishedCity+"</h5></div></li>");
		}
		restart();
		$('#webticker').webTicker({
			speed: 60
		});
	});
});

var data = [];
var filteredData;
var dataCounter = 0;
var mainTimer;
var map;
var drawingManager;
var markersArray = [];
var secondaryMarkersArray = [];

var currentBounds;
var infowindow;

var relMap;
var desMap;


function initialize() {
	// create the map 
	var mapOptions = {
		center: new google.maps.LatLng(40, -60),
		zoom: 3,
		mapTypeId: google.maps.MapTypeId.ROADMAP 
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	
	drawingManager = new google.maps.drawing.DrawingManager({
	    drawingMode: google.maps.drawing.OverlayType.HAND,
		drawingControl: true,
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER,
			drawingModes: [
			  google.maps.drawing.OverlayType.CIRCLE
			]
		},
		circleOptions: {
			fillColor: '#ff7029',
			fillOpacity: 0.3,
			strokeWeight: 1,
			clickable: false,
			zIndex: 1,
			editable: false
		}
	});
	drawingManager.setMap(map);
	
	google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
		currentBounds = circle.getBounds();
		restart();
		circle.setMap(null);
	});
	
	
	//$('#webticker').webTicker();
}

function restart(){
	filteredData = [];
	dataCounter = 0;
	clearTimeout(mainTimer);
	deleteOverlays();
	// lets start the data processing
	var steppingTime = 0;
	if (!currentBounds){
		filteredData = data;
		steppingTime = 300;
	} else {
		for (var i = 0; i < data.length; i++){
			var d = data[i];
			var source = new google.maps.LatLng(d.relinquishedResortLat, d.relinquishedResortLong);
			if (currentBounds.contains(source)){
				filteredData.push(d);
			}
		}
		steppingTime = 20;
	}
	mainTimer = window.setInterval(addPath, steppingTime);
}

function addPath(){
	
	var currentData = filteredData[dataCounter];
	draw(currentData, dataCounter);
	dataCounter++;
	if (dataCounter == filteredData.length)
		clearTimeout(mainTimer);
}

function draw(currentData, i){
	if (!currentData)
		return;
	
	var source = new google.maps.LatLng(currentData.relinquishedResortLat, currentData.relinquishedResortLong);
	var destination = new google.maps.LatLng(currentData.destinationResortLat, currentData.destinationResortLong);
	var points = new google.maps.MVCArray();
	points.push(source);
	
	var line = new google.maps.Polyline({
		path: points,
		geodesic: true, 
		strokeColor: "#FFFFFF", //C8F526
		strokeOpacity: 1.0,
		strokeWeight: 1,
		map: map
	});
	markersArray.push(line);
//	var pin = currentData.transactionType != 'EX' ? "/images/orange_circle.png" : "/images/blue_circle.png"
//	var marker = new google.maps.Marker({
//		position: source,
//		map: map,
//		//animation: google.maps.Animation.DROP,
//		title: currentData.relinquishedResortName,
//		iidata: currentData,
//		icon: pin
//	});
//	
//	markersArray.push(marker);
//	google.maps.event.addListener(marker, 'click', function(){
//		onMarkerClick(marker);
//	});
	
	var count = 0;
	var annimationTimer = window.setInterval(function() {
		count += 0.05;
		var newPoint = google.maps.geometry.spherical.interpolate(points.getAt(points.getLength() - 1), destination, count);
		points.push(newPoint);
		if (count >= 1){
			clearTimeout(annimationTimer);
			var pin2 = currentData.transactionType != 'EX' ? "/images/blue_pin.png" : "/images/orange_pin.png"
			var marker2 = new google.maps.Marker({
				position: destination,
				//animation: google.maps.Animation.DROP,
				map: map,
				title: currentData.destinationResortName,
				iidata: currentData, 
				icon: pin2
			});
			markersArray.push(marker2);
			google.maps.event.addListener(marker2, 'click', function() {
				onMarkerClick(marker2);
			});
		}
	}, 80);
}

function onMarkerClick(marker){
	// info window stuff
	if (infowindow)
		infowindow.close();

	// delete old markers
	deleteSecondaryOverlays();
	var data = marker.iidata;
	var heading = "";
	if (data.transactionType == 'EX'){
		heading = "Exchange";
	} else {
		heading = "Getaway";
	}
		
	$("#heading").html(heading);
	
	// now set the other stuff
	if (data.transactionType == 'EX'){
		$("#relBox").show();
		$("#relinquishedResortName").html(data.relinquishedResortName);
		$("#relinquishedResortCode").html(data.relinquishedResortCode);
		$("#relinquishedCity").html(data.relinquishedCity);
		$("#relinquishedTerritoryDescription").html(camelCase(data.relinquishedTerritoryDescription));
		$("#relinquishedCountry").html(data.relinquishedCountry);
		
		$("#relImg").attr('src', 'http://www.intervalworld.com/images/_resd/jpglg/ii_'+data.relinquishedResortCode.toLowerCase()+'1.jpg');
		$("#relMoreDetails").attr('href', '/web/cs?a=1503&resortCode=' + data.relinquishedResortCode);
	} else {
		$("#relBox").hide();
	}
	
	
	$("#destBox").show();
	$("#destinationResortName").html(data.destinationResortName);
	$("#destinationResortCode").html(data.destinationResortCode);
	$("#destiantionCity").html(data.destiantionCity);
	$("#desitinationTerritoryDescription").html(camelCase(data.desitinationTerritoryDescription));
	$("#destinationCountry").html(data.destinationCountry);
		
	$("#desImg").attr('src', 'http://www.intervalworld.com/images/_resd/jpglg/ii_'+data.destinationResortCode.toLowerCase()+'1.jpg');
	$("#desMoreDetails").attr('href', '/web/cs?a=1503&resortCode=' + data.destinationResortCode);
	
		//	$(".des_rel_pins img")[0].src = "/images/rel_pin.png";
		
	//	$(".des_rel_pins img")[0].src = "/images/dest_pin.png";
		
	
	
	infowindow = new google.maps.InfoWindow({
		content: $("#popupBox").html()
	});
	
	infowindow.open(map, marker);
}

function deleteOverlays() {
	if (markersArray) {
		for (i in markersArray) {
		  markersArray[i].setMap(null);
		}
		markersArray.length = 0;
	}
}

function deleteSecondaryOverlays() {
	if (secondaryMarkersArray) {
		for (i in secondaryMarkersArray) {
			secondaryMarkersArray[i].setMap(null);
		}
		secondaryMarkersArray.length = 0;
	}
}
function camelCase(s) {
	  return (s||'').toLowerCase().replace(/(\b|-)\w/g, function(m) {
	    return m.toUpperCase().replace(/-/,'');
	  });
	}

