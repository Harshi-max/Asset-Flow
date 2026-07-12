export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export function successResponse<T>(data: T, message = "Request completed successfully") {
  return { success: true, data, message } satisfies ApiResponse<T>;
}

export function errorResponse(message: string) {
  return { success: false, error: message } satisfies ApiResponse<never>;
}
