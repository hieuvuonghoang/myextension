import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { License } from '../models/license';
import { LicenseService } from '../services/license.service';
import { Router } from '@angular/router';
import { catchError, mergeMap, take } from 'rxjs/operators';
import { Utilitys } from '../utilitys/utilitys';

@Injectable({
  providedIn: 'root'
})
export class ManagerLicenseDetailResolverService implements Resolve<License>{

  constructor(
    private licenseService: LicenseService,
    private router: Router,
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<License> | Observable<never> {
    let id = route.paramMap.get('id')!;
    let license: License;
    if (id === "") {
      license = new License();
      let currentDate = new Date();
      let afterOneYear = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
      license.fromdate = Utilitys.getCurrentDateStr(currentDate);
      license.isactive = true;
      license.todate = Utilitys.getCurrentDateStr(afterOneYear);
      return of(license);
    }
    return this.licenseService.getLicenseID(id)
      .pipe(
        take(1),
        mergeMap(data => {
          if (data) {
            console.log(data);
            license = new License({ ...data });
            return of(license);
          } else {
            this.router.navigate(['/manager-license']);
            return EMPTY;
          }
        })
      )
  }
}

