-- ========================================================================
-- NSBM GREEN UNIVERSITY — FACULTY OF COMPUTING
-- Module: Web and Mobile Application Development (Batch: 26.1 IFSL)
-- FINAL PROJECT ASSIGNMENT: DATABASE SCHEMA & SEED DATA
-- Project Topic 1: NSBM NewsDesk — Campus News Management System
-- ========================================================================

DROP TABLE IF EXISTS `bookmarks`;
DROP TABLE IF EXISTS `category_subscriptions`;
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `submissions`;
DROP TABLE IF EXISTS `articles`;
DROP TABLE IF EXISTS `announcements`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- ------------------------------------------------------------------------
-- 1. Table: users
-- ------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  `student_id` VARCHAR(50) NULL,
  `admin_id` VARCHAR(50) NULL,
  `faculty` VARCHAR(100) DEFAULT 'Faculty of Computing',
  `title` VARCHAR(100) DEFAULT 'Student Journalist',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Secure Default Admin & Student Accounts (Password: NsbmAdmin@2026!)
INSERT INTO `users` (`id`, `username`, `name`, `email`, `password_hash`, `role`, `student_id`, `admin_id`, `faculty`, `title`) VALUES
(1, 'admin', 'System Administrator', 'admin@nsbm.ac.lk', '$2y$10$rZxAjZIInC3l0RB3WmP3guWwAUAnEAvZW7gkIqC.Ow6rmebF1rBEi', 'admin', NULL, 'NSBM-ADM-001', 'University Media Bureau', 'Chief Newsdesk Administrator'),
(2, 'student', 'Kasun Perera', 'student@students.nsbm.ac.lk', '$2y$10$rZxAjZIInC3l0RB3WmP3guWwAUAnEAvZW7gkIqC.Ow6rmebF1rBEi', 'student', 'NSBM-IT-24-9021', NULL, 'Faculty of Computing', 'Student Reporter'),
(3, 'pariyaratne', 'Sanduni Ariyaratne', 's.ariyaratne@students.nsbm.ac.lk', '$2y$10$rZxAjZIInC3l0RB3WmP3guWwAUAnEAvZW7gkIqC.Ow6rmebF1rBEi', 'student', 'NSBM-IT-23-4819', NULL, 'Faculty of Computing', 'Senior Student Researcher');

-- ------------------------------------------------------------------------
-- 2. Table: categories
-- ------------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) NOT NULL DEFAULT 'general',
  `color` VARCHAR(20) NOT NULL DEFAULT '#6366f1',
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categories` (`id`, `slug`, `name`, `icon`, `color`, `description`) VALUES
(1, 'academic', 'Academic', 'academic', '#6366f1', 'Curriculum updates, research publications, faculty notices, and international double degree MoUs.'),
(2, 'events', 'Events', 'events', '#ec4899', 'Campus celebrations, gala ceremonies, academic symposiums, and convocations.'),
(3, 'sports', 'Sports', 'sports', '#f59e0b', 'Inter-university sports, athletics, swimming meets, and varsity trials.'),
(4, 'general', 'General', 'general', '#3b82f6', 'Official university directives, SAARC delegations, shuttle updates, and executive notices.'),
(5, 'computing', 'Computing & AI', 'computing', '#06b6d4', 'Faculty of Computing breakthroughs, national digital economy summits, and ICT lectures.'),
(6, 'sustainability', 'Sustainability', 'sustainability', '#10b981', 'South Asia\'s 1st Green University awards, green building ratings, solar microgrids, and eco initiatives.');

-- ------------------------------------------------------------------------
-- 3. Table: announcements
-- ------------------------------------------------------------------------
CREATE TABLE `announcements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'General',
  `badge` VARCHAR(30) NOT NULL DEFAULT 'GENERAL',
  `summary` TEXT NOT NULL,
  `pinned` TINYINT(1) NOT NULL DEFAULT 0,
  `published_date` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `announcements` (`id`, `title`, `category`, `badge`, `summary`, `pinned`, `published_date`) VALUES
(1, 'Inauguration of Rs. 720M Civil Engineering Laboratory Complex', 'Academic', 'URGENT', 'Ceremonially declared open by Attorney General Hon. K. A. Parinda Ranasinghe Jr., PC, as part of NSBM 10th anniversary milestones.', 1, 'October 26, 2026'),
(2, 'NSBM Phase II Awarded Platinum Rating by Green Building Council', 'Sustainability', 'FEATURED', 'South Asia\'s premier green university campus receives highest environmental certification at the Annual Green Building Awards 2026.', 1, 'November 20, 2026'),
(3, 'Southern Cross University Australia Dual Degree Applications Open', 'Academic', 'ACADEMIC', 'Undergraduates can register for the double degree combining Bachelor of Business and Bachelor of Information Technology starting 2027.', 0, 'October 28, 2026'),
(4, 'Executive Session on Sri Lanka\'s Digital Economy by Dr. Hans Wijayasuriya', 'Computing & AI', 'TECH', 'Keynote address by Chief Advisor to the President on Digital Economy on digital transformation competencies and AI governance.', 0, 'November 10, 2026');

