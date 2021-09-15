import { Component, OnInit } from '@angular/core';
import { License } from 'src/app/models/license';
import { LicenseService } from 'src/app/services/license.service';
import { Utilitys } from 'src/app/utilitys/utilitys';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-manager-license',
  templateUrl: './manager-license.component.html',
  styleUrls: ['./manager-license.component.css']
})
export class ManagerLicenseComponent implements OnInit {

  licenses: License[] = [];
  pageLength: number = 10;
  paginations: string[] = [];
  page: number = 0;
  pageCount: number = 0;
  field: string = "";
  sort: number = 0;
  indexPage: number = 0;

  constructor(
    private licenseService: LicenseService,
    private router: Router,
    private route: ActivatedRoute,
    private shareDataService: ShareDataService,
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      params => {
        this.page = params.get('page') ? parseInt(params.get('page')!, 10) : 0;
        this.field = params.get('field') ? params.get('field')! : '';
        this.sort = params.get('sort') ? parseInt(params.get('sort')!, 10) : 0;
        this.getLicences();
      }
    )

  }

  private getLicences() {
    this.licenseService.getLicense(this.page, this.pageLength, this.field, this.sort).subscribe(
      docs => {
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
        console.log(this.licenses);
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
      this.router.navigate(['manager-license', { page: pageSel, pageLength: this.pageLength, field: this.field, sort: this.sort }]);
    }
  }

  onSelectPage(page: string) {
    let pageSel = parseInt(page, 10);
    if (pageSel && pageSel !== this.page) {
      this.router.navigate(['manager-license', { page: pageSel, pageLength: this.pageLength, field: this.field, sort: this.sort }]);
    }
  }

  lockOrUnlock(license: License) {
    let licenseTmp = new License({ ...JSON.parse(JSON.stringify(license)) });
    let mes = "";
    if (!licenseTmp.isactive) {
      mes = "Vô hiệu hóa license thành công!";
    } else {
      mes = "Kích hoạt license thành công!";
    }
    licenseTmp.isactive = !licenseTmp.isactive;
    this.licenseService.putLicense(licenseTmp)
      .subscribe(
        data => {
          console.log(data);
          license.isactive = licenseTmp.isactive;
          let Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            icon: 'warning',
            title: mes
          })
        }
      )
  }

  edit(license: License) {
    this.shareDataService.previousURL.next(this.router.url);
    this.router.navigate(['manager-license-detail', license._id]);
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
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.licenseService.delLicense(license._id)
          .subscribe(data => {
            console.log(data);
            this.getLicences();
            // this.router.navigate(['manager-license', { page: this.page, pageLength: this.pageLength, field: this.field, sort: this.sort }]);
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
          })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        // swalWithBootstrapButtons.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    })
  }

  createNew() {
    this.router.navigate(['/manager-license-detail', ""]);
  }

}
