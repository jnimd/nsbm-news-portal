-- ========================================================================
-- NSBM GREEN UNIVERSITY — FACULTY OF COMPUTING
-- Module: Web and Mobile Application Development (Batch: 26.1 IFSL)
-- FINAL PROJECT ASSIGNMENT: DATABASE SCHEMA & SEED DATA
-- Project Topic 1: NSBM NewsDesk — Campus News Management System
-- ========================================================================

CREATE DATABASE IF NOT EXISTS `nsbm_newsdesk` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nsbm_newsdesk`;

-- ------------------------------------------------------------------------
-- 1. Table: users
-- Roles: 'student', 'admin'
-- ------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
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

-- Seed Users (Passwords hashed or default 'nsbm2026')
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `student_id`, `admin_id`, `faculty`, `title`) VALUES
(1, 'Kasun Perera', 'student@students.nsbm.ac.lk', '$2y$10$e846V0K8pZ1z6jU.p8Xyqe0Wl8P4L3H8L/ePqL3Vw9L2f7m1vW5yK', 'student', 'NSBM-IT-24-9021', NULL, 'Faculty of Computing', 'Student Reporter'),
(2, 'Dr. Priyantha Kumar', 'admin@nsbm.ac.lk', '$2y$10$e846V0K8pZ1z6jU.p8Xyqe0Wl8P4L3H8L/ePqL3Vw9L2f7m1vW5yK', 'admin', NULL, 'ADMIN-PRESS-01', 'University Media Bureau', 'Chief Editor & Communications Director'),
(3, 'Sanduni Ariyaratne', 's.ariyaratne@students.nsbm.ac.lk', '$2y$10$e846V0K8pZ1z6jU.p8Xyqe0Wl8P4L3H8L/ePqL3Vw9L2f7m1vW5yK', 'student', 'NSBM-IT-23-4819', NULL, 'Faculty of Computing', 'Senior Student Researcher');

-- ------------------------------------------------------------------------
-- 2. Table: categories
-- Required: Academic, Events, Sports, General + Computing & Sustainability
-- ------------------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
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
(1, 'academic', 'Academic', 'academic', '#6366f1', 'Curriculum updates, research publications, faculty notices, and exam timetables.'),
(2, 'events', 'Events', 'events', '#ec4899', 'Campus galas, hackathons, club exhibitions, convocations, and guest lectures.'),
(3, 'sports', 'Sports', 'sports', '#f59e0b', 'Inter-university rugby, cricket, swimming, athletics, and intramural tournaments.'),
(4, 'general', 'General', 'general', '#3b82f6', 'Official university directives, campus safety, shuttle schedules, and student notices.'),
(5, 'computing', 'Computing & AI', 'computing', '#06b6d4', 'Faculty of Computing breakthroughs, software summits, robotics, and tech demos.'),
(6, 'sustainability', 'Sustainability', 'sustainability', '#10b981', 'South Asia\'s 1st Green University eco-audits, solar microgrid, and biodiversity.');

-- ------------------------------------------------------------------------
-- 3. Table: announcements
-- Campus directives, breaking bulletin ticker
-- ------------------------------------------------------------------------
DROP TABLE IF EXISTS `announcements`;
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
(1, 'Inauguration Ceremony for the 2026 Academic Year', 'Academic', 'URGENT', 'All first-year undergraduates are requested to report to the Main Auditorium by 8:30 AM with their admission credentials.', 1, 'October 24, 2026'),
(2, 'National Inter-University AI Hackathon 2026 Registrations Open', 'Events', 'FEATURED', 'Over LKR 1.5 Million in prize pools. Teams of 4 from any recognised higher education institute can register via the portal before November 2.', 1, 'October 23, 2026'),
(3, 'Annual Varsity Green Cup: Rugby & Track Trials This Saturday', 'Sports', 'SPORTS', 'Open selection trials for freshmen and seniors at the NSBM International Ground from 7:00 AM with Varsity Head Coach.', 0, 'October 21, 2026'),
(4, 'Campus Shuttle Service Timetable Update for Semester 1', 'General', 'GENERAL', 'Additional express shuttles between Makumbura Multimodal Transport Hub and NSBM Green Campus added every 15 minutes during peak hours.', 0, 'October 19, 2026');

-- ------------------------------------------------------------------------
-- 4. Table: articles
-- Core news dispatches published to the public newsfeed
-- ------------------------------------------------------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category_id` INT NULL,
  `category_name` VARCHAR(100) NOT NULL,
  `category_slug` VARCHAR(50) NOT NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `author_role` VARCHAR(100) DEFAULT 'Student Journalist',
  `read_time` VARCHAR(30) DEFAULT '4 min read',
  `views` INT DEFAULT 1,
  `featured` TINYINT(1) DEFAULT 0,
  `image_path` VARCHAR(255) NOT NULL DEFAULT '1im/ezgif-frame-001.jpg',
  `image_caption` VARCHAR(255) NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `published_date` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `articles` (`id`, `title`, `category_id`, `category_name`, `category_slug`, `author_name`, `author_role`, `read_time`, `views`, `featured`, `image_path`, `image_caption`, `excerpt`, `content`, `published_date`) VALUES
