-- 004_drop_rollback.sql
PRINT '== 004: Drop / rollback view and indexes for user_favorite ==';
GO

-- 1) Drop view v_user_favorites
IF OBJECT_ID('dbo.v_user_favorites', 'V') IS NOT NULL
BEGIN
    DROP VIEW dbo.v_user_favorites;
    PRINT 'Dropped view dbo.v_user_favorites';
END
ELSE
    PRINT 'View dbo.v_user_favorites does not exist';
GO

-- 2) Drop dynamic composite index if exists (ตรวจชื่อ column เหมือนตอนสร้าง)
DECLARE @idCol SYSNAME;
SELECT TOP(1) @idCol = name
FROM sys.columns
WHERE object_id = OBJECT_ID('dbo.user_favorite')
  AND name IN ('account_id','accountId','user_id','userId','userid');

IF @idCol IS NOT NULL
BEGIN
    DECLARE @idxName NVARCHAR(128) = 'idx_user_favorite_' + @idCol + '_createdat';
    IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = @idxName AND object_id = OBJECT_ID('dbo.user_favorite'))
    BEGIN
        DECLARE @dropsql NVARCHAR(MAX) = N'DROP INDEX ' + QUOTENAME(@idxName) + N' ON dbo.user_favorite;';
        EXEC sp_executesql @dropsql;
        PRINT 'Dropped index: ' + @idxName;
    END
    ELSE
        PRINT 'Index ' + @idxName + ' does not exist';
END
ELSE
    PRINT 'No account/user id column detected in dbo.user_favorite - skip composite index drop';
GO

-- 3) Drop helper indexes if exist
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_user_favorite_event_id' AND object_id = OBJECT_ID('dbo.user_favorite'))
BEGIN
    DROP INDEX idx_user_favorite_event_id ON dbo.user_favorite;
    PRINT 'Dropped idx_user_favorite_event_id';
END
ELSE
    PRINT 'idx_user_favorite_event_id not exists';
GO

PRINT '== Done 004_drop_rollback ==';
GO
