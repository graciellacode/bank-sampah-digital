// Bentuk response SUKSES standar sesuai kontrak API di PDF.
// Generic <T> artinya bentuk "data" bisa berbeda-beda tergantung endpoint,
// nanti kita isi saat memanggil, contoh: ApiSuccessResponse<Nasabah[]>
export interface ApiSuccessResponse<T> {
    statusCode: number;
    success: true;
    message: string;
    data: T;
}