import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, App, ModalController, NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { Geolocation } from '@ionic-native/geolocation';

import { AppData } from '../../providers/app-data';

declare var google;

@Component({
    selector: 'page-order',
    templateUrl: 'order.html'
})
export class OrderPage {
    @ViewChild('map') mapElement: ElementRef

    submitted = false

    userID: any
    user_info: any

    map: any
    markerArray = []

    timePickerObj: any
    datePickerObj: any

    params: any = {}
    today: string

    apiKey: any = 'AIzaSyD7iBIhRsXT0SzEJTxSxyOkqJvTYvBS2h4'

    constructor(
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public appData: AppData,
        private geolocation: Geolocation,
    ) {
        /* load google map script dynamically */
        // const script = document.createElement('script');
        // script.id = 'google';
        // if (this.apiKey) {
        //     script.src = 'https://maps.googleapis.com/maps/api/js?v=3&libraries=drawing,geometry,places&key=' + this.apiKey;
        // } else {
        //     script.src = 'https://maps.googleapis.com/maps/api/js?v=3&libraries=drawing,geometry,places&key=';
        // }
        // document.head.appendChild(script);

        this.appData.getUserInfoPromise().then((data) => {
            this.user_info = data
            this.userID = data['id']
        })

        this.today = new Date().toISOString()
        console.log(this.today)

        // this.geolocation.getCurrentPosition().then((resp) => {
        //     console.log(resp)
        //     // resp.coords.latitude
        //     // resp.coords.longitude
        // }).catch((error) => {
        //     console.log('Error getting location', error);
        // });

        // let watch = this.geolocation.watchPosition();
        // watch.subscribe((data) => {
        //     console.log(data)
        //     // data can be a set of coordinates, or an error (if an error occurred).
        //     // data.coords.latitude
        //     // data.coords.longitude
        // });

        // wait a bit to make sure the script is loaded
        // setTimeout(() => {
            
        // }, 1000)
    }

    ionViewDidLoad() {
        this.loadMap()
    }

    loadMap() {
        this.geolocation.getCurrentPosition().then((position) => {

            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

            this.renderMap(latLng)

        }, (err) => {
            console.log(err)
        })
    }

    renderMap(latLng) {
        let $scope = this

        google.maps.event.addListenerOnce($scope.map, 'idle', function () {
            let marker = new google.maps.Marker({
                map: $scope.map,
                position: latLng,
                animation: google.maps.Animation.DROP
            })
            $scope.markerArray.push(marker)

            $scope.searchBar()

            // this.theInterval = null;

            // this.theInterval = $interval(function() {
            //     let pacContainers = document.getElementsByClassName('pac-container');
            //     if (pacContainers.length >= 2) {
            //         $interval.cancel(this.theInterval);
            //         this.disableTap();
            //         $ionicLoading.hide();
            //     }
            // }.bind(this), 1000);
            // this.$on('$destroy', function () {
            //     $interval.cancel(this.theInterval)
            // });

        });
    }

    searchBar() {
        let $scope = this

        // let sidebar = document.getElementById('pac-sidebar')
        let from = document.getElementById('pac-from'),
            to = document.getElementById('pac-to')

        let options = { componentRestrictions: { country: 'vn' } }

        let autocomplete_from = new google.maps.places.Autocomplete(from, options),
            autocomplete_to = new google.maps.places.Autocomplete(to, options)

        /*autocomplete_from.bindTo('bounds', $scope.map);
        autocomplete_to.bindTo('bounds', $scope.map);
        */
        google.maps.event.addDomListener(from, 'keydown', function (e) {
            //console.log('keydown!')
            if (e.keyCode == 13 && document.getElementsByClassName("pac-container")[0]) {
                e.preventDefault()
            }
        })

        google.maps.event.trigger(to, 'keydown', function (e) {
            //console.log(e.keyCode);
            if (e.keyCode === 13 && !e.triggered) {
                google.maps.event.trigger(this, 'keydown', { keyCode: 40 })
                google.maps.event.trigger(this, 'keydown', { keyCode: 13, triggered: true })
            }
        })

        let infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(autocomplete_to, 'place_changed', function () {
            $scope.map_select(autocomplete_to, infowindow, 1);
        })

        google.maps.event.addListener(autocomplete_from, 'place_changed', function () {
            $scope.map_select(autocomplete_from, infowindow, 0)
        })
    }

