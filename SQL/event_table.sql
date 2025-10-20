DELETE FROM event;
SELECT * FROM event;
-----------------------------------------------
USE tueventsdb;
GO

ALTER TABLE dbo.[event]
ADD active BIT NOT NULL
    CONSTRAINT DF_event_active DEFAULT(1) WITH VALUES;
GO

BEGIN TRANSACTION;

-- (1)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Market Day',
  N'Food, books, and handmade fair',
  N'A chill market featuring food, drinks, books, and handmade crafts by students.',
  2,
  300,
  '2025-11-05',
  '2025-11-06',
  N'Entrance to Puay Ungphakorn Library',
  N'Faculty of Liberal Arts',
  'liberalarts.contact@tu.ac.th',
  'Resourse/Poster/image 1.png',
  '10:00'
);

-- (2)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Digital Assets Fair',
  N'Milk tea booth + digital asset knowledge',
  N'Learn crypto basics, wallet care, and investment risks; grab milk tea at partner booths.',
  10,
  200,
  '2025-11-08',
  '2025-11-08',
  N'Puay Ungphakorn Library',
  N'Thammasat Business School',
  'tbs.contact@tu.ac.th',
  'Resourse/Poster/image 2.png',
  '13:00'
);

-- (3)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Melody Room 2 – Singing Contest',
  N'TU singing contest',
  N'Compete with live backup band — prelims and finals on the same day.',
  3,
  120,
  '2025-11-12',
  '2025-11-12',
  N'Contemplative Sculpture Courtyard, Rangsit Campus',
  N'Faculty of Fine and Applied Arts',
  'finearts.contact@tu.ac.th',
  'Resourse/Poster/image 3.png',
  '17:30'
);

-- (4)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Beat the Champion 3',
  N'High-energy quiz show',
  N'Challenge the champion in speed-round questions for scholarship prizes.',
  6,
  180,
  '2025-11-15',
  '2025-11-15',
  N'100Ys. PUAY Park for the People',
  N'Faculty of Social Administration',
  'socialadmin.contact@tu.ac.th',
  'Resourse/Poster/image 4.png',
  '14:00'
);

-- (5)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Vivid Sand – Fantasy Show',
  N'Magic and theatre performance',
  N'A fantasy performance blending visuals and lighting for an immersive stage experience.',
  8,
  250,
  '2025-11-20',
  '2025-11-20',
  N'TU Theatre, Rangsit Campus',
  N'Faculty of Science And Technology',
  'sciencetech.contact@tu.ac.th',
  'Resourse/Poster/image 5.png',
  '18:30'
);

-- (6)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Flea Market Edition',
  N'New-poster market edition',
  N'Shop clothing, handmade items, and pop-up cafés.',
  2,
  320,
  '2025-11-22',
  '2025-11-23',
  N'Entrance to Puay Ungphakorn Library',
  N'Faculty of Liberal Arts',
  'liberalarts.contact@tu.ac.th',
  'Resourse/Poster/image 6.png',
  '10:00'
);

-- (7)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'TUSC – The Outside Walk',
  N'Night campus walk',
  N'Evening exploration with TUSC club and photo check-in spots.',
  2,
  150,
  '2025-11-26',
  '2025-11-26',
  N'Lecture Classroom 4 (LC.4), Rangsit Campus',
  N'Faculty of Political Science',
  'polisci.contact@tu.ac.th',
  'Resourse/Poster/image 7.png',
  '19:00'
);

-- (8)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'The Final Competition – Debate',
  N'Debate championship',
  N'Challenging motions testing reasoning, communication, and timing.',
  6,
  160,
  '2025-11-29',
  '2025-11-29',
  N'Puey Ungphakorn Centenary Hall, Rangsit Campus',
  N'Faculty of Law',
  'law.contact@tu.ac.th',
  'Resourse/Poster/image 8.png',
  '13:30'
);

-- (9)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'TUTV Finalist',
  N'Scouting new-gen communicators',
  N'Showcase hosting/announcing skills with workshops from media seniors.',
  6,
  140,
  '2025-12-03',
  '2025-12-03',
  N'Faculty of Journalism Building, Rangsit Campus',
  N'Faculty of Journalism and Mass Communication',
  'journalism.contact@tu.ac.th',
  'Resourse/Poster/image 9.png',
  '15:00'
);

