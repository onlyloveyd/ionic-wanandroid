import {Component, OnInit} from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular';
import {SelfHttpService} from '../service/HttpService';
import {NativeHttpService} from '../service/NativeHttpService';
import {environment} from "../../environments/environment";
import {HttpResponse} from "@angular/common/http";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    username: any;
    password: any;

    constructor(private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                private httpService: SelfHttpService,
                private nativeHttpService: NativeHttpService) {
    }

    ngOnInit() {
    }

    doLogin() {
        console.log(this.username);
        console.log(this.password);
        if (this.username == null) {
            this.presentToast('请输入用户名').then();
            return;
        }
        if (this.password == null) {
            this.presentToast('请输入密码').then();
            return;
        }
        if (environment.isMobile) {
            this.nativeHttpService.login(this.username, this.password).then((res) => {
                console.log(res);
            });
        } else {
            this.httpService.login(this.username, this.password).subscribe((res: HttpResponse<Object>) => {
                console.log(res.headers);
            });
        }


    }

    async presentToast(message) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 1000
        });
        toast.present();
    }
}
