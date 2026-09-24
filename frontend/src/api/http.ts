import { ERROR_MESSAGES } from "../constants/errorMessages";
import { getCurrentUser } from "./currentUser";

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const user = getCurrentUser();
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": String(user.id),
      "x-user-name": encodeURIComponent(user.name),
      "x-role": user.role,
      ...(options.headers ?? {})
    }
  });
  if (!res.ok) {
    let code = "INTERNAL_ERROR";
    let message = ERROR_MESSAGES.VALIDATION_FAILED;
    try {
      const body = await res.json();
      code = body.code ?? code;
      message = (ERROR_MESSAGES as Record<string, string>)[code] ?? body.message ?? message;
    } catch {
      // 响应体不是 JSON 时使用通用错误文案。
    }
    throw new ApiError(code, message, res.status);
  }
  return (await res.json()) as T;
}
