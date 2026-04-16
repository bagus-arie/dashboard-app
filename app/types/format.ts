export interface InfoFilter {
  tanggal: string;
  jenis_alat: string;
  lokasi: string;
}

export interface AlatData {
  Timestamp: string;
  "Jenis Alat": string;
  "Lokasi Alat": string;
  "Jenis Pekerjaan": string;
  "Jenis Pekerjaan (Jelaskan part yang diganti / Pekerjaan yang dilakukan)": string;
  "Hour Meter": string | number;
  "Tegangan L-L (Avg)": string | number;
  "Tegangan L-N (Avg)": string | number;
  "Arus R": string | number;
  "Arus S": string | number;
  "Arus T": string | number;
  "Pressure On": string | number;
  "Pressure Off": string | number;
  "Foto Selfie + Time Stamp": string;
}

export interface ApiResponse {
  status: string;
  info_filter_aktif: InfoFilter;
  jumlah_data: number;
  data: AlatData[];
}