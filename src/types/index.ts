export interface WastewaterFacility {
  id?: number;
  nama: string;
  kelurahan_desa: string;
  kapasitas_desain: number;
  kapasitas_terpasang: number;
  tahun_dibangun_rehabilitasi?: number | null;
  kondisi_status_operasional: 'Bangunan Baik, Optimal' | 'Bangunan Baik, Tidak Optimal' | 'Bangunan Rusak, Optimal' | 'Bangunan Rusak, Tidak Optimal';
  lembaga_pengelola: string;
  pengecekan_effluent: 'Belum dilakukan' | 'Sudah dilakukan' | 'Dalam proses';
  latitude?: number | null;
  longitude?: number | null;
  alamat_lengkap?: string | null;
  keterangan?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  full_name: string;
  role: 'admin' | 'operator' | 'viewer';
  is_active: boolean;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityLog {
  id?: number;
  user_id: number;
  action: string;
  table_name: string;
  record_id?: number | null;
  old_values?: any;
  new_values?: any;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
}
