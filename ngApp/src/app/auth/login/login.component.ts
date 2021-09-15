import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData = {
    email: '',
    pass: '',
  }

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.auth.loginUser(this.loginUserData)
      .subscribe(
        data => {
          if (data.error) {
            this.Toast.fire({
              icon: 'error',
              title: data.error,
            })
          } else {
            localStorage.setItem('token', data.token)
            this.router.navigate([''])
          }
        },
        err => console.error(err)
      )
  }

}
