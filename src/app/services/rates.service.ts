import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import RatesEndPoints from "../constants/rates-end-points";
import { RateConverterInterface } from "../interfaces/rate-converter.interface";

@Injectable({ providedIn: 'root' })
export class RatesService {

    basPath = environment.ratesBaseUrl
    enpoints = RatesEndPoints;

    constructor(private http: HttpClient) {}

    getAllExchanges(): Observable<any> {
        return this.http.get(`${this.basPath}${this.enpoints.EXCHANGE_RATE_ALL}`);
    }

    // getExchangeRate(payload: RateConverterInterface): Observable<any> {
    //     return this.http.post(`${this.basPath}${this.enpoints.EXCHANGE_RATE_CONVERTER}`, payload);
    // }

    getExchangeRateByType(): Observable<any> {
        return this.http.get(`${this.basPath}${this.enpoints.EXCHANGE_CURRENCIES}`);
    }

}
