DELETE FROM event;
SELECT * FROM event;
-----------------------------------------------
USE tueventsdb;
GO

BEGIN TRANSACTION;

-- (1) Market
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Market Day',
  N'Food, books, and handmade fair',
  N'A chill market featuring food, drinks, books, and handmade crafts by students.',
  2, 300, '2025-11-05', '10:00', '2025-11-06', '18:00', -- end_time (สมมติ)
  N'Entrance to Puay Ungphakorn Library', N'Faculty of Liberal Arts', 'liberalarts.contact@tu.ac.th', 'Resourse/Poster/image 1.png', 1
);

-- (2) Fair
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Digital Assets Fair',
  N'Milk tea booth + digital asset knowledge',
  N'Learn crypto basics, wallet care, and investment risks; grab milk tea at partner booths.',
  10, 200, '2025-11-08', '13:00', '2025-11-08', '17:00', -- end_time (สมมติ)
  N'Puay Ungphakorn Library', N'Thammasat Business School', 'tbs.contact@tu.ac.th', 'Resourse/Poster/image 2.png', 1
);

-- (3) Contest (Evening)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Melody Room 2 – Singing Contest',
  N'TU singing contest',
  N'Compete with live backup band — prelims and finals on the same day.',
  3, 120, '2025-11-12', '17:30', '2025-11-12', '22:00', -- end_time (สมมติ)
  N'Contemplative Sculpture Courtyard, Rangsit Campus', N'Faculty of Fine and Applied Arts', 'finearts.contact@tu.ac.th', 'Resourse/Poster/image 3.png', 1
);

-- (4) Quiz Show
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Beat the Champion 3',
  N'High-energy quiz show',
  N'Challenge the champion in speed-round questions for scholarship prizes.',
  6, 180, '2025-11-15', '14:00', '2025-11-15', '17:00', -- end_time (สมมติ)
  N'100Ys. PUAY Park for the People', N'Faculty of Social Administration', 'socialadmin.contact@tu.ac.th', 'Resourse/Poster/image 4.png', 1
);

-- (5) Show (Evening)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Vivid Sand – Fantasy Show',
  N'Magic and theatre performance',
  N'A fantasy performance blending visuals and lighting for an immersive stage experience.',
  8, 250, '2025-11-20', '18:30', '2025-11-20', '21:00', -- end_time (สมมติ)
  N'TU Theatre, Rangsit Campus', N'Faculty of Science And Technology', 'sciencetech.contact@tu.ac.th', 'Resourse/Poster/image 5.png', 1
);

-- (6) Market
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Flea Market Edition',
  N'New-poster market edition',
  N'Shop clothing, handmade items, and pop-up cafés.',
  2, 320, '2025-11-22', '10:00', '2025-11-23', '18:00', -- end_time (สมมติ)
  N'Entrance to Puay Ungphakorn Library', N'Faculty of Liberal Arts', 'liberalarts.contact@tu.ac.th', 'Resourse/Poster/image 6.png', 1
);

-- (7) Night Walk
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'TUSC – The Outside Walk',
  N'Night campus walk',
  N'Evening exploration with TUSC club and photo check-in spots.',
  2, 150, '2025-11-26', '19:00', '2025-11-26', '21:00', -- end_time (สมมติ)
  N'Lecture Classroom 4 (LC.4), Rangsit Campus', N'Faculty of Political Science', 'polisci.contact@tu.ac.th', 'Resourse/Poster/image 7.png', 1
);

-- (8) Debate Final
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'The Final Competition – Debate',
  N'Debate championship',
  N'Challenging motions testing reasoning, communication, and timing.',
  6, 160, '2025-11-29', '13:30', '2025-11-29', '17:00', -- end_time (สมมติ)
  N'Puey Ungphakorn Centenary Hall, Rangsit Campus', N'Faculty of Law', 'law.contact@tu.ac.th', 'Resourse/Poster/image 8.png', 1
);

-- (9) Workshop
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'TUTV Finalist',
  N'Scouting new-gen communicators',
  N'Showcase hosting/announcing skills with workshops from media seniors.',
  6, 140, '2025-12-03', '15:00', '2025-12-03', '18:00', -- end_time (สมมติ)
  N'Faculty of Journalism Building, Rangsit Campus', N'Faculty of Journalism and Mass Communication', 'journalism.contact@tu.ac.th', 'Resourse/Poster/image 9.png', 1
);

-- (10) Seminar/Day
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Digital Assets Day',
  N'Digital finance trends update',
  N'Understand Tokenization, DeFi, risks, and practical guidance.',
  10, 220, '2025-12-06', '10:30', '2025-12-06', '16:00', -- end_time (สมมติ)
  N'Puay Ungphakorn Library', N'Thammasat Business School', 'tbs.contact@tu.ac.th', 'Resourse/Poster/image 10.png', 1
);

