DELETE FROM dbo.[event];
GO

DELETE FROM dbo.[category];
GO

SELECT * FROM category;

DBCC CHECKIDENT ('dbo.[category]', RESEED, 0);
GO

----------------------------------------------------

PRINT 'Writing dbo.category...';
BEGIN TRANSACTION;

-- สังเกตว่าเราเอาคอลัมน์ category_id ออกไปเลย
INSERT INTO dbo.category (category_name) VALUES
(N'Freshy Camp'),
(N'Market/Fair'),
(N'Music/Contest'),
(N'Tech/Workshop'),
(N'Sports'),
(N'Competition'),
(N'Workshop'),
(N'Art/Show'),
(N'Academic/Career'),
(N'Finance'),
(N'Business');

COMMIT;
GO

PRINT '======== Finish Create Category ========';
GO