import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  countyCode: string = "TR";

  constructor(
    private http: HttpClient
  ) { }

  getCountySubDivs() {
    let url = environment.serviceURL + "/city_state/" + this.countyCode ;
    return this.http.get<any[]>(url).pipe(
      map((result: any) => {
        return result[0];
      }),
      catchError((error) => {
        if (error.status === 401) { }
        throw error;
      })
    )
  }

  getDistricts(city: string) {
    let url = environment.serviceURL + "/districts";
    return this.http.post<any[]>(url, {
      country: this.countyCode,
      city
    }).pipe(
      map((result: any) => {
        return result;
      }),
      catchError((error) => {
        if (error.status === 401) { }
        throw error;
      })
    )

  }

}