-- ------------------------------------------------------------------------
-- 4. Table: articles (11 REAL NEWS ARTICLES)
-- ------------------------------------------------------------------------
CREATE TABLE `articles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category_id` INT NULL,
  `category_name` VARCHAR(100) NOT NULL,
  `category_slug` VARCHAR(50) NOT NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `author_role` VARCHAR(100) DEFAULT 'University Press Bureau',
  `read_time` VARCHAR(30) DEFAULT '5 min read',
  `views` INT DEFAULT 1,
  `featured` TINYINT(1) DEFAULT 0,
  `image_path` VARCHAR(255) NOT NULL,
  `image_caption` VARCHAR(255) NULL,
  `image_paths` TEXT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `published_date` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `articles` (`id`, `title`, `category_id`, `category_name`, `category_slug`, `author_name`, `author_role`, `read_time`, `views`, `featured`, `image_path`, `image_caption`, `image_paths`, `excerpt`, `content`, `published_date`) VALUES
(1, 'NSBM Opens Rs. 720 Million Civil Engineering Laboratory Complex', 1, 'Academic', 'academic', 'Prof. E. A. Weerasinghe & Media Bureau', 'University Infrastructure Bureau', '5 min read', 2150, 1, 'news/news 1/news 1.jpeg', 'Ceremonial opening of the Rs. 720M Civil Engineering Laboratory Complex by Attorney General Hon. K. A. Parinda Ranasinghe Jr.', '[\"news/news 1/news 1.jpeg\"]', 'NSBM Green University ceremonially opened its state-of-the-art Civil Engineering Laboratory Complex, representing a significant Rs. 720 million self-financed investment in engineering education as part of its 10th anniversary celebrations.', 'NSBM Green University ceremonially opened its state-of-the-art Civil Engineering Laboratory Complex, representing a significant Rs. 720 million self-financed investment in engineering education, on 26 October 2026 as part of its 10th anniversary celebrations.\r\n\r\nLocated within the university’s Phase II development at Pitipana, Homagama, the new complex marks an important milestone in NSBM’s continued investment in modern academic infrastructure and practical engineering education. Equipped with modern infrastructure, high-tech laboratories and advanced learning facilities, the complex is designed to strengthen students’ practical learning experiences and support the development of industry-relevant engineering skills.\r\n\r\nThe complex was ceremonially declared open by the Attorney General of Sri Lanka, Hon. K. A. Parinda Ranasinghe Jr., PC, in the distinguished presence of NSBM Founder and Vice-Chancellor Prof. E. A. Weerasinghe; Prof. Richard Davies, Vice-Chancellor and CEO of the University of Plymouth, United Kingdom; Prof. Tyrone Carlin, Vice-Chancellor and President of Southern Cross University, Australia; and Prof. Li Lu, Vice-Chancellor and President of Zhejiang Shuren University, China.\r\n\r\nThe Rs. 720 million investment reflects NSBM’s commitment to providing students with an academic environment that connects theoretical knowledge with practical application. By strengthening its engineering facilities, the university aims to equip future engineers with the technical knowledge, practical experience and competencies required to meet the evolving demands of the profession.\r\n\r\nThe opening of the complex also forms part of NSBM’s broader campus expansion programme, which seeks to enhance its academic capabilities and create opportunities for future-focused education across multiple disciplines.\r\n\r\nAs NSBM marks a decade of excellence and national impact, the new Civil Engineering Laboratory Complex stands as a testament to its continued investment in education, infrastructure and the next generation of engineering professionals.', 'Oct 26, 2026'),

