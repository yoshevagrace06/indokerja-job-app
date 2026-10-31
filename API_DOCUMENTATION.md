\# API Documentation - IndoKerja.id



Base URL (local): `http://localhost:3000`



Semua endpoint yang butuh autentikasi memerlukan header:



Token didapat dari response `POST /auth/login`.



\---



\## Auth



\### POST /auth/register



Mendaftarkan akun baru sebagai Job Seeker atau Company.



\*\*Body:\*\*

```json

{

&#x20; "email": "user@example.com",

&#x20; "password": "password123",

&#x20; "name": "John Doe",

&#x20; "role": "JOB\_SEEKER",

&#x20; "companyName": "PT Sedia Jaya"

}

```



`role` hanya boleh `"JOB\_SEEKER"` atau `"COMPANY"`. Field `companyName`

bersifat opsional, dapat diisi langsung saat register jika `role` adalah

`COMPANY` (alternatif dari memanggil `POST /users/company` terpisah

setelah login). Password minimal 6 karakter.



\*\*Response 201:\*\*

```json

{

&#x20; "id": "uuid",

&#x20; "email": "user@example.com",

&#x20; "name": "John Doe",

&#x20; "role": "JOB\_SEEKER"

}

```



\### POST /auth/login



Login dan mendapatkan JWT token.



\*\*Body:\*\*

```json

{

&#x20; "email": "user@example.com",

&#x20; "password": "password123"

}

```



\*\*Response 200:\*\*

```json

{

&#x20; "access\_token": "eyJhbGciOi...",

&#x20; "user": {

&#x20;   "id": "uuid",

&#x20;   "email": "user@example.com",

&#x20;   "name": "John Doe",

&#x20;   "role": "JOB\_SEEKER"

&#x20; }

}

```



\*\*Catatan keamanan:\*\*

\- Pesan error untuk email tidak terdaftar maupun password salah sama-sama

&#x20; `"Invalid credentials"` (anti user-enumeration).

\- Akun terkunci otomatis selama 15 menit setelah 3 kali login gagal

&#x20; berturut-turut.



\---



\## Users



\### GET /users/me



Mengambil profil user yang sedang login.



\*\*Auth:\*\* Wajib (JWT), semua role.



\*\*Response 200:\*\*

```json

{

&#x20; "id": "uuid",

&#x20; "email": "user@example.com",

&#x20; "name": "John Doe",

&#x20; "role": "COMPANY",

&#x20; "company": {

&#x20;   "id": "uuid",

&#x20;   "companyName": "PT Sedia Jaya",

&#x20;   "description": "..."

&#x20; }

}

```



\### POST /users/company



Membuat profil company untuk user dengan role COMPANY.



\*\*Auth:\*\* Wajib (JWT).



\*\*Body:\*\*

```json

{

&#x20; "companyName": "PT Sedia Jaya",

&#x20; "description": "Perusahaan teknologi..."

}

```



\*\*Response 201:\*\*

```json

{

&#x20; "id": "uuid",

&#x20; "companyName": "PT Sedia Jaya",

&#x20; "description": "Perusahaan teknologi...",

&#x20; "userId": "uuid"

}

```



\---



\## Jobs



\### POST /jobs



Membuat lowongan pekerjaan baru.



\*\*Auth:\*\* Wajib, role \*\*COMPANY\*\*.



\*\*Body:\*\*

```json

{

&#x20; "title": "Frontend Developer",

&#x20; "description": "About the Company\\n...\\n\\nResponsibilities\\n...",

&#x20; "location": "Jakarta Selatan, Indonesia",

&#x20; "salary": "8000000",

&#x20; "jobType": "FULL\_TIME"

}

```



`jobType` salah satu dari: `FULL\_TIME`, `PART\_TIME`, `CONTRACT`,

`INTERNSHIP`, `FREELANCE`.



\*\*Response 201:\*\*

```json

{

&#x20; "id": "uuid",

&#x20; "title": "Frontend Developer",

&#x20; "description": "...",

&#x20; "location": "Jakarta Selatan, Indonesia",

&#x20; "salary": "8000000",

&#x20; "jobType": "FULL\_TIME",

&#x20; "isOpen": true,

&#x20; "companyId": "uuid",

&#x20; "createdAt": "2026-10-31T00:00:00.000Z",

&#x20; "updatedAt": "2026-10-31T00:00:00.000Z"

}

```



\### GET /jobs



Mengambil semua lowongan yang tersedia.



\*\*Auth:\*\* Tidak wajib (public).



\*\*Response 200:\*\*

```json

\[

&#x20; {

&#x20;   "id": "uuid",

&#x20;   "title": "Frontend Developer",

&#x20;   "location": "Jakarta Selatan, Indonesia",

&#x20;   "salary": "8000000",

&#x20;   "jobType": "FULL\_TIME",

&#x20;   "isOpen": true,

&#x20;   "company": {

&#x20;     "companyName": "PT Sedia Jaya"

&#x20;   }

&#x20; }

]

```



