export const userReturnString = `
id,first_name,last_name, full_name, email, 
      phone_number, active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, password,
      is_onboarded, birthdate, profile_image,
      address(id, floor, house,
        street, country(id, name),
        state(id, name), city(id, name)
      ), identity(*), artisan(id,
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
      address(id, floor, house,
        street, country(id, name),
        state(id, name), city(id, name)
      ), identity(*), artisan(id,
        name, business_name,
        category(*), certificate,
        work_id, created_at,
        updated_at, approved,
        certificate_approved, work_id_approved)
`;

export const serviceReturnString = `
id, name,
price, description,
category(*), created_at,
updated_at, platform_percentage,
artisan(*, user(id, full_name, email, phone_number, birthdate)), negotiable, is_active`;
