PRINT '== 002: Create view v_user_favorites ==';
GO

-- ลบ view เดิม (ถ้ามี)
IF OBJECT_ID('dbo.v_user_favorites', 'V') IS NOT NULL
BEGIN
    DROP VIEW dbo.v_user_favorites;
    PRINT 'Dropped existing view dbo.v_user_favorites';
END
GO

-- สร้าง VIEW ใหม่ให้ตรงกับ schema ปัจจุบัน
CREATE VIEW dbo.v_user_favorites
AS
SELECT
    -- จากตาราง user_favorite
    uf.id           AS favorite_id,
    uf.account_id   AS account_id,
    uf.event_id     AS event_id,
    uf.created_at   AS favorited_at,

    -- จากตาราง event
    e.title         AS event_title,
    e.description   AS event_description,
    e.detail        AS event_detail,
    e.start_date,
    e.starts_at,
    e.end_date,
    e.ends_at,
    e.location,
    e.capacity,
    e.organizer,
    e.organizer_contact,
    e.image_url,
    e.active        AS event_active,

    -- จากตาราง category
    c.category_id   AS category_id,
    c.category_name AS category_name

FROM dbo.user_favorite uf
LEFT JOIN dbo.[event] e
    ON uf.event_id = e.event_id 
LEFT JOIN dbo.category c
    ON e.category_id = c.category_id;
GO

PRINT '== Done creating view v_user_favorites ==';
GO