(1, 'Faculty of Computing Unveils Edge-AI Diagnostics for Rural Agriculture', 1, 'Academic', 'academic', 'Kanishka Senanayake', 'Senior Student Researcher', '6 min read', 1420, 1, '1im/ezgif-frame-045.jpg', 'Faculty of Computing Edge-AI Lab & Diagnostics Bench', 'Undergraduate coders deploy a zero-cloud convolutional neural network on edge microcontrollers detecting crop blight with 98.4% accuracy.', 'Tucked away in the third-floor research wing of the Faculty of Computing, a team of undergraduate innovators is quietly pioneering an edge-deployed convolutional neural network designed to diagnose early-stage crop and plant disease without requiring an active internet link.\n\nUnder the mentorship of leading faculty and in partnership with regional agricultural centers, the model runs directly on low-power microcontrollers equipped with miniature CMOS image sensors.\n\n"Our primary goal was zero-cloud latency," explains project lead Sanduni Ariyaratne. "In rural tea and rubber plantations where cellular bandwidth is intermittent, our system analyzes leaf histology and skin lesions in under 38 milliseconds with 98.4% verified diagnostic accuracy."\n\nThe lab has already filed two provisional intellectual property patents through the NSBM Center for Research and Commercialization, signaling a powerful paradigm shift in student-led technological sovereignty.', 'Oct 22, 2026'),
(2, 'Annual Green Conclave 2026: 48 Hours of Restless Innovation at the Recreation Dome', 2, 'Events', 'events', 'Tharindu Perera', 'Campus Bureau Chief', '4 min read', 980, 1, '2im/ezgif-frame-080.jpg', 'NSBM Recreation Dome during HackPulse 2026', 'Energy drinks, algorithmic breakthroughs, and dawn pitches. We spent 48 sleepless hours documenting 120 teams competing for the Innovation Cup.', 'At 3:15 AM on Saturday, the glowing blue hue of hundreds of laptop displays reflected off the geodesic arches of the NSBM Recreation Dome.\n\nOver 120 teams from 18 universities across Sri Lanka had gathered for HackPulse 2026, challenged to deliver functional decentralized disaster-management systems within 48 unbroken hours.\n\nBetween algorithmic breakthroughs and whiteboard sprints, students traded debugging strategies over steaming mugs of Ceylon ginger tea. When final pitch time arrived at Sunday dawn, three projects were immediately awarded incubation offers by Colombo angel syndicates.', 'Oct 20, 2026'),
(3, 'Varsity Green Dragons Clinch Western Province Inter-Uni Rugby Championship', 3, 'Sports', 'sports', 'Malinda Jayasuriya', 'Sports Editor', '5 min read', 1850, 1, '3im/ezgif-frame-110.jpg', 'Green Dragons lifting the Western Province Championship Trophy', 'In a thrilling 28-24 final against Colombo University, the Green Dragons staged a second-half comeback to lift the coveted provincial trophy.', 'A deafening roar echoed across the Pitipana sports complex as fly-half Shenal De Silva pierced through the defensive line in the 78th minute to seal an unforgettable 28-24 victory.\n\nThe championship win crowns an undefeated season for the NSBM varsity rugby squad, which dominated scrums and demonstrated surgical tactical kicking under head coach Ruwan Gunasekara.\n\n"This trophy is the result of 5:00 AM gym sessions and tireless discipline," said team captain Thisara Alwis during the post-match celebration.', 'Oct 19, 2026'),
(4, 'Campus Sustainability Audit: 85% Carbon Reduction Milestone Achieved', 6, 'Sustainability', 'sustainability', 'Dilini Rajapakse', 'Environmental Desk', '7 min read', 730, 0, '1im/ezgif-frame-090.jpg', 'Wetlands and Solar Harvesting Array at NSBM Green Campus', 'New independent audit confirms South Asia\'s First Green University has transformed over 15 metric tons of monthly organic waste into bio-energy.', 'At 6:00 AM every morning, before lecture halls open their doors, NSBM’s automated ecological transit carts make their daily rounds across four university dining halls.\n\nEvery scrap of organic prep material, coffee grounds, and dining byproduct is diverted from landfills directly to the university\'s twin anaerobic biodigesters located on the campus periphery.\n\nOver a 21-day mesophilic processing cycle, microbes transform over 15 metric tons of monthly organic waste into rich organic digestate and compressed methane gas that fuels the culinary academy\'s test kitchens.', 'Oct 18, 2026'),
(5, 'Vice Chancellor Bureau Announces New Guidelines on Academic Research Grants', 4, 'General', 'general', 'Editorial Desk', 'University Press Bureau', '4 min read', 1120, 0, '2im/ezgif-frame-130.jpg', 'Administrative Council & Faculty Board Chambers', 'Undergraduate student researchers are now eligible for up to LKR 500,000 in seed research funding for green technology and robotics projects.', 'The NSBM Academic Council has announced an expansion of the Undergraduate Research Incentive Scheme (URIS) for the 2026/2027 academic cycle.\n\nUnder the revised directive, students across all four faculties (Computing, Business, Engineering, and Science) can apply for peer-reviewed seed funding for research that addresses sustainable national economic priorities.\n\nApplications open on November 1st through the university research portal, with initial disbursement ceremonies scheduled for early next year.', 'Oct 17, 2026');