(2, 'NSBM Green University Marks 10th Anniversary with Multi-Religious Observances', 2, 'Events', 'events', 'Cultural & Inter-Faith Directorate', 'Campus Press Bureau', '6 min read', 1780, 1, 'news/news 2/WhatsApp Image 2026-11-23 at 18.54.33.jpeg', 'Overnight Pirith chanting ceremony and inter-faith observances marking NSBM 10th Anniversary', '[\"news/news 2/WhatsApp Image 2026-11-23 at 18.54.33.jpeg\",\"news/news 2/WhatsApp Image 2026-11-23 at 18.54.34 (1).jpeg\",\"news/news 2/WhatsApp Image 2026-11-23 at 18.54.34 (2).jpeg\",\"news/news 2/WhatsApp Image 2026-11-23 at 18.54.34.jpeg\"]', 'As part of its 10th anniversary celebrations, NSBM Green University organised a series of multi-religious observances from 21 to 24 October 2026, bringing together its university community to seek blessings.', 'As part of its 10th anniversary celebrations, NSBM Green University organised a series of religious observances from 21 to 24 October 2026, bringing together members of its university community to seek blessings for the institution’s continued growth and success.\r\n\r\nReflecting NSBM’s respect for Sri Lanka’s diverse religious traditions, the observances provided an opportunity for staff and students to come together in prayer, thanksgiving and reflection, while celebrating a decade of achievements and looking towards the university’s future.\r\n\r\nThe series included religious programmes organised by the NSBM Buddhist Society, Hindu Society, Islamic Society, and Catholic and Christian Society, each reflecting the spiritual traditions and cultural heritage of their respective communities.\r\n\r\nThe Buddhist observances began with a Buddha Pooja organised by the NSBM Buddhist Society, invoking blessings for peace, prosperity and the university’s future journey. The programme also included an overnight Pirith Chanting Ceremony held on 23 October at the newly constructed NSBM Civil Engineering Laboratory premises, followed by the traditional Heel Dane (morning alms offering) to the venerable Maha Sangha.\r\n\r\nThe Hindu Society hosted Natham ’26, a celebration that commenced with sacred poojas seeking blessings for the university and its leadership. The event was attended by Vice-Chancellor Prof. E. A. Weerasinghe, Senior Deputy Vice-Chancellor Prof. Chaminda Rathnayake, members of the senior management team, deans and staff.\r\n\r\nThe NSBM Islamic Society organised a special cultural gathering featuring Qaseeda recitations, a keynote Bayan session delivered by Moulavi Nashik Farook Tanweeri, and traditional delicacies. Meanwhile, the NSBM Catholic and Christian Society organised a Holy Mass celebrated by Rev. Fr. Prasad Harshana and Rev. Fr. Teshan Priyadarshana.\r\n\r\nTogether, these religious observances formed a meaningful part of NSBM’s anniversary celebrations, recognising the diversity of faiths while uniting the community in fellowship.', 'Oct 24, 2026'),

(3, 'NSBM Academic Staff Empowered to Embed Entrepreneurship Across the Curriculum', 1, 'Academic', 'academic', 'Staff Development & Quality Assurance Center', 'Curriculum Innovation Bureau', '5 min read', 1340, 0, 'news/news 3/WhatsApp Image 2026-11-23 at 19.23.05 (1).jpeg', 'Dr. Adam Scott of Victoria University Australia facilitating the CPD entrepreneurship session for NSBM academic staff', '[\"news/news 3/WhatsApp Image 2026-11-23 at 19.23.05 (1).jpeg\",\"news/news 3/WhatsApp Image 2026-11-23 at 19.23.05.jpeg\",\"news/news 3/WhatsApp Image 2026-11-23 at 19.23.06 (1).jpeg\",\"news/news 3/WhatsApp Image 2026-11-23 at 19.23.06.jpeg\",\"news/news 3/WhatsApp Image 2026-11-23 at 19.23.07.jpeg\"]', 'NSBM Green University conducted a Continuing Professional Development (CPD) session on embedding entrepreneurial thinking across curricula, facilitated by Dr. Adam Scott of Victoria University, Australia.', 'NSBM Green University conducted a Continuing Professional Development (CPD) session titled \"Embedding Entrepreneurship Across the Curriculum: Practical Strategies for Teaching and Learning,\" bringing together academic staff from all faculties to explore ways of integrating entrepreneurial thinking and practices into teaching and learning across disciplines.\r\n\r\nThe session was facilitated by Dr Adam Scott of Victoria University, Australia, who shared research-based insights and practical approaches drawn from nine instructional design principles developed in collaboration with Dr Nilusha Gallage, Lecturer and Coordinator – Undergraduate Courses at Victoria University.\r\n\r\nThe discussions covered three key areas of curriculum design: content, teaching and assessment. Participants explored strategies for scaffolding learning materials to accommodate different levels of student readiness, using Generative AI to present complex theories through visual formats, and connecting academic concepts with real-world applications.\r\n\r\nIn relation to teaching approaches, the session highlighted the importance of balancing the use of Generative AI with interactive and discussion-based learning. Practical strategies included AI critique activities to strengthen students’ critical thinking, as well as collaborative team projects that encourage creativity, problem-solving and teamwork.\r\n\r\nThe assessment component focused on designing authentic learning experiences that reflect real-world entrepreneurial practices, including venture pitches and reflective portfolios. The session was organised by the Young Entrepreneurship Circle in collaboration with the Department of Management and Staff Development Center as part of Global Entrepreneurship Week 2026.', 'Nov 18, 2026'),

