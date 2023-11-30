export interface HttpError {
  status: number;
  message: string | null;
}

export interface HttpResponse<T> {
  data: T;
  success: boolean;
  message: string;
}
