\# IndoKerja.id — Job Application Management



Aplikasi simulasi proses lamaran kerja. Job Seeker dapat melihat \& melamar

lowongan, Company dapat membuat lowongan \& mengelola status kandidat.



\## Tech Stack



\*\*Backend\*\*

\- Node.js + TypeScript

\- NestJS

\- Prisma ORM

\- PostgreSQL

\- JWT + Passport (autentikasi)

\- class-validator (validasi input)

\- bcrypt (hash password)

\- Account lockout setelah 3x percobaan login gagal (keamanan tambahan)



\*\*Frontend\*\*

\- React.js + TypeScript + Vite

\- Axios

\- React Router DOM

\- Tailwind CSS v4

\- lucide-react (icon)



\## Struktur Folder
indokerja-job-app/

├── backend/

│ ├── prisma/

│ │ ├── schema.prisma

│ │ └── migrations/

│ ├── src/

│ │ ├── auth/

│ │ ├── users/

│ │ ├── jobs/

│ │ ├── applications/

│ │ └── prisma/

│ └── package.json

├── frontend/

│ ├── src/

│ │ ├── api/

│ │ ├── components/

│ │ ├── context/

│ │ └── pages/

│ └── package.json

├── README.md

└── API\_DOCUMENTATION.md



\## Prasyarat



\- Node.js versi 18 atau lebih baru

\- npm

\- PostgreSQL (project ini pakai `prisma dev` untuk database lokal,

&#x20; jadi tidak perlu install PostgreSQL terpisah)



\## Cara Menjalankan (Local)



\### 1. Clone repository



```bash

git clone https://github.com/USERNAME/indokerja-job-app.git

cd indokerja-job-app

```



\### 2. Setup Backend



```bash

cd backend

npm install

```



Buat file `.env` di folder `backend/`:

DATABASE\_URL="postgres://postgres:postgres@localhost:51214/template1?sslmode=disable\&connection\_limit=10\&connect\_timeout=0\&pgbouncer=true"

JWT\_SECRET="ganti-dengan-secret-rahasia-kamu"




Jalankan database lokal (biarkan terminal ini tetap terbuka):



```bash

npx prisma dev

```



Di terminal baru, terapkan schema database:



```bash

cd backend

npx prisma db push

npx prisma generate

```



Jalankan server backend:



```bash

npm run start:dev

```



Backend berjalan di `http://localhost:3000`.



\### 3. Setup Frontend



Buka terminal baru:



```bash

cd frontend

npm install

```



Jalankan frontend:



```bash

npm run dev

```



Frontend berjalan di `http://localhost:5173`.



\### 4. Akun untuk testing



Tidak ada akun default/seed. Buat akun baru lewat halaman Register

(`http://localhost:5173/register`), pilih peran \*\*Job Seeker\*\* atau

\*\*Company\*\*.



\## Alur Pemakaian



1\. \*\*Sebagai Company\*\*: Register → login → buat lowongan baru (Create

&#x20;  Job) → lihat daftar pelamar di lowongan yang dibuat → ubah status

&#x20;  kandidat (Applied / Reviewing / Shortlisted / Rejected / Accepted).

2\. \*\*Sebagai Job Seeker\*\*: Register → login → lihat daftar lowongan →

&#x20;  buka detail lowongan → Apply → lihat status lamaran di halaman

&#x20;  "Lamaran Saya".



Satu Job Seeker tidak dapat melamar lowongan yang sama dua kali.

Setiap perubahan status lamaran otomatis tercatat di riwayat

(`application\_history`).



\## Fitur Keamanan



\- Password di-hash dengan bcrypt sebelum disimpan.

\- Autentikasi menggunakan JWT Bearer token.

\- Role-based access control (Job Seeker tidak bisa mengakses endpoint

&#x20; khusus Company, dan sebaliknya).

\- Validasi input di setiap endpoint menggunakan class-validator.

\- Pesan error login digeneralisasi ("Invalid credentials") baik

&#x20; untuk email tidak terdaftar maupun password salah, untuk mencegah

&#x20; user enumeration.

\- Akun otomatis terkunci selama 15 menit setelah 3 kali percobaan

&#x20; login gagal berturut-turut.



\## Dokumentasi API



Lihat \[API\_DOCUMENTATION.md](./API\_DOCUMENTATION.md) untuk daftar

lengkap endpoint, request body, dan contoh response.

