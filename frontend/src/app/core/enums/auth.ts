export enum ELogin {
  EMAIL = "email",
  PASSWORD = "password",
}

export enum EContactType {
  EMAIL = "email",
  PHONE = "phone",
}

export enum EOnboardingStep {
  PHONE_VERIFICATION = "phone_verification",
  EMAIL_VERIFICATION = "email_verification",
  OTP_VERIFICATION_PHONE = "otp_verification_phone",
  OTP_VERIFICATION_EMAIL = "otp_verification_email",
  IMAGE_UPLOAD = "image_upload",
  COMPLETE = "complete",
}
