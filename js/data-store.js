// local storage data store
(function(window) {
  'use strict';

  const STORAGE_KEYS = {
    ARTICLES: 'nsbm_newsdesk_articles_v7',
    CATEGORIES: 'nsbm_newsdesk_categories_v7',
    ANNOUNCEMENTS: 'nsbm_newsdesk_announcements_v7',
    SUBMISSIONS: 'nsbm_newsdesk_submissions_v7',
    COMMENTS: 'nsbm_newsdesk_comments_v7',
    BOOKMARKS: 'nsbm_newsdesk_bookmarks_v7',
    SUBSCRIPTIONS: 'nsbm_newsdesk_subscriptions_v7',
    LIKES: 'nsbm_newsdesk_likes_v7',
    SOCIAL_POSTS: 'nsbm_newsdesk_social_posts_v7',
    CURRENT_USER: 'nsbm_newsdesk_current_user_v7'
  };

  // Seed Categories: Strictly matches Topic 1 (Academic, Events, Sports, General) + Computing, Sustainability
  const DEFAULT_CATEGORIES = [
    { id: 'academic', name: 'Academic', icon: 'academic', color: '#6366f1', description: 'Curriculum updates, research publications, faculty notices, and international double degree MoUs.' },
    { id: 'events', name: 'Events', icon: 'events', color: '#ec4899', description: 'Campus celebrations, gala ceremonies, academic symposiums, and convocations.' },
    { id: 'sports', name: 'Sports', icon: 'sports', color: '#f59e0b', description: 'Inter-university sports, athletics, swimming meets, and varsity trials.' },
    { id: 'general', name: 'General', icon: 'general', color: '#3b82f6', description: 'Official university directives, SAARC delegations, shuttle updates, and executive notices.' },
    { id: 'computing', name: 'Computing & AI', icon: 'computing', color: '#06b6d4', description: 'Faculty of Computing breakthroughs, national digital economy summits, and ICT lectures.' },
    { id: 'sustainability', name: 'Sustainability', icon: 'sustainability', color: '#10b981', description: 'South Asia\'s 1st Green University awards, green building ratings, solar microgrids, and eco initiatives.' }
  ];

  // Seed Announcements: Administrative directives & breaking bulletins
  const DEFAULT_ANNOUNCEMENTS = [
    {
      id: 'ann-1',
      title: 'Inauguration of Rs. 720M Civil Engineering Laboratory Complex',
      category: 'Academic',
      date: 'October 26, 2026',
      badge: 'URGENT',
      summary: 'Ceremonially declared open by Attorney General Hon. K. A. Parinda Ranasinghe Jr., PC, as part of NSBM 10th anniversary milestones.',
      pinned: true
    },
    {
      id: 'ann-2',
      title: 'NSBM Phase II Awarded Platinum Rating by Green Building Council',
      category: 'Sustainability',
      date: 'November 20, 2026',
      badge: 'FEATURED',
      summary: 'South Asia\'s premier green university campus receives highest environmental certification at the Annual Green Building Awards 2026.',
      pinned: true
    },
    {
      id: 'ann-3',
      title: 'Southern Cross University Australia Dual Degree Applications Open',
      category: 'Academic',
      date: 'October 28, 2026',
      badge: 'ACADEMIC',
      summary: 'Undergraduates can register for the double degree combining Bachelor of Business and Bachelor of Information Technology starting 2027.',
      pinned: false
    },
    {
      id: 'ann-4',
      title: 'Executive Session on Sri Lanka\'s Digital Economy by Dr. Hans Wijayasuriya',
      category: 'Computing & AI',
      date: 'November 10, 2026',
      badge: 'TECH',
      summary: 'Keynote address by Chief Advisor to the President on Digital Economy on digital transformation competencies and AI governance.',
      pinned: false
    }
  ];

  // Seed Articles (11 REAL NEWS ARTICLES)
  const DEFAULT_ARTICLES = [
  {
    "id": 1,
    "title": "NSBM Opens Rs. 720 Million Civil Engineering Laboratory Complex",
    "category": "Academic",
    "categorySlug": "academic",
    "author": "Prof. E. A. Weerasinghe & Media Bureau",
    "authorRole": "University Infrastructure Bureau",
    "readTime": "5 min read",
    "views": 2150,
    "featured": true,
    "image": "news/news 1/news 1.jpeg",
    "imageCaption": "Ceremonial opening of the Rs. 720M Civil Engineering Laboratory Complex by Attorney General Hon. K. A. Parinda Ranasinghe Jr.",
    "images": [
      "news/news 1/news 1.jpeg"
    ],
    "excerpt": "NSBM Green University ceremonially opened its state-of-the-art Civil Engineering Laboratory Complex, representing a significant Rs. 720 million self-financed investment in engineering education as part of its 10th anniversary celebrations.",
    "content": "NSBM Green University ceremonially opened its state-of-the-art Civil Engineering Laboratory Complex, representing a significant Rs. 720 million self-financed investment in engineering education, on 26 October 2026 as part of its 10th anniversary celebrations.\n\nLocated within the university’s Phase II development at Pitipana, Homagama, the new complex marks an important milestone in NSBM’s continued investment in modern academic infrastructure and practical engineering education. Equipped with modern infrastructure, high-tech laboratories and advanced learning facilities, the complex is designed to strengthen students’ practical learning experiences and support the development of industry-relevant engineering skills.\n\nThe complex was ceremonially declared open by the Attorney General of Sri Lanka, Hon. K. A. Parinda Ranasinghe Jr., PC, in the distinguished presence of NSBM Founder and Vice-Chancellor Prof. E. A. Weerasinghe; Prof. Richard Davies, Vice-Chancellor and CEO of the University of Plymouth, United Kingdom; Prof. Tyrone Carlin, Vice-Chancellor and President of Southern Cross University, Australia; and Prof. Li Lu, Vice-Chancellor and President of Zhejiang Shuren University, China.\n\nThe Rs. 720 million investment reflects NSBM’s commitment to providing students with an academic environment that connects theoretical knowledge with practical application. By strengthening its engineering facilities, the university aims to equip future engineers with the technical knowledge, practical experience and competencies required to meet the evolving demands of the profession.\n\nThe opening of the complex also forms part of NSBM’s broader campus expansion programme, which seeks to enhance its academic capabilities and create opportunities for future-focused education across multiple disciplines.\n\nAs NSBM marks a decade of excellence and national impact, the new Civil Engineering Laboratory Complex stands as a testament to its continued investment in education, infrastructure and the next generation of engineering professionals.",
    "date": "Oct 26, 2026",
    "publishedDate": "Oct 26, 2026"
  },
  {
    "id": 2,
    "title": "NSBM Green University Marks 10th Anniversary with Multi-Religious Observances",
    "category": "Events",
    "categorySlug": "events",
    "author": "Cultural & Inter-Faith Directorate",
    "authorRole": "Campus Press Bureau",
    "readTime": "6 min read",
    "views": 1780,
    "featured": true,
    "image": "news/news 2/WhatsApp Image 2026-11-23 at 18.54.33.jpeg",
    "imageCaption": "Overnight Pirith chanting ceremony and inter-faith observances marking NSBM 10th Anniversary",
    "images": [
      "news/news 2/WhatsApp Image 2026-11-23 at 18.54.33.jpeg",
      "news/news 2/WhatsApp Image 2026-11-23 at 18.54.34 (1).jpeg",
      "news/news 2/WhatsApp Image 2026-11-23 at 18.54.34 (2).jpeg",
      "news/news 2/WhatsApp Image 2026-11-23 at 18.54.34.jpeg"
    ],
    "excerpt": "As part of its 10th anniversary celebrations, NSBM Green University organised a series of multi-religious observances from 21 to 24 October 2026, bringing together its university community to seek blessings.",
    "content": "As part of its 10th anniversary celebrations, NSBM Green University organised a series of religious observances from 21 to 24 October 2026, bringing together members of its university community to seek blessings for the institution’s continued growth and success.\n\nReflecting NSBM’s respect for Sri Lanka’s diverse religious traditions, the observances provided an opportunity for staff and students to come together in prayer, thanksgiving and reflection, while celebrating a decade of achievements and looking towards the university’s future.\n\nThe series included religious programmes organised by the NSBM Buddhist Society, Hindu Society, Islamic Society, and Catholic and Christian Society, each reflecting the spiritual traditions and cultural heritage of their respective communities.\n\nThe Buddhist observances began with a Buddha Pooja organised by the NSBM Buddhist Society, invoking blessings for peace, prosperity and the university’s future journey. The programme also included an overnight Pirith Chanting Ceremony held on 23 October at the newly constructed NSBM Civil Engineering Laboratory premises, followed by the traditional Heel Dane (morning alms offering) to the venerable Maha Sangha.\n\nThe Hindu Society hosted Natham ’26, a celebration that commenced with sacred poojas seeking blessings for the university and its leadership. The event was attended by Vice-Chancellor Prof. E. A. Weerasinghe, Senior Deputy Vice-Chancellor Prof. Chaminda Rathnayake, members of the senior management team, deans and staff.\n\nThe NSBM Islamic Society organised a special cultural gathering featuring Qaseeda recitations, a keynote Bayan session delivered by Moulavi Nashik Farook Tanweeri, and traditional delicacies. Meanwhile, the NSBM Catholic and Christian Society organised a Holy Mass celebrated by Rev. Fr. Prasad Harshana and Rev. Fr. Teshan Priyadarshana.\n\nTogether, these religious observances formed a meaningful part of NSBM’s anniversary celebrations, recognising the diversity of faiths while uniting the community in fellowship.",
    "date": "Oct 24, 2026",
    "publishedDate": "Oct 24, 2026"
  },
  {
    "id": 3,
    "title": "NSBM Academic Staff Empowered to Embed Entrepreneurship Across the Curriculum",
    "category": "Academic",
    "categorySlug": "academic",
    "author": "Staff Development & Quality Assurance Center",
    "authorRole": "Curriculum Innovation Bureau",
    "readTime": "5 min read",
    "views": 1340,
    "featured": false,
    "image": "news/news 3/WhatsApp Image 2026-11-23 at 19.23.05 (1).jpeg",
    "imageCaption": "Dr. Adam Scott of Victoria University Australia facilitating the CPD entrepreneurship session for NSBM academic staff",
    "images": [
      "news/news 3/WhatsApp Image 2026-11-23 at 19.23.05 (1).jpeg",
      "news/news 3/WhatsApp Image 2026-11-23 at 19.23.05.jpeg",
      "news/news 3/WhatsApp Image 2026-11-23 at 19.23.06 (1).jpeg",
      "news/news 3/WhatsApp Image 2026-11-23 at 19.23.06.jpeg",
      "news/news 3/WhatsApp Image 2026-11-23 at 19.23.07.jpeg"
    ],
    "excerpt": "NSBM Green University conducted a Continuing Professional Development (CPD) session on embedding entrepreneurial thinking across curricula, facilitated by Dr. Adam Scott of Victoria University, Australia.",
    "content": "NSBM Green University conducted a Continuing Professional Development (CPD) session titled \"Embedding Entrepreneurship Across the Curriculum: Practical Strategies for Teaching and Learning,\" bringing together academic staff from all faculties to explore ways of integrating entrepreneurial thinking and practices into teaching and learning across disciplines.\n\nThe session was facilitated by Dr Adam Scott of Victoria University, Australia, who shared research-based insights and practical approaches drawn from nine instructional design principles developed in collaboration with Dr Nilusha Gallage, Lecturer and Coordinator – Undergraduate Courses at Victoria University.\n\nThe discussions covered three key areas of curriculum design: content, teaching and assessment. Participants explored strategies for scaffolding learning materials to accommodate different levels of student readiness, using Generative AI to present complex theories through visual formats, and connecting academic concepts with real-world applications.\n\nIn relation to teaching approaches, the session highlighted the importance of balancing the use of Generative AI with interactive and discussion-based learning. Practical strategies included AI critique activities to strengthen students’ critical thinking, as well as collaborative team projects that encourage creativity, problem-solving and teamwork.\n\nThe assessment component focused on designing authentic learning experiences that reflect real-world entrepreneurial practices, including venture pitches and reflective portfolios. The session was organised by the Young Entrepreneurship Circle in collaboration with the Department of Management and Staff Development Center as part of Global Entrepreneurship Week 2026.",
    "date": "Nov 18, 2026",
    "publishedDate": "Nov 18, 2026"
  },
  {
    "id": 4,
    "title": "Economics and Decision Sciences Students Host ECONOMICA 2026 and Launch NEXsurge",
    "category": "Events",
    "categorySlug": "events",
    "author": "Students’ Circle of Economics (SCEDS)",
    "authorRole": "Faculty of Business Syndicate",
    "readTime": "6 min read",
    "views": 1620,
    "featured": true,
    "image": "news/news 4/WhatsApp Image 2026-11-23 at 19.25.33 (1).jpeg",
    "imageCaption": "Official launch of NEXsurge Magazine during ECONOMICA 2026 at NSBM Green University",
    "images": [
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.33 (1).jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.33.jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.34 (1).jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.34 (2).jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.34.jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.35 (1).jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.35 (2).jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.35.jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.36.jpeg"
    ],
    "excerpt": "SCEDS at the Faculty of Business successfully hosted ECONOMICA 2026 under the theme \"Harnessing Sri Lanka’s Economic Resources\" alongside the official launch of NEXsurge magazine.",
    "content": "The Students’ Circle of Economics and Decision Sciences (SCEDS) of the Faculty of Business at NSBM Green University successfully hosted ECONOMICA 2026, its flagship academic initiative, under the theme \"Harnessing Sri Lanka’s Economic Resources.\" The event brought together young economic thinkers, academics, and distinguished industry experts to explore sustainable national development.\n\nA key highlight was the official launch of NEXsurge, a magazine featuring thought-provoking articles and fresh perspectives on harnessing Sri Lanka’s economic resources for sustainable development. The publication provides a platform for sharing knowledge, encouraging critical thinking, and highlighting the perspectives of emerging economic thinkers.\n\nThe event recognised outstanding contributions through competitions: Sanithi Jayasinghe (University of Sri Jayewardenepura) was named Inter-University Winner, while Pramodi De Silva (NSBM Green University) secured the Intra-University Winner title. Competition entries were evaluated by senior academics from the University of Kelaniya, University of Colombo, and Staffordshire University, UK.\n\nA panel discussion titled \"From Potential to Progress: Harnessing Sri Lanka’s Resources for Sustainable Economic Growth\" featured Dr. Nisha Arunatilake (Director of Research, IPS), Ms. Arani Rodrigo (Chief Economist, Ceylon Chamber of Commerce), and Prof. Janaka Fernando (USJ). ECONOMICA 2026 reflected SCEDS’s commitment to fostering economic awareness and nurturing young talent.",
    "date": "Nov 14, 2026",
    "publishedDate": "Nov 14, 2026"
  },
  {
    "id": 5,
    "title": "NSBM Psychology Undergraduates Exhibit Developmental Theories Creatively",
    "category": "Academic",
    "categorySlug": "academic",
    "author": "Psychology Student Association",
    "authorRole": "Faculty of Science Bureau",
    "readTime": "4 min read",
    "views": 1190,
    "featured": false,
    "image": "news/news 5/WhatsApp Image 2026-11-23 at 19.27.43.jpeg",
    "imageCaption": "BSc (Hons) Psychology undergraduates showcasing creative developmental exhibits at NSBM",
    "images": [
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.43.jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.44 (1).jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.44 (2).jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.44.jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.45 (1).jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.45 (2).jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.45.jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.46 (1).jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.46.jpeg"
    ],
    "excerpt": "Undergraduates of the 26.2 BSc (Hons) Psychology programme following the University of Plymouth degree pathway showcased learning through innovative Exhibit Presentations analyzing human development in films.",
    "content": "Undergraduates of the 26.2 BSc (Hons) Psychology programme, following the University of Plymouth degree pathway at NSBM Green University, recently showcased their learning through a series of creative and insightful Exhibit Presentations.\n\nAs part of their academic activities, students explored the application of developmental psychology theories by examining how different aspects of human development are portrayed in films. Through this exercise, they connected theoretical concepts with real-world representations, critically evaluating how developmental theories are reflected in characters, behaviours and life experiences on screen.\n\nMoving beyond conventional classroom learning, the activity provided students with an opportunity to demonstrate their understanding through creative exhibits while strengthening their critical thinking, analytical, teamwork and presentation skills. It also encouraged them to communicate complex psychological concepts in engaging and accessible ways.\n\nThrough their thoughtful analyses and creative presentations, the students demonstrated how academic knowledge can be translated into practical understanding. The initiative reflects NSBM’s commitment to providing an engaging and experiential learning environment that prepares future psychology professionals to apply their knowledge beyond the classroom.",
    "date": "Nov 15, 2026",
    "publishedDate": "Nov 15, 2026"
  },
  {
    "id": 6,
    "title": "NSBM Strengthens International Academic Ties with St. Joseph's College, India",
    "category": "Academic",
    "categorySlug": "academic",
    "author": "International Relations Office",
    "authorRole": "Global Academic Partnerships Desk",
    "readTime": "3 min read",
    "views": 950,
    "featured": false,
    "image": "news/news 6/WhatsApp Image 2026-11-23 at 19.29.11 (1).jpeg",
    "imageCaption": "MoU signing between NSBM Green University and St. Joseph's College (Autonomous), India facilitated by CIMA Sri Lanka",
    "images": [
      "news/news 6/WhatsApp Image 2026-11-23 at 19.29.11 (1).jpeg",
      "news/news 6/WhatsApp Image 2026-11-23 at 19.29.11 (2).jpeg",
      "news/news 6/WhatsApp Image 2026-11-23 at 19.29.11.jpeg",
      "news/news 6/WhatsApp Image 2026-11-23 at 19.29.12 (1).jpeg",
      "news/news 6/WhatsApp Image 2026-11-23 at 19.29.12.jpeg"
    ],
    "excerpt": "NSBM Green University has expanded its international academic network by signing an MoU with St. Joseph’s College (Autonomous), Tiruchirappalli, India, facilitated by CIMA Sri Lanka.",
    "content": "NSBM Green University has further expanded its international academic network through the signing of a Memorandum of Understanding (MoU) with St. Joseph’s College (Autonomous), Tiruchirappalli, Tamil Nadu, India.\n\nInitiated with the facilitation of CIMA Sri Lanka, this partnership marks another step in NSBM’s continued efforts to build meaningful global connections, foster academic collaboration, and expand its international engagement.\n\nThe occasion was attended by Mr. Sivasubramaniam Vithushan, Lead Manager – Business Development & Stakeholder Relationships; Mr. Tharindu Wijewardana, Country Head – Sri Lanka; and Dr. A. John Peter, Director, St. Joseph’s International, St. Joseph’s College, Tiruchirappalli, Tamil Nadu, India.\n\nThrough this partnership, NSBM continues to expand its international connections and pursue opportunities for meaningful engagement, joint student initiatives, and faculty research exchanges with leading higher education institutions across the South Asian region.",
    "date": "Nov 12, 2026",
    "publishedDate": "Nov 12, 2026"
  },
  {
    "id": 7,
    "title": "NSBM Hosts Dr. Hans Wijayasuriya for Sri Lanka's Digital Future Session",
    "category": "Computing & AI",
    "categorySlug": "computing",
    "author": "Faculty of Computing Press Syndicate",
    "authorRole": "Technology & Digital Economy Desk",
    "readTime": "5 min read",
    "views": 2450,
    "featured": true,
    "image": "news/news 7/WhatsApp Image 2026-11-23 at 19.36.12.jpeg",
    "imageCaption": "Dr. Hans Wijayasuriya delivering the keynote address on Sri Lanka's Digital Transformation at NSBM Green University",
    "images": [
      "news/news 7/WhatsApp Image 2026-11-23 at 19.36.12.jpeg"
    ],
    "excerpt": "NSBM welcomed Dr. Hans Wijayasuriya, Chief Advisor to the President on the Digital Economy and Chairman of GovTech and ICTA, for an insightful session on Sri Lanka's digital economy.",
    "content": "NSBM Green University welcomed Dr. Hans Wijayasuriya, Chief Advisor to the President on the Digital Economy and Chairman of GovTech and the ICT Agency of Sri Lanka, for an insightful session with its students and academic staff on the future of Sri Lanka’s digital economy.\n\nThe session explored the opportunities and challenges shaping the country’s digital transformation, highlighting the growing importance of digital literacy, technological adaptability and the development of skills and competencies required to thrive in an increasingly digital world. The discussion provided students with valuable perspectives on emerging developments in the digital economy and the role of the next generation in supporting the country’s digital advancement.\n\nDuring his visit, Dr. Wijayasuriya also met with Senior Deputy Vice Chancellor Prof. Chaminda Rathnayake and the University’s senior management. The meeting provided an opportunity to exchange perspectives on the evolving role of higher education in supporting national development and preparing future-ready graduates equipped to respond to the changing demands of the digital economy.\n\nThe engagement reinforced the importance of strengthening connections between academia and the evolving digital landscape, ensuring that higher education remains responsive to emerging industry needs, AI governance, and technological developments.",
    "date": "Nov 10, 2026",
    "publishedDate": "Nov 10, 2026"
  },
  {
    "id": 8,
    "title": "NSBM Delegation Represents Sri Lanka at 88th SAARC CCI Executive Meeting in Maldives",
    "category": "General",
    "categorySlug": "general",
    "author": "Executive Directorate Press",
    "authorRole": "Diplomatic & Regional Affairs Bureau",
    "readTime": "4 min read",
    "views": 1180,
    "featured": false,
    "image": "news/news 8/WhatsApp Image 2026-11-23 at 22.47.35 (1).jpeg",
    "imageCaption": "Vice-Chancellor Prof. E. A. Weerasinghe leading the NSBM delegation at the 88th SAARC CCI Meeting in Maldives",
    "images": [
      "news/news 8/WhatsApp Image 2026-11-23 at 22.47.35 (1).jpeg",
      "news/news 8/WhatsApp Image 2026-11-23 at 22.47.35.jpeg",
      "news/news 8/WhatsApp Image 2026-11-23 at 22.47.36 (1).jpeg",
      "news/news 8/WhatsApp Image 2026-11-23 at 22.47.36.jpeg"
    ],
    "excerpt": "NSBM Green University proudly represented Sri Lanka at the 88th Executive Committee Meeting of the SAARC Chamber of Commerce and Industry (SAARC CCI) held in the Maldives.",
    "content": "NSBM Green University proudly represented Sri Lanka at the 88th Executive Committee Meeting of the SAARC Chamber of Commerce and Industry (SAARC CCI), held on 16 November 2026 in the Maldives. The meeting brought together representatives from across South Asia to discuss important matters related to regional economic cooperation, sustainable development and opportunities for strengthening partnerships among institutions and organisations in the region.\n\nThe NSBM delegation consisted of Vice-Chancellor Professor E. A. Weerasinghe, Senior Deputy Vice-Chancellor Professor Chaminda Rathnayake and Head of Administration Mr. Kapila Liyanage. Their participation provided an opportunity for NSBM to engage with regional representatives and contribute to discussions focused on improving cooperation, higher education integration, and building stronger connections across South Asian countries.\n\nNSBM's involvement in this prestigious international summit reflects the university's ongoing commitment to expanding its global presence and strengthening Sri Lanka's position as an emerging higher education hub in South Asia.",
    "date": "Nov 16, 2026",
    "publishedDate": "Nov 16, 2026"
  },
  {
    "id": 9,
    "title": "NSBM Celebrates Nursing Pledge Ceremony 2026 for Undergraduates",
    "category": "Events",
    "categorySlug": "events",
    "author": "Department of Life Sciences",
    "authorRole": "Healthcare & Science Desk",
    "readTime": "5 min read",
    "views": 1890,
    "featured": true,
    "image": "news/news 9/WhatsApp Image 2026-11-23 at 22.47.37 (1).jpeg",
    "imageCaption": "Undergraduate nurses receiving ceremonial caps and lighting traditional lamps at the NSBM Nursing Pledge Ceremony 2026",
    "images": [
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.37 (1).jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.37.jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.38.jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.39 (1).jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.39 (2).jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.39.jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.40 (1).jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.40.jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.41.jpeg"
    ],
    "excerpt": "NSBM Green University celebrated the Nursing Pledge Ceremony 2026 for batches 25.2 and 25.3, marking a sacred milestone in the healthcare journeys of nursing undergraduates.",
    "content": "NSBM Green University proudly celebrated the Nursing Pledge Ceremony 2026 on 11 November 2026, marking a significant milestone in the academic and professional journeys of students from the 25.2 and 25.3 Nursing batches. The ceremony provided an opportunity for nursing undergraduates to formally express their commitment to the nursing profession and its responsibilities towards individuals, families and communities.\n\nThe event was honoured by the presence of Mrs. H. M. C. M. Herath, Former Chief Nursing Officer and Lecturer in Nursing at the Faculty of Nursing, University of Colombo, who attended as Chief Guest. The ceremony was also attended by distinguished university leaders, including Vice-Chancellor Prof. E. A. Weerasinghe, Senior Deputy Vice-Chancellor Prof. Chaminda Rathnayake, Deputy Vice-Chancellor Prof. Thilini de Silva, and Dr. Nuwanthi Katuwavila, Dean of the Faculty of Science.\n\nThe ceremony welcomed distinguished healthcare leaders from Sri Jayewardenepura General Hospital, Durdans Hospital, and Shanthi Nivasa.\n\nA central highlight was the ceremonial presentation of nursing caps and the lighting of traditional three-wick oil lamps, symbolising the wisdom, compassion and dedication essential to professional healthcare. The university extends its heartfelt blessings to all inducted nursing scholars.",
    "date": "Nov 11, 2026",
    "publishedDate": "Nov 11, 2026"
  },
  {
    "id": 10,
    "title": "NSBM and Southern Cross University Australia Sign MoU for Dual Degree Programme",
    "category": "Academic",
    "categorySlug": "academic",
    "author": "Global Academic Bureau",
    "authorRole": "Senior University Press",
    "readTime": "5 min read",
    "views": 1950,
    "featured": true,
    "image": "news/news 10/WhatsApp Image 2026-11-23 at 23.13.12.jpeg",
    "imageCaption": "Prof. Tyrone Carlin (Vice-Chancellor SCU) and Prof. E. A. Weerasinghe signing the Dual Degree MoU at NSBM",
    "images": [
      "news/news 10/WhatsApp Image 2026-11-23 at 23.13.12.jpeg",
      "news/news 10/WhatsApp Image 2026-11-23 at 23.13.13 (1).jpeg",
      "news/news 10/WhatsApp Image 2026-11-23 at 23.13.13 (2).jpeg",
      "news/news 10/WhatsApp Image 2026-11-23 at 23.13.13.jpeg"
    ],
    "excerpt": "NSBM Green University signed an MoU with Southern Cross University (SCU), Australia, introducing a groundbreaking double degree combining Bachelor of Business and Bachelor of Information Technology.",
    "content": "NSBM Green University has taken another important step towards expanding international higher education opportunities in Sri Lanka by signing a Memorandum of Understanding (MoU) with Southern Cross University (SCU), Australia. The agreement introduces a new double degree programme combining a Bachelor of Business and a Bachelor of Information Technology, which is expected to commence in 2027.\n\nThe agreement was formalised as part of NSBM Green University's 10th Anniversary Celebrations, marking a significant milestone in the longstanding academic partnership between the two universities. The MoU was signed by Professor Tyrone Carlin, Vice-Chancellor of Southern Cross University, and Professor E. A. Weerasinghe, Vice-Chancellor of NSBM Green University. Both institutions reaffirmed their shared commitment to providing internationally aligned education and preparing students for the changing demands of the global employment market.\n\nThe proposed double degree programme is designed to bring together two vital fields: business and information technology. In today's rapidly developing digital world, organisations increasingly require professionals who understand both business operations and technological solutions.\n\nBeyond the introduction of the double degree, the MoU represents the continued development of the relationship between NSBM and Southern Cross University, laying a robust foundation for joint research initiatives and student exchanges.",
    "date": "Oct 27, 2026",
    "publishedDate": "Oct 27, 2026"
  },
  {
    "id": 11,
    "title": "NSBM Green University Awarded Platinum Rating at Annual Green Building Awards 2026",
    "category": "Sustainability",
    "categorySlug": "sustainability",
    "author": "Green Task Force & Campus Architecture Bureau",
    "authorRole": "Eco-Sustainability Desk",
    "readTime": "5 min read",
    "views": 2800,
    "featured": true,
    "image": "news/news 11/WhatsApp Image 2026-11-23 at 23.22.05.jpeg",
    "imageCaption": "NSBM Phase II development awarded the highest Platinum Rating by the Green Building Council of Sri Lanka",
    "images": [
      "news/news 11/WhatsApp Image 2026-11-23 at 23.22.04.jpeg",
      "news/news 11/WhatsApp Image 2026-11-23 at 23.22.05.jpeg"
    ],
    "excerpt": "NSBM Green University achieves top environmental honours with the prestigious Platinum Rating for its Phase II development at the Annual Green Building Awards 2026.",
    "content": "NSBM Green University continues to set the benchmark for ecological campus design and sustainable higher education in South Asia, securing the prestigious Platinum Rating for its Phase II development at the Annual Green Building Awards 2026 organised by the Green Building Council of Sri Lanka (GBCSL).\n\nThe award honours NSBM's exemplary commitment to energy efficiency, sustainable water management, carbon emissions reduction, and green architectural design across its state-of-the-art campus premises in Pitipana, Homagama. The Phase II development integrates advanced solar microgrids, natural ventilation engineering, rainwater harvesting systems, and sustainable landscaping.\n\nVice-Chancellor Prof. E. A. Weerasinghe accepted the honour on behalf of the university, stating: 'Receiving the Platinum Rating from the Green Building Council of Sri Lanka reaffirms our founding philosophy as South Asia's first green university. We remain dedicated to providing future generations with a sustainable, inspiring learning environment.'\n\nThe certification cements NSBM's position as a regional pioneer in sustainable university infrastructure and environmental stewardship.",
    "date": "Nov 20, 2026",
    "publishedDate": "Nov 20, 2026"
  }
];

  // Seed Submissions for Admin Editorial Queue
  const DEFAULT_SUBMISSIONS = [
    {
      id: 'sub-101',
      title: 'Development of Low-Power LoRa IoT Nodes for Campus Microclimate Monitoring',
      category: 'Academic',
      author: 'Ravindu Perera',
      studentId: 'NSBM-IT-23-4819',
      submittedDate: 'Nov 21, 2026',
      status: 'pending',
      readTime: '5 min read',
      excerpt: 'A prototype IoT sensor network developed by computing students that monitors microclimate parameters across NSBM landscaping.',
      content: `Our computing second-year engineering team has deployed field trials for low-power LoRa mesh nodes designed to track soil moisture and ambient temperatures across university grounds. Telemetry is uploaded wirelessly to the campus sustainability dashboard.`,
      feedback: ''
    },
    {
      id: 'sub-102',
      title: 'NSBM Robotics Club Showcases Autonomous Search and Rescue Drones at TechEx',
      category: 'Computing & AI',
      author: 'Minoli Weerakkody',
      studentId: 'NSBM-BM-22-1904',
      submittedDate: 'Nov 20, 2026',
      status: 'pending',
      readTime: '4 min read',
      excerpt: 'Student robotics engineers demo edge-vision drones capable of mapping confined indoor disaster zones.',
      content: `The NSBM Robotics Guild demonstrated its search and rescue quadcopter platform at TechEx 2026, featuring onboard computer vision and collision avoidance systems running on edge neural compute sticks.`,
      feedback: ''
    },
    {
      id: 'sub-103',
      title: 'Student Senate Adopts Green Campus Single-Use Plastic Elimination Policy',
      category: 'Sustainability',
      author: 'Hiran Jayasundara',
      studentId: 'NSBM-LAW-24-0312',
      submittedDate: 'Nov 18, 2026',
      status: 'approved',
      readTime: '3 min read',
      excerpt: 'New legislative framework requires all dining providers on campus to adopt biodegradable packaging by January 2027.',
      content: `In a historic vote, the Student Senate unanimously ratified the Green Dining Compact 2026. Under this agreement, all campus eateries will phase out single-use plastic cutlery and cups, replacing them with areca-nut leaf plates and paper straws produced by regional cottage industries.`,
      feedback: 'Approved by Chief Editor. Published to campus newsfeed.'
    }
  ];

  // Seed Comments
  const DEFAULT_COMMENTS = [
    {
      id: 'cmt-1',
      articleId: 1,
      author: 'Danushka Silva',
      role: 'Civil Engineering Undergrad',
      date: 'Oct 26, 2026, 11:30 AM',
      text: 'The new structural testing facilities and concrete tech labs in the Rs. 720M complex are world class!',
      status: 'approved'
    },
    {
      id: 'cmt-2',
      articleId: 7,
      author: 'Dr. Priyantha Kumar',
      role: 'Chief Editor',
      date: 'Nov 10, 2026, 02:45 PM',
      text: 'Dr. Hans Wijayasuriya\'s insights on digital public infrastructure and AI governance provide an essential roadmap for our computing undergraduates.',
      status: 'approved'
    },
    {
      id: 'cmt-3',
      articleId: 11,
      author: 'Student Contributor',
      role: 'Student Reporter',
      date: 'Nov 20, 2026, 04:15 PM',
      text: 'Receiving the Platinum Rating from the Green Building Council is a proud achievement for every student and staff member at NSBM!',
      status: 'approved'
    }
  ];

  // Seed Community Social Posts
  const DEFAULT_SOCIAL_POSTS = [
  {
    "id": "post-seed-1",
    "articleId": 1,
    "isOfficialArticle": true,
    "author": "Prof. E. A. Weerasinghe & Media Bureau",
    "role": "University Infrastructure Bureau",
    "faculty": "Academic Faculty",
    "date": "Oct 26, 2026",
    "category": "Academic",
    "categorySlug": "academic",
    "title": "NSBM Opens Rs. 720 Million Civil Engineering Laboratory Complex",
    "excerpt": "NSBM Green University ceremonially opened its state-of-the-art Civil Engineering Laboratory Complex, representing a significant Rs. 720 million self-financed investment in engineering education as part of its 10th anniversary celebrations.",
    "content": "NSBM Green University ceremonially opened its state-of-the-art Civil Engineering Laboratory Complex, representing a significant Rs. 720 million self-financed investment in engineering education as part of its 10th anniversary celebrations.\n\nNSBM Green University ceremonially opened its state-of-the-art Civil Engineering Laboratory Complex, representing a significant Rs. 720 million self-financed investment in engineering education, on 26 October 2026 as part of its 10th anniversary celebrations.\n\nLocated within the university’s Phase II development at Pitipana, Homagama, the new complex marks an important milestone in NSBM’s continued investment in modern academic infrastructure and practical engineering education. Equipped with modern infrastructure, high-tech laboratories and advanced learning facilities, the complex is designed to strengthen students’ practical learning experiences and support the development of industry-relevant engineering skills.\n\nThe complex was ceremonially declared open by the Attorney General of Sri Lanka, Hon. K. A. Parinda Ranasinghe Jr., PC, in the distinguished presence of NSBM Founder and Vice-Chancellor Prof. E. A. Weerasinghe; Prof. Richard Davies, Vice-Chancellor and CEO of the University of Plymouth, United Kingdom; Prof. Tyrone Carlin, Vice-Chancellor and President of Southern Cross University, Australia; and Prof. Li Lu, Vice-Chancellor and President of Zhejiang Shuren University, China.\n\nThe Rs. 720 million investment reflects NSBM’s commitment to providing students with an academic environment that connects theoretical knowledge with practical application. By strengthening its engineering facilities, the university aims to equip future engineers with the technical knowledge, practical experience and competencies required to meet the evolving demands of the profession.\n\nThe opening of the complex also forms part of NSBM’s broader campus expansion programme, which seeks to enhance its academic capabilities and create opportunities for future-focused education across multiple disciplines.\n\nAs NSBM marks a decade of excellence and national impact, the new Civil Engineering Laboratory Complex stands as a testament to its continued investment in education, infrastructure and the next generation of engineering professionals.",
    "image": "news/news 1/news 1.jpeg",
    "imageCaption": "Ceremonial opening of the Rs. 720M Civil Engineering Laboratory Complex by Attorney General Hon. K. A. Parinda Ranasinghe Jr.",
    "images": [
      "news/news 1/news 1.jpeg"
    ],
    "likesCount": 0,
    "isLiked": false,
    "commentsCount": 0,
    "comments": [],
    "sharesCount": 0,
    "readTime": "5 min read",
    "tags": [
      "#NSBM",
      "#Academic",
      "#CampusNews"
    ]
  },
  {
    "id": "post-seed-2",
    "articleId": 2,
    "isOfficialArticle": true,
    "author": "Cultural & Inter-Faith Directorate",
    "role": "Campus Press Bureau",
    "faculty": "University Bureau",
    "date": "Oct 24, 2026",
    "category": "Events",
    "categorySlug": "events",
    "title": "NSBM Green University Marks 10th Anniversary with Multi-Religious Observances",
    "excerpt": "As part of its 10th anniversary celebrations, NSBM Green University organised a series of multi-religious observances from 21 to 24 October 2026, bringing together its university community to seek blessings.",
    "content": "As part of its 10th anniversary celebrations, NSBM Green University organised a series of multi-religious observances from 21 to 24 October 2026, bringing together its university community to seek blessings.\n\nAs part of its 10th anniversary celebrations, NSBM Green University organised a series of religious observances from 21 to 24 October 2026, bringing together members of its university community to seek blessings for the institution’s continued growth and success.\n\nReflecting NSBM’s respect for Sri Lanka’s diverse religious traditions, the observances provided an opportunity for staff and students to come together in prayer, thanksgiving and reflection, while celebrating a decade of achievements and looking towards the university’s future.\n\nThe series included religious programmes organised by the NSBM Buddhist Society, Hindu Society, Islamic Society, and Catholic and Christian Society, each reflecting the spiritual traditions and cultural heritage of their respective communities.\n\nThe Buddhist observances began with a Buddha Pooja organised by the NSBM Buddhist Society, invoking blessings for peace, prosperity and the university’s future journey. The programme also included an overnight Pirith Chanting Ceremony held on 23 October at the newly constructed NSBM Civil Engineering Laboratory premises, followed by the traditional Heel Dane (morning alms offering) to the venerable Maha Sangha.\n\nThe Hindu Society hosted Natham ’26, a celebration that commenced with sacred poojas seeking blessings for the university and its leadership. The event was attended by Vice-Chancellor Prof. E. A. Weerasinghe, Senior Deputy Vice-Chancellor Prof. Chaminda Rathnayake, members of the senior management team, deans and staff.\n\nThe NSBM Islamic Society organised a special cultural gathering featuring Qaseeda recitations, a keynote Bayan session delivered by Moulavi Nashik Farook Tanweeri, and traditional delicacies. Meanwhile, the NSBM Catholic and Christian Society organised a Holy Mass celebrated by Rev. Fr. Prasad Harshana and Rev. Fr. Teshan Priyadarshana.\n\nTogether, these religious observances formed a meaningful part of NSBM’s anniversary celebrations, recognising the diversity of faiths while uniting the community in fellowship.",
    "image": "news/news 2/WhatsApp Image 2026-11-23 at 18.54.33.jpeg",
    "imageCaption": "Overnight Pirith chanting ceremony and inter-faith observances marking NSBM 10th Anniversary",
    "images": [
      "news/news 2/WhatsApp Image 2026-11-23 at 18.54.33.jpeg",
      "news/news 2/WhatsApp Image 2026-11-23 at 18.54.34 (1).jpeg",
      "news/news 2/WhatsApp Image 2026-11-23 at 18.54.34 (2).jpeg",
      "news/news 2/WhatsApp Image 2026-11-23 at 18.54.34.jpeg"
    ],
    "likesCount": 0,
    "isLiked": false,
    "commentsCount": 0,
    "comments": [],
    "sharesCount": 0,
    "readTime": "6 min read",
    "tags": [
      "#NSBM",
      "#Events",
      "#CampusNews"
    ]
  },
  {
    "id": "post-seed-3",
    "articleId": 3,
    "isOfficialArticle": true,
    "author": "Staff Development & Quality Assurance Center",
    "role": "Curriculum Innovation Bureau",
    "faculty": "Academic Faculty",
    "date": "Nov 18, 2026",
    "category": "Academic",
    "categorySlug": "academic",
    "title": "NSBM Academic Staff Empowered to Embed Entrepreneurship Across the Curriculum",
    "excerpt": "NSBM Green University conducted a Continuing Professional Development (CPD) session on embedding entrepreneurial thinking across curricula, facilitated by Dr. Adam Scott of Victoria University, Australia.",
    "content": "NSBM Green University conducted a Continuing Professional Development (CPD) session on embedding entrepreneurial thinking across curricula, facilitated by Dr. Adam Scott of Victoria University, Australia.\n\nNSBM Green University conducted a Continuing Professional Development (CPD) session titled \"Embedding Entrepreneurship Across the Curriculum: Practical Strategies for Teaching and Learning,\" bringing together academic staff from all faculties to explore ways of integrating entrepreneurial thinking and practices into teaching and learning across disciplines.\n\nThe session was facilitated by Dr Adam Scott of Victoria University, Australia, who shared research-based insights and practical approaches drawn from nine instructional design principles developed in collaboration with Dr Nilusha Gallage, Lecturer and Coordinator – Undergraduate Courses at Victoria University.\n\nThe discussions covered three key areas of curriculum design: content, teaching and assessment. Participants explored strategies for scaffolding learning materials to accommodate different levels of student readiness, using Generative AI to present complex theories through visual formats, and connecting academic concepts with real-world applications.\n\nIn relation to teaching approaches, the session highlighted the importance of balancing the use of Generative AI with interactive and discussion-based learning. Practical strategies included AI critique activities to strengthen students’ critical thinking, as well as collaborative team projects that encourage creativity, problem-solving and teamwork.\n\nThe assessment component focused on designing authentic learning experiences that reflect real-world entrepreneurial practices, including venture pitches and reflective portfolios. The session was organised by the Young Entrepreneurship Circle in collaboration with the Department of Management and Staff Development Center as part of Global Entrepreneurship Week 2026.",
    "image": "news/news 3/WhatsApp Image 2026-11-23 at 19.23.05 (1).jpeg",
    "imageCaption": "Dr. Adam Scott of Victoria University Australia facilitating the CPD entrepreneurship session for NSBM academic staff",
    "images": [
      "news/news 3/WhatsApp Image 2026-11-23 at 19.23.05 (1).jpeg",
      "news/news 3/WhatsApp Image 2026-11-23 at 19.23.05.jpeg",
      "news/news 3/WhatsApp Image 2026-11-23 at 19.23.06 (1).jpeg",
      "news/news 3/WhatsApp Image 2026-11-23 at 19.23.06.jpeg",
      "news/news 3/WhatsApp Image 2026-11-23 at 19.23.07.jpeg"
    ],
    "likesCount": 0,
    "isLiked": false,
    "commentsCount": 0,
    "comments": [],
    "sharesCount": 0,
    "readTime": "5 min read",
    "tags": [
      "#NSBM",
      "#Academic",
      "#CampusNews"
    ]
  },
  {
    "id": "post-seed-4",
    "articleId": 4,
    "isOfficialArticle": true,
    "author": "Students’ Circle of Economics (SCEDS)",
    "role": "Faculty of Business Syndicate",
    "faculty": "University Bureau",
    "date": "Nov 14, 2026",
    "category": "Events",
    "categorySlug": "events",
    "title": "Economics and Decision Sciences Students Host ECONOMICA 2026 and Launch NEXsurge",
    "excerpt": "SCEDS at the Faculty of Business successfully hosted ECONOMICA 2026 under the theme \"Harnessing Sri Lanka’s Economic Resources\" alongside the official launch of NEXsurge magazine.",
    "content": "SCEDS at the Faculty of Business successfully hosted ECONOMICA 2026 under the theme \"Harnessing Sri Lanka’s Economic Resources\" alongside the official launch of NEXsurge magazine.\n\nThe Students’ Circle of Economics and Decision Sciences (SCEDS) of the Faculty of Business at NSBM Green University successfully hosted ECONOMICA 2026, its flagship academic initiative, under the theme \"Harnessing Sri Lanka’s Economic Resources.\" The event brought together young economic thinkers, academics, and distinguished industry experts to explore sustainable national development.\n\nA key highlight was the official launch of NEXsurge, a magazine featuring thought-provoking articles and fresh perspectives on harnessing Sri Lanka’s economic resources for sustainable development. The publication provides a platform for sharing knowledge, encouraging critical thinking, and highlighting the perspectives of emerging economic thinkers.\n\nThe event recognised outstanding contributions through competitions: Sanithi Jayasinghe (University of Sri Jayewardenepura) was named Inter-University Winner, while Pramodi De Silva (NSBM Green University) secured the Intra-University Winner title. Competition entries were evaluated by senior academics from the University of Kelaniya, University of Colombo, and Staffordshire University, UK.\n\nA panel discussion titled \"From Potential to Progress: Harnessing Sri Lanka’s Resources for Sustainable Economic Growth\" featured Dr. Nisha Arunatilake (Director of Research, IPS), Ms. Arani Rodrigo (Chief Economist, Ceylon Chamber of Commerce), and Prof. Janaka Fernando (USJ). ECONOMICA 2026 reflected SCEDS’s commitment to fostering economic awareness and nurturing young talent.",
    "image": "news/news 4/WhatsApp Image 2026-11-23 at 19.25.33 (1).jpeg",
    "imageCaption": "Official launch of NEXsurge Magazine during ECONOMICA 2026 at NSBM Green University",
    "images": [
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.33 (1).jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.33.jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.34 (1).jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.34 (2).jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.34.jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.35 (1).jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.35 (2).jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.35.jpeg",
      "news/news 4/WhatsApp Image 2026-11-23 at 19.25.36.jpeg"
    ],
    "likesCount": 0,
    "isLiked": false,
    "commentsCount": 0,
    "comments": [],
    "sharesCount": 0,
    "readTime": "6 min read",
    "tags": [
      "#NSBM",
      "#Events",
      "#CampusNews"
    ]
  },
  {
    "id": "post-seed-5",
    "articleId": 5,
    "isOfficialArticle": true,
    "author": "Psychology Student Association",
    "role": "Faculty of Science Bureau",
    "faculty": "Academic Faculty",
    "date": "Nov 15, 2026",
    "category": "Academic",
    "categorySlug": "academic",
    "title": "NSBM Psychology Undergraduates Exhibit Developmental Theories Creatively",
    "excerpt": "Undergraduates of the 26.2 BSc (Hons) Psychology programme following the University of Plymouth degree pathway showcased learning through innovative Exhibit Presentations analyzing human development in films.",
    "content": "Undergraduates of the 26.2 BSc (Hons) Psychology programme following the University of Plymouth degree pathway showcased learning through innovative Exhibit Presentations analyzing human development in films.\n\nUndergraduates of the 26.2 BSc (Hons) Psychology programme, following the University of Plymouth degree pathway at NSBM Green University, recently showcased their learning through a series of creative and insightful Exhibit Presentations.\n\nAs part of their academic activities, students explored the application of developmental psychology theories by examining how different aspects of human development are portrayed in films. Through this exercise, they connected theoretical concepts with real-world representations, critically evaluating how developmental theories are reflected in characters, behaviours and life experiences on screen.\n\nMoving beyond conventional classroom learning, the activity provided students with an opportunity to demonstrate their understanding through creative exhibits while strengthening their critical thinking, analytical, teamwork and presentation skills. It also encouraged them to communicate complex psychological concepts in engaging and accessible ways.\n\nThrough their thoughtful analyses and creative presentations, the students demonstrated how academic knowledge can be translated into practical understanding. The initiative reflects NSBM’s commitment to providing an engaging and experiential learning environment that prepares future psychology professionals to apply their knowledge beyond the classroom.",
    "image": "news/news 5/WhatsApp Image 2026-11-23 at 19.27.43.jpeg",
    "imageCaption": "BSc (Hons) Psychology undergraduates showcasing creative developmental exhibits at NSBM",
    "images": [
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.43.jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.44 (1).jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.44 (2).jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.44.jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.45 (1).jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.45 (2).jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.45.jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.46 (1).jpeg",
      "news/news 5/WhatsApp Image 2026-11-23 at 19.27.46.jpeg"
    ],
    "likesCount": 0,
    "isLiked": false,
    "commentsCount": 0,
    "comments": [],
    "sharesCount": 0,
    "readTime": "4 min read",
    "tags": [
      "#NSBM",
      "#Academic",
      "#CampusNews"
    ]
  },
  {
    "id": "post-seed-6",
    "articleId": 6,
    "isOfficialArticle": true,
    "author": "International Relations Office",
    "role": "Global Academic Partnerships Desk",
    "faculty": "Academic Faculty",
    "date": "Nov 12, 2026",
    "category": "Academic",
    "categorySlug": "academic",
    "title": "NSBM Strengthens International Academic Ties with St. Joseph's College, India",
    "excerpt": "NSBM Green University has expanded its international academic network by signing an MoU with St. Joseph’s College (Autonomous), Tiruchirappalli, India, facilitated by CIMA Sri Lanka.",
    "content": "NSBM Green University has expanded its international academic network by signing an MoU with St. Joseph’s College (Autonomous), Tiruchirappalli, India, facilitated by CIMA Sri Lanka.\n\nNSBM Green University has further expanded its international academic network through the signing of a Memorandum of Understanding (MoU) with St. Joseph’s College (Autonomous), Tiruchirappalli, Tamil Nadu, India.\n\nInitiated with the facilitation of CIMA Sri Lanka, this partnership marks another step in NSBM’s continued efforts to build meaningful global connections, foster academic collaboration, and expand its international engagement.\n\nThe occasion was attended by Mr. Sivasubramaniam Vithushan, Lead Manager – Business Development & Stakeholder Relationships; Mr. Tharindu Wijewardana, Country Head – Sri Lanka; and Dr. A. John Peter, Director, St. Joseph’s International, St. Joseph’s College, Tiruchirappalli, Tamil Nadu, India.\n\nThrough this partnership, NSBM continues to expand its international connections and pursue opportunities for meaningful engagement, joint student initiatives, and faculty research exchanges with leading higher education institutions across the South Asian region.",
    "image": "news/news 6/WhatsApp Image 2026-11-23 at 19.29.11 (1).jpeg",
    "imageCaption": "MoU signing between NSBM Green University and St. Joseph's College (Autonomous), India facilitated by CIMA Sri Lanka",
    "images": [
      "news/news 6/WhatsApp Image 2026-11-23 at 19.29.11 (1).jpeg",
      "news/news 6/WhatsApp Image 2026-11-23 at 19.29.11 (2).jpeg",
      "news/news 6/WhatsApp Image 2026-11-23 at 19.29.11.jpeg",
      "news/news 6/WhatsApp Image 2026-11-23 at 19.29.12 (1).jpeg",
      "news/news 6/WhatsApp Image 2026-11-23 at 19.29.12.jpeg"
    ],
    "likesCount": 0,
    "isLiked": false,
    "commentsCount": 0,
    "comments": [],
    "sharesCount": 0,
    "readTime": "3 min read",
    "tags": [
      "#NSBM",
      "#Academic",
      "#CampusNews"
    ]
  },
  {
    "id": "post-seed-7",
    "articleId": 7,
    "isOfficialArticle": true,
    "author": "Faculty of Computing Press Syndicate",
    "role": "Technology & Digital Economy Desk",
    "faculty": "Faculty of Computing",
    "date": "Nov 10, 2026",
    "category": "Computing & AI",
    "categorySlug": "computing",
    "title": "NSBM Hosts Dr. Hans Wijayasuriya for Sri Lanka's Digital Future Session",
    "excerpt": "NSBM welcomed Dr. Hans Wijayasuriya, Chief Advisor to the President on the Digital Economy and Chairman of GovTech and ICTA, for an insightful session on Sri Lanka's digital economy.",
    "content": "NSBM welcomed Dr. Hans Wijayasuriya, Chief Advisor to the President on the Digital Economy and Chairman of GovTech and ICTA, for an insightful session on Sri Lanka's digital economy.\n\nNSBM Green University welcomed Dr. Hans Wijayasuriya, Chief Advisor to the President on the Digital Economy and Chairman of GovTech and the ICT Agency of Sri Lanka, for an insightful session with its students and academic staff on the future of Sri Lanka’s digital economy.\n\nThe session explored the opportunities and challenges shaping the country’s digital transformation, highlighting the growing importance of digital literacy, technological adaptability and the development of skills and competencies required to thrive in an increasingly digital world. The discussion provided students with valuable perspectives on emerging developments in the digital economy and the role of the next generation in supporting the country’s digital advancement.\n\nDuring his visit, Dr. Wijayasuriya also met with Senior Deputy Vice Chancellor Prof. Chaminda Rathnayake and the University’s senior management. The meeting provided an opportunity to exchange perspectives on the evolving role of higher education in supporting national development and preparing future-ready graduates equipped to respond to the changing demands of the digital economy.\n\nThe engagement reinforced the importance of strengthening connections between academia and the evolving digital landscape, ensuring that higher education remains responsive to emerging industry needs, AI governance, and technological developments.",
    "image": "news/news 7/WhatsApp Image 2026-11-23 at 19.36.12.jpeg",
    "imageCaption": "Dr. Hans Wijayasuriya delivering the keynote address on Sri Lanka's Digital Transformation at NSBM Green University",
    "images": [
      "news/news 7/WhatsApp Image 2026-11-23 at 19.36.12.jpeg"
    ],
    "likesCount": 0,
    "isLiked": false,
    "commentsCount": 0,
    "comments": [],
    "sharesCount": 0,
    "readTime": "5 min read",
    "tags": [
      "#NSBM",
      "#ComputingAI",
      "#CampusNews"
    ]
  },
  {
    "id": "post-seed-8",
    "articleId": 8,
    "isOfficialArticle": true,
    "author": "Executive Directorate Press",
    "role": "Diplomatic & Regional Affairs Bureau",
    "faculty": "University Bureau",
    "date": "Nov 16, 2026",
    "category": "General",
    "categorySlug": "general",
    "title": "NSBM Delegation Represents Sri Lanka at 88th SAARC CCI Executive Meeting in Maldives",
    "excerpt": "NSBM Green University proudly represented Sri Lanka at the 88th Executive Committee Meeting of the SAARC Chamber of Commerce and Industry (SAARC CCI) held in the Maldives.",
    "content": "NSBM Green University proudly represented Sri Lanka at the 88th Executive Committee Meeting of the SAARC Chamber of Commerce and Industry (SAARC CCI) held in the Maldives.\n\nNSBM Green University proudly represented Sri Lanka at the 88th Executive Committee Meeting of the SAARC Chamber of Commerce and Industry (SAARC CCI), held on 16 November 2026 in the Maldives. The meeting brought together representatives from across South Asia to discuss important matters related to regional economic cooperation, sustainable development and opportunities for strengthening partnerships among institutions and organisations in the region.\n\nThe NSBM delegation consisted of Vice-Chancellor Professor E. A. Weerasinghe, Senior Deputy Vice-Chancellor Professor Chaminda Rathnayake and Head of Administration Mr. Kapila Liyanage. Their participation provided an opportunity for NSBM to engage with regional representatives and contribute to discussions focused on improving cooperation, higher education integration, and building stronger connections across South Asian countries.\n\nNSBM's involvement in this prestigious international summit reflects the university's ongoing commitment to expanding its global presence and strengthening Sri Lanka's position as an emerging higher education hub in South Asia.",
    "image": "news/news 8/WhatsApp Image 2026-11-23 at 22.47.35 (1).jpeg",
    "imageCaption": "Vice-Chancellor Prof. E. A. Weerasinghe leading the NSBM delegation at the 88th SAARC CCI Meeting in Maldives",
    "images": [
      "news/news 8/WhatsApp Image 2026-11-23 at 22.47.35 (1).jpeg",
      "news/news 8/WhatsApp Image 2026-11-23 at 22.47.35.jpeg",
      "news/news 8/WhatsApp Image 2026-11-23 at 22.47.36 (1).jpeg",
      "news/news 8/WhatsApp Image 2026-11-23 at 22.47.36.jpeg"
    ],
    "likesCount": 0,
    "isLiked": false,
    "commentsCount": 0,
    "comments": [],
    "sharesCount": 0,
    "readTime": "4 min read",
    "tags": [
      "#NSBM",
      "#General",
      "#CampusNews"
    ]
  },
  {
    "id": "post-seed-9",
    "articleId": 9,
    "isOfficialArticle": true,
    "author": "Department of Life Sciences",
    "role": "Healthcare & Science Desk",
    "faculty": "University Bureau",
    "date": "Nov 11, 2026",
    "category": "Events",
    "categorySlug": "events",
    "title": "NSBM Celebrates Nursing Pledge Ceremony 2026 for Undergraduates",
    "excerpt": "NSBM Green University celebrated the Nursing Pledge Ceremony 2026 for batches 25.2 and 25.3, marking a sacred milestone in the healthcare journeys of nursing undergraduates.",
    "content": "NSBM Green University celebrated the Nursing Pledge Ceremony 2026 for batches 25.2 and 25.3, marking a sacred milestone in the healthcare journeys of nursing undergraduates.\n\nNSBM Green University proudly celebrated the Nursing Pledge Ceremony 2026 on 11 November 2026, marking a significant milestone in the academic and professional journeys of students from the 25.2 and 25.3 Nursing batches. The ceremony provided an opportunity for nursing undergraduates to formally express their commitment to the nursing profession and its responsibilities towards individuals, families and communities.\n\nThe event was honoured by the presence of Mrs. H. M. C. M. Herath, Former Chief Nursing Officer and Lecturer in Nursing at the Faculty of Nursing, University of Colombo, who attended as Chief Guest. The ceremony was also attended by distinguished university leaders, including Vice-Chancellor Prof. E. A. Weerasinghe, Senior Deputy Vice-Chancellor Prof. Chaminda Rathnayake, Deputy Vice-Chancellor Prof. Thilini de Silva, and Dr. Nuwanthi Katuwavila, Dean of the Faculty of Science.\n\nThe ceremony welcomed distinguished healthcare leaders from Sri Jayewardenepura General Hospital, Durdans Hospital, and Shanthi Nivasa.\n\nA central highlight was the ceremonial presentation of nursing caps and the lighting of traditional three-wick oil lamps, symbolising the wisdom, compassion and dedication essential to professional healthcare. The university extends its heartfelt blessings to all inducted nursing scholars.",
    "image": "news/news 9/WhatsApp Image 2026-11-23 at 22.47.37 (1).jpeg",
    "imageCaption": "Undergraduate nurses receiving ceremonial caps and lighting traditional lamps at the NSBM Nursing Pledge Ceremony 2026",
    "images": [
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.37 (1).jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.37.jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.38.jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.39 (1).jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.39 (2).jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.39.jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.40 (1).jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.40.jpeg",
      "news/news 9/WhatsApp Image 2026-11-23 at 22.47.41.jpeg"
    ],
    "likesCount": 0,
    "isLiked": false,
    "commentsCount": 0,
    "comments": [],
    "sharesCount": 0,
    "readTime": "5 min read",
    "tags": [
      "#NSBM",
      "#Events",
      "#CampusNews"
    ]
  },
  {
    "id": "post-seed-10",
    "articleId": 10,
    "isOfficialArticle": true,
    "author": "Global Academic Bureau",
    "role": "Senior University Press",
    "faculty": "Academic Faculty",
    "date": "Oct 27, 2026",
    "category": "Academic",
    "categorySlug": "academic",
    "title": "NSBM and Southern Cross University Australia Sign MoU for Dual Degree Programme",
    "excerpt": "NSBM Green University signed an MoU with Southern Cross University (SCU), Australia, introducing a groundbreaking double degree combining Bachelor of Business and Bachelor of Information Technology.",
    "content": "NSBM Green University signed an MoU with Southern Cross University (SCU), Australia, introducing a groundbreaking double degree combining Bachelor of Business and Bachelor of Information Technology.\n\nNSBM Green University has taken another important step towards expanding international higher education opportunities in Sri Lanka by signing a Memorandum of Understanding (MoU) with Southern Cross University (SCU), Australia. The agreement introduces a new double degree programme combining a Bachelor of Business and a Bachelor of Information Technology, which is expected to commence in 2027.\n\nThe agreement was formalised as part of NSBM Green University's 10th Anniversary Celebrations, marking a significant milestone in the longstanding academic partnership between the two universities. The MoU was signed by Professor Tyrone Carlin, Vice-Chancellor of Southern Cross University, and Professor E. A. Weerasinghe, Vice-Chancellor of NSBM Green University. Both institutions reaffirmed their shared commitment to providing internationally aligned education and preparing students for the changing demands of the global employment market.\n\nThe proposed double degree programme is designed to bring together two vital fields: business and information technology. In today's rapidly developing digital world, organisations increasingly require professionals who understand both business operations and technological solutions.\n\nBeyond the introduction of the double degree, the MoU represents the continued development of the relationship between NSBM and Southern Cross University, laying a robust foundation for joint research initiatives and student exchanges.",
    "image": "news/news 10/WhatsApp Image 2026-11-23 at 23.13.12.jpeg",
    "imageCaption": "Prof. Tyrone Carlin (Vice-Chancellor SCU) and Prof. E. A. Weerasinghe signing the Dual Degree MoU at NSBM",
    "images": [
      "news/news 10/WhatsApp Image 2026-11-23 at 23.13.12.jpeg",
      "news/news 10/WhatsApp Image 2026-11-23 at 23.13.13 (1).jpeg",
      "news/news 10/WhatsApp Image 2026-11-23 at 23.13.13 (2).jpeg",
      "news/news 10/WhatsApp Image 2026-11-23 at 23.13.13.jpeg"
    ],
    "likesCount": 0,
    "isLiked": false,
    "commentsCount": 0,
    "comments": [],
    "sharesCount": 0,
    "readTime": "5 min read",
    "tags": [
      "#NSBM",
      "#Academic",
      "#CampusNews"
    ]
  },
  {
    "id": "post-seed-11",
    "articleId": 11,
    "isOfficialArticle": true,
    "author": "Green Task Force & Campus Architecture Bureau",
    "role": "Eco-Sustainability Desk",
    "faculty": "Campus Architecture",
    "date": "Nov 20, 2026",
    "category": "Sustainability",
    "categorySlug": "sustainability",
    "title": "NSBM Green University Awarded Platinum Rating at Annual Green Building Awards 2026",
    "excerpt": "NSBM Green University achieves top environmental honours with the prestigious Platinum Rating for its Phase II development at the Annual Green Building Awards 2026.",
    "content": "NSBM Green University achieves top environmental honours with the prestigious Platinum Rating for its Phase II development at the Annual Green Building Awards 2026.\n\nNSBM Green University continues to set the benchmark for ecological campus design and sustainable higher education in South Asia, securing the prestigious Platinum Rating for its Phase II development at the Annual Green Building Awards 2026 organised by the Green Building Council of Sri Lanka (GBCSL).\n\nThe award honours NSBM's exemplary commitment to energy efficiency, sustainable water management, carbon emissions reduction, and green architectural design across its state-of-the-art campus premises in Pitipana, Homagama. The Phase II development integrates advanced solar microgrids, natural ventilation engineering, rainwater harvesting systems, and sustainable landscaping.\n\nVice-Chancellor Prof. E. A. Weerasinghe accepted the honour on behalf of the university, stating: 'Receiving the Platinum Rating from the Green Building Council of Sri Lanka reaffirms our founding philosophy as South Asia's first green university. We remain dedicated to providing future generations with a sustainable, inspiring learning environment.'\n\nThe certification cements NSBM's position as a regional pioneer in sustainable university infrastructure and environmental stewardship.",
    "image": "news/news 11/WhatsApp Image 2026-11-23 at 23.22.05.jpeg",
    "imageCaption": "NSBM Phase II development awarded the highest Platinum Rating by the Green Building Council of Sri Lanka",
    "images": [
      "news/news 11/WhatsApp Image 2026-11-23 at 23.22.04.jpeg",
      "news/news 11/WhatsApp Image 2026-11-23 at 23.22.05.jpeg"
    ],
    "likesCount": 0,
    "isLiked": false,
    "commentsCount": 0,
    "comments": [],
    "sharesCount": 0,
    "readTime": "5 min read",
    "tags": [
      "#NSBM",
      "#Sustainability",
      "#CampusNews"
    ]
  }
];

  // User Profiles (Authentic NSBM Credentials)
  const DEMO_USERS = {
    student: {
      name: 'NSBM Student Contributor',
      email: 'student@students.nsbm.ac.lk',
      role: 'student',
      studentId: 'NSBM-IT-24-9021',
      faculty: 'Faculty of Computing',
      title: 'Student Contributor'
    },
    admin: {
      name: 'NSBM Editorial Administrator',
      email: 'admin@nsbm.ac.lk',
      role: 'admin',
      adminId: 'NSBM-ADM-001',
      title: 'Chief Newsdesk Administrator'
    }
  };

  // DataStore Core Interface
  const DataStore = {
    init: function() {
      if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(DEFAULT_ARTICLES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(DEFAULT_SUBMISSIONS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(DEFAULT_COMMENTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([1, 3]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) {
        localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(['academic', 'computing']));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SOCIAL_POSTS)) {
        localStorage.setItem(STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(DEFAULT_SOCIAL_POSTS));
      }
    },

    // --- ARTICLES CRUD ---
    getArticles: function(filter) {
      this.init();
      let articles = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
      if (!filter) return articles;

      if (filter.category && filter.category !== 'all') {
        const catLower = filter.category.toLowerCase();
        articles = articles.filter(a => 
          (a.category && a.category.toLowerCase() === catLower) || 
          (a.categorySlug && a.categorySlug.toLowerCase() === catLower)
        );
      }

      if (filter.search) {
        const q = filter.search.toLowerCase();
        articles = articles.filter(a => 
          (a.title && a.title.toLowerCase().includes(q)) || 
          (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
          (a.author && a.author.toLowerCase().includes(q))
        );
      }

      if (filter.date) {
        const targetDate = new Date(filter.date);
        articles = articles.filter(a => {
          const artDate = new Date(a.date);
          return !isNaN(artDate) && artDate.toDateString() === targetDate.toDateString();
        });
      }

      if (filter.featuredOnly) {
        articles = articles.filter(a => a.featured);
      }

      return articles;
    },

    getArticleById: function(id) {
      const articles = this.getArticles();
      return articles.find(a => a.id === parseInt(id, 10));
    },

    createArticle: function(articleData) {
      this.init();
      const articles = this.getArticles();
      const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
      
      const newArticle = {
        id: newId,
        title: articleData.title || 'Untitled Dispatch',
        category: articleData.category || 'Academic',
        categorySlug: (articleData.category || 'academic').toLowerCase(),
        author: articleData.author || 'NSBM News Bureau',
        authorRole: articleData.authorRole || 'Editorial Desk',
        date: articleData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: articleData.readTime || '4 min read',
        views: articleData.views || 1,
        featured: Boolean(articleData.featured),
        image: articleData.image || '1im/ezgif-frame-001.jpg',
        imageCaption: articleData.imageCaption || 'NSBM Green University Campus Scene',
        excerpt: articleData.excerpt || (articleData.content ? articleData.content.substring(0, 160) + '...' : ''),
        content: articleData.content || ''
      };

      articles.unshift(newArticle);
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
      return newArticle;
    },

    updateArticle: function(id, updateData) {
      this.init();
      const articles = this.getArticles();
      const index = articles.findIndex(a => a.id === parseInt(id, 10));
      if (index === -1) return null;

      articles[index] = {
        ...articles[index],
        ...updateData,
        id: articles[index].id
      };

      if (updateData.category) {
        articles[index].categorySlug = updateData.category.toLowerCase();
      }

      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
      return articles[index];
    },

    deleteArticle: function(id) {
      this.init();
      let articles = this.getArticles();
      articles = articles.filter(a => a.id !== parseInt(id, 10));
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
      return true;
    },

    incrementArticleViews: function(id) {
      const articles = this.getArticles();
      const article = articles.find(a => a.id === parseInt(id, 10));
      if (article) {
        article.views = (article.views || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
      }
    },

    // --- CATEGORIES MANAGEMENT ---
    getCategories: function() {
      this.init();
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    },

    addCategory: function(cat) {
      this.init();
      const categories = this.getCategories();
      const slug = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newCat = {
        id: slug,
        name: cat.name,
        icon: cat.icon || 'general',
        color: cat.color || '#6366f1',
        description: cat.description || ''
      };
      categories.push(newCat);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      return newCat;
    },

    deleteCategory: function(id) {
      this.init();
      let categories = this.getCategories();
      categories = categories.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      return true;
    },

    // --- CATEGORY SUBSCRIPTIONS (For Students) ---
    getSubscriptions: function(studentId) {
      this.init();
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS) || '[]');
    },

    toggleSubscription: function(categoryId) {
      this.init();
      const subs = this.getSubscriptions();
      const catLower = categoryId.toLowerCase();
      let updated;
      if (subs.includes(catLower)) {
        updated = subs.filter(s => s !== catLower);
      } else {
        updated = [...subs, catLower];
      }
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
      return updated.includes(catLower);
    },

    isSubscribed: function(categoryId) {
      const subs = this.getSubscriptions();
      return subs.includes(categoryId.toLowerCase());
    },

    // --- ANNOUNCEMENTS MANAGEMENT (CRUD) ---
    getAnnouncements: function() {
      this.init();
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '[]');
    },

    createAnnouncement: function(data) {
      this.init();
      const announcements = this.getAnnouncements();
      const newId = 'ann-' + Date.now().toString().slice(-4);
      const newAnn = {
        id: newId,
        title: data.title,
        category: data.category || 'General',
        date: data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        badge: (data.badge || data.category || 'GENERAL').toUpperCase(),
        summary: data.summary,
        pinned: Boolean(data.pinned)
      };
      announcements.unshift(newAnn);
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
      return newAnn;
    },

    updateAnnouncement: function(id, data) {
      this.init();
      const announcements = this.getAnnouncements();
      const index = announcements.findIndex(a => a.id === id);
      if (index === -1) return null;
      announcements[index] = { ...announcements[index], ...data };
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
      return announcements[index];
    },

    deleteAnnouncement: function(id) {
      this.init();
      let announcements = this.getAnnouncements();
      announcements = announcements.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
      return true;
    },

    toggleAnnouncementPin: function(id) {
      this.init();
      const announcements = this.getAnnouncements();
      const ann = announcements.find(a => a.id === id);
      if (ann) {
        ann.pinned = !ann.pinned;
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
      }
      return ann;
    },

    // --- STUDENT SUBMISSIONS (Approval Queue) ---
    getSubmissions: function(studentIdFilter) {
      this.init();
      let submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || '[]');
      if (studentIdFilter) {
        submissions = submissions.filter(s => s.studentId === studentIdFilter);
      }
      return submissions;
    },

    createSubmission: function(subData) {
      this.init();
      const submissions = this.getSubmissions();
      const newId = 'sub-' + (Date.now().toString().slice(-5));
      const user = this.getCurrentUser() || DEMO_USERS.student;

      const newSub = {
        id: newId,
        title: subData.title,
        category: subData.category || 'Academic',
        author: subData.author || user.name,
        studentId: user.studentId || 'NSBM-STU-2026',
        submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'pending',
        readTime: subData.readTime || '4 min read',
        excerpt: subData.excerpt || (subData.content ? subData.content.substring(0, 140) + '...' : ''),
        content: subData.content || '',
        image: subData.image || '1im/ezgif-frame-001.jpg',
        feedback: ''
      };

      submissions.unshift(newSub);
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
      return newSub;
    },

    updateSubmissionStatus: function(id, status, feedback) {
      this.init();
      const submissions = this.getSubmissions();
      const sub = submissions.find(s => s.id === id);
      if (!sub) return null;

      sub.status = status;
      if (feedback !== undefined) {
        sub.feedback = feedback;
      }

      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

      // If approved, automatically publish to the public articles store!
      if (status === 'approved') {
        this.createArticle({
          title: sub.title,
          category: sub.category,
          author: sub.author,
          authorRole: 'Student Journalist',
          readTime: sub.readTime,
          excerpt: sub.excerpt,
          content: sub.content,
          image: sub.image,
          featured: false
        });
      }

      return sub;
    },

    // --- COMMENTS & MODERATION ---
    getComments: function(articleId) {
      this.init();
      let comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
      if (articleId) {
        comments = comments.filter(c => c.articleId === parseInt(articleId, 10));
      }
      return comments;
    },

    addComment: function(articleId, text, authorName, role) {
      this.init();
      const comments = this.getComments();
      const user = this.getCurrentUser() || DEMO_USERS.student;
      
      const newComment = {
        id: 'cmt-' + Date.now(),
        articleId: parseInt(articleId, 10),
        author: authorName || user.name,
        role: role || (user.role === 'admin' ? 'Editor' : 'Student Reader'),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: text,
        status: 'approved'
      };

      comments.push(newComment);
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
      return newComment;
    },

    deleteComment: function(id) {
      this.init();
      let comments = this.getComments();
      comments = comments.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
      return true;
    },

    // --- BOOKMARKS ---
    getBookmarks: function() {
      this.init();
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');
    },

    isBookmarked: function(articleId) {
      const bookmarks = this.getBookmarks();
      return bookmarks.includes(parseInt(articleId, 10));
    },

    toggleBookmark: function(articleId) {
      this.init();
      const id = parseInt(articleId, 10);
      let bookmarks = this.getBookmarks();
      if (bookmarks.includes(id)) {
        bookmarks = bookmarks.filter(b => b !== id);
      } else {
        bookmarks.push(id);
      }
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      return bookmarks.includes(id);
    },

    // --- LIKES & REACTIONS ---
    getLikedIds: function() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || '[1, 3]');
      } catch (e) {
        return [1, 3];
      }
    },

    isLiked: function(articleId) {
      const liked = this.getLikedIds();
      return liked.includes(parseInt(articleId, 10));
    },

    toggleLike: function(articleId) {
      this.init();
      const id = parseInt(articleId, 10);
      let liked = this.getLikedIds();
      const articles = this.getArticles();
      const article = articles.find(a => a.id === id);
      
      let isNowLiked = false;
      if (liked.includes(id)) {
        liked = liked.filter(item => item !== id);
        if (article && article.likes && article.likes > 0) {
          article.likes -= 1;
        }
      } else {
        liked.push(id);
        isNowLiked = true;
        if (article) {
          article.likes = (article.likes || 0) + 1;
        }
      }

      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(liked));
      if (article) {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
      }

      return {
        liked: isNowLiked,
        count: article ? (article.likes || (isNowLiked ? 1 : 0)) : 0
      };
    },

    // --- SOCIAL BUZZ / COMMUNITY POSTS ---
    getSocialPosts: function(filterCategory) {
      this.init();
      const articles = this.getArticles();
      const customPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.SOCIAL_POSTS) || '[]');
      const likedIds = this.getLikedIds();

      // Transform standard articles into rich social posts
      const articlePosts = articles.map(art => {
        const comments = this.getComments(art.id);
        return {
          id: 'post-art-' + art.id,
          articleId: art.id,
          isOfficialArticle: true,
          author: art.author,
          role: art.authorRole || 'NSBM News Bureau',
          faculty: 'Faculty of Computing',
          date: art.date,
          category: art.category,
          categorySlug: art.categorySlug || (art.category ? art.category.toLowerCase() : 'general'),
          title: art.title,
          excerpt: art.excerpt,
          content: art.content,
          image: art.image,
          imageCaption: art.imageCaption,
          likesCount: art.likes !== undefined ? art.likes : Math.floor((art.views || 100) / 10) + 15,
          isLiked: likedIds.includes(art.id),
          commentsCount: comments.length,
          comments: comments,
          sharesCount: Math.floor((art.views || 50) / 25) + 3,
          readTime: art.readTime || '4 min read',
          tags: ['#NSBM', '#' + (art.category || 'Campus').replace(/\s+/g, ''), '#GreenUniversity']
        };
      });

      let allPosts = [...customPosts, ...articlePosts];

      if (filterCategory && filterCategory !== 'all') {
        const target = filterCategory.toLowerCase();
        allPosts = allPosts.filter(p => p.categorySlug === target || (p.category && p.category.toLowerCase() === target));
      }

      return allPosts;
    },

    createSocialPost: function(postData) {
      this.init();
      const user = this.getCurrentUser() || DEMO_USERS.student;
      const customPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.SOCIAL_POSTS) || '[]');
      const newId = 'post-custom-' + Date.now();

      const newPost = {
        id: newId,
        articleId: null,
        isOfficialArticle: false,
        author: user.name || 'NSBM Student Contributor',
        role: user.role === 'admin' ? 'Chief Editor & Press Director' : (user.title || 'Student Contributor'),
        faculty: user.faculty || 'Faculty of Computing',
        date: 'Just now',
        category: postData.category || 'General',
        categorySlug: (postData.category || 'general').toLowerCase(),
        title: postData.title || '',
        excerpt: postData.content ? postData.content.substring(0, 160) + '...' : '',
        content: postData.content || '',
        image: postData.image || (Array.isArray(postData.images) && postData.images.length > 0 ? postData.images[0] : null),
        images: (Array.isArray(postData.images) && postData.images.length > 0) ? postData.images : (postData.image ? [postData.image] : []),
        imageCaption: postData.imageCaption || '',
        likesCount: 0,
        isLiked: false,
        commentsCount: 0,
        comments: [],
        sharesCount: 0,
        readTime: 'Quick Update',
        tags: postData.tags || ['#NSBM', '#CampusLife', '#StudentBuzz']
      };

      customPosts.unshift(newPost);
      localStorage.setItem(STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(customPosts));
      return newPost;
    },

    // --- USER SESSION ---
    getCurrentUser: function() {
      // Try localStorage first (persistent), then sessionStorage (tab-only fallback)
      let stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!stored) {
        stored = sessionStorage.getItem('nsbm_newsdesk_session_user');
        // Promote sessionStorage hit into localStorage for persistence
        if (stored) {
          try { localStorage.setItem(STORAGE_KEYS.CURRENT_USER, stored); } catch(e) {}
        }
      }
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { return null; }
      }
      return null;
    },

    setCurrentUser: function(user) {
      const json = JSON.stringify(user);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, json);
      try { sessionStorage.setItem('nsbm_newsdesk_session_user', json); } catch(e) {}
    },

    logout: function() {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      try { sessionStorage.removeItem('nsbm_newsdesk_session_user'); } catch(e) {}
    },

    loginAsDemo: function(role) {
      const user = DEMO_USERS[role] || DEMO_USERS.student;
      this.setCurrentUser(user);
      return user;
    },

    // --- ANALYTICS & READERSHIP REPORTS ---
    getAnalytics: function() {
      const articles = this.getArticles();
      const submissions = this.getSubmissions();
      const comments = this.getComments();
      const announcements = this.getAnnouncements();

      const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
      const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
      const approvedSubmissions = submissions.filter(s => s.status === 'approved').length;

      const categoryCounts = {};
      articles.forEach(a => {
        const cat = a.category || 'General';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      return {
        totalArticles: articles.length,
        totalViews: totalViews,
        pendingSubmissions: pendingSubmissions,
        approvedSubmissions: approvedSubmissions,
        totalComments: comments.length,
        totalAnnouncements: announcements.length,
        categoryCounts: categoryCounts,
        topArticles: [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)
      };
    }
  };

  window.DataStore = DataStore;
  DataStore.init();

})(window);

