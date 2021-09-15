import { Component, HostBinding, OnInit } from '@angular/core';
import { License } from 'src/app/models/license';
import { LicenseService } from 'src/app/services/license.service';
import { Utilitys } from 'src/app/utilitys/utilitys';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ShareDataService } from 'src/app/services/share-data.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-manager-license',
  templateUrl: './manager-license.component.html',
  styleUrls: ['./manager-license.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ opacity: '1' })),
      transition('void => *', [
        style({ opacity: '0' }),
        animate(500)
      ]),
    ]),
  ]
})
export class ManagerLicenseComponent implements OnInit {
  @HostBinding('@.disabled')
  public animationsDisabled = false;

  licenses: License[] = [];
  pageLength: number = 10;
  paginations: string[] = [];
  page: number = 1;
  pageCount: number = 0;
  field: string = "";
  sort: number = 0;
  indexPage: number = 0;

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

  constructor(
    private licenseService: LicenseService,
    private router: Router,
    private route: ActivatedRoute,
    private shareDataService: ShareDataService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.page = params.get('page') ? parseInt(params.get('page')!, 10) : 1;
        this.field = params.get('field') ? params.get('field')! : '';
        this.sort = params.get('sort') ? parseInt(params.get('sort')!, 10) : 0;
        this.getLicences();
      }
    )
  }

  private getLicences() {
    this.licenseService.getLicense(this.page, this.pageLength, this.field, this.sort).subscribe(
      docs => {
        this.animationsDisabled = true;
        this.pageCount = Math.floor(docs.count / this.pageLength);
        if ((docs.count % this.pageLength) !== 0) {
          this.pageCount += 1;
        }
        this.paginations = Utilitys.pagination(this.page, this.pageCount);
        this.getIndexCurrentPage();
        let license: License;
        this.licenses = [];
        for (let i = 0; i < docs.docLicenses.length; i++) {
          license = new License({ ...docs.docLicenses[i] });
          this.licenses.push(license);
        }
        setTimeout(() => {
          this.animationsDisabled = false;
        }, 0)
      }
    );
  }

  private getIndexCurrentPage() {
    for (let i = 0; i < this.paginations.length; i++) {
      if (parseInt(this.paginations[i], 10) === this.page) {
        this.indexPage = i;
        break;
      }
    }
  }

  changePage(n: number) {
    let pageSel = n + this.page;
    if (pageSel > 0 && pageSel <= this.pageCount) {
      this.page = pageSel;
      this.router.navigate(['admin/manager-license', { page: pageSel, pageLength: this.pageLength, field: this.field, sort: this.sort }]);
    }
  }

  onSelectPage(page: string) {
    let pageSel = parseInt(page, 10);
    if (pageSel && pageSel !== this.page) {
      this.router.navigate(['admin/manager-license', { page: pageSel, pageLength: this.pageLength, field: this.field, sort: this.sort }]);
    }
  }

  lockOrUnlock(license: License) {
    let licenseTmp = new License({ ...JSON.parse(JSON.stringify(license)) });
    licenseTmp.isactive = !licenseTmp.isactive;
    this.licenseService.putLicenseIsActive(licenseTmp)
      .subscribe(
        data => {
          licenseTmp.isactive = data.license.isactive === "true" ? true : false;
          let index = -1;
          for (let i = 0; i < this.licenses.length; i++) {
            if (this.licenses[i]._id === licenseTmp._id) {
              index = i;
              break;
            }
          }
          this.licenses.splice(index, 1);
          this.licenses.splice(index, 0, licenseTmp);
          if (data.error) {
            this.Toast.fire({
              icon: 'error',
              title: data.error
            })
          } else {
            this.Toast.fire({
              icon: 'success',
              title: data.mes
            })
          }
        }
      )
  }

  edit(license: License) {
    this.shareDataService.previousURL.next(this.router.url);
    this.router.navigate(['admin/manager-license-detail', license._id]);
  }

  delete(license: License) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Xác nhận xóa license?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.licenseService.delLicense(license._id)
          .subscribe(data => {
            if (data.error) {
              this.Toast.fire({
                icon: 'error',
                title: data.error
              })
            } else {
              this.Toast.fire({
                icon: 'success',
                title: data.mes
              })
            }
            this.getLicences();
          })
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        this.Toast.fire({
          icon: 'info',
          title: 'Hủy bỏ hành động xóa license!'
        })
      }
    })
  }

  createNew() {
    this.router.navigate(['admin/manager-license-detail', ""]);
  }

}
