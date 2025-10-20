BEGIN TRANSACTION;

INSERT INTO [category] (category_name) VALUES
 (N'Camp'),
 (N'Activity'),
 (N'Music'),
 (N'Technology'),
 (N'Sport'),
 (N'Competition'),
 (N'Workshop'),
 (N'Art'),
 (N'Academic'),
 (N'Finance'),
 (N'Business');
 
COMMIT;
