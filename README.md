## Deskripsi Proyek

Backend untuk aplikasi undian dengan sistem gacha. Setiap user hanya boleh gacha maksimal 5 kali dalam 1 hari. Program ini memastikan kuota hadiah tidak terlampaui dan mencatat semua aktivitas di MongoDB.

## Fitur

- Autentikasi JWT
- Endpoint gacha yang diprotect dengan token
- Pencatatan log gacha di database

## Cara Menjalankan

npm install
npm run dev
Server berjalan di localhost:5000

## Daftar Endpoint

1. Create User
   POST localhost:5000/api/users  
   Input = Body:JSON  
   {  
   "email": "emailkamu@test.com",  
   "full_name": "nama kamu",  
   "password": "passwordkamu",  
   "confirm_password": "passwordkamu"  
   }  
   Deskripsi: Menyimpan akun user kedalam database

2. Authentication  
   POST localhost:5000/api/auth/login  
   Input: JSON  
   {  
   "email": "emailkamu@test.com",  
   "password": "passwordkamu"  
   }  
   Deskripsi: Mendapatkan token login yang berlaku selama 1 hari

3. Gacha (Protected)  
   POST localhost:5000/api/gacha  
   Input = Header:  
   Key: Authorization  
   Value: JWT <token>  
   Deskripsi: Melakukan gacha (maksimal 5 kali per hari)

4. History Gacha User  
   GET localhost:5000/api/gacha/history  
   Input = Header:  
   Key: Authorization  
   Value: JWT <token>  
   Deskripsi: Melihat riwayat gacha user menggunakan token akunnya

5. Prize Remaining  
   GET localhost:5000/api/prizes/remaining  
   Deskripsi: Melihat daftar hadiah dan jumlah yang masih tersisa

6. Winners  
   GET localhost:5000/api/winners  
   Deskripsi: Melihat daftar user yang menang beserta hadiahnya. Nama user disamarkan secara acak
