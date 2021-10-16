import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { RateConverterInterface } from 'src/app/interfaces/rate-converter.interface';
import { ConversionService } from 'src/app/services/conversion.service';
import { RatesService } from 'src/app/services/rates.service';

@Component({
    selector: 'app-currency-converter',
    templateUrl: './currency-converter.component.html',
    styleUrls: ['./currency-converter.component.less'],
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();

    availableCurrency: any;
    sourceCurrencies: string[] = [];
    targetCurrencies: string[] = [];

    converterForm = this.fb.group({
        sourceCurrency: null,
        targetCurrency: null,
        currencyValue: null,
        convertedValue: [{value: null, disabled: true}]
    });

    constructor(private fb: FormBuilder,
        private rateService: RatesService,
        private conversionService: ConversionService) {}

    ngOnInit(): void {
        this.getAvailableCurrencyList();
        this.handleFormValueChanges()
    }

    getAvailableCurrencyList(): void {
        this.subscriptions.add(
            this.rateService.getExchangeRateByType().subscribe(res => {
                if( !res) {
                    return
                }

                this.sourceCurrencies = res.source;
                this.targetCurrencies = res.target;
            })
        )
    }

    handleFormValueChanges(): void {

        if(!this.converterForm) {
            return;
        }

        const sourceCurrency$: Observable<any> | any = this.converterForm.get('sourceCurrency')?.valueChanges.pipe(startWith(null));
        const targetCurrency$: Observable<any> | any = this.converterForm.get('targetCurrency')?.valueChanges.pipe(startWith(null));
        const currencyValue$: Observable<any> | any = this.converterForm.get('currencyValue')?.valueChanges.pipe(startWith(null));

        this.subscriptions.add(
            combineLatest(sourceCurrency$, targetCurrency$, currencyValue$)
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.checkAndGetConvertedValue();
            })
        )
    }

    checkAndGetConvertedValue(): void {
        const { sourceCurrency, targetCurrency } = this.converterForm.value;

        if(!sourceCurrency || !targetCurrency ) {
            return;
        }

        this.getConvertedValue();

    }

    getConvertedValue(target = false): void {
        const { sourceCurrency, targetCurrency, currencyValue } = this.converterForm.value;

        const request: RateConverterInterface = {
            source: sourceCurrency,
            target: targetCurrency,
            sourceValue: currencyValue
        }

        this.subscriptions.add(
            this.conversionService.getCurrenctConversion(request).subscribe(res => {
                const convertedValue = res && res.targetValue;
                this.updateConvertedValue(convertedValue);
            })
        )
    }

    updateConvertedValue(value: string): void {
        const parseValue = parseFloat(value).toFixed(2);
        this.converterForm.get('convertedValue')?.patchValue(parseValue);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
