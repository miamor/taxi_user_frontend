import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';

//import { UserData } from './user-data';

// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
//import { c } from '@angular/core/src/render3';


@Injectable()
export class AppData {

    HAS_LOGGED_IN = 'hasLoggedIn';
    user_info: any;
    userID: any;

    constructor(
        public events: Events,
        public storage: Storage,
        public http: Http
    ) {
        this.getUserInfo().then((data) => {
            if (data) {
                this.user_info = data
                this.userID = data['id']
            }
        })
    }


    addTrip(formData: any): any {
        return this.http.post('http://localhost/taxi_user_backend/trip_add.php', formData).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data;
        })
    }

    listTripsSelled(taxiid: any): any {
        return this.http.post('http://localhost/taxi_user_backend/trip_all_sell.php', { taxiid: taxiid }).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }

    listNoti(): any {
        return this.http.post('http://localhost/taxi_user_backend/promotion_all.php', {}).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }

    getNotiInfo(notiID: any): any {
        return this.http.post('http://localhost/taxi_user_backend/promotion_one.php', {id: notiID}).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }

    listHistory(userID: any): any {
        return this.http.post('http://localhost/taxi_user_backend/bookhistory_all.php', {userid: userID}).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }


    register(params: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('http://localhost/taxi_user_backend/register.php', params).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }

    login(params: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('http://localhost/taxi_user_backend/login.php', params).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }

    logout(): void {
        this.storage.remove('hasLoggedIn')
        this.storage.remove('username')
        //this.storage.remove('token')
        this.storage.remove('user_info')
        this.events.publish('user:logout')
    }

    hasLoggedIn(): Promise<boolean> {
        return this.storage.get('hasLoggedIn').then((value) => {
            console.log('hasLoggedIn = ' + value)
            return value == true
        })
    }


    getUserInfo(): Promise<string> {
        return this.storage.get('user_info')
    }

    getUserInfoPromise(): Promise<object> {
        return this.storage.get('user_info').then((value) => {
            return value
        })
    }

}
