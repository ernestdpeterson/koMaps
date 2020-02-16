/* exported google modalClose modalFunc initMap */
/* global ko google */
/* eslint-env jquery */
var map;
var typeVariable;

// BEHAVIOR CONTROL FOR MY MODALS:
// When the user clicks the button, open the modal
function modalFunc(controlValue) {
    var modalShow = document.getElementById("modal"+controlValue);
    modalShow.style.display = "block";
}

// When the user clicks on <span>(x), close the modal
function modalClose(idValue) {
    var modalX = String(idValue).replace(/close/, "modal");
    var modalC = document.getElementById(modalX);
    modalC.style.display = "none";
}

// When the user clicks anywhere outside the modal, close it
window.onclick = function(event) {
    if ($(event.target).hasClass("modal")) {
        event.target.style.display = "none";
        console.log("it Works!");
    }

};

function initMap() {
    // var startPoint = {lat: 39.8282, lng: -98.5795};
    var startPoint = {lat: 30.433283, lng: -87.240372};
    var infowindow = new google.maps.InfoWindow();
    var search = document.getElementById("searchContainer");
    var roto = document.getElementById("roto");
    var input = document.getElementById("searchInput");
    var autocomplete = new google.maps.places.Autocomplete(input);

    map = new google.maps.Map(document.getElementById("map"), {
        center: startPoint,
        zoom: 5
    });

    var service = new google.maps.places.PlacesService(map);

    //places the search boxes inside the map element
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(search);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(roto);

    //style the marker
    var defaultIcon = makeMarkerIcon("ff4800");
    var yellowIcon = makeMarkerIcon("ffff24");
    var bouncyIcon = google.maps.Animation.BOUNCE;
    var droppyIcon = google.maps.Animation.DROP;

    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            "http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|"+ markerColor +
            "|40|_|%E2%80%A2",
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));
        return markerImage;
    }

    function populateInfoWindow(marker, infowindow) {

        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent("");
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener("closeclick", function() {
                infowindow.marker = null;
                marker.setAnimation(null);
            });
            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            // In case the status is OK, which means the pano was found, compute the position of the streetview image, then calculate the heading, then get a panorama from that and set the options
            function getStreetView(data, status) {

                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    var markerLat = marker.position.lat();
                    var markerLng = marker.position.lng();
                    var mapQuestURL = "http://www.mapquestapi.com/geocoding/v1/reverse?key=eYCUpFNieaLmErWTstVqZMrZcCemCh0x&location=" + 
                    markerLat + "," + markerLng +
                    "&ourFormat=json&includeRoadMetadata=true&includeNearestIntersection=true";

                    $.ajax({
                        url: mapQuestURL,
                        type: "GET"
                    }).done(
                        function(stuff) {
                            var streetAddress = stuff.results[0].locations[0].street;
                            var cityAddress = stuff.results[0].locations[0].adminArea5;
                            var stateAddress = stuff.results[0].locations[0].adminArea3;
                            var postalAddress = stuff.results[0].locations[0].postalCode;
                            var address = streetAddress + ", " + cityAddress + ", " + stateAddress + ", " + postalAddress;

                            infowindow.setContent("<div>" + marker.title + "</div><br><div id='pano'></div>" + 
                    "<div>From: <a href='https://developer.mapquest.com/'>MapQuest</a>: " + address + "</div>" + 
                    "<img srcset='https://www.mapquestapi.com/staticmap/v5/map?key=eYCUpFNieaLmErWTstVqZMrZcCemCh0x&center=" + markerLat + "," + markerLng + "&zoom=18&type=hyb&size=300,300' alt='Satalite view from MapQuest failed.'>"
                            );

                            var panoramaOptions = {
                                position: nearStreetViewLocation,
                                pov: {
                                    heading: heading,
                                    pitch: 30
                                }
                            };
                            var panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"), panoramaOptions);


                        }
                    ).fail(function(err) {
                        alert("MapQuest Adress failed ", err);
                        throw err;
                    });
                } else {
                    infowindow.setContent("<div>" + marker.title + "</div>" +
                    "<div id='pano'><br><br>No Street View Found</div>");
                }
            }
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
        }
    }

    var SimpleListModel = function(items) {
        var self = this;

        self.items = ko.observableArray(items);

        self.modalArray = ko.observableArray([]);

        self.koMarkers = ko.observableArray([]);

        self.koArray = ko.observableArray([]);

        self.addEllement = function() {
            self.koArray.push();
        };

        self.addMarkerType = ko.observable("all");

        self.optionValues = ko.observable([
            {seeit: "All", thisVal: "all"}, 
            {seeit: "Store", thisVal: "store"}, 
            {seeit: "School", thisVal: "school"}, 
            {seeit: "Doctor", thisVal: "doctor"}, 
            {seeit: "Hospital", thisVal: "hospital"}, 
            {seeit: "Church", thisVal: "church"}, 
            {seeit: "Museum", thisVal: "museum"}, 
            {seeit: "Restaurant", thisVal: "restaurant"}
        ]);

        self.inputPlace = ko.observableArray("");

        // New location for display and clear old location data
        self.changePlace = ko.observable(function() {

            self.koMarkers().forEach(function(oldMarker) {
                oldMarker.setMap(null);
            });

            self.koMarkers = [];

            // self.modalArray().id.remove();
            
            //remove the modal DOM element
            // $(`#modalMaker > .modal`).remove();
            
            self.modalArray = [];

            var newPlace = self.inputPlace();
            
            var newPlaceURL = "https://maps.googleapis.com/maps/api/geocode/json?address="+newPlace+"&key=AIzaSyDyLw3cQPBIXwwExxqVNBsc9D-4KeVPp8g";
            $.ajax({
                url: newPlaceURL,
                type: "GET"
            }).done(function(thisNewPlaceData) {
                var lat = thisNewPlaceData.results[0].geometry.location.lat;
                var lng = thisNewPlaceData.results[0].geometry.location.lng;
                var searchStartPoint = {lat, lng};
                service.nearbySearch({
                    location: searchStartPoint,
                    radius: 500,
                    type: [typeVariable]
                }, callback);
            });
        });

        self.someHelp = ko.observable(function() {
            if (self.addMarkerType() == "all") {
                for (var m = 0; m < self.koMarkers.length; m++) {
                    self.koMarkers[m].setMap(null);
                    self.koMarkers[m].setMap(map);
                }
            } else {
                for (var b = self.koMarkers.length - 1; b >= 0; b--) {
                    self.koMarkers[b].setMap(null);
                    if (self.koMarkers[b].locationType == self.addMarkerType()) {
                        self.koMarkers[b].setMap(map);
                    }
                }
            }
        });

        self.makeMarkerType = ko.computed(function() {
            for (var k = 0; k < self.koMarkers.length; k++) {
                self.koMarkers[k].setMap(map);
            }
        });

        self.clickVal = ko.observable(function() {

            var markerType = this.markerPlace.placeType;

            for (var j = 0; j < self.koMarkers.length; j++) {
                self.koMarkers[j].setAnimation(null);
                if (self.koMarkers[j].id == this.markerPlace.place_id) {
                    self.koMarkers[j].setAnimation(bouncyIcon);
                    populateInfoWindow(self.koMarkers[j], infowindow);
                    map.setCenter(self.koMarkers[j].getPosition());
                }
            }
        }, self);

        self.markersSearch = ko.computed(
            function() {
                service.nearbySearch({
                    location: startPoint,
                    radius: 500,
                    type: [typeVariable]
                }, callback);
            });

        function callback(results, status) {

            if (status === google.maps.places.PlacesServiceStatus.OK) {

                for (var resultsIterator = 0; resultsIterator < results.length; resultsIterator++) {

                    var request = {
                        placeId: results[resultsIterator].place_id // example:'ChIJddaafks-xIkRPeiYXHAvDi4' // example: ChIJN1t_tDeuEmsRUsoyG83frY4
                    };

                    service.getDetails(request, function(rvwsPlace, status) {

                        console.log("The status of google.maps.places is: ", status);
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            var rvwsText = [];
                            if(rvwsPlace.reviews !== undefined) {
                                for (var s = rvwsPlace.reviews.length - 1; s >= 0; s--) {
                                    rvwsText.push(String(rvwsPlace.reviews[s].text) + "<br>" + "<br>");
                                }
                            } else {
                                rvwsText.push("No reviews for this location.");
                            }

                            //sets the location type
                            var thisTypeVar;
                            for (var z = rvwsPlace.types.length - 1; z >= 0; z--) {
                                
                                if (rvwsPlace.types[z] == "restaurant") {
                                    thisTypeVar = "restaurant";
                                    break;
                                } else if (rvwsPlace.types[z] == "store") {
                                    thisTypeVar = "store";
                                    break;
                                } else if (rvwsPlace.types[z] == "school") {
                                    thisTypeVar = "school";
                                    break;
                                } else if (rvwsPlace.types[z] == "doctor") {
                                    thisTypeVar = "doctor";
                                    break;
                                } else if (rvwsPlace.types[z] == "hospital") {
                                    thisTypeVar = "hospital";
                                    break;
                                } else if (rvwsPlace.types[z] == "church") {
                                    thisTypeVar = "church";
                                    break;
                                } else if (rvwsPlace.types[z] == "museum") {
                                    thisTypeVar = "museum";
                                    break;
                                } else {
                                    thisTypeVar = "none";
                                }
                            }

                            var idName = String(rvwsPlace.name).replace(/ /g, "_");

                            var newKoArray = 
                                {
                                    placeId: rvwsPlace.name,
                                    tagId: idName,
                                    markerPlace: rvwsPlace,
                                    placeType: thisTypeVar
                                };

                            self.koArray().push(newKoArray);

                            //populate the modalArray
                            self.modalArray.push({
                                modalName: idName,
                                modalInfo: rvwsText
                            });

                            createMarker(rvwsPlace, thisTypeVar, droppyIcon, defaultIcon);

                            rvwsText = [];
    
                        } else {
                            console.log("Details service unavailable at this time. ");
                        }//bottom of the reviews loop
                    }); //bottom of the getDetails

                }// bottom of the for(results) loop
            } // bottom of the if(status)
        }

        function createMarker(place, rvwsMarker, iconAnimation, iconCollor) {

            if (place == "not this one") {
                return;
            }

            // centers the map on the results cluster
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(place.geometry.location);
            map.fitBounds(bounds);

            // found this zoom solution @ https://code.i-harness.com/en/q/45040f
            google.maps.event.addListenerOnce(map, "bounds_changed", function(event) {
                if(!event){"";}
                if (this.getZoom() > 15) {
                    this.setZoom(15);
                }
            });

            var marker = new google.maps.Marker({
                // map: map,
                position: place.geometry.location,
                title: place.name,
                locationType: rvwsMarker,
                animation: iconAnimation,
                icon: iconCollor,
                id: place.place_id
            });

            marker.setMap(map);
            
            marker.addListener("click", function() {
                for (var u = self.koMarkers.length - 1; u >= 0; u--) {
                    self.koMarkers[u].setAnimation(null);
                }
                populateInfoWindow(marker, infowindow);
                marker.setAnimation(bouncyIcon);
                map.setCenter(marker.getPosition());
            });

            self.koMarkers.push(marker);
        }

    }; // bottom of the KO model

    ko.applyBindings(new SimpleListModel());
}