export interface EmailPayload {
  Recipients: {
    To: string[];
    CC?: string[];
    BCC?: string[];
  };
  Content: {
    Body?: [];
    Merge?: object;
    Attachments?: any[];
    Headers?: object;
    Postback?: string;
    EnvelopeFrom?: string;
    From: string;
    ReplyTo?: string;
    Subject: string;
    TemplateName: string;
    AttachFiles?: string[];
    Utm?: object;
  };
  Options?: object;
}
