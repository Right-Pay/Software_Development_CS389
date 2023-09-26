export interface HttpError {
    status: number;
    message: string | null;
}

export interface HttpResponse {
    data: any;
    status: number;
    error: HttpError | null;
}