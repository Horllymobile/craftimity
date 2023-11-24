export const userReturnString = `
id,first_name,last_name, full_name, email, 
      phone_number, active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, password,
      is_onboarded, birthdate, profile_image,
      Address(id, floor, house,
        street, Country(id, name),
        State(id, name), City(id, name)
      ), User_Identity(*), Artisan(id,
        name, business_name,
        category(*), certificate,
        work_id, created_at,
        updated_at, approved,
        certificate_approved, work_id_approved)
`;

export const userDecryptedReturnString = `
id,first_name,last_name, full_name, email, 
      phone_number, active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, password, decrypted_password,
      is_onboarded, birthdate, profile_image,
      Address(id, floor, house,
        street, Country(id, name),
        State(id, name), City(id, name)
      ), User_Identity(*), Artisan(id,
        name, business_name,
        category(*), certificate,
        work_id, created_at,
        updated_at, approved,
        certificate_approved, work_id_approved)
`;
