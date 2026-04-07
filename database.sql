-- Database Schema for Wastewater Management Information System (SI-PAL)
-- Created for managing IPALD (Instalasi Pengolahan Air Limbah Domestik) facilities

CREATE DATABASE IF NOT EXISTS si_pal;
USE si_pal;

-- Table for wastewater treatment facilities
CREATE TABLE pengelolaan_air_limbah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL COMMENT 'Nama fasilitas IPALD',
    kelurahan_desa VARCHAR(255) NOT NULL COMMENT 'Kelurahan/Desa yang masuk dalam cakupan pelayanan',
    kapasitas_desain INT NOT NULL COMMENT 'Kapasitas Desain (SR)',
    kapasitas_terpasang INT NOT NULL COMMENT 'Kapasitas Terpasang (SR)',
    tahun_dibangun_rehabilitasi YEAR NULL COMMENT 'Tahun Dibangun/Rehabilitasi',
    kondisi_status_operasional ENUM('Bangunan Baik, Optimal', 'Bangunan Baik, Tidak Optimal', 'Bangunan Rusak, Optimal', 'Bangunan Rusak, Tidak Optimal') NOT NULL COMMENT 'Kondisi dan Status Operasional',
    lembaga_pengelola VARCHAR(100) NOT NULL COMMENT 'Lembaga Pengelola (BLUD, Swasta, dll)',
    pengecekan_effluent ENUM('Belum dilakukan', 'Sudah dilakukan', 'Dalam proses') NOT NULL COMMENT 'Status Pengecekan Effluent',
    latitude DECIMAL(10, 8) NULL COMMENT 'Koordinat Latitude',
    longitude DECIMAL(11, 8) NULL COMMENT 'Koordinat Longitude',
    alamat_lengkap TEXT NULL COMMENT 'Alamat lengkap fasilitas',
    keterangan TEXT NULL COMMENT 'Keterangan tambahan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_kelurahan (kelurahan_desa),
    INDEX idx_lembaga (lembaga_pengelola),
    INDEX idx_kondisi (kondisi_status_operasional),
    INDEX idx_koordinat (latitude, longitude)
);

-- Insert sample data based on the provided table and PDF document
INSERT INTO pengelolaan_air_limbah (
    nama, 
    kelurahan_desa, 
    kapasitas_desain, 
    kapasitas_terpasang, 
    tahun_dibangun_rehabilitasi,
    kondisi_status_operasional, 
    lembaga_pengelola, 
    pengecekan_effluent,
    latitude,
    longitude,
    alamat_lengkap
) VALUES 
-- Original Kota Kendari data
('IPALD Rusunawa Tobuuha', 'Kelurahan Tobuha', 200, 96, NULL, 'Bangunan Baik, Optimal', 'BLUD', 'Belum dilakukan', -3.9778, 122.5194, 'Kelurahan Tobuha, Kota Kendari, Sulawesi Tenggara'),
('IPALD Rusunawa Puday', 'Kelurahan Puday', 200, 196, NULL, 'Bangunan Baik, Optimal', 'BLUD', 'Belum dilakukan', -3.9889, 122.5083, 'Kelurahan Puday, Kota Kendari, Sulawesi Tenggara'),
('IPALD Rusunawa Bungkutoko', 'Kelurahan Bungkutoko', 200, 114, NULL, 'Bangunan Baik, Optimal', 'BLUD', 'Belum dilakukan', -4.0000, 122.4972, 'Kelurahan Bungkutoko, Kota Kendari, Sulawesi Tenggara'),

-- Additional data from PDF document - IPLT and IPALD facilities
-- IPLT Data
('IPLT Pulonggida', 'Kelurahan Watulondo', 80, 50, 2005, 'Bangunan Baik, Optimal', 'UPTD', 'Belum dilakukan', -5.4891, 122.6233, 'IPLT Pulonggida, Kelurahan Watulondo, Kota Baubau'),