    map_select(autocomplete, infowindow, type) {
        let $scope = this

        for (let i = 0; i < $scope.markerArray.length; i++) {
            $scope.markerArray[i].setMap(null);
        }
        $scope.markerArray = [];

        let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        let infowindowContent = document.getElementById('infowindow-content-' + type);
        infowindow.setContent(infowindowContent);

        infowindow.close();
        let place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        if (place.geometry.viewport) {
            $scope.map.fitBounds(place.geometry.viewport);
        } else {
            $scope.map.setCenter(place.geometry.location);
            $scope.map.setZoom(10);
        }
        //console.log(place);
        if (type == 0) (<HTMLInputElement>document.getElementById('start')).value = place.formatted_address;
        else if (type == 1) (<HTMLInputElement>document.getElementById('end')).value = place.formatted_address;

        let index = type;
        let marker_now = new google.maps.Marker({
            label: labels[index++ % labels.length],
            map: $scope.map
        });
        marker_now.setPlace({
            placeId: place.place_id,
            location: place.geometry.location
        });

        marker_now.setVisible(true);
        google.maps.event.addListener(marker_now, 'click', function () {
            infowindow.setContent('<div><strong>' + place.name + '</strong><br/>' + place.formatted_address + '<br>' +
                place.place_id + '</div>');
            infowindow.open($scope.map, this);
        });

        if ((<HTMLInputElement>document.getElementById('start')).value != null && (<HTMLInputElement>document.getElementById('end')).value != null)
            $scope.getDirection(place.geometry.location);
    }