(4, 'Economics and Decision Sciences Students Host ECONOMICA 2026 and Launch NEXsurge', 2, 'Events', 'events', 'Students’ Circle of Economics (SCEDS)', 'Faculty of Business Syndicate', '6 min read', 1620, 1, 'news/news 4/WhatsApp Image 2026-11-23 at 19.25.33 (1).jpeg', 'Official launch of NEXsurge Magazine during ECONOMICA 2026 at NSBM Green University', '[\"news/news 4/WhatsApp Image 2026-11-23 at 19.25.33 (1).jpeg\",\"news/news 4/WhatsApp Image 2026-11-23 at 19.25.33.jpeg\",\"news/news 4/WhatsApp Image 2026-11-23 at 19.25.34 (1).jpeg\",\"news/news 4/WhatsApp Image 2026-11-23 at 19.25.34 (2).jpeg\",\"news/news 4/WhatsApp Image 2026-11-23 at 19.25.34.jpeg\",\"news/news 4/WhatsApp Image 2026-11-23 at 19.25.35 (1).jpeg\",\"news/news 4/WhatsApp Image 2026-11-23 at 19.25.35 (2).jpeg\",\"news/news 4/WhatsApp Image 2026-11-23 at 19.25.35.jpeg\",\"news/news 4/WhatsApp Image 2026-11-23 at 19.25.36.jpeg\"]', 'SCEDS at the Faculty of Business successfully hosted ECONOMICA 2026 under the theme "Harnessing Sri Lanka’s Economic Resources" alongside the official launch of NEXsurge magazine.', 'The Students’ Circle of Economics and Decision Sciences (SCEDS) of the Faculty of Business at NSBM Green University successfully hosted ECONOMICA 2026, its flagship academic initiative, under the theme "Harnessing Sri Lanka’s Economic Resources." The event brought together young economic thinkers, academics, and distinguished industry experts to explore sustainable national development.\r\n\r\nA key highlight was the official launch of NEXsurge, a magazine featuring thought-provoking articles and fresh perspectives on harnessing Sri Lanka’s economic resources for sustainable development. The publication provides a platform for sharing knowledge, encouraging critical thinking, and highlighting the perspectives of emerging economic thinkers.\r\n\r\nThe event recognised outstanding contributions through competitions: Sanithi Jayasinghe (University of Sri Jayewardenepura) was named Inter-University Winner, while Pramodi De Silva (NSBM Green University) secured the Intra-University Winner title. Competition entries were evaluated by senior academics from the University of Kelaniya, University of Colombo, and Staffordshire University, UK.\r\n\r\nA panel discussion titled "From Potential to Progress: Harnessing Sri Lanka’s Resources for Sustainable Economic Growth" featured Dr. Nisha Arunatilake (Director of Research, IPS), Ms. Arani Rodrigo (Chief Economist, Ceylon Chamber of Commerce), and Prof. Janaka Fernando (USJ). ECONOMICA 2026 reflected SCEDS’s commitment to fostering economic awareness and nurturing young talent.', 'Nov 14, 2026'),

(5, 'NSBM Psychology Undergraduates Exhibit Developmental Theories Creatively', 1, 'Academic', 'academic', 'Psychology Student Association', 'Faculty of Science Bureau', '4 min read', 1190, 0, 'news/news 5/WhatsApp Image 2026-11-23 at 19.27.43.jpeg', 'BSc (Hons) Psychology undergraduates showcasing creative developmental exhibits at NSBM', '[\"news/news 5/WhatsApp Image 2026-11-23 at 19.27.43.jpeg\",\"news/news 5/WhatsApp Image 2026-11-23 at 19.27.44 (1).jpeg\",\"news/news 5/WhatsApp Image 2026-11-23 at 19.27.44 (2).jpeg\",\"news/news 5/WhatsApp Image 2026-11-23 at 19.27.44.jpeg\",\"news/news 5/WhatsApp Image 2026-11-23 at 19.27.45 (1).jpeg\",\"news/news 5/WhatsApp Image 2026-11-23 at 19.27.45 (2).jpeg\",\"news/news 5/WhatsApp Image 2026-11-23 at 19.27.45.jpeg\",\"news/news 5/WhatsApp Image 2026-11-23 at 19.27.46 (1).jpeg\",\"news/news 5/WhatsApp Image 2026-11-23 at 19.27.46.jpeg\"]', 'Undergraduates of the 26.2 BSc (Hons) Psychology programme following the University of Plymouth degree pathway showcased learning through innovative Exhibit Presentations analyzing human development in films.', 'Undergraduates of the 26.2 BSc (Hons) Psychology programme, following the University of Plymouth degree pathway at NSBM Green University, recently showcased their learning through a series of creative and insightful Exhibit Presentations.\r\n\r\nAs part of their academic activities, students explored the application of developmental psychology theories by examining how different aspects of human development are portrayed in films. Through this exercise, they connected theoretical concepts with real-world representations, critically evaluating how developmental theories are reflected in characters, behaviours and life experiences on screen.\r\n\r\nMoving beyond conventional classroom learning, the activity provided students with an opportunity to demonstrate their understanding through creative exhibits while strengthening their critical thinking, analytical, teamwork and presentation skills. It also encouraged them to communicate complex psychological concepts in engaging and accessible ways.\r\n\r\nThrough their thoughtful analyses and creative presentations, the students demonstrated how academic knowledge can be translated into practical understanding. The initiative reflects NSBM’s commitment to providing an engaging and experiential learning environment that prepares future psychology professionals to apply their knowledge beyond the classroom.', 'Nov 15, 2026'),

