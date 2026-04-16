import type { $Fetch } from "ofetch";
import type { ApiResponse } from "~/types/format";
export class AlatRepository {
  private fetch: $Fetch;

  constructor(fetch: $Fetch) {
    this.fetch = fetch;
  }

  async getbyAlat(namaAlat : string): Promise<ApiResponse[]> {
    return this.fetch<ApiResponse[]>(`?jenis_alat=${namaAlat}`, {
      method: "GET",
    });
  }

   async getbyGedung(lokasi : string): Promise<ApiResponse[]> {
    return this.fetch<ApiResponse[]>(`?lokasi=${lokasi}`, {
      method: "GET",
    });
  }
  
  async getbyTanggal(tanggal : string): Promise<ApiResponse[]> {
    return this.fetch<ApiResponse[]>(`?tanggal=${tanggal}`, {
      method: "GET",
    });
  }

//   async getProductById(id: number): Promise<Berita> {
//     return this.fetch<Berita>(`/berita/${id}`, {
//       method: "GET",
//     });
//   }

//   async createBerita(beritaData: Omit<Berita, "id">): Promise<Berita> {
//     return this.fetch<Berita>("/berita", {
//       method: "POST",
//       body: beritaData,
//     });
//   }
}