-- (10)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Digital Assets Day',
  N'Digital finance trends update',
  N'Understand Tokenization, DeFi, risks, and practical guidance.',
  10,
  220,
  '2025-12-06',
  '2025-12-06',
  N'Puay Ungphakorn Library',
  N'Thammasat Business School',
  'tbs.contact@tu.ac.th',
  'Resourse/Poster/image 10.png',
  '10:30'
);

-- (11)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Space Quest 25 – Next Gen Spacepreneurs',
  N'Find space-business ideas',
  N'Lecture + workshop on space business models for students.',
  4,
  180,
  '2025-12-10',
  '2025-12-10',
  N'Thammasat Creative Space, Puay Ungphakorn Library',
  N'Faculty of Science',
  'science.contact@tu.ac.th',
  'Resourse/Poster/image 11.png',
  '09:30'
);

-- (12)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Digital Media Contest: Big Battle',
  N'Digital media competition',
  N'Final round in creativity/editing/motion graphics.',
  6,
  200,
  '2025-12-12',
  '2025-12-12',
  N'Media Lab, SC1, Rangsit Campus',
  N'Faculty of Journalism and Mass Communication',
  'journalism.contact@tu.ac.th',
  'Resourse/Poster/image 12.png',
  '13:00'
);

-- (13)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'SDGs Leadership',
  N'Leadership development for change',
  N'Learn about 17 SDGs and implement real projects in communities.',
  9,
  120,
  '2025-12-14',
  '2025-12-15',
  N'Seminar Room SC3-302, Rangsit Campus',
  N'Faculty of Social Administration',
  'socialadmin.contact@tu.ac.th',
  'Resourse/Poster/image 13.png',
  '09:00'
);

-- (14)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'TBS Freshy Camp',
  N'Freshmen orientation camp',
  N'Bonding activities introducing university life for new TBS students.',
  1,
  250,
  '2025-12-18',
  '2025-12-19',
  N'Faculty of Commerce and Accountancy Building, Rangsit Campus',
  N'Thammasat Business School',
  'tbs.contact@tu.ac.th',
  'Resourse/Poster/image 14.png',
  '08:00'
);

-- (15)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Magician’s Journey',
  N'Magic theatre play',
  N'The journey of a magician on stage with grand illusions.',
  8,
  260,
  '2025-12-20',
  '2025-12-20',
  N'TU Theatre',
  N'Faculty of Fine and Applied Arts, Rangsit Campus',
  'finearts.contact@tu.ac.th',
  'Resourse/Poster/image 15.png',
  '18:00'
);

-- (16)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Waves of Hope – Tales from the Ocean',
  N'Art exhibition inspired by the sea',
  N'Mixed-media works telling stories of the ocean and hope.',
  8,
  180,
  '2025-12-22',
  '2026-01-05',
  N'TU Art Gallery, Rangsit Campus',
  N'Faculty of Fine and Applied Arts',
  'finearts.contact@tu.ac.th',
  'Resourse/Poster/image 16.png',
  '10:00'
);

-- (17)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Opening Windows of Opportunity',
  N'Education and career guidance fair',
  N'Explore programs, skill development, and scholarships.',
  9,
  300,
  '2026-01-07',
  '2026-01-07',
  N'Sport Center 4,5, Rangsit Campus',
  N'Faculty of Liberal Arts',
  'liberalarts.contact@tu.ac.th',
  'Resourse/Poster/image 17.png',
  '09:00'
);

-- (18)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'CI x Cheer: Wear Your Identity',
  N'Team shirt design workshop',
  N'Learn logo design basics, fabric selection, and real screen-printing session.',
  7,
  90,
  '2026-01-10',
  '2026-01-10',
  N'SC3-302, Rangsit Campus',
  N'Faculty of Fine and Applied Arts',
  'finearts.contact@tu.ac.th',
  'Resourse/Poster/image 18.png',
  '10:30'
);

-- (19)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'SCIZM 2025',
  N'Creative design competition',
  N'Theme: “Design for Impact” — judged by professors and industry experts.',
  6,
  220,
  '2026-01-12',
  '2026-01-12',
  N'Innovation Page',
  N'Faculty of Architecture and Planning',
  'architecture.contact@tu.ac.th',
  'Resourse/Poster/image 19.png',
  '13:00'
);

-- (20)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'New World – Freshmen Adventure',
  N'Welcome event for new students',
  N'Mini games, checkpoints, senior meetups, and club introductions.',
  2,
  500,
  '2026-01-15',
  '2026-01-15',
  N'LC4-202, Rangsit Campus',
  N'Faculty of Political Science',
  'polisci.contact@tu.ac.th',
  'Resourse/Poster/image 20.png',
  '08:30'
);

