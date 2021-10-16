import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RatesService } from 'src/app/services/rates.service';

@Component({
    selector: 'app-currency-list',
    templateUrl: './currency-list.component.html',
    styleUrls: ['./currency-list.component.less'],
})
export class CurrencyListComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();

    currencyList: any[] = [];

    REFRESH_INTERVAL = 5000; // In Seconds

    rateList$: any;

    constructor(private rateService: RatesService) {}

    ngOnInit(): void {
        this.getAllCurrencyList();
        this.rateList$ = setInterval(() => this.getAllCurrencyList(), this.REFRESH_INTERVAL);
    }


    getAllCurrencyList() {
        console.log('getAllCurrencyList ..');

        this.subscriptions.add(
            this.rateService.getAllExchanges().subscribe((res: any[]) => {
                this.currencyList = res;
            })
        );
    }

    ngOnDestroy(): void {
        if(this.rateList$) {
            clearInterval(this.rateList$);
        }
        this.subscriptions.unsubscribe();
    }
}
