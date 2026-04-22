import { defineStore } from 'pinia'
import type { AlatData, InfoFilter } from '~/types/format'

// 2. Buat Pinia Store
export const useDetailAlatStore = defineStore("DetailAlatLokasi", {
  state: () => ({
    dataAlat: [] as AlatData[],
    infoFilter: {
      tanggal: '',
      jenis_alat: '',
      lokasi: ''
    } as InfoFilter,
    jumlahData: 0,
    statusApi: '',
    
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchSemuaAlat(lokasi: string, Lantai: string) {
      // 1. Nyalakan loading dan reset error setiap kali fungsi dipanggil
      this.isLoading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();
        console.log(`Mencari data untuk Gedung: ${lokasi}, Lantai: ${Lantai}`);
        
        // Panggil API menggunakan nama gedung (misal: "igd" atau "nicu")
        const response = await $api.alats.getbyGedung(lokasi);
        
        if (response && response.status === 'success') {
          
          // ==========================================
          // FILTER GANDA (GEDUNG + LANTAI)
          // ==========================================
          const reqLokasi = lokasi.toLowerCase().trim();
          const reqLantai = Lantai ? Lantai.toString().toLowerCase().trim() : '';

          const dataTersaring = response.data.filter((item: any) => {
            const lokasiAlat = (item["Lokasi Alat"] || "").toLowerCase().trim();

            // Syarat 1: Namanya harus mengandung nama gedung (misal: harus ada kata "igd")
            if (!lokasiAlat.includes(reqLokasi)) return false;

            // Syarat 2: Khusus untuk IGD (atau gedung bertingkat lainnya), 
            // pastikan angka lantainya juga ada di dalam nama lokasi (misal: "IGD 7 R1")
            // Jika nama gedungnya NICU/PICU, kita abaikan filter lantai karena di data tidak ada angkanya.
            if (reqLokasi === 'igd' && reqLantai !== '') {
               // Kalau sedang cari lantai 7, tapi data ini tidak punya angka 7, maka buang (false)
               if (!lokasiAlat.includes(reqLantai)) return false;
            }

            return true; // Jika lolos semua syarat, masukkan ke data akhir
          });

          // Simpan data yang sudah disaring ke state Pinia
          this.dataAlat = dataTersaring;
          this.infoFilter = response.info_filter_aktif;
          this.jumlahData = dataTersaring.length;
          this.statusApi = response.status;
          
          console.log(`Berhasil menyaring ${dataTersaring.length} data untuk Lantai ${Lantai}`);
        }
      } catch (err: any) {
        this.error = err.message || 'Terjadi kesalahan saat mengambil data alat.';
        console.error("Pinia Error (fetchSemuaAlat):", err);
        this.dataAlat = []; // Kosongkan data jika terjadi error
      } finally {
        // 2. Matikan loading (wajib ditaruh di finally agar selalu dieksekusi)
        this.isLoading = false;
      }
    }
  },
  
  getters: {
    isDataEmpty: (state) => state.dataAlat.length === 0,
  }
});