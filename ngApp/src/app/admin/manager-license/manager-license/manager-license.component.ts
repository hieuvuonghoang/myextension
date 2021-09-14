import { Component, OnInit } from '@angular/core';
import { License } from 'src/app/models/license';
import { LicenseService } from 'src/app/services/license.service';

@Component({
  selector: 'app-manager-license',
  templateUrl: './manager-license.component.html',
  styleUrls: ['./manager-license.component.css']
})
export class ManagerLicenseComponent implements OnInit {

  licenses: License[] = [];

  constructor(
    private licenseService: LicenseService,
  ) { }

  ngOnInit(): void {
    this.licenseService.getLicense().subscribe(
      docs => {
        let license: License;
        for (let i = 0; i < docs.length; i++) {
          license = new License({...docs[i]});
          this.licenses.push(license);
        }
        console.log(this.licenses);
      }
    );
  }

}
