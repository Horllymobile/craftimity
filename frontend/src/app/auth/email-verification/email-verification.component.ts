import { Component, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, Subscription, finalize, map } from "rxjs";
import { EContactType } from "src/app/core/enums/auth";
import { IVerifyOtp } from "src/app/core/models/auth";
import { AuthService } from "src/app/core/services/auth/auth.service";

@Component({
  selector: "craft-email-verification",
  templateUrl: "./email-verification.component.html",
  styleUrls: ["./email-verification.component.scss"],
})
export class EmailVerificationComponent implements OnDestroy {
  form!: FormGroup;
  email$!: Observable<string | null>;
  email = "";
  paramSub$!: Subscription;
  verifySub$!: Subscription;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      code: [null, [Validators.required]],
    });
    this.email$ = this.router.paramMap.pipe(
      map((res) => {
        const email = res.get("email");
        if (email) {
          this.email = email;
        }
        return email;
      })
    );
  }

  verifyOtp(formPayload: { [key: string]: string }) {
    this.isLoading = true;
    const payload: IVerifyOtp = {
      type: EContactType.EMAIL,
      code: formPayload["code"],
      email: this.email,
    };
    this.verifySub$ = this.authService
      .verifyOtp(payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem("USER", JSON.stringify(res.data));
          this.toastrService.success(res.message);
          this.route.navigate(["/auth/onboarding"], {
            queryParams: {
              email: payload.email,
              type: payload.type,
            },
          });
        },
        error: (err) => {
          console.log(err);
          this.toastrService.success(err.message);
        },
      });
  }

  ngOnDestroy(): void {
    this.paramSub$?.unsubscribe();
    this.verifySub$?.unsubscribe();
  }
}
