import { VALIDATION_RULES } from "./constants"

type ValidationResult = {
  isValid: boolean
  message: string
}

export const FormValidators = {
  /* prettier-ignore */
  validateUsername(username: string): ValidationResult {

    const minLength = VALIDATION_RULES.USERNAME.MIN_LENGTH
    const maxLength = VALIDATION_RULES.USERNAME.MAX_LENGTH
    const pattern = VALIDATION_RULES.USERNAME.PATTERN

    if (!username) return { isValid: false, message: "Username is required" }

    if (username.length < minLength) return { isValid: false, message: `Username must be at least ${minLength} characters` }

    if (username.length > maxLength) return { isValid: false, message: `Username must be less than ${maxLength} characters` }

    if (!pattern.test(username)) return { isValid: false, message: "Username can only contain latin letters, numbers, and underscores" }

    return { isValid: true, message: "" }
  },

  validateEmail(email: string): ValidationResult {
    const pattern = VALIDATION_RULES.EMAIL.PATTERN

    if (!email) return { isValid: false, message: "Email is required" }

    if (!pattern.test(email)) return { isValid: false, message: "Invalid email format" }

    return { isValid: true, message: "" }
  },

  /* prettier-ignore */
  validatePassword(password: string): ValidationResult {
    
    const minLength = VALIDATION_RULES.PASSWORD.MIN_LENGTH
    const maxLength = VALIDATION_RULES.PASSWORD.MAX_LENGTH
    const patterns = VALIDATION_RULES.PASSWORD.PATTERNS

    if (!password) return { isValid: false, message: "Password is required" }

    if (password.length < minLength) return { isValid: false, message: `Password must be at least ${minLength} characters` }

    if (password.length > maxLength) return { isValid: false, message: `Password must be less than ${maxLength} characters` }

    if (!patterns.LATIN_ONLY.test(password)) return { isValid: false, message: "Password must contain latin only symbols" }

    if (!patterns.UPPERCASE.test(password)) return { isValid: false, message: "Password must contain at least one latin uppercase letter" }

    if (!patterns.LOWERCASE.test(password)) return { isValid: false, message: "Password must contain at least one latin lowercase letter" }

    if (!patterns.NUMBER.test(password)) return { isValid: false, message: "Password must contain at least one number" }

    return { isValid: true, message: "" }
  }
}
