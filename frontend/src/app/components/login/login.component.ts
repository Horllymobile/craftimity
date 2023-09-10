import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "craft-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  openLoginWithEmail = true;
  openLoginWithPhone = false;
  constructor(private dialogRef: MatDialogRef<LoginComponent>) {}

  toogle() {
    this.openLoginWithEmail = !this.openLoginWithEmail;
    this.openLoginWithPhone = !this.openLoginWithPhone;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