-- (11) Workshop (Full day)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Space Quest 25 – Next Gen Spacepreneurs',
  N'Find space-business ideas',
  N'Lecture + workshop on space business models for students.',
  4, 180, '2025-12-10', '09:30', '2025-12-10', '17:00', -- end_time (สมมติ)
  N'Thammasat Creative Space, Puay Ungphakorn Library', N'Faculty of Science', 'science.contact@tu.ac.th', 'Resourse/Poster/image 11.png', 1
);

-- (12) Contest
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Digital Media Contest: Big Battle',
  N'Digital media competition',
  N'Final round in creativity/editing/motion graphics.',
  6, 200, '2025-12-12', '13:00', '2025-12-12', '17:00', -- end_time (สมมติ)
  N'Media Lab, SC1, Rangsit Campus', N'Faculty of Journalism and Mass Communication', 'journalism.contact@tu.ac.th', 'Resourse/Poster/image 12.png', 1
);

-- (13) Workshop (Full day)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'SDGs Leadership',
  N'Leadership development for change',
  N'Learn about 17 SDGs and implement real projects in communities.',
  9, 120, '2025-12-14', '09:00', '2025-12-15', '17:00', -- end_time (สมมติ)
  N'Seminar Room SC3-302, Rangsit Campus', N'Faculty of Social Administration', 'socialadmin.contact@tu.ac.th', 'Resourse/Poster/image 13.png', 1
);

-- (14) Freshy Camp
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'TBS Freshy Camp',
  N'Freshmen orientation camp',
  N'Bonding activities introducing university life for new TBS students.',
  1, 250, '2025-12-18', '08:00', '2025-12-19', '17:00', -- end_time (สมมติ)
  N'Faculty of Commerce and Accountancy Building, Rangsit Campus', N'Thammasat Business School', 'tbs.contact@tu.ac.th', 'Resourse/Poster/image 14.png', 1
);

-- (15) Show (Evening)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Magician’s Journey',
  N'Magic theatre play',
  N'The journey of a magician on stage with grand illusions.',
  8, 260, '2025-12-20', '18:00', '2025-12-20', '20:30', -- end_time (สมมติ)
  N'TU Theatre', N'Faculty of Fine and Applied Arts, Rangsit Campus', 'finearts.contact@tu.ac.th', 'Resourse/Poster/image 15.png', 1
);

-- (16) Art Exhibit (Gallery hours)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Waves of Hope – Tales from the Ocean',
  N'Art exhibition inspired by the sea',
  N'Mixed-media works telling stories of the ocean and hope.',
  8, 180, '2025-12-22', '10:00', '2026-01-05', '17:00', -- end_time (สมมติ)
  N'TU Art Gallery, Rangsit Campus', N'Faculty of Fine and Applied Arts', 'finearts.contact@tu.ac.th', 'Resourse/Poster/image 16.png', 1
);

-- (17) Fair (Full day)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Opening Windows of Opportunity',
  N'Education and career guidance fair',
  N'Explore programs, skill development, and scholarships.',
  9, 300, '2026-01-07', '09:00', '2026-01-07', '17:00', -- end_time (สมมติ)
  N'Sport Center 4,5, Rangsit Campus', N'Faculty of Liberal Arts', 'liberalarts.contact@tu.ac.th', 'Resourse/Poster/image 17.png', 1
);

-- (18) Workshop
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'CI x Cheer: Wear Your Identity',
  N'Team shirt design workshop',
  N'Learn logo design basics, fabric selection, and real screen-printing session.',
  7, 90, '2026-01-10', '10:30', '2026-01-10', '15:00', -- end_time (สมมติ)
  N'SC3-302, Rangsit Campus', N'Faculty of Fine and Applied Arts', 'finearts.contact@tu.ac.th', 'Resourse/Poster/image 18.png', 1
);

-- (19) Competition
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'SCIZM 2025',
  N'Creative design competition',
  N'Theme: “Design for Impact” — judged by professors and industry experts.',
  6, 220, '2026-01-12', '13:00', '2026-01-12', '17:00', -- end_time (สมมติ)
  N'Innovation Page', N'Faculty of Architecture and Planning', 'architecture.contact@tu.ac.th', 'Resourse/Poster/image 19.png', 1
);

-- (20) Freshmen event (Full day)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'New World – Freshmen Adventure',
  N'Welcome event for new students',
  N'Mini games, checkpoints, senior meetups, and club introductions.',
  2, 500, '2026-01-15', '08:30', '2026-01-15', '16:30', -- end_time (สมมติ)
  N'LC4-202, Rangsit Campus', N'Faculty of Political Science', 'polisci.contact@tu.ac.th', 'Resourse/Poster/image 20.png', 1
);

-- (21) Hackathon (24h)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Hackathon for Change',
  N'24-hour hackathon',
  N'Team up to build social, health, or education tech projects with mentors from industry.',
  4, 180, '2026-01-18', '09:00', '2026-01-19', '09:00', -- end_time (24h)
  N'Thammasat Creative Space, Puay Ungphakorn Library', N'Faculty of Engineering', 'engineering.contact@tu.ac.th', 'Resourse/Poster/image 11.png', 1
);

