import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export class DomainError extends Error {
  status: number;
  code: string;

  constructor(code: keyof typeof ERROR_CODES, status = 400) {
    super(ERROR_MESSAGES[code]);
    this.name = "DomainError";
    this.status = status;
    this.code = ERROR_CODES[code];
  }
}
