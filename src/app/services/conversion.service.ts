import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import ConversionEndPoints from "../constants/conversion-end-points";
import { RateConverterInterface } from "../interfaces/rate-converter.interface";

@Injectable({ providedIn: "root" })
export class ConversionService {

    basPath = environment.conversionBaseUrl
    enpoints = ConversionEndPoints;


    constructor(private http: HttpClient) {}

    getCurrenctConversion(payload: RateConverterInterface | any): Observable<any> {
        return this.http.get(`${this.basPath}${this.enpoints.CURRENCY_CONVERSION_SPECIFIC}`, { params: payload });
    }

    // getAllCurrenctConversion(): Observable<any> {
    //     return this.http.get(`${this.basPath}${this.enpoints.CURRENCY_CONVERSION_ALL}`);
    // }

}