(6, 'NSBM Strengthens International Academic Ties with St. Joseph\'s College, India', 1, 'Academic', 'academic', 'International Relations Office', 'Global Academic Partnerships Desk', '3 min read', 950, 0, 'news/news 6/WhatsApp Image 2026-11-23 at 19.29.11 (1).jpeg', 'MoU signing between NSBM Green University and St. Joseph\'s College (Autonomous), India facilitated by CIMA Sri Lanka', '[\"news/news 6/WhatsApp Image 2026-11-23 at 19.29.11 (1).jpeg\",\"news/news 6/WhatsApp Image 2026-11-23 at 19.29.11 (2).jpeg\",\"news/news 6/WhatsApp Image 2026-11-23 at 19.29.11.jpeg\",\"news/news 6/WhatsApp Image 2026-11-23 at 19.29.12 (1).jpeg\",\"news/news 6/WhatsApp Image 2026-11-23 at 19.29.12.jpeg\"]', 'NSBM Green University has expanded its international academic network by signing an MoU with St. Joseph’s College (Autonomous), Tiruchirappalli, India, facilitated by CIMA Sri Lanka.', 'NSBM Green University has further expanded its international academic network through the signing of a Memorandum of Understanding (MoU) with St. Joseph’s College (Autonomous), Tiruchirappalli, Tamil Nadu, India.\r\n\r\nInitiated with the facilitation of CIMA Sri Lanka, this partnership marks another step in NSBM’s continued efforts to build meaningful global connections, foster academic collaboration, and expand its international engagement.\r\n\r\nThe occasion was attended by Mr. Sivasubramaniam Vithushan, Lead Manager – Business Development & Stakeholder Relationships; Mr. Tharindu Wijewardana, Country Head – Sri Lanka; and Dr. A. John Peter, Director, St. Joseph’s International, St. Joseph’s College, Tiruchirappalli, Tamil Nadu, India.\r\n\r\nThrough this partnership, NSBM continues to expand its international connections and pursue opportunities for meaningful engagement, joint student initiatives, and faculty research exchanges with leading higher education institutions across the South Asian region.', 'Nov 12, 2026'),

(7, 'NSBM Hosts Dr. Hans Wijayasuriya for Sri Lanka\'s Digital Future Session', 5, 'Computing & AI', 'computing', 'Faculty of Computing Press Syndicate', 'Technology & Digital Economy Desk', '5 min read', 2450, 1, 'news/news 7/WhatsApp Image 2026-11-23 at 19.36.12.jpeg', 'Dr. Hans Wijayasuriya delivering the keynote address on Sri Lanka\'s Digital Transformation at NSBM Green University', '[\"news/news 7/WhatsApp Image 2026-11-23 at 19.36.12.jpeg\"]', 'NSBM welcomed Dr. Hans Wijayasuriya, Chief Advisor to the President on the Digital Economy and Chairman of GovTech and ICTA, for an insightful session on Sri Lanka\'s digital economy.', 'NSBM Green University welcomed Dr. Hans Wijayasuriya, Chief Advisor to the President on the Digital Economy and Chairman of GovTech and the ICT Agency of Sri Lanka, for an insightful session with its students and academic staff on the future of Sri Lanka’s digital economy.\r\n\r\nThe session explored the opportunities and challenges shaping the country’s digital transformation, highlighting the growing importance of digital literacy, technological adaptability and the development of skills and competencies required to thrive in an increasingly digital world. The discussion provided students with valuable perspectives on emerging developments in the digital economy and the role of the next generation in supporting the country’s digital advancement.\r\n\r\nDuring his visit, Dr. Wijayasuriya also met with Senior Deputy Vice Chancellor Prof. Chaminda Rathnayake and the University’s senior management. The meeting provided an opportunity to exchange perspectives on the evolving role of higher education in supporting national development and preparing future-ready graduates equipped to respond to the changing demands of the digital economy.\r\n\r\nThe engagement reinforced the importance of strengthening connections between academia and the evolving digital landscape, ensuring that higher education remains responsive to emerging industry needs, AI governance, and technological developments.', 'Nov 10, 2026'),

