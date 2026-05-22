export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone: string): boolean {
  return /^(\+33|0)[1-9](\d{2}){4}$/.test(phone.replace(/\s/g, ''))
}

export function isValidPostalCode(code: string): boolean {
  return /^\d{5}$/.test(code)
}

export function isValidCardNumber(num: string): boolean {
  return /^\d{16}$/.test(num.replace(/\s/g, ''))
}
