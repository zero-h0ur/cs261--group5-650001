-- ===== หมวดหมู่ =====
MERGE INTO category (category_id, category_name) KEY(category_id) VALUES
 (1,'ค่าย'),
 (2,'กิจกรรม'),
 (3,'ดนตรี'),
 (4,'เทคโนโลยี'),
 (5,'กีฬา'),
 (6,'แข่งขัน'),
 (7,'เวิร์กชอป'),
 (8,'ศิลปะ'),
 (9,'วิชาการ'),
 (10,'การเงิน'),
 (11,'ธุรกิจ');

-- ===== อีเวนท์ตัวอย่าง =====
-- ถ้า column event_id เป็น IDENTITY (ตาม @GeneratedValue) แนะนำ "ไม่ใส่" event_id ให้ autos-increment
/*MERGE INTO event (
  title, description, start_date, end_date, time, location,
  organizer, capacity, organizer_contact, image_url, category_id, detail
) KEY(title) VALUES
('TU Freshmen Night', 'คอนเสิร์ตเปิดปี', DATE '2025-10-25', DATE '2025-10-25', '18:00',
 'Hall A', 'SA TU', 500, 'line:@sastu', 'Resourse/Poster/image-14.png', 1,
 'รายละเอียดงานสำหรับเดโม'),
('Design Thinking 101', 'เวิร์กชอปเบื้องต้น', DATE '2025-10-28', DATE '2025-10-28', '13:00',
 'ห้อง C-201', 'DSI', 60, 'fb:DSI', 'Resourse/Poster/image-15.png', 7,
 'รายละเอียดงานสำหรับเดโม');
*/