(8, 'NSBM Delegation Represents Sri Lanka at 88th SAARC CCI Executive Meeting in Maldives', 4, 'General', 'general', 'Executive Directorate Press', 'Diplomatic & Regional Affairs Bureau', '4 min read', 1180, 0, 'news/news 8/WhatsApp Image 2026-11-23 at 22.47.35 (1).jpeg', 'Vice-Chancellor Prof. E. A. Weerasinghe leading the NSBM delegation at the 88th SAARC CCI Meeting in Maldives', '[\"news/news 8/WhatsApp Image 2026-11-23 at 22.47.35 (1).jpeg\",\"news/news 8/WhatsApp Image 2026-11-23 at 22.47.35.jpeg\",\"news/news 8/WhatsApp Image 2026-11-23 at 22.47.36 (1).jpeg\",\"news/news 8/WhatsApp Image 2026-11-23 at 22.47.36.jpeg\"]', 'NSBM Green University proudly represented Sri Lanka at the 88th Executive Committee Meeting of the SAARC Chamber of Commerce and Industry (SAARC CCI) held in the Maldives.', 'NSBM Green University proudly represented Sri Lanka at the 88th Executive Committee Meeting of the SAARC Chamber of Commerce and Industry (SAARC CCI), held on 16 November 2026 in the Maldives. The meeting brought together representatives from across South Asia to discuss important matters related to regional economic cooperation, sustainable development and opportunities for strengthening partnerships among institutions and organisations in the region.\r\n\r\nThe NSBM delegation consisted of Vice-Chancellor Professor E. A. Weerasinghe, Senior Deputy Vice-Chancellor Professor Chaminda Rathnayake and Head of Administration Mr. Kapila Liyanage. Their participation provided an opportunity for NSBM to engage with regional representatives and contribute to discussions focused on improving cooperation, higher education integration, and building stronger connections across South Asian countries.\r\n\r\nNSBM\'s involvement in this prestigious international summit reflects the university\'s ongoing commitment to expanding its global presence and strengthening Sri Lanka\'s position as an emerging higher education hub in South Asia.', 'Nov 16, 2026'),

(9, 'NSBM Celebrates Nursing Pledge Ceremony 2026 for Undergraduates', 2, 'Events', 'events', 'Department of Life Sciences', 'Healthcare & Science Desk', '5 min read', 1890, 1, 'news/news 9/WhatsApp Image 2026-11-23 at 22.47.37 (1).jpeg', 'Undergraduate nurses receiving ceremonial caps and lighting traditional lamps at the NSBM Nursing Pledge Ceremony 2026', '[\"news/news 9/WhatsApp Image 2026-11-23 at 22.47.37 (1).jpeg\",\"news/news 9/WhatsApp Image 2026-11-23 at 22.47.37.jpeg\",\"news/news 9/WhatsApp Image 2026-11-23 at 22.47.38.jpeg\",\"news/news 9/WhatsApp Image 2026-11-23 at 22.47.39 (1).jpeg\",\"news/news 9/WhatsApp Image 2026-11-23 at 22.47.39 (2).jpeg\",\"news/news 9/WhatsApp Image 2026-11-23 at 22.47.39.jpeg\",\"news/news 9/WhatsApp Image 2026-11-23 at 22.47.40 (1).jpeg\",\"news/news 9/WhatsApp Image 2026-11-23 at 22.47.40.jpeg\",\"news/news 9/WhatsApp Image 2026-11-23 at 22.47.41.jpeg\"]', 'NSBM Green University celebrated the Nursing Pledge Ceremony 2026 for batches 25.2 and 25.3, marking a sacred milestone in the healthcare journeys of nursing undergraduates.', 'NSBM Green University proudly celebrated the Nursing Pledge Ceremony 2026 on 11 November 2026, marking a significant milestone in the academic and professional journeys of students from the 25.2 and 25.3 Nursing batches. The ceremony provided an opportunity for nursing undergraduates to formally express their commitment to the nursing profession and its responsibilities towards individuals, families and communities.\r\n\r\nThe event was honoured by the presence of Mrs. H. M. C. M. Herath, Former Chief Nursing Officer and Lecturer in Nursing at the Faculty of Nursing, University of Colombo, who attended as Chief Guest. The ceremony was also attended by distinguished university leaders, including Vice-Chancellor Prof. E. A. Weerasinghe, Senior Deputy Vice-Chancellor Prof. Chaminda Rathnayake, Deputy Vice-Chancellor Prof. Thilini de Silva, and Dr. Nuwanthi Katuwavila, Dean of the Faculty of Science.\r\n\r\nThe ceremony welcomed distinguished healthcare leaders from Sri Jayewardenepura General Hospital, Durdans Hospital, and Shanthi Nivasa.\r\n\r\nA central highlight was the ceremonial presentation of nursing caps and the lighting of traditional three-wick oil lamps, symbolising the wisdom, compassion and dedication essential to professional healthcare. The university extends its heartfelt blessings to all inducted nursing scholars.', 'Nov 11, 2026'),

