export interface IAddContact {
  Email: string;
  Status: 'Transactional';
  FirstName: string;
  LastName: string;
  CustomFields?: {
    message: string;
    phone: string;
  };
  Consent?: {};
}
