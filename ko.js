var map;

function initMap() {
    // var startPoint = {lat: 39.8282, lng: -98.5795};
    var startPoint = {lat: 30.433283, lng: -87.240372};
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();
    var search = document.getElementById('searchContainer');
    var roto = document.getElementById('roto');
    var input = document.getElementById('searchInput');
    var autocomplete = new google.maps.places.Autocomplete(input);

    map = new google.maps.Map(document.getElementById('map'), {
      center: startPoint,
      zoom: 5
    });

    var service = new google.maps.places.PlacesService(map);

    //places the search boxes inside the map element
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(search);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(roto);

    var SimpleListModel = function(items) {

        this.items = ko.observableArray(items);

    }

    ko.applyBindings(new SimpleListModel());
}