-- (21)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Hackathon for Change',
  N'24-hour hackathon',
  N'Team up to build social, health, or education tech projects with mentors from industry.',
  4,
  180,
  '2026-01-18',
  '2026-01-19',
  N'Thammasat Creative Space, Puay Ungphakorn Library',
  N'Faculty of Engineering',
  'engineering.contact@tu.ac.th',
  'Resourse/Poster/image 11.png',
  '09:00'
);

-- (22)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Startup Pitch Night',
  N'Startup pitching event',
  N'5-minute pitch + Q&A with investors and professors.',
  11,
  120,
  '2026-01-20',
  '2026-01-20',
  N'Media Lab, SC1, Rangsit Campus',
  N'Thammasat Business School',
  'tbs.contact@tu.ac.th',
  'Resourse/Poster/image 12.png',
  '18:00'
);

-- (23)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Classical Evening',
  N'Classical music concert',
  N'Orchestral performance featuring special guest singers.',
  3,
  160,
  '2026-01-22',
  '2026-01-22',
  N'Contemplative Sculpture Courtyard, Rangsit Campus',
  N'Faculty of Fine and Applied Arts',
  'finearts.contact@tu.ac.th',
  'Resourse/Poster/image 3.png',
  '19:00'
);

-- (24)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Financial Literacy Fair',
  N'Finance education fair',
  N'Learn semester budgeting, beginner funds, and basic tax planning.',
  10,
  250,
  '2026-01-25',
  '2026-01-25',
  N'Puay Ungphakorn Library',
  N'Thammasat Business School',
  'tbs.contact@tu.ac.th',
  'Resourse/Poster/image 2.png',
  '10:00'
);

-- (25)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Data Science Bootcamp',
  N'Intensive data science bootcamp',
  N'Python, EDA, and ML fundamentals with a final project.',
  4,
  100,
  '2026-01-27',
  '2026-01-29',
  N'Thammasat Creative Space, Puay Ungphakorn Library',
  N'Faculty of Science',
  'science.contact@tu.ac.th',
  'Resourse/Poster/image 11.png',
  '09:00'
);

-- (26)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Photography Workshop',
  N'Artistic photography workshop',
  N'Learn composition, lighting, and shadow — with outdoor field practice.',
  7,
  60,
  '2026-01-30',
  '2026-01-30',
  N'FA Studio 2, Rangsit Campus',
  N'Faculty of Fine and Applied Arts',
  'finearts.contact@tu.ac.th',
  'Resourse/Poster/image 16.png',
  '10:00'
);

-- (27)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'E-sports Tournament',
  N'University E-sports Tournament',
  N'Qualifier to final round with live broadcast.',
  6,
  240,
  '2026-02-01',
  '2026-02-02',
  N'100Ys. PUAY Park for the People',
  N'Faculty of Engineering',
  'engineering.contact@tu.ac.th',
  'Resourse/Poster/image 4.png',
  '12:00'
);

-- (28)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Research Symposium',
  N'Student research presentation event',
  N'Poster and stage presentation for CS, DS, and SCI students.',
  9,
  180,
  '2026-02-04',
  '2026-02-04',
  N'Sport Center 4,5, Rangsit Campus',
  N'Faculty of Science',
  'science.contact@tu.ac.th',
  'Resourse/Poster/image 17.png',
  '09:00'
);

-- (29)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Campus Sports Day',
  N'University sports festival',
  N'Parade and friendly competitions connecting all faculties.',
  5,
  600,
  '2026-02-07',
  '2026-02-07',
  N'Lecture Classroom 4 (LC.4), Rangsit Campus',
  N'Faculty of Political Science',
  'polisci.contact@tu.ac.th',
  'Resourse/Poster/image 7.png',
  '08:00'
);

-- (30)
INSERT INTO [event] (title, description, detail, category_id, capacity, start_date, end_date, location, organizer, organizer_contact, image_url, time) VALUES
(
  N'Creative Market Plus',
  N'Upgraded creative flea market',
  N'Featuring second-hand books, candle workshops, and live music.',
  2,
  350,
  '2026-02-10',
  '2026-02-11',
  N'Entrance to Puay Ungphakorn Library',
  N'Faculty of Liberal Arts',
  'liberalarts.contact@tu.ac.th',
  'Resourse/Poster/image 6.png',
  '10:00'
);

COMMIT;