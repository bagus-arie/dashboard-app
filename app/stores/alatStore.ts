import { defineStore } from 'pinia'
import type { AlatData, InfoFilter } from '~/types/format'

// 2. Buat Pinia Store
export const useAlatStore = defineStore("Alat", {
  state: () => ({
    // Menampung data utama dari API
    dataAlat: [] as AlatData[],
    
    // Menampung info filter dan meta data
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
    // Fungsi untuk mengambil data dan menyimpannya ke state
    async fetchSemuaAlat() {
    //   this.isLoading = true;
    //   this.error = null;

      try {
    //     // Menggunakan instance API plugin Anda (seperti di kodingan sebelumnya)
        const { $api } = useNuxtApp();
        
    //     // Panggil API
        const response = await $api.alats.getAllbyAlat();

    //     // JIKA BERHASIL: Simpan respons ke dalam state Pinia
        if (response && response.status === 'success') {
          this.dataAlat = response.data;
          this.infoFilter = response.info_filter_aktif;
          this.jumlahData = response.jumlah_data;
          this.statusApi = response.status;
        }

      } catch (err: any) {
    //     // JIKA GAGAL: Tangkap error
        this.error = err.message || 'Terjadi kesalahan saat mengambil data alat.';
        console.error("Pinia Error (fetchSemuaAlat):", err);
      } finally {
        // MATIKAN LOADING: Baik sukses maupun gagal, loading harus berhenti
        this.isLoading = false;
      }
    }
  },
  
  getters: {
    // Opsional: Contoh jika Anda ingin membuat getter untuk mengecek apakah data kosong
    isDataEmpty: (state) => state.dataAlat.length === 0,
  }
});