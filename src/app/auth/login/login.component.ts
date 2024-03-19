import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserInformationService } from '../user-information.service';
import { HorizontalComponent } from 'src/app/layouts/theme/theme.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { auth } from 'src/app/shared/models/Cams-new/auth';
// import { AsseteTreeService } from 'src/app/services/Modules/aes/assete-tree.service';
// import { MapperService } from 'src/app/services/Modules/aes/mapper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  error!: string;
  loading!: boolean;
  submitted!: boolean;

  isDarkMode: boolean = true;

  credentials!: auth;

  
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';

  loginForm!: FormGroup;

  isLoginActive: boolean = true;
  loginLeft: number = 4;
  registerRight: number = -520;
  loginOpacity: number = 1;
  registerOpacity: number = 0;

  constructor(
    private auth: AuthService, private router: Router,
    private actRoute: ActivatedRoute,
    private fb: FormBuilder,
    // private asseteTreeService: AsseteTreeService,
    // private mapper: MapperService,
    private userInforService: UserInformationService) { }

  getCookie(cookieName: string) {
    var cookieValue = "light";
    var cookieArray = document.cookie.split(";");
    for (var i = 0; i < cookieArray.length; i++) {
      var cookiePair = cookieArray[i].split("=");
      var name = cookiePair[0].trim();
      if (name === cookieName) {
        cookieValue = decodeURIComponent(cookiePair[1]);
        break;
      }
    }
    return cookieValue;
  }

  ngOnInit(): void {

    this.loading = true;
    // this.auth.checkSingleSignOn('/').subscribe(res => {
    //   if (res) {

    //     let loggedUser = this.auth.getUser();

    //     this.router.navigate([this.auth.lastUrl]);
    //     this.userInforService.basicUserInfo(loggedUser.id, loggedUser.fName, loggedUser.lName, loggedUser.role, loggedUser.email).subscribe({

    //       next: (response: any) => {

    //         if (response != null) {

    //           const configurations = JSON.parse(JSON.stringify(response));

    //           //this.asseteTreeService.setTree(configurations.lstAsseteTree);

    //           //this.mapper.setApprovalRequirements(configurations.fmApprovalRequired, configurations.tmApprovalRequired);

    //           this.router.navigate([this.auth.lastUrl]);

    //         }

    //       },
    //       error: (error: any) => { },
    //       complete() { }
    //     });

    //   }
    //   else {
    //     this.loading = false;
    //     window.location.href = environment.signOn;
    //   }
    // });

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.isDarkMode = this.getCookie('aes-app-theme') == 'dark' ? true : false;

  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     console.log(this.loginForm.value);
  //     this.auth.login(this.loginForm.value).subscribe({
  //       next: (res) => {
  //         console.log(res.message);
  //         this.loginForm.reset();
  //         this.auth.storeToken(res.accessToken);
  //         this.auth.storeRefreshToken(res.refreshToken);
  //         const tokenPayload = this.auth.decodedToken();
  //         this.userStore.setFullNameForStore(tokenPayload.name);
  //         this.userStore.setRoleForStore(tokenPayload.role);
  //         this.toast.success({detail:"SUCCESS", summary:res.message, duration: 5000});
  //         this.router.navigate(['dashboard'])
  //       },
  //       error: (err) => {
  //         this.toast.error({detail:"ERROR", summary:"Something when wrong!", duration: 5000});
  //         console.log(err);
  //       },
  //     });
  //   } else {
  //     ValidateForm.validateAllFormFields(this.loginForm);
  //   }
  // }

  login() {
    this.credentials = this.loginForm.value;

    this.loginLeft = 4;
    this.registerRight = -520;
    this.isLoginActive = true;
    this.loginOpacity = 1;
    this.registerOpacity = 0;

    //this.credentials = new auth();

    this.auth.login(this.credentials).subscribe({
      next:(response:any) => {
        console.log(response);
        const jwtToken = response.token;

        // Store the JWT in local storage or a secure cookie
        localStorage.setItem('jwt', jwtToken);

        // Redirect to a secure page or handle authentication success
        this.router.navigate(['dashboard']);
      },
      error: (error:any) => {
        // Handle authentication error
        console.error('Authentication failed:', error);
      }
    });
  }

  validateControl = (controlName: string) => {
    const control = this.loginForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  hasError = (controlName: string, errorName: string) => {
    const control = this.loginForm.get(controlName);
    return control ? control.hasError(errorName) : false;
  }
}
