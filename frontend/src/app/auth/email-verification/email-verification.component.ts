import { Component, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, Subscription, finalize, interval, map } from "rxjs";
import { EContactType } from "src/app/core/enums/auth";
import { IVerifyOtp } from "src/app/core/models/auth";
import { AuthService } from "src/app/core/services/auth/auth.service";

@Component({
  selector: "craft-email-verification",
  templateUrl: "./email-verification.component.html",
  styleUrls: ["./email-verification.component.scss"],
})
export class EmailVerificationComponent implements OnDestroy {
  timer = 30;
  resetSub$!: Subscription;
  form!: FormGroup;
  email$!: Observable<string | null>;
  email = "";
  paramSub$!: Subscription;
  verifySub$!: Subscription;
  isLoading = false;
  isResending = false;
  intervalSub$!: Subscription;
  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.startTimer();
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
          this.toastrService.success(res.message);
          this.route.navigate(["/auth/login"]);
        },
        error: (err) => {
          this.toastrService.success(err);
        },
      });
  }

  async resendOTPCode() {
    this.isResending = true;
    let payload = {
      type: EContactType.EMAIL,
      email: this.email,
    };
    this.resetSub$ = this.authService
      .resendOTPCode(payload)
      .pipe(
        finalize(async () => {
          this.startTimer();
          this.isResending = false;
        })
      )
      .subscribe({
        next: async (res) => {
          this.toastrService.success(res);
        },
        error: async (err) => {
          this.toastrService.success(err);
        },
      });
  }

  startTimer() {
    if (this.timer < 1) this.timer = 30;
    this.intervalSub$ = interval(1000)
      .pipe()
      .subscribe((res) => {
        this.timer -= 1;
        if (this.timer <= 0) {
          this.intervalSub$.unsubscribe();
          this.timer = 0;
        }
      });
  }

  ngOnDestroy(): void {
    this.paramSub$?.unsubscribe();
    this.verifySub$?.unsubscribe();
  }
}