\### GET /jobs/:id



Mengambil detail satu lowongan.



\*\*Auth:\*\* Tidak wajib (public).



\*\*Response 200:\*\*

```json

{

&#x20; "id": "uuid",

&#x20; "title": "Frontend Developer",

&#x20; "description": "...",

&#x20; "location": "Jakarta Selatan, Indonesia",

&#x20; "salary": "8000000",

&#x20; "jobType": "FULL\_TIME",

&#x20; "isOpen": true,

&#x20; "company": {

&#x20;   "companyName": "PT Sedia Jaya",

&#x20;   "description": "...",

&#x20;   "userId": "uuid"

&#x20; }

}

```



\*\*Response 404:\*\* Job tidak ditemukan.



\### PATCH /jobs/:id/toggle



Membuka atau menutup lowongan (toggle). Hanya bisa dilakukan oleh

Company pemilik lowongan tersebut.



\*\*Auth:\*\* Wajib, role \*\*COMPANY\*\*, dan harus pemilik lowongan.



\*\*Response 200:\*\*

```json

{

&#x20; "id": "uuid",

&#x20; "isOpen": false,

&#x20; "...": "..."

}

```



\*\*Response 403:\*\* Jika bukan pemilik lowongan.



\---



\## Applications



\### POST /applications



Melamar sebuah lowongan.



\*\*Auth:\*\* Wajib, role \*\*JOB\_SEEKER\*\*.



\*\*Body:\*\*

```json

{

&#x20; "jobId": "uuid"

}

```



\*\*Response 201:\*\*

```json

{

&#x20; "id": "uuid",

&#x20; "jobId": "uuid",

&#x20; "jobSeekerId": "uuid",

&#x20; "status": "APPLIED",

&#x20; "appliedAt": "2026-10-31T00:00:00.000Z"

}

```



\*\*Response 400/409:\*\* Jika sudah pernah melamar job yang sama

sebelumnya (constraint unique `jobId + jobSeekerId`).



\### GET /applications/me



Mengambil semua lamaran milik Job Seeker yang sedang login, beserta

statusnya.



\*\*Auth:\*\* Wajib, role \*\*JOB\_SEEKER\*\*.



\*\*Response 200:\*\*

```json

\[

&#x20; {

&#x20;   "id": "uuid",

&#x20;   "status": "REVIEWING",

&#x20;   "appliedAt": "2026-10-31T00:00:00.000Z",

&#x20;   "job": {

&#x20;     "id": "uuid",

&#x20;     "title": "Frontend Developer",

&#x20;     "company": {

&#x20;       "companyName": "PT Sedia Jaya"

&#x20;     }

&#x20;   }

&#x20; }

]

```



\### GET /applications/job/:jobId



Mengambil semua pelamar untuk sebuah lowongan tertentu. Hanya bisa

diakses oleh Company pemilik lowongan tersebut.



\*\*Auth:\*\* Wajib, role \*\*COMPANY\*\*.



\*\*Response 200:\*\*

```json

\[

&#x20; {

&#x20;   "id": "uuid",

&#x20;   "status": "APPLIED",

&#x20;   "appliedAt": "2026-10-31T00:00:00.000Z",

&#x20;   "jobSeeker": {

&#x20;     "name": "Grace",

&#x20;     "email": "grace@example.com"

&#x20;   }

&#x20; }

]

```



\### PATCH /applications/:id/status



Mengubah status lamaran seorang kandidat. Setiap perubahan otomatis

tersimpan ke `application\_history`.



\*\*Auth:\*\* Wajib, role \*\*COMPANY\*\* (harus pemilik lowongan terkait).



\*\*Body:\*\*

```json

{

&#x20; "status": "SHORTLISTED",

&#x20; "note": "Kandidat lolos tahap screening awal"

}

```



`status` salah satu dari: `APPLIED`, `REVIEWING`, `SHORTLISTED`,

`REJECTED`, `ACCEPTED`. Field `note` bersifat opsional, akan ikut

tersimpan di `application\_history` sebagai catatan perubahan status.



\*\*Response 200:\*\*

```json

{

&#x20; "id": "uuid",

&#x20; "status": "SHORTLISTED",

&#x20; "updatedAt": "2026-10-31T00:00:00.000Z"

}

```



\---



\## Error Response Format



Semua error mengikuti format standar NestJS:



```json

{

&#x20; "statusCode": 400,

&#x20; "message": "Validation failed atau pesan error spesifik",

&#x20; "error": "Bad Request"

}

```



Kode status yang umum digunakan:

\- `400` - Bad Request (validasi gagal)

\- `401` - Unauthorized (token tidak ada/invalid)

\- `403` - Forbidden (role tidak sesuai, atau bukan pemilik resource)

\- `404` - Not Found (resource tidak ditemukan)

\- `409` - Conflict (contoh: melamar job yang sama dua kali)

