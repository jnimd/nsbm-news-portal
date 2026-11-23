// local storage data store
(function(window) {
  'use strict';

  const STORAGE_KEYS = {
    ARTICLES: 'nsbm_newsdesk_articles_v4',
    CATEGORIES: 'nsbm_newsdesk_categories_v4',
    ANNOUNCEMENTS: 'nsbm_newsdesk_announcements_v4',
    SUBMISSIONS: 'nsbm_newsdesk_submissions_v4',
    COMMENTS: 'nsbm_newsdesk_comments_v4',
    BOOKMARKS: 'nsbm_newsdesk_bookmarks_v4',
    SUBSCRIPTIONS: 'nsbm_newsdesk_subscriptions_v4',
    LIKES: 'nsbm_newsdesk_likes_v4',
    SOCIAL_POSTS: 'nsbm_newsdesk_social_posts_v4',
    CURRENT_USER: 'nsbm_newsdesk_current_user_v4'
  };

  // Seed Categories: Strictly matches Topic 1 (Academic, Events, Sports, General) + Computing, Sustainability
  const DEFAULT_CATEGORIES = [
    { id: 'academic', name: 'Academic', icon: 'academic', color: '#6366f1', description: 'Curriculum updates, research publications, faculty notices, and exam timetables.' },
    { id: 'events', name: 'Events', icon: 'events', color: '#ec4899', description: 'Campus galas, hackathons, club exhibitions, convocations, and guest lectures.' },
    { id: 'sports', name: 'Sports', icon: 'sports', color: '#f59e0b', description: 'Inter-university rugby, cricket, swimming, athletics, and intramural tournaments.' },
    { id: 'general', name: 'General', icon: 'general', color: '#3b82f6', description: 'Official university directives, campus safety, shuttle schedules, and student notices.' },
    { id: 'computing', name: 'Computing & AI', icon: 'computing', color: '#06b6d4', description: 'Faculty of Computing breakthroughs, software summits, robotics, and tech demos.' },
    { id: 'sustainability', name: 'Sustainability', icon: 'sustainability', color: '#10b981', description: 'South Asia\'s 1st Green University eco-audits, solar microgrid, and biodiversity.' }
  ];

  // Seed Announcements: Administrative directives & breaking bulletins
  const DEFAULT_ANNOUNCEMENTS = [
    {
      id: 'ann-1',
      title: 'Inauguration Ceremony for the 2026 Academic Year',
      category: 'Academic',
      date: 'October 24, 2026',
      badge: 'URGENT',
      summary: 'All first-year undergraduates are requested to report to the Main Auditorium by 8:30 AM with their admission credentials.',
      pinned: true
    },
    {
      id: 'ann-2',
      title: 'National Inter-University AI Hackathon 2026 Registrations Open',
      category: 'Events',
      date: 'October 23, 2026',
      badge: 'FEATURED',
      summary: 'Over LKR 1.5 Million in prize pools. Teams of 4 from any recognised higher education institute can register via the portal before November 2.',
      pinned: true
    },
    {
      id: 'ann-3',
      title: 'Annual Varsity Green Cup: Rugby & Track Trials This Saturday',
      category: 'Sports',
      date: 'October 21, 2026',
      badge: 'SPORTS',
      summary: 'Open selection trials for freshmen and seniors at the NSBM International Ground from 7:00 AM with Varsity Head Coach.',
      pinned: false
    },
    {
      id: 'ann-4',
      title: 'Campus Shuttle Service Timetable Update for Semester 1',
      category: 'General',
      date: 'October 19, 2026',
      badge: 'GENERAL',
      summary: 'Additional express shuttles between Makumbura Multimodal Transport Hub and NSBM Green Campus added every 15 minutes during peak hours.',
      pinned: false
    }
  ];

  // Seed Articles
  const DEFAULT_ARTICLES = [
    {
      id: 1,
      title: 'Faculty of Computing Unveils Edge-AI Diagnostics for Rural Agriculture',
      category: 'Academic',
      categorySlug: 'academic',
      author: 'Kanishka Senanayake',
      authorRole: 'Senior Student Researcher',
      date: 'Oct 22, 2026',
      readTime: '6 min read',
      views: 1420,
      featured: true,
      image: '1im/ezgif-frame-045.jpg',
      imageCaption: 'Faculty of Computing Edge-AI Lab & Diagnostics Bench',
      excerpt: 'Undergraduate coders deploy a zero-cloud convolutional neural network on edge microcontrollers detecting crop blight with 98.4% accuracy.',
      content: `Tucked away in the third-floor research wing of the Faculty of Computing, a team of undergraduate innovators is quietly pioneering an edge-deployed convolutional neural network designed to diagnose early-stage crop and plant disease without requiring an active internet link.

Under the mentorship of leading faculty and in partnership with regional agricultural centers, the model runs directly on low-power microcontrollers equipped with miniature CMOS image sensors.

"Our primary goal was zero-cloud latency," explains project lead Sanduni Ariyaratne. "In rural tea and rubber plantations where cellular bandwidth is intermittent, our system analyzes leaf histology and skin lesions in under 38 milliseconds with 98.4% verified diagnostic accuracy."

The lab has already filed two provisional intellectual property patents through the NSBM Center for Research and Commercialization, signaling a powerful paradigm shift in student-led technological sovereignty.`
    },
    {
      id: 2,
      title: 'Annual Green Conclave 2026: 48 Hours of Restless Innovation at the Recreation Dome',
      category: 'Events',
      categorySlug: 'events',
      author: 'Tharindu Perera',
      authorRole: 'Campus Bureau Chief',
      date: 'Oct 20, 2026',
      readTime: '4 min read',
      views: 980,
      featured: true,
      image: '2im/ezgif-frame-080.jpg',
      imageCaption: 'NSBM Recreation Dome during HackPulse 2026',
      excerpt: 'Energy drinks, algorithmic breakthroughs, and dawn pitches. We spent 48 sleepless hours documenting 120 teams competing for the Innovation Cup.',
      content: `At 3:15 AM on Saturday, the glowing blue hue of hundreds of laptop displays reflected off the geodesic arches of the NSBM Recreation Dome.

Over 120 teams from 18 universities across Sri Lanka had gathered for HackPulse 2026, challenged to deliver functional decentralized disaster-management systems within 48 unbroken hours.

Between algorithmic breakthroughs and whiteboard sprints, students traded debugging strategies over steaming mugs of Ceylon ginger tea. When final pitch time arrived at Sunday dawn, three projects were immediately awarded incubation offers by Colombo angel syndicates.

"The energy at NSBM during hackathon season is incomparable," remarked participant Nuwantha Bandara. "Nobody sleeps, but everyone builds."`
    },
    {
      id: 3,
      title: 'Varsity Green Dragons Clinch Western Province Inter-Uni Rugby Championship',
      category: 'Sports',
      categorySlug: 'sports',
      author: 'Malinda Jayasuriya',
      authorRole: 'Sports Editor',
      date: 'Oct 19, 2026',
      readTime: '5 min read',
      views: 1850,
      featured: true,
      image: '3im/ezgif-frame-110.jpg',
      imageCaption: 'Green Dragons lifting the Western Province Championship Trophy',
      excerpt: 'In a thrilling 28-24 final against Colombo University, the Green Dragons staged a second-half comeback to lift the coveted provincial trophy.',
      content: `A deafening roar echoed across the Pitipana sports complex as fly-half Shenal De Silva pierced through the defensive line in the 78th minute to seal an unforgettable 28-24 victory.

The championship win crowns an undefeated season for the NSBM varsity rugby squad, which dominated scrums and demonstrated surgical tactical kicking under head coach Ruwan Gunasekara.

"This trophy is the result of 5:00 AM gym sessions and tireless discipline," said team captain Thisara Alwis during the post-match celebration. The team now sets its sights on the All-Island University Games scheduled for December.`
    },
    {
      id: 4,
      title: 'Campus Sustainability Audit: 85% Carbon Reduction Milestone Achieved',
      category: 'Sustainability',
      categorySlug: 'sustainability',
      author: 'Dilini Rajapakse',
      authorRole: 'Environmental Desk',
      date: 'Oct 18, 2026',
      readTime: '7 min read',
      views: 730,
      featured: false,
      image: '1im/ezgif-frame-090.jpg',
      imageCaption: 'Wetlands and Solar Harvesting Array at NSBM Green Campus',
      excerpt: 'New independent audit confirms South Asia\'s First Green University has transformed over 15 metric tons of monthly organic waste into bio-energy.',
      content: `At 6:00 AM every morning, before lecture halls open their doors, NSBMâ€™s automated ecological transit carts make their daily rounds across four university dining halls.

Every scrap of organic prep material, coffee grounds, and dining byproduct is diverted from landfills directly to the university's twin anaerobic biodigesters located on the campus periphery.

Over a 21-day mesophilic processing cycle, microbes transform over 15 metric tons of monthly organic waste into rich organic digestate and compressed methane gas that fuels the culinary academy's test kitchens.`
    },
    {
      id: 5,
      title: 'Vice Chancellor Bureau Announces New Guidelines on Academic Research Grants',
      category: 'General',
      categorySlug: 'general',
      author: 'Editorial Desk',
      authorRole: 'University Press Bureau',
      date: 'Oct 17, 2026',
      readTime: '4 min read',
      views: 1120,
      featured: false,
      image: '2im/ezgif-frame-130.jpg',
      imageCaption: 'Administrative Council & Faculty Board Chambers',
      excerpt: 'Undergraduate student researchers are now eligible for up to LKR 500,000 in seed research funding for green technology and robotics projects.',
      content: `The NSBM Academic Council has announced an expansion of the Undergraduate Research Incentive Scheme (URIS) for the 2026/2027 academic cycle.

Under the revised directive, students across all four faculties (Computing, Business, Engineering, and Science) can apply for peer-reviewed seed funding for research that addresses sustainable national economic priorities.

Applications open on November 1st through the university research portal, with initial disbursement ceremonies scheduled for early next year.`
    },
    {
      id: 6,
      title: 'Under the Green Canopy: Acoustic Jam Sessions Return to Campus Amphitheatre',
      category: 'Events',
      categorySlug: 'events',
      author: 'Chamod Jayawardena',
      authorRole: 'Arts & Culture Desk',
      date: 'Oct 15, 2026',
      readTime: '3 min read',
      views: 890,
      featured: false,
      image: '3im/ezgif-frame-020.jpg',
      imageCaption: 'Acoustic evenings at the open-air campus amphitheatre',
      excerpt: 'How acoustic Friday evenings under the Pitipana stars became the spiritual heartbeat of NSBM\'s creative underground.',
      content: `As dusk falls over Pitipana, acoustic guitars, flutes, and spoken-word poetry echo through NSBM's open-air amphitheatre nestled beneath the palm canopy.

What began as an informal jam session among architecture and software engineering students has blossomed into a beloved bi-weekly tradition, capturing the multilingual, cosmopolitan camaraderie that defines campus life.`
    }
  ];

  // Seed Submissions for Admin Editorial Queue
  const DEFAULT_SUBMISSIONS = [
    {
      id: 'sub-101',
      title: 'Autonomous Solar Rovers for Soil Moisture Sampling on Campus Grounds',
      category: 'Academic',
      author: 'Ravindu Perera',
      studentId: 'NSBM-IT-23-4819',
      submittedDate: 'Oct 22, 2026',
      status: 'pending',
      readTime: '5 min read',
      excerpt: 'A prototype solar rover built by mechatronics students that maps moisture and nitrogen levels across NSBM landscaping.',
      content: `Our mechatronics second-year team has completed field trials for a low-cost, 3D-printed solar rover designed to roam campus gardens autonomously.

The vehicle navigates using dual ultrasonic distance sensors and GPS waypoints. As it traverses the soil, an automated probe plunges 10cm into the earth to capture capacitive moisture, pH, and electrical conductivity metrics, transmitting the telemetry directly to the campus facilities web dashboard via LoRaWAN.

We hope to expand this initiative to local agricultural smallholders throughout the Homagama region in 2027.`,
      feedback: ''
    },
    {
      id: 'sub-102',
      title: 'NSBM Aquatics Team Sweeps Gold at National Inter-University Swimming Meet',
      category: 'Sports',
      author: 'Minoli Weerakkody',
      studentId: 'NSBM-BM-22-1904',
      submittedDate: 'Oct 21, 2026',
      status: 'pending',
      readTime: '4 min read',
      excerpt: 'NSBM swimmers claim 7 gold medals and break two national university records in the 200m freestyle and 4x100m relay.',
      content: `The NSBM Green Waves swimming team dominated the pool at the Sugathadasa Stadium, taking home top honors in seven individual and relay events.

Star swimmer Kavishka Senaratne set a new university meet record in the 200m individual medley, clocking in at 2:08.41. The victory marks the third consecutive year NSBM has retained the overall championship trophy in the aquatic arena.`,
      feedback: ''
    },
    {
      id: 'sub-103',
      title: 'Student Senate Pass Resolution on Zero-Single-Use Plastics at University Cafes',
      category: 'General',
      author: 'Hiran Jayasundara',
      studentId: 'NSBM-LAW-24-0312',
      submittedDate: 'Oct 19, 2026',
      status: 'approved',
      readTime: '3 min read',
      excerpt: 'New legislative framework requires all dining providers on campus to adopt biodegradable packaging by January 2027.',
      content: `In a historic vote, the Student Senate unanimously ratified the 'Green Dining Compact 2026'. Under this agreement, all campus eateries will phase out single-use plastic cutlery and cups, replacing them with areca-nut leaf plates and paper straws produced by regional cottage industries.`,
      feedback: 'Approved by Chief Editor. Published to campus newsfeed.'
    }
  ];

  // Seed Comments
  const DEFAULT_COMMENTS = [
    {
      id: 'cmt-1',
      articleId: 1,
      author: 'Danushka Silva',
      role: 'Computing Undergrad',
      date: 'Oct 22, 2026, 11:30 AM',
      text: 'Proud of our third-year team! The zero-cloud edge AI model is going to help so many farmers across our rural zones.',
      status: 'approved'
    },
    {
      id: 'cmt-2',
      articleId: 1,
      author: 'Dr. Rohan Samarasinghe',
      role: 'Visiting Faculty',
      date: 'Oct 22, 2026, 12:45 PM',
      text: 'Exceptional technical execution on the low-power microcontroller deployment. Looking forward to the symposium demonstration.',
      status: 'approved'
    },
    {
      id: 'cmt-3',
      articleId: 3,
      author: 'Kasun Wickrama',
      role: 'Student Athlete',
      date: 'Oct 20, 2026, 09:15 AM',
      text: 'That try in the 78th minute was pure tactical brilliance. Green Dragons all the way!',
      status: 'approved'
    }
  ];

  // Seed Community Social Posts with diverse high-quality campus photography
  const DEFAULT_SOCIAL_POSTS = [
    {
      id: 'post-seed-1',
      articleId: null,
      isOfficialArticle: false,
      author: 'Sanduni Ariyaratne',
      role: 'Student Researcher',
      faculty: 'Faculty of Computing',
      date: '2 hours ago',
      category: 'Computing & AI',
      categorySlug: 'computing',
      title: 'Our Edge AI Model Surpassed 98% Accuracy in Plantation Trials! 🚀',
      excerpt: 'We deployed our microcontroller sensor array on regional tea plantations this morning. Real-time inference in 34ms without any cloud connection!',
      content: `Incredible milestone for our undergrad research squad! We deployed our microcontroller sensor array on regional tea plantations this morning.\n\nLeaf histology scans returned 98.4% diagnostic accuracy with 34ms inference time. Zero Wi-Fi, zero cloud dependency — pure edge computing right on the field!\n\nMassive gratitude to Dr. Rohan and our senior lab engineers for the sleepless debugging sessions over Ceylon tea! ☕🌱`,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Field testing embedded microcontrollers & edge diagnostics sensor',
      likesCount: 142,
      isLiked: true,
      commentsCount: 2,
      comments: [
        { author: 'Nuwantha Bandara', role: 'Software Eng Undergrad', text: 'Stunning work Sanduni! Are you guys open-sourcing the training weights after patent review?' },
        { author: 'Dr. Rohan Samarasinghe', role: 'Faculty Mentor', text: 'Proud of this milestone. Excellent deployment execution under low-voltage constraints.' }
      ],
      sharesCount: 19,
      readTime: 'Quick Update',
      tags: ['#EdgeAI', '#FacultyOfComputing', '#UndergradResearch', '#NSBM']
    },
    {
      id: 'post-seed-2',
      articleId: null,
      isOfficialArticle: false,
      author: 'Thisara Alwis',
      role: 'Varsity Rugby Captain',
      faculty: 'Faculty of Business',
      date: '5 hours ago',
      category: 'Sports',
      categorySlug: 'sports',
      title: 'Green Dragons Western Province Victory Celebration 🐉🏆',
      excerpt: 'Undefeated season sealed at Pitipana grounds! Huge shoutout to the student crowd whose chants kept us pushing through the final scrum.',
      content: `28-24 in the final 2 minutes. What a match against Colombo University!\n\nA huge shoutout to every student, alumni, and lecturer who packed the Pitipana bleachers today. Your chants carried us through that final 78th-minute try.\n\nThe trophy is coming back to NSBM Green Campus where it belongs! Next stop: All-Island University Games! 🏉🔥`,
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Varsity Green Dragons championship celebration',
      likesCount: 285,
      isLiked: true,
      commentsCount: 2,
      comments: [
        { author: 'Malinda Jayasuriya', role: 'Sports Editor', text: 'That tactical kick in the 78th was pure class captain!' },
        { author: 'Chamod Jayawardena', role: 'Arts Club', text: 'The stadium atmosphere was electric! Well deserved victory.' }
      ],
      sharesCount: 44,
      readTime: 'Sports Dispatch',
      tags: ['#GreenDragons', '#VarsityRugby', '#Champions2026', '#NSBMSports']
    },
    {
      id: 'post-seed-3',
      articleId: null,
      isOfficialArticle: false,
      author: 'Dilini Rajapakse',
      role: 'Green Campus Ambassador',
      faculty: 'Faculty of Science',
      date: 'Yesterday',
      category: 'Sustainability',
      categorySlug: 'sustainability',
      title: 'Biodiversity Walk & Native Butterfly Sanctuary Survey 🦋🍃',
      excerpt: 'Over 42 native butterfly and avian species recorded around the university wetlands during our morning ecological census.',
      content: `Morning biodiversity census around the NSBM Green Wetlands & Solar Microgrid corridor.\n\nOur environmental science team identified 42 native butterfly and pollinator species, confirming our campus micro-ecosystem is actively flourishing.\n\nReminder: Next tree plantation drive happens this Saturday near the lake amphitheatre. Everyone is welcome to plant a sapling! 🌳💚`,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'NSBM Green Wetlands ecosystem & native plant sanctuary',
      likesCount: 198,
      isLiked: false,
      commentsCount: 1,
      comments: [
        { author: 'Sanduni Ariyaratne', role: 'Computing Undergrad', text: 'Count me in for Saturday! Will bring our whole lab group.' }
      ],
      sharesCount: 27,
      readTime: 'Green University',
      tags: ['#GreenUniversity', '#EcoLiving', '#Sustainability', '#NSBMLife']
    },
    {
      id: 'post-seed-4',
      articleId: null,
      isOfficialArticle: false,
      author: 'Nuwantha Bandara',
      role: 'Hackathon Lead Organiser',
      faculty: 'Faculty of Computing',
      date: '2 days ago',
      category: 'Events',
      categorySlug: 'events',
      title: 'HackPulse 2026: 48-Hour Coding Marathon Underway at the Dome 💻⚡',
      excerpt: '120 teams, 48 hours, infinite energy drinks and Ceylon tea. The decentralized disaster-tech systems are mind-blowing!',
      content: `Hour 34 of HackPulse 2026 at the NSBM Recreation Dome.\n\nWatching 120 student teams debug distributed offline protocols and mesh networks through the dead of night is nothing short of inspiring.\n\nBig pitches start at 9:00 AM on the main stage with angel investor judges. Come witness the future of Sri Lankan tech! 🚀`,
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Collaborative coding sprints at NSBM HackPulse 2026',
      likesCount: 312,
      isLiked: true,
      commentsCount: 1,
      comments: [
        { author: 'Kasun Perera', role: 'Computing Undergrad', text: 'The energy in the dome is unmatched! Let us go team ByteForce!' }
      ],
      sharesCount: 38,
      readTime: 'Campus Event',
      tags: ['#HackPulse2026', '#CodeCampus', '#Innovation', '#NSBMComputing']
    },
    {
      id: 'post-seed-5',
      articleId: null,
      isOfficialArticle: false,
      author: 'Chamod Jayawardena',
      role: 'Campus Cultural Guild',
      faculty: 'Faculty of Business',
      date: '3 days ago',
      category: 'Events',
      categorySlug: 'events',
      title: 'Acoustic Jam Under the Stars: Campus Amphitheatre Sessions 🎸✨',
      excerpt: 'Guitars, cajons, flutes and original poetry. Nothing beats Friday evenings beneath the Pitipana green canopy.',
      content: `Friday dusk beneath the palm canopy at the open-air amphitheatre.\n\nFrom acoustic Sinhala classics to indie arrangements and spontaneous rap cyphers, tonight reminded all of us why university life is about so much more than exams.\n\nNext session is October 31st — bring your instruments and good vibes! 🎵🌙`,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Undergraduate acoustic musical night at campus open-air theatre',
      likesCount: 220,
      isLiked: false,
      commentsCount: 1,
      comments: [
        { author: 'Dilini Rajapakse', role: 'Student', text: 'The flute solo on the lake steps was pure magic!' }
      ],
      sharesCount: 16,
      readTime: 'Arts & Culture',
      tags: ['#CampusMusic', '#AcousticNights', '#NSBMLife', '#PitipanaVibes']
    }
  ];

  // Demo Profiles
  const DEMO_USERS = {
    student: {
      name: 'Kasun Perera',
      email: 'student@students.nsbm.ac.lk',
      role: 'student',
      studentId: 'NSBM-IT-24-9021',
      faculty: 'Faculty of Computing'
    },
    admin: {
      name: 'Dr. Priyantha Kumar',
      email: 'admin@nsbm.ac.lk',
      role: 'admin',
      adminId: 'ADMIN-PRESS-01',
      title: 'Chief Editor & Communications Director'
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
        author: user.name || 'Kasun Perera',
        role: user.role === 'admin' ? 'Chief Editor & Press Director' : (user.title || 'Student Contributor'),
        faculty: user.faculty || 'Faculty of Computing',
        date: 'Just now',
        category: postData.category || 'General',
        categorySlug: (postData.category || 'general').toLowerCase(),
        title: postData.title || '',
        excerpt: postData.content ? postData.content.substring(0, 160) + '...' : '',
        content: postData.content || '',
        image: postData.image || null,
        imageCaption: postData.imageCaption || '',
        likesCount: 1,
        isLiked: true,
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
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { return null; }
      }
      return null;
    },

    setCurrentUser: function(user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    },

    logout: function() {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
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

