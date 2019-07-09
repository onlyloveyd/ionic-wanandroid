import {LoadingController, ToastController} from '@ionic/angular';


export class BasePage {
    constructor(private loadingCtrl: LoadingController,
                private toastCtrl: ToastController) {

    }

    async showToast(message: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 1000,
        });
        toast.present();
    }

    async showLoading() {
        const loading = await this.loadingCtrl.create({
            message: '加载中……',
            mode: 'ios'
        });
        loading.present();
    }

    dismissLoading() {
        this.loadingCtrl.dismiss().then();
    }

}