(10, 'NSBM and Southern Cross University Australia Sign MoU for Dual Degree Programme', 1, 'Academic', 'academic', 'Global Academic Bureau', 'Senior University Press', '5 min read', 1950, 1, 'news/news 10/WhatsApp Image 2026-11-23 at 23.13.12.jpeg', 'Prof. Tyrone Carlin (Vice-Chancellor SCU) and Prof. E. A. Weerasinghe signing the Dual Degree MoU at NSBM', '[\"news/news 10/WhatsApp Image 2026-11-23 at 23.13.12.jpeg\",\"news/news 10/WhatsApp Image 2026-11-23 at 23.13.13 (1).jpeg\",\"news/news 10/WhatsApp Image 2026-11-23 at 23.13.13 (2).jpeg\",\"news/news 10/WhatsApp Image 2026-11-23 at 23.13.13.jpeg\"]', 'NSBM Green University signed an MoU with Southern Cross University (SCU), Australia, introducing a groundbreaking double degree combining Bachelor of Business and Bachelor of Information Technology.', 'NSBM Green University has taken another important step towards expanding international higher education opportunities in Sri Lanka by signing a Memorandum of Understanding (MoU) with Southern Cross University (SCU), Australia. The agreement introduces a new double degree programme combining a Bachelor of Business and a Bachelor of Information Technology, which is expected to commence in 2027.\r\n\r\nThe agreement was formalised as part of NSBM Green University\'s 10th Anniversary Celebrations, marking a significant milestone in the longstanding academic partnership between the two universities. The MoU was signed by Professor Tyrone Carlin, Vice-Chancellor of Southern Cross University, and Professor E. A. Weerasinghe, Vice-Chancellor of NSBM Green University. Both institutions reaffirmed their shared commitment to providing internationally aligned education and preparing students for the changing demands of the global employment market.\r\n\r\nThe proposed double degree programme is designed to bring together two vital fields: business and information technology. In today\'s rapidly developing digital world, organisations increasingly require professionals who understand both business operations and technological solutions.\r\n\r\nBeyond the introduction of the double degree, the MoU represents the continued development of the relationship between NSBM and Southern Cross University, laying a robust foundation for joint research initiatives and student exchanges.', 'Oct 27, 2026'),

(11, 'NSBM Green University Awarded Platinum Rating at Annual Green Building Awards 2026', 6, 'Sustainability', 'sustainability', 'Green Task Force & Campus Architecture Bureau', 'Eco-Sustainability Desk', '5 min read', 2800, 1, 'news/news 11/WhatsApp Image 2026-11-23 at 23.22.05.jpeg', 'NSBM Phase II development awarded the highest Platinum Rating by the Green Building Council of Sri Lanka', '[\"news/news 11/WhatsApp Image 2026-11-23 at 23.22.04.jpeg\",\"news/news 11/WhatsApp Image 2026-11-23 at 23.22.05.jpeg\"]', 'NSBM Green University achieves top environmental honours with the prestigious Platinum Rating for its Phase II development at the Annual Green Building Awards 2026.', 'NSBM Green University continues to set the benchmark for ecological campus design and sustainable higher education in South Asia, securing the prestigious Platinum Rating for its Phase II development at the Annual Green Building Awards 2026 organised by the Green Building Council of Sri Lanka (GBCSL).\r\n\r\nThe award honours NSBM\'s exemplary commitment to energy efficiency, sustainable water management, carbon emissions reduction, and green architectural design across its state-of-the-art campus premises in Pitipana, Homagama. The Phase II development integrates advanced solar microgrids, natural ventilation engineering, rainwater harvesting systems, and sustainable landscaping.\r\n\r\nVice-Chancellor Prof. E. A. Weerasinghe accepted the honour on behalf of the university, stating: \'Receiving the Platinum Rating from the Green Building Council of Sri Lanka reaffirms our founding philosophy as South Asia\'s first green university. We remain dedicated to providing future generations with a sustainable, inspiring learning environment.\'\r\n\r\nThe certification cements NSBM\'s position as a regional pioneer in sustainable university infrastructure and environmental stewardship.', 'Nov 20, 2026');

