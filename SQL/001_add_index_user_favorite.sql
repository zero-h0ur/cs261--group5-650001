-- 001_add_index_user_favorite.sql
PRINT '== 001: Add index for user_favorite (account_id, created_at DESC) and helper indexes ==';
GO

-- ตรวจว่าตาราง user_favorite มีอยู่ก่อน
IF OBJECT_ID('dbo.user_favorite', 'U') IS NULL
BEGIN
    PRINT 'Table dbo.user_favorite does not exist. Skipping index creation.';
    RETURN;
END
GO

-- หา column ที่เป็น account/user identifier ในตาราง (รองรับหลายชื่อ)
DECLARE @idCol SYSNAME;
SELECT TOP(1) @idCol = name
FROM sys.columns
WHERE object_id = OBJECT_ID('dbo.user_favorite')
  AND name IN ('account_id','accountId','user_id','userId','userid');

IF @idCol IS NULL
BEGIN
    PRINT 'No account/user id column found in dbo.user_favorite. Please create index manually.';
    RETURN;
END
ELSE
    PRINT 'Found identifier column: ' + @idCol;

-- สร้าง composite index (account/user id + created_at DESC) เพื่อรองรับการเรียงลำดับ recent favorites
DECLARE @idxName NVARCHAR(128) = 'idx_user_favorite_' + @idCol + '_createdat';
DECLARE @sql NVARCHAR(MAX);

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = @idxName
      AND object_id = OBJECT_ID('dbo.user_favorite')
)
BEGIN
    SET @sql = N'CREATE INDEX ' + QUOTENAME(@idxName) + 
               N' ON dbo.user_favorite (' + QUOTENAME(@idCol) + N' DESC, created_at DESC);';
    EXEC sp_executesql @sql;
    PRINT 'Created index: ' + @idxName;
END
ELSE
BEGIN
    PRINT 'Index ' + @idxName + ' already exists';
END
GO

-- เพิ่ม index ช่วยสำหรับค้นหาตาม event_id (ถ้ายังไม่มี)
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.user_favorite') AND name = 'event_id')
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM sys.indexes
        WHERE name = 'idx_user_favorite_event_id'
          AND object_id = OBJECT_ID('dbo.user_favorite')
    )
    BEGIN
        CREATE INDEX idx_user_favorite_event_id
        ON dbo.user_favorite (event_id);
        PRINT 'Created idx_user_favorite_event_id';
    END
    ELSE
        PRINT 'idx_user_favorite_event_id already exists';
END
ELSE
    PRINT 'Column event_id not found in dbo.user_favorite - skipped event_id index';
GO

PRINT '== Done 001_add_index_user_favorite ==';
GO