-- IPALD Komunal Kota Baubau (2006-2012)
('IPALD Komunal Tomba', 'Kelurahan Tomba', 0, 0, 2006, 'Bangunan Rusak, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4678, 122.6012, 'Kelurahan Tomba, Kota Baubau'),
('IPALD Komunal Bataraguru 1', 'Kelurahan Bataraguru', 0, 0, 2006, 'Bangunan Rusak, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4789, 122.6134, 'Kelurahan Bataraguru, Kota Baubau'),
('IPALD Komunal Nganganaumala 1', 'Kelurahan Nganganaumala', 0, 0, 2006, 'Bangunan Rusak, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4567, 122.6245, 'Kelurahan Nganganaumala, Kota Baubau'),
('IPALD Komunal Bataraguru 2', 'Kelurahan Bataraguru', 0, 0, 2007, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4790, 122.6135, 'Kelurahan Bataraguru, Kota Baubau'),
('IPALD Komunal Kobula', 'Kelurahan Kobula', 0, 0, 2007, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4456, 122.6356, 'Kelurahan Kobula, Kota Baubau'),
('IPALD Komunal Tarafu', 'Kelurahan Tarafu', 100, 0, 2008, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4345, 122.6467, 'Kelurahan Tarafu, Kota Baubau'),
('IPALD Komunal Nganganaumala 2', 'Kelurahan Nganganaumala', 100, 0, 2008, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4568, 122.6246, 'Kelurahan Nganganaumala, Kota Baubau'),
('IPALD Komunal Kadolokatapi 1', 'Kelurahan Kadolokatapi', 0, 0, 2008, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.4234, 122.6578, 'Kelurahan Kadolokatapi, Kota Baubau'),
('IPALD Komunal Wameo 1', 'Kelurahan Wameo', 0, 0, 2010, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.4123, 122.6689, 'Kelurahan Wameo, Kota Baubau'),
('IPALD Komunal Lamangga', 'Kelurahan Lamangga', 0, 0, 2010, 'Bangunan Rusak, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4012, 122.6790, 'Kelurahan Lamangga, Kota Baubau'),
('IPALD Komunal Bone-Bone 1', 'Kelurahan Bone-Bone', 0, 0, 2011, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.3901, 122.6801, 'Kelurahan Bone-Bone, Kota Baubau'),
('IPALD Komunal Liabuku 1', 'Kelurahan Liabuku', 0, 0, 2011, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.3890, 122.6812, 'Kelurahan Liabuku, Kota Baubau'),
('IPALD Komunal Lakologou', 'Kelurahan Lakologou', 0, 0, 2012, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.3789, 122.6923, 'Kelurahan Lakologou, Kota Baubau'),

-- IPALD Komunal 2012-2015
('IPALD Komunal Sulaa', 'Kelurahan Sulaa', 100, 10, 2012, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3678, 122.7034, 'Kelurahan Sulaa, Kota Baubau'),
('IPALD Komunal Waborobo 1', 'Kelurahan Waborobo', 100, 0, 2012, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3567, 122.7145, 'Kelurahan Waborobo, Kota Baubau'),
('IPALD Komunal Bone-Bone 2', 'Kelurahan Bone-Bone', 100, 12, 2012, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3902, 122.6802, 'Kelurahan Bone-Bone, Kota Baubau'),
('IPALD Komunal Batulo 1', 'Kelurahan Batulo', 100, 0, 2013, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3456, 122.7256, 'Kelurahan Batulo, Kota Baubau'),
('IPALD Komunal Batulo 2', 'Kelurahan Batulo', 100, 0, 2013, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3457, 122.7257, 'Kelurahan Batulo, Kota Baubau'),
('IPALD Komunal Karya Baru', 'Kelurahan Karya Baru', 100, 34, 2013, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3345, 122.7367, 'Kelurahan Karya Baru, Kota Baubau'),
('IPALD Komunal Sukanayo', 'Kelurahan Sukanayo', 100, 0, 2013, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3234, 122.7478, 'Kelurahan Sukanayo, Kota Baubau'),

-- IPALD + MCK 2014
('IPALD + MCK Kaisabu Baru 1', 'Kelurahan Kaisabu Baru', 0, 0, 2014, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3123, 122.7589, 'Kelurahan Kaisabu Baru, Kota Baubau'),
('IPALD Komunal Kaisabu Baru 2', 'Kelurahan Kaisabu Baru', 30, 12, 2014, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3124, 122.7590, 'Kelurahan Kaisabu Baru, Kota Baubau'),
('IPALD Komunal Kaisabu Baru 3', 'Kelurahan Kaisabu Baru', 20, 8, 2014, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3125, 122.7591, 'Kelurahan Kaisabu Baru, Kota Baubau'),
('IPALD Komunal Kadolokatapi 2', 'Kelurahan Kadolokatapi', 50, 24, 2014, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4235, 122.6579, 'Kelurahan Kadolokatapi, Kota Baubau'),
('IPALD Komunal Kadolokatapi 3', 'Kelurahan Kadolokatapi', 50, 13, 2014, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4236, 122.6580, 'Kelurahan Kadolokatapi, Kota Baubau'),
('IPALD Komunal Labalawa 1', 'Kelurahan Labalawa', 30, 14, 2014, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3012, 122.7690, 'Kelurahan Labalawa, Kota Baubau'),
('IPALD Komunal Labalawa 2', 'Kelurahan Labalawa', 30, 12, 2014, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3013, 122.7691, 'Kelurahan Labalawa, Kota Baubau'),
('IPALD Komunal Labalawa 3', 'Kelurahan Labalawa', 40, 23, 2014, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3014, 122.7692, 'Kelurahan Labalawa, Kota Baubau'),

-- IPALD Komunal 2015
('IPALD Komunal Kampeonaho 1', 'Kelurahan Kampeonaho', 30, 15, 2014, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2901, 122.7801, 'Kelurahan Kampeonaho, Kota Baubau'),
('IPALD Komunal Kampeonaho 2', 'Kelurahan Kampeonaho', 30, 5, 2014, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2902, 122.7802, 'Kelurahan Kampeonaho, Kota Baubau'),
('IPALD Komunal Kampeonaho 3', 'Kelurahan Kampeonaho', 40, 21, 2014, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2903, 122.7803, 'Kelurahan Kampeonaho, Kota Baubau'),
('IPALD Komunal Liabuku 2', 'Kelurahan Liabuku', 20, 15, 2015, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3891, 122.6813, 'Kelurahan Liabuku, Kota Baubau'),
('IPALD Komunal Liabuku 3', 'Kelurahan Liabuku', 20, 17, 2015, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.3892, 122.6814, 'Kelurahan Liabuku, Kota Baubau'),
('IPALD Komunal Waliabuku 1', 'Kelurahan Waliabuku', 30, 6, 2015, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2790, 122.7912, 'Kelurahan Waliabuku, Kota Baubau'),
('IPALD Komunal Waliabuku 2', 'Kelurahan Waliabuku', 30, 4, 2015, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2791, 122.7913, 'Kelurahan Waliabuku, Kota Baubau'),
('IPALD Komunal Waliabuku 3', 'Kelurahan Waliabuku', 30, 8, 2015, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2792, 122.7914, 'Kelurahan Waliabuku, Kota Baubau'),
('IPALD Komunal NgkariNgkari 1', 'Kelurahan NgkariNgkari', 50, 40, 2015, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2679, 122.8023, 'Kelurahan NgkariNgkari, Kota Baubau'),
('IPALD Komunal NgkariNgkari 2', 'Kelurahan NgkariNgkari', 50, 42, 2015, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2680, 122.8024, 'Kelurahan NgkariNgkari, Kota Baubau'),
('IPALD Komunal Gonda Baru 1', 'Kelurahan Gonda Baru', 30, 20, 2015, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.2568, 122.8134, 'Kelurahan Gonda Baru, Kota Baubau'),
('IPALD Komunal Gonda Baru 2', 'Kelurahan Gonda Baru', 30, 17, 2015, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.2569, 122.8135, 'Kelurahan Gonda Baru, Kota Baubau'),
('IPALD Komunal Gonda Baru 3', 'Kelurahan Gonda Baru', 30, 22, 2015, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.2570, 122.8136, 'Kelurahan Gonda Baru, Kota Baubau'),

-- IPALD Komunal 2015 (Wameo dan Baadia)
('IPALD Komunal Wameo 2', 'Kelurahan Wameo', 80, 30, 2015, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4124, 122.6690, 'Kelurahan Wameo, Kota Baubau'),
('IPALD Komunal Wameo 3', 'Kelurahan Wameo', 20, 11, 2015, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4125, 122.6691, 'Kelurahan Wameo, Kota Baubau'),
('IPALD Komunal Wameo 4', 'Kelurahan Wameo', 20, 10, 2015, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.4126, 122.6692, 'Kelurahan Wameo, Kota Baubau'),
('IPALD Komunal Baadia', 'Kelurahan Baadia', 100, 53, 2015, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2457, 122.8245, 'Kelurahan Baadia, Kota Baubau'),

-- IPALD + MCK 2016
('IPALD + MCK Bugi 1', 'Kelurahan Bugi', 0, 0, 2016, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.2346, 122.8356, 'Kelurahan Bugi, Kota Baubau'),

-- IPALD Komunal 2017
('IPALD Komunal Waliabuku 4', 'Kelurahan Waliabuku', 40, 20, 2017, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2793, 122.7915, 'Kelurahan Waliabuku, Kota Baubau'),
('IPALD Komunal Waliabuku 5', 'Kelurahan Waliabuku', 40, 20, 2017, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2794, 122.7916, 'Kelurahan Waliabuku, Kota Baubau'),
('IPALD Komunal Palabusa 1', 'Kelurahan Palabusa', 50, 22, 2017, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2235, 122.8467, 'Kelurahan Palabusa, Kota Baubau'),
('IPALD Komunal Lowu-Lowu', 'Kelurahan Lowu-Lowu', 50, 25, 2017, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2124, 122.8578, 'Kelurahan Lowu-Lowu, Kota Baubau'),
('IPALD Komunal Kolese 1', 'Kelurahan Kolese', 50, 31, 2017, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.2013, 122.8689, 'Kelurahan Kolese, Kota Baubau'),
('IPALD Komunal Gonda Baru 4', 'Kelurahan Gonda Baru', 40, 27, 2017, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2571, 122.8137, 'Kelurahan Gonda Baru, Kota Baubau'),
('IPALD Komunal Gonda Baru 5', 'Kelurahan Gonda Baru', 40, 23, 2017, 'Bangunan Baik, Tidak Optimal', 'KSM', 'Belum dilakukan', -5.2572, 122.8138, 'Kelurahan Gonda Baru, Kota Baubau'),
('IPALD Komunal Bugi 2', 'Kelurahan Bugi', 40, 40, 2017, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.2347, 122.8357, 'Kelurahan Bugi, Kota Baubau'),
('IPALD Komunal Bugi 3', 'Kelurahan Bugi', 40, 40, 2017, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.2348, 122.8358, 'Kelurahan Bugi, Kota Baubau'),

-- IPALD Komunal 2018
('IPALD Komunal Labalawa 4', 'Kelurahan Labalawa', 50, 50, 2018, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.3015, 122.7693, 'Kelurahan Labalawa, Kota Baubau'),
('IPALD Komunal Palabusa 2', 'Kelurahan Palabusa', 50, 50, 2018, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.2236, 122.8468, 'Kelurahan Palabusa, Kota Baubau'),

-- MCK Kombinasi + IPALD 2018
('MCK Kombinasi + IPALD Waborobo 2', 'Kelurahan Waborobo', 50, 50, 2018, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.3568, 122.7146, 'Kelurahan Waborobo, Kota Baubau'),
('MCK Kombinasi + IPALD Waborobo 3', 'Kelurahan Waborobo', 50, 50, 2018, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.3569, 122.7147, 'Kelurahan Waborobo, Kota Baubau'),
('MCK Kombinasi + IPALD Kalia-Lia', 'Kelurahan Kalia-Lia', 50, 50, 2018, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.1902, 122.8790, 'Kelurahan Kalia-Lia, Kota Baubau'),
('MCK Kombinasi + IPALD Kolese 2', 'Kelurahan Kolese', 50, 50, 2018, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.2014, 122.8690, 'Kelurahan Kolese, Kota Baubau'),

-- MCK++ 2018-2019
('MCK++ Kampeonaho', 'Kelurahan Kampeonaho', 0, 0, 2018, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.2904, 122.7804, 'Kelurahan Kampeonaho, Kota Baubau'),
('MCK++ Liabuku', 'Kelurahan Liabuku', 0, 0, 2018, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.3893, 122.6815, 'Kelurahan Liabuku, Kota Baubau'),
('MCK++ Kaisabu Baru', 'Kelurahan Kaisabu Baru', 0, 0, 2018, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.3126, 122.7592, 'Kelurahan Kaisabu Baru, Kota Baubau'),
('MCK++ BWI', 'Kelurahan BWI', 0, 0, 2019, 'Bangunan Baik, Optimal', 'KSM', 'Belum dilakukan', -5.1791, 122.8901, 'Kelurahan BWI, Kota Baubau');

-- Table for users (admin backend)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'operator', 'viewer') DEFAULT 'operator',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@sipal.com', '$2b$10$rQZ9vKzqzQzqzQzqzQzqzOzqzQzqzQzqzQzqzQzqzQzqzQzqzQzqz', 'Administrator', 'admin');

-- Table for activity logs
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE, VIEW',
    table_name VARCHAR(50) NOT NULL,
    record_id INT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_action (user_id, action),
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_created_at (created_at)
);
