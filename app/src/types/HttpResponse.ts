export interface HttpError {
  status: number;
  message: string | null;
}

export interface HttpResponse {
  data: any;
  success: boolean;
  message: string;
}
