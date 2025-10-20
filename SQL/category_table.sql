DELETE FROM dbo.[event];
GO


DELETE FROM dbo.[category];
GO

SELECT * FROM category;

DBCC CHECKIDENT ('dbo.[category]', RESEED, 0);
GO

----------------------------------------------------

INSERT INTO dbo.[category](category_name)
VALUES (N'Camp'), (N'Activity'), (N'Music'), (N'Technology'), (N'Sport'),
       (N'Competition'), (N'Workshop'), (N'Art'), (N'Academic'),
       (N'Finance'), (N'Business');
GO

SELECT * FROM dbo.[category] ORDER BY category_id;