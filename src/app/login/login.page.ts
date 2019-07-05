import {Component, OnInit} from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular';
import {SelfHttpService} from '../service/HttpService';
import {NativeHttpService} from '../service/NativeHttpService';

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
        this.nativeHttpService.login(this.username, this.password).then((res) => {
            console.log(res);
        });

    }

    async presentToast(message) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 1000
        });
        toast.present();
    }
}