-- (22) Pitching (Evening)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Startup Pitch Night',
  N'Startup pitching event',
  N'5-minute pitch + Q&A with investors and professors.',
  11, 120, '2026-01-20', '18:00', '2026-01-20', '21:00', -- end_time (สมมติ)
  N'Media Lab, SC1, Rangsit Campus', N'Thammasat Business School', 'tbs.contact@tu.ac.th', 'Resourse/Poster/image 12.png', 1
);

-- (23) Concert (Evening)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Classical Evening',
  N'Classical music concert',
  N'Orchestral performance featuring special guest singers.',
  3, 160, '2026-01-22', '19:00', '2026-01-22', '21:30', -- end_time (สมมติ)
  N'Contemplative Sculpture Courtyard, Rangsit Campus', N'Faculty of Fine and Applied Arts', 'finearts.contact@tu.ac.th', 'Resourse/Poster/image 3.png', 1
);

-- (24) Fair
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Financial Literacy Fair',
  N'Finance education fair',
  N'Learn semester budgeting, beginner funds, and basic tax planning.',
  10, 250, '2026-01-25', '10:00', '2026-01-25', '16:00', -- end_time (สมมติ)
  N'Puay Ungphakorn Library', N'Thammasat Business School', 'tbs.contact@tu.ac.th', 'Resourse/Poster/image 2.png', 1
);

-- (25) Bootcamp (Full day)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Data Science Bootcamp',
  N'Intensive data science bootcamp',
  N'Python, EDA, and ML fundamentals with a final project.',
  4, 100, '2026-01-27', '09:00', '2026-01-29', '17:00', -- end_time (สมมติ)
  N'Thammasat Creative Space, Puay Ungphakorn Library', N'Faculty of Science', 'science.contact@tu.ac.th', 'Resourse/Poster/image 11.png', 1
);

-- (26) Workshop
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Photography Workshop',
  N'Artistic photography workshop',
  N'Learn composition, lighting, and shadow — with outdoor field practice.',
  7, 60, '2026-01-30', '10:00', '2026-01-30', '14:00', -- end_time (สมมติ)
  N'FA Studio 2, Rangsit Campus', N'Faculty of Fine and Applied Arts', 'finearts.contact@tu.ac.th', 'Resourse/Poster/image 16.png', 1
);

-- (27) Tournament
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'E-sports Tournament',
  N'University E-sports Tournament',
  N'Qualifier to final round with live broadcast.',
  6, 240, '2026-02-01', '12:00', '2026-02-02', '20:00', -- end_time (สมมติ)
  N'100Ys. PUAY Park for the People', N'Faculty of Engineering', 'engineering.contact@tu.ac.th', 'Resourse/Poster/image 4.png', 1
);

-- (28) Symposium (Full day)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Research Symposium',
  N'Student research presentation event',
  N'Poster and stage presentation for CS, DS, and SCI students.',
  9, 180, '2026-02-04', '09:00', '2026-02-04', '17:00', -- end_time (สมมติ)
  N'Sport Center 4,5, Rangsit Campus', N'Faculty of Science', 'science.contact@tu.ac.th', 'Resourse/Poster/image 17.png', 1
);

-- (29) Sports Day (Full day)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Campus Sports Day',
  N'University sports festival',
  N'Parade and friendly competitions connecting all faculties.',
  5, 600, '2026-02-07', '08:00', '2026-02-07', '17:00', -- end_time (สมมติ)
  N'Lecture Classroom 4 (LC.4), Rangsit Campus', N'Faculty of Political Science', 'polisci.contact@tu.ac.th', 'Resourse/Poster/image 7.png', 1
);

-- (30) Market
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, starts_at, end_date, ends_at, location, organizer, organizer_contact, image_url, active) VALUES
(
  N'Creative Market Plus',
  N'Upgraded creative flea market',
  N'Featuring second-hand books, candle workshops, and live music.',
  2, 350, '2026-02-10', '10:00', '2026-02-11', '18:00', -- end_time (สมมติ)
  N'Entrance to Puay Ungphakorn Library', N'Faculty of Liberal Arts', 'liberalarts.contact@tu.ac.th', 'Resourse/Poster/image 6.png', 1
);

COMMIT;

GO
PRINT '== Ensuring indexes for event table ==';
GO

-- 1) Index สำหรับกรองตามช่วงเวลา
IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'idx_event_starts_at_ends_at'
      AND object_id = OBJECT_ID('dbo.event')
)
BEGIN
    CREATE INDEX idx_event_starts_at_ends_at
    ON dbo.[event] (starts_at, ends_at);
    PRINT 'Created idx_event_starts_at_ends_at';
END
ELSE
BEGIN
    PRINT 'idx_event_starts_at_ends_at already exists';
END
GO

-- 2) Index สำหรับค้นหาชื่อกิจกรรม (title)
IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'idx_event_title'
      AND object_id = OBJECT_ID('dbo.event')
)
BEGIN
    CREATE INDEX idx_event_title
    ON dbo.[event] (title);
    PRINT 'Created idx_event_title';
END
ELSE
BEGIN
    PRINT 'idx_event_title already exists';
END
GO

PRINT '== Done ensuring indexes ==';
GO
