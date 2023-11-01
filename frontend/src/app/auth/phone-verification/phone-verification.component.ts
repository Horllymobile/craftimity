import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, Subscription, finalize, map } from "rxjs";
import { EContactType } from "src/app/core/enums/auth";
import { IVerifyOtp } from "src/app/core/models/auth";
import { AuthService } from "src/app/core/services/auth/auth.service";

@Component({
  selector: "craft-phone-verification",
  templateUrl: "./phone-verification.component.html",
  styleUrls: ["./phone-verification.component.scss"],
})
export class PhoneVerificationComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  phone$!: Observable<string | null>;
  phone = "";
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

    this.phone$ = this.router.paramMap.pipe(
      map((res) => {
        const phone = res.get("phone");
        if (phone) {
          this.phone = phone;
        }
        return res.get("phone");
      })
    );
  }

  verifyOtp(formPayload: { [key: string]: string }) {
    this.isLoading = true;
    const payload: IVerifyOtp = {
      type: EContactType.PHONE,
      code: formPayload["code"],
      phone: this.phone,
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
          console.log(res);
          localStorage.setItem("USER", JSON.stringify(res.data));
          this.toastrService.success(res.message);
          this.route.navigate(["/auth/onboarding"], {
            queryParams: {
              phone: payload.phone,
              type: payload.type,
            },
          });
        },
        error: (err) => {
          this.toastrService.error(err.message);
        },
      });
  }

  ngOnDestroy(): void {
    this.paramSub$?.unsubscribe();
    this.verifySub$?.unsubscribe();
  }
}
