export interface EmailTemplate {
  from: From;
  personalizations: Personalization[];
  template_id: string;
}

export interface EmailMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

export interface Personalization {
  to: To[];
  dynamic_template_data: any;
}

export type From = {
  email?: string;
};

export type To = {
  email?: string;
};
