# SI-PAL - Sistem Informasi Pengelolaan Air Limbah

Sistem informasi pengelolaan air limbah sederhana menggunakan Next.js dengan backend AdminLTE style dan frontend modern untuk menampilkan data fasilitas IPALD (Instalasi Pengolahan Air Limbah Domestik).

## Fitur

### Backend Admin Panel (AdminLTE Style)
- Dashboard dengan statistik fasilitas
- CRUD (Create, Read, Update, Delete) data fasilitas IPALD
- Manajemen data dengan pencarian dan filter
- Interface admin yang user-friendly

### Frontend Public (Modern Design)
- **List View**: Tampilan daftar fasilitas dengan pencarian dan filter
- **Map View**: Visualisasi geografis fasilitas dengan marker interaktif
- Responsive design untuk semua perangkat
- Statistik real-time

### Database
- Struktur database MySQL untuk pengelolaan air limbah
- Tabel fasilitas dengan koordinat latitude/longitude
- Data sample berdasarkan tabel infrastruktur SPALD-T Kota Kendari

## Teknologi yang Digunakan

- **Framework**: Next.js 16 dengan TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **Maps**: Leaflet (OpenStreetMap)
- **Icons**: Lucide React
- **Database Connection**: mysql2

## Instalasi

1. **Clone dan setup project**
   ```bash
   cd si_pal
   npm install
   ```

2. **Setup Database**
   - Buat database MySQL dengan nama `si_pal`
   - Import struktur database dari file `database.sql`
   ```bash
   mysql -u root -p si_pal < database.sql
   ```

3. **Konfigurasi Environment**
   - Copy `.env.example` ke `.env.local`
   - Sesuaikan konfigurasi database:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=si_pal
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) untuk melihat frontend public.
   
   Akses [http://localhost:3000/admin](http://localhost:3000/admin) untuk admin panel.

## Struktur Project

```
si_pal/
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin panel pages
│   │   │   ├── facilities/        # CRUD fasilitas
│   │   │   └── layout.tsx         # Admin layout (AdminLTE style)
│   │   ├── api/                   # API routes
│   │   │   ├── facilities/        # CRUD API endpoints
│   │   │   └── dashboard/         # Dashboard stats API
│   │   ├── map/                   # Map view page
│   │   └── page.tsx               # Homepage (list view)
│   ├── components/
│   │   └── MapComponent.tsx       # Leaflet map component
│   ├── lib/
│   │   └── db.ts                  # Database connection
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── database.sql                   # Database schema
└── README.md
```

## Fitur Database

### Tabel `pengelolaan_air_limbah`
- `id`: Primary key
- `nama`: Nama fasilitas IPALD
- `kelurahan_desa`: Lokasi kelurahan/desa
- `kapasitas_desain`: Kapasitas desain (SR)
- `kapasitas_terpasang`: Kapasitas terpasang (SR)
- `tahun_dibangun_rehabilitasi`: Tahun pembangunan/rehabilitasi
- `kondisi_status_operasional`: Status kondisi dan operasional
- `lembaga_pengelola`: Lembaga yang mengelola (BLUD, dll)
- `pengecekan_effluent`: Status pengecekan effluent
- `latitude`, `longitude`: Koordinat geografis
- `alamat_lengkap`: Alamat lengkap fasilitas
- `keterangan`: Keterangan tambahan

## API Endpoints

### Facilities API
- `GET /api/facilities` - Get all facilities with pagination and search
- `POST /api/facilities` - Create new facility
- `GET /api/facilities/[id]` - Get facility by ID
- `PUT /api/facilities/[id]` - Update facility
- `DELETE /api/facilities/[id]` - Delete facility

### Dashboard API
- `GET /api/dashboard/stats` - Get dashboard statistics

## Penggunaan

### Admin Panel
1. Akses `/admin` untuk dashboard admin
2. Kelola data fasilitas di `/admin/facilities`
3. Tambah fasilitas baru dengan form yang tersedia
4. Edit atau hapus fasilitas yang sudah ada

### Public Frontend
1. **List View** (`/`): Lihat daftar semua fasilitas dengan pencarian dan filter
2. **Map View** (`/map`): Lihat lokasi fasilitas di peta interaktif
3. Klik marker di peta untuk melihat detail fasilitas

## Data Sample

Project ini sudah include data sample berdasarkan:
- IPALD Rusunawa Tobuuha (Kelurahan Tobuha)
- IPALD Rusunawa Puday (Kelurahan Puday)  
- IPALD Rusunawa Bungkutoko (Kelurahan Bungkutoko)

Data berdasarkan SSK Kota Kendari dan BPPW Provinsi Sulawesi Tenggara, 2024.

## Development

Untuk development lebih lanjut:

1. **Tambah fitur baru**: Extend API routes di `src/app/api/`
2. **Modifikasi UI**: Edit components di `src/app/` dan `src/components/`
3. **Database changes**: Update `database.sql` dan types di `src/types/`

## Deployment

Project ini siap untuk deployment ke platform seperti Vercel, Netlify, atau server VPS dengan konfigurasi database yang sesuai.

## Lisensi

Project ini dibuat untuk keperluan sistem informasi pengelolaan air limbah.
# ipal