    getDirection(pos) {
        let $scope = this

        $scope.map.setZoom(13)

        // Instantiate a directions service.
        let directionsService = new google.maps.DirectionsService
        let geocoder = new google.maps.Geocoder()

        $scope.map.setCenter(pos)

        geocoder.geocode({
            'location': pos
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    //	document.getElementById('start').value = results[0].formatted_address;

                    // Create a renderer for directions and bind it to the map.
                    let directionsDisplay = new google.maps.DirectionsRenderer({ map: $scope.map })
                    // Instantiate an info window to hold step text.
                    let stepDisplay = new google.maps.InfoWindow

                    $scope.calculateAndDisplayRoute(directionsDisplay, directionsService, stepDisplay)
                } else {
                    //console.log('No results found')
                }
            } else {
                //console.log('Geocoder failed due to: ' + status)
            }
        })
    }

    calculateAndDisplayRoute(directionsDisplay, directionsService, stepDisplay) {
        let $scope = this
        //console.log(document.getElementById('start').value);
        //console.log(document.getElementById('end').value);

        // First, remove any existing markers from the map.
        for (let i = 0; i < $scope.markerArray.length; i++) {
            $scope.markerArray[i].setMap(null)
        }
        $scope.markerArray = []

        // Retrieve the start and end locations and create a DirectionsRequest using
        // {travelMode} directions.
        directionsService.route({
            origin: (<HTMLInputElement>document.getElementById('start')).value,
            destination: (<HTMLInputElement>document.getElementById('end')).value,
            travelMode: (<HTMLInputElement>document.getElementById('travelMode')).value // DRIVING | BICYCLING | TRANSIT | WALKING
        }, function (response, status) {
            // Route the directions and pass the response to a function to create
            // markers for each step.
            if (status === 'OK') {
                // document.getElementById('box-search-one-route').visibility = true

                document.getElementById('warnings-panel').innerHTML = '<b>' + response.routes[0].warnings + '</b>'
                console.log(directionsDisplay)
                directionsDisplay.setDirections(response)

                // $scope.showSteps(response, stepDisplay, map)                
                let distance = response.routes[0].legs[0].distance.text
                let time = response.routes[0].legs[0].duration.text
                document.getElementById('box-search-one-distance').innerHTML = distance
                document.getElementById('box-search-one-time').innerHTML = time
            } else {
                //console.log('Directions request failed due to ' + status)
            }
        })
    }

    showSteps(directionResult, markerArray, stepDisplay) {
        let $scope = this

        // For each step, place a marker, and add the text to the marker's infowindow.
        // Also attach the marker to an array so we can keep track of it and remove it
        // when calculating new routes.
        let myRoute = directionResult.routes[0].legs[0]
        for (let i = 0; i < myRoute.steps.length; i++) {
            let marker = markerArray[i] = markerArray[i] || new google.maps.Marker
            marker.setMap($scope.map)
            marker.setPosition(myRoute.steps[i].start_location)
            // $scope.attachInstructionText(stepDisplay, marker, myRoute.steps[i].instructions)
        }
    }

    attachInstructionText(stepDisplay, marker, text) {
        let $scope = this

        google.maps.event.addListener(marker, 'click', function () {
            // Open an info window when the marker is clicked on, containing the text
            // of the step.
            stepDisplay.setContent(text)
            stepDisplay.open($scope.map, marker)
        })
    }



    select_seat(seat) {
        (<HTMLInputElement>document.getElementById('seat')).value = seat
        let sones = document.getElementsByClassName('sone')
        for (let i = 0; i < sones.length; i++) {
            sones[i].classList.remove('active')
            if (sones[i].id == 'seat' + seat) {
                sones[i].classList.add('active')
            }
        }
    }

    getPrice(frAr, toAr, distance, seat) {
        let fromDistrict = frAr[frAr.length - 3].trim(), // quận đi
            toDistrict = toAr[toAr.length - 3].trim() // quận đến

        let mult = 10
        if (seat == 7) mult = 12

        let priceThisTrip = parseFloat(distance) * mult
        if (seat == 16) priceThisTrip = 1

        if ((fromDistrict == 'Cầu Giấy' || fromDistrict == 'Đống Đa' || fromDistrict == 'Ba Đình' || fromDistrict == 'Hai Bà Trưng' || fromDistrict == 'Nam Từ Liêm' || fromDistrict == 'Bắc Từ Liêm') && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5) { priceThisTrip = 190 }
            else if (seat == 7) { priceThisTrip = 300 }
        }

        if ((toDistrict == 'Cầu Giấy' || toDistrict == 'Đống Đa' || toDistrict == 'Ba Đình' || toDistrict == 'Hai Bà Trưng' || toDistrict == 'Nam Từ Liêm' || toDistrict == 'Bắc Từ Liêm') && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5) { priceThisTrip = 250 }
            else if (seat == 7) { priceThisTrip = 350 }
        }

        if (fromDistrict == 'Gia Lâm' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 250
            else if (seat == 7)
                priceThisTrip = 350
        }

        if (toDistrict == 'Gia Lâm' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 300
            else
                priceThisTrip = 370
        }

        if (fromDistrict == 'Thanh Xuân' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 230;
            else if (seat == 7)
                priceThisTrip = 320;
        }

        if (toDistrict == 'Thanh Xuân' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 250;
            else if (seat == 7)
                priceThisTrip = 330;
        }

        if (fromDistrict == 'Long Biên' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 230;
            else if (seat == 7)
                priceThisTrip = 320;
        }

        if (toDistrict == 'Long Biên' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 260;
            else if (seat == 7)
                priceThisTrip = 350;
        }

        if (fromDistrict == 'Hà Đông' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 250;
            else if (seat == 7)
                priceThisTrip = 350;
        }

        if (toDistrict == 'Hà Đông' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 270;
            else if (seat == 7)
                priceThisTrip = 370;
        }

        if (fromDistrict == 'Thanh Trì' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 250;
            else if (seat == 7)
                priceThisTrip = 350;
        }

        if (toDistrict == 'Thanh Trì' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 300;
            else if (seat == 7)
                priceThisTrip = 370;
        }

        if (fromDistrict == 'Hoàng Mai' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 250;
            else if (seat == 7)
                priceThisTrip = 350;
        }

        if (toDistrict == 'Hoàng Mai' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 280;
            else if (seat == 7)
                priceThisTrip = 370;
        }

        return priceThisTrip
    }

    request_first() {
        let from = (<HTMLInputElement>document.getElementById('start')).value,
            to = (<HTMLInputElement>document.getElementById('end')).value,
            seat = parseInt((<HTMLInputElement>document.getElementById('seat')).value),
            distance = document.getElementById('box-search-one-distance').innerHTML

        if (from && to && seat) {
            let frAr = from.split(','),
                toAr = to.split(',')

            this.params.price = this.getPrice(frAr, toAr, distance, seat)

            let tripInfo = 'Đi từ: <b>' + frAr + '</b>.<br/>Đến: <b>' + toAr + '</b>.<br/>Loại xe: <b>' + seat + ' chỗ</b>.<br/>Quãng đường: <b>' + distance + '</b>.<br/>Giá tiền (tham khảo): <b>' + this.params.price + 'k</b>';

            let alert = this.alertCtrl.create({
                title: 'Thông tin giá tiền',
                message: tripInfo,
                buttons: [
                    {
                        text: 'Quay lại',
                        role: 'cancel'
                    },
                    {
                        text: 'Đặt xe',
                        handler: (data: any) => {
                            let detailsForm = document.getElementById('trip-user-details')
                            detailsForm.classList.add('active')
                            document.getElementById('tripInfo').innerHTML = tripInfo
                        }
                    }
                ]
            })
            alert.present()

        } else {
            let alert = this.alertCtrl.create({
                title: 'Lỗi',
                message: 'Bạn phải điền đầy đủ thông tin: <br/>Điểm đi, <br/>Điểm đến, <br/>Xe số chỗ.',
                buttons: [
                    {
                        text: 'Đóng',
                        handler: (data: any) => {
                            this.closeAlertHandl()
                        }
                    }
                ]
            })
            alert.present()
        }
    }

    request(form: NgForm) {
        if (form.valid) {
            let from = (<HTMLInputElement>document.getElementById('start')).value,
                to = (<HTMLInputElement>document.getElementById('end')).value,
                seat = parseInt((<HTMLInputElement>document.getElementById('seat')).value)
            // name = document.getElementById('name').value,
            // phone = document.getElementById('phone').value,
            // guess_num = document.getElementById('guess_num').value,
            // time_date = document.getElementById('time_date').value,
            // time_time = document.getElementById('time_time').value,
            // time = time_date + ' ' + time_time + ':00',
            // is_round = document.getElementById('is_round').value,
            // details = document.getElementById('details').value,
            // PNR = document.getElementById('PNR').value

            this.params.from = from
            this.params.to = to
            this.params.seat = seat
            this.params.time = this.params.time_date + ' ' + this.params.time_time + ':00'
            this.params.guess_num = parseInt(this.params.guess_num)

            if (this.userID) {
                this.params.userid = this.userID
            }
            console.log(this.params)

            if (this.params.name && this.params.phone && from && to && seat > 0 && this.params.guess_num > 0 && this.params.time && this.params.price) {
                this.appData.addTrip(this.params).subscribe((data: any) => {
                    console.log(data)
                    if (data == 1) {
                        let alert = this.alertCtrl.create({
                            title: 'Thành công',
                            message: 'Quý khách đã đặt xe thành công. Nhân viên công ty sẽ liên hệ để xác nhận với quý khách ngay bây giờ. Cảm ơn quý khác đã tin tưởng và sử dụng dịch vụ của công ty Đông Dương D.C. Trân trọng.',
                            buttons: [
                                {
                                    text: 'Đóng',
                                    handler: (data: any) => {
                                        this.closeAlertHandl()
                                        location.reload()
                                    }
                                }
                            ]
                        })
                        alert.present()
                    }
                })
            }
        } else {
            let alert = this.alertCtrl.create({
                title: 'Lỗi',
                message: 'Bạn phải nhập đầy đủ thông tin để đặt xe.',
                buttons: [
                    {
                        text: 'Đóng',
                        handler: (data: any) => {
                            this.closeAlertHandl()
                        }
                    }
                ]
            })
            alert.present()
        }
    }

    goback() {
        let detailsForm = document.getElementById('trip-user-details')
        detailsForm.classList.remove('active')
    }

    closeAlertHandl() {
        // this.navCtrl.pop() // go back
    }


}
