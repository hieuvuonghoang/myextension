import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { License } from 'src/app/models/license';
import { LicenseService } from 'src/app/services/license.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-manager-license-detail',
  templateUrl: './manager-license-detail.component.html',
  styleUrls: ['./manager-license-detail.component.css']
})
export class ManagerLicenseDetailComponent implements OnInit {

  licenseRoot!: License;
  license!: License;
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

  previousURL: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private licenseService: LicenseService,
    private shareDataSevice: ShareDataService,
    private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.shareDataSevice.previousURL.subscribe(
      data => {
        this.previousURL = data;
      }
    )
    this.route.data
      .subscribe(data => {
        this.licenseRoot = new License({ ...data.license });
        this.license = new License({ ...data.license });
      });
  }

  goBack() {
    this.router.navigateByUrl(this.previousURL);
  }

  submit() {
    if (JSON.stringify(this.license) !== JSON.stringify(this.licenseRoot)) {
      if (this.license._id === "") {
        this.insert();
      } else {
        this.update();
      }
    } else {
      this.Toast.fire({
        icon: 'info',
        title: 'Không có bất kỳ thông tin nào thay đổi để thực hiện cập nhật!'
      })
    }
  }

  private insert() {
    this.licenseService.postLicense(this.license)
      .subscribe(
        data => {
          if(data.error) {
            this.Toast.fire({
              icon: 'error',
              title: data.error,
            })
          } else {
            this.license._id = data.license._id;
            this.licenseRoot = new License(JSON.parse(JSON.stringify(this.license)));
            this.Toast.fire({
              icon: 'success',
              title: data.mes,
            })
          }
        }, err => {
          this.Toast.fire({
            icon: 'error',
            title: err.message
          })
        }
      )
  }

  private update() {
    this.licenseService.putLicense(this.license)
      .subscribe(
        data => {
          if(data.error) {
            this.Toast.fire({
              icon: 'error',
              title: data.error,
            })
          } else {
            this.licenseRoot = new License(JSON.parse(JSON.stringify(this.license)));
            this.Toast.fire({
              icon: 'success',
              title: data.mes,
            })
          }
        }, err => {
          this.Toast.fire({
            icon: 'error',
            title: err.message
          })
        }
      )
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (JSON.stringify(this.license) === JSON.stringify(this.licenseRoot)) {
      return true;
    }
    return this.dialogService.confirm('Discard changes?');
  }

}