-- ------------------------------------------------------------------------
-- 5. Table: submissions
-- ------------------------------------------------------------------------
CREATE TABLE `submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ref_id` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `student_id` VARCHAR(50) NOT NULL,
  `submitted_date` VARCHAR(50) NOT NULL,
  `read_time` VARCHAR(30) DEFAULT '4 min read',
  `image_path` VARCHAR(255) DEFAULT 'news/news 1/news 1.jpeg',
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `feedback` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `submissions` (`id`, `ref_id`, `title`, `category`, `author_name`, `student_id`, `submitted_date`, `read_time`, `image_path`, `excerpt`, `content`, `status`, `feedback`) VALUES
(1, 'sub-101', 'Development of Low-Power LoRa IoT Nodes for Campus Microclimate Monitoring', 'Academic', 'Ravindu Perera', 'NSBM-IT-23-4819', 'Nov 21, 2026', '5 min read', 'news/news 1/news 1.jpeg', 'A prototype IoT sensor network developed by computing students that monitors microclimate parameters across NSBM landscaping.', 'Our computing second-year engineering team has deployed field trials for low-power LoRa mesh nodes designed to track soil moisture and ambient temperatures across university grounds.', 'pending', ''),
(2, 'sub-102', 'NSBM Robotics Club Showcases Autonomous Search and Rescue Drones at TechEx', 'Computing & AI', 'Minoli Weerakkody', 'NSBM-BM-22-1904', 'Nov 20, 2026', '4 min read', 'news/news 7/WhatsApp Image 2026-11-23 at 19.36.12.jpeg', 'Student robotics engineers demo edge-vision drones capable of mapping confined indoor disaster zones.', 'The NSBM Robotics Guild demonstrated its search and rescue quadcopter platform at TechEx 2026, featuring onboard computer vision and collision avoidance.', 'pending', ''),
(3, 'sub-103', 'Student Senate Adopts Green Campus Single-Use Plastic Elimination Policy', 'Sustainability', 'Hiran Jayasundara', 'NSBM-LAW-24-0312', 'Nov 18, 2026', '3 min read', 'news/news 11/WhatsApp Image 2026-11-23 at 23.22.05.jpeg', 'New legislative framework requires all dining providers on campus to adopt biodegradable packaging by January 2027.', 'In a historic vote, the Student Senate unanimously ratified the Green Dining Compact 2026.', 'approved', 'Approved by Chief Editor. Published to campus newsfeed.');

-- ------------------------------------------------------------------------
-- 6. Table: comments
-- ------------------------------------------------------------------------
CREATE TABLE `comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `article_id` INT NOT NULL,
  `user_id` INT NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `user_role` VARCHAR(50) DEFAULT 'Student Reader',
  `comment_text` TEXT NOT NULL,
  `status` ENUM('approved', 'flagged', 'removed') NOT NULL DEFAULT 'approved',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `comments` (`id`, `article_id`, `user_id`, `author_name`, `user_role`, `comment_text`, `status`) VALUES
(1, 1, 2, 'Danushka Silva', 'Civil Engineering Undergrad', 'The new structural testing facilities and concrete tech labs in the Rs. 720M complex are world class!', 'approved'),
(2, 7, 1, 'Dr. Priyantha Kumar', 'Chief Editor', 'Dr. Hans Wijayasuriya\'s insights on digital public infrastructure and AI governance provide an essential roadmap for our computing undergraduates.', 'approved'),
(3, 11, 2, 'Kasun Perera', 'Student Reporter', 'Receiving the Platinum Rating from the Green Building Council is a proud achievement for every student and staff member at NSBM!', 'approved');

-- ------------------------------------------------------------------------
-- 7. Table: bookmarks
-- ------------------------------------------------------------------------
CREATE TABLE `bookmarks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `article_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_article_unique` (`user_id`, `article_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `bookmarks` (`user_id`, `article_id`) VALUES
(2, 1),
(2, 7),
(2, 11);

-- ------------------------------------------------------------------------
-- 8. Table: category_subscriptions
-- ------------------------------------------------------------------------
CREATE TABLE `category_subscriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `category_slug` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_category_unique` (`user_id`, `category_slug`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `category_subscriptions` (`user_id`, `category_slug`) VALUES
(2, 'academic'),
(2, 'computing'),
(2, 'sustainability');
