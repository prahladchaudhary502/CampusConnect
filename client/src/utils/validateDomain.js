
// to allow college domain only to register
export const ALLOWED_DOMAINS = ["mnnit.ac.in"];

export function isValidDomain(email) {
  const domain = email.split("@")[1];
  return ALLOWED_DOMAINS.includes(domain);
}
