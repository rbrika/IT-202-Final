var latitude;
var longitude;
var map;
function initMap(){
    var chicago = {lat: 41.8781, lng: -87.6298};
    map = new google.maps.Map(document.getElementById('map1'), {zoom: 12, center: chicago}); 
    navigator.geolocation.getCurrentPosition(function(position) {
    // Center on user's current location if geolocation prompt allowed
         latitude=position.coords.latitude;
        longitude=position.coords.longitude;
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    map.setCenter(initialLocation);
    map.setZoom(19);
  }, function(positionError) {
    // User denied geolocation prompt - default to Chicago
    map.setCenter(new google.maps.LatLng(41.8781, -87.6298));
    map.setZoom(5);
  });
    
};

$(document).ready(function () { 
    
    initMap();
    makeAjax();
    function makeAjax(){
        $.ajax({
            url: 'https://data.cityofchicago.org/resource/9rg7-mz9y.json',
            method: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(data){
                console.log(data);
                $.each(data, function(i,v){
                    
                    var result=distance(latitude,longitude,v.latitude,v.longitude);
                    console.log(result);
                    var location = {lat: parseFloat(v.latitude), lng: parseFloat(v.longitude)};
                    var marker = new google.maps.Marker({
                        position: location,
                        map: map,
                        title: 'Hello World!'
                    });
                    var infowindow = new google.maps.InfoWindow({
                         content:
                          '<div id="content">'+
                              '<div id="siteNotice">'+
                              '</div>'+
                               '<h1 id="firstHeading" class="firstHeading"> District ' 
                                +v.district+ 
                                '</h1>'+
                                '<div id="bodyContent">'+
                                '<b>Address: '+v.address+' '+v.city+
                                ' '+v.state+' '+v.zip+'</b>'+
                                '<br><br><b>Phone Number: '+v.phone+
                                '</b><br><br><b>Distance in km from your current location: '+Number((result).toFixed(2))+'</b>'+
                                '</div>'+
                          '</div>'
                  });
                  marker.addListener('click', function() {
                      infowindow.open(map, marker);
                  });
                });
            }
        });
    }
    function distance(la, ln, lat0, lng0){
        deglen = 110.25;
        x = la - lat0;
        y = (ln - lng0)*Math.cos(lat0);
        return deglen*Math.sqrt(x*x + y*y);
    }
        
    
});
