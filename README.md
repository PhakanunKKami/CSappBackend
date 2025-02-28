# CSappBackend
1. โหลด REST Client Extension ใน VS code
2. เปิดไฟล์ .http แล้วกด Send request เพื่อเช็คการทำงาน

* มีปัญหาสักอย่างกับ prisma ที่เครื่องเลยไม่ได้ลบ column name lastname ออก (อันนี้ถ้าแก้ตอนเอาขึ้นเซิฟก็แค่ตัว database กับ prisma ไม่เกี่ยวกับ JWT)
* แนะนำให้โหลดเฉพาะไฟล์ที่เพิ่มมา middleware folder, routes folder, utils, และอัพเดทไฟล์ server.js
* เรียงใส่ folder เพื่อความสวยงามและเป็นระเบียบเฉยๆ
* ใน .ENV เป็นของ database ทดสอบ ถ้าดึงไปใช้เลยอย่าลืมเปลี่ยน!!!
