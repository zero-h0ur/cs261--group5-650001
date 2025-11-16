-- 003_sample_queries_favorites.sql
PRINT '== 003: Sample queries for v_user_favorites (includes pagination + instructions for execution plan) ==';
GO

-- ตั้งค่าเพื่อดู statistics (IO/Time) — รันก่อน/หลัง query เพื่อดูประสิทธิภาพ
SET STATISTICS IO ON;
SET STATISTICS TIME ON;
GO

-- ตัวอย่าง 1: ดึง favorites ของ user/account โดยใช้ pagination (page, pageSize)
-- ตัวอย่างสมมติ: page = 1, pageSize = 10
DECLARE @page INT = 1;
DECLARE @pageSize INT = 10;
DECLARE @offset INT = (@page - 1) * @pageSize;

-- ถ้า view มี column account_id ใช้ WHERE account_id = <value>
-- แก้ค่า 1 เป็น account/user ที่ต้องการ
SELECT
    favorite_id,
    account_id,
    event_id,
    event_title,
    start_date,
    starts_at,
    location,
    category_name,
    favorited_at
FROM dbo.v_user_favorites
WHERE account_id = 1   -- <<== ปรับเป็น account/user จริง
ORDER BY favorited_at DESC
OFFSET @offset ROWS
FETCH NEXT @pageSize ROWS ONLY;
GO

-- ตัวอย่าง 2: นับจำนวน favorites ต่อ event (top popular events)
SELECT TOP (50)
    event_id,
    event_title,
    COUNT(*) AS favorite_count
FROM dbo.v_user_favorites
GROUP BY event_id, event_title
ORDER BY favorite_count DESC;
GO

-- ตัวอย่าง 3: ดู favorites เฉพาะ event ที่ active และยังไม่จบ (ตามวันที่ปัจจุบัน)
SELECT
    account_id,
    event_id,
    event_title,
    start_date,
    end_date,
    location
FROM dbo.v_user_favorites
WHERE event_active = 1
  AND (end_date IS NULL OR end_date >= CAST(GETDATE() AS date))
ORDER BY start_date ASC;
GO

-- วิธีดู Execution Plan / Detailed stats (รันใน Query Editor / SSMS / Azure Data Studio)
PRINT '--- To capture XML execution plan, enable STATISTICS XML ON before running a query: ---';
PRINT 'SET STATISTICS XML ON;';
PRINT '/* run your query then */';
PRINT 'SET STATISTICS XML OFF;';
GO

-- ปิด STATISTICS
SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;
GO

PRINT '== Done 003_sample_queries_favorites ==';
GO