-- ------------------------------------------------------------------------
-- 5. Table: submissions
-- Student articles submitted for administrative review & approval
-- ------------------------------------------------------------------------
DROP TABLE IF EXISTS `submissions`;
CREATE TABLE `submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ref_id` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `student_id` VARCHAR(50) NOT NULL,
  `submitted_date` VARCHAR(50) NOT NULL,
  `read_time` VARCHAR(30) DEFAULT '4 min read',
  `image_path` VARCHAR(255) DEFAULT '1im/ezgif-frame-001.jpg',
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `feedback` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `submissions` (`id`, `ref_id`, `title`, `category`, `author_name`, `student_id`, `submitted_date`, `read_time`, `excerpt`, `content`, `status`, `feedback`) VALUES
(1, 'sub-101', 'Autonomous Solar Rovers for Soil Moisture Sampling on Campus Grounds', 'Academic', 'Ravindu Perera', 'NSBM-IT-23-4819', 'Oct 22, 2026', '5 min read', 'A prototype solar rover built by mechatronics students that maps moisture and nitrogen levels across NSBM landscaping.', 'Our mechatronics second-year team has completed field trials for a low-cost, 3D-printed solar rover designed to roam campus gardens autonomously.', 'pending', ''),
(2, 'sub-102', 'NSBM Aquatics Team Sweeps Gold at National Inter-University Swimming Meet', 'Sports', 'Minoli Weerakkody', 'NSBM-BM-22-1904', 'Oct 21, 2026', '4 min read', 'NSBM swimmers claim 7 gold medals and break two national university records in the 200m freestyle and 4x100m relay.', 'The NSBM Green Waves swimming team dominated the pool at the Sugathadasa Stadium, taking home top honors in seven individual and relay events.', 'pending', ''),
(3, 'sub-103', 'Student Senate Pass Resolution on Zero-Single-Use Plastics at University Cafes', 'General', 'Hiran Jayasundara', 'NSBM-LAW-24-0312', 'Oct 19, 2026', '3 min read', 'New legislative framework requires all dining providers on campus to adopt biodegradable packaging by January 2027.', 'In a historic vote, the Student Senate unanimously ratified the Green Dining Compact 2026.', 'approved', 'Approved by Chief Editor. Published to campus newsfeed.');

-- ------------------------------------------------------------------------
-- 6. Table: comments
-- Reader comments & moderation
-- ------------------------------------------------------------------------
DROP TABLE IF EXISTS `comments`;
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
(1, 1, 1, 'Danushka Silva', 'Computing Undergrad', 'Proud of our third-year team! The zero-cloud edge AI model is going to help so many farmers across our rural zones.', 'approved'),
(2, 1, 2, 'Dr. Rohan Samarasinghe', 'Visiting Faculty', 'Exceptional technical execution on the low-power microcontroller deployment. Looking forward to the symposium demonstration.', 'approved'),
(3, 3, 1, 'Kasun Wickrama', 'Student Athlete', 'That try in the 78th minute was pure tactical brilliance. Green Dragons all the way!', 'approved');

-- ------------------------------------------------------------------------
-- 7. Table: bookmarks
-- Saved articles per user
-- ------------------------------------------------------------------------
DROP TABLE IF EXISTS `bookmarks`;
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
(1, 1),
(1, 3);

-- ------------------------------------------------------------------------
-- 8. Table: category_subscriptions
-- Student category notifications
-- ------------------------------------------------------------------------
DROP TABLE IF EXISTS `category_subscriptions`;
CREATE TABLE `category_subscriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `category_slug` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_category_unique` (`user_id`, `category_slug`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `category_subscriptions` (`user_id`, `category_slug`) VALUES
(1, 'academic'),
(1, 'computing');
