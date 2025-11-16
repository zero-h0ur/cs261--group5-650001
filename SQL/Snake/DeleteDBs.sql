USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'tueventsdb')
BEGIN
    ALTER DATABASE tueventsdb SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE tueventsdb;
END
GO