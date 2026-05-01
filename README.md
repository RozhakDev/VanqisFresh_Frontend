# VanqisFresh Frontend

VanqisFresh Frontend adalah aplikasi berbasis React yang berfungsi sebagai antarmuka pengguna untuk sistem penjualan produk buah dan sayur. Aplikasi ini memungkinkan pengguna untuk melihat katalog produk, mengelola keranjang, serta melakukan proses checkout dan pembayaran.

Frontend berfokus pada pengalaman pengguna yang sederhana dan cepat, dengan pendekatan mobile-first. Seluruh data diambil dari backend melalui REST API, sementara state seperti autentikasi dan keranjang dikelola di sisi client.

## Fungsionalitas

Frontend menangani interaksi utama pengguna, meliputi eksplorasi produk buah dan sayur, pengelolaan keranjang, serta proses checkout dan pembayaran.

## Teknologi

Frontend dikembangkan menggunakan:

- React
- TypeScript
- Vite
- React Router
- TanStack React Query
- Zustand
- Axios
- Tailwind CSS

## Instalasi

1. Clone repository dan masuk ke direktori project
   
   ```bash
   git clone https://github.com/RozhakDev/VanqisFresh_Frontend.git
   cd VanqisFresh_Frontend
   ```

2. Install dependency

    ```bash
    npm install
    ```

3. Jalankan development server

    ```bash
    npm run dev
    ```

## Struktur

Frontend menggunakan arsitektur modular yang memisahkan halaman, state, dan komunikasi API untuk menjaga keteraturan dan kemudahan pengembangan.

## Tim

VanqisFresh Team

## Catatan

Frontend terintegrasi dengan backend melalui REST API. Beberapa state seperti keranjang disimpan secara lokal untuk menjaga performa dan pengalaman pengguna. Sistem dirancang ringan dan mudah dikembangkan sesuai kebutuhan.

## License

See [LICENSE](./LICENSE)