const { users, posts, opportunities, connections } = require('./localDB');
const bcrypt = require('bcryptjs');

// Generate fake data
const seedData = async () => {
    console.log('🌱 Seeding fake data...');

    // Clear existing data by reading and clearing
    const existingUsers = users.findAll();
    const existingPosts = posts.findAll();
    const existingOpps = opportunities.findAll();
    const existingConns = connections.findAll();

    console.log(`Found ${existingUsers.length} existing users, ${existingPosts.length} posts, ${existingOpps.length} opportunities, ${existingConns.length} connections`);

    // Create fake users (mentors and students)
    const fakeUsers = [
        {
            name: 'Sarah Chen',
            email: 'sarah.chen@alumni.edu',
            password: await bcrypt.hash('password123', 10),
            role: 'alumni',
            college: 'MIT',
            graduationYear: 2020,
            isEmployed: true,
            company: 'Google',
            jobTitle: 'Senior Software Engineer',
            isMentor: true,
            bio: 'Passionate about helping students break into tech. 5+ years of experience in full-stack development.',
            skills: ['React', 'Node.js', 'Python', 'System Design', 'Leadership'],
            karma: 150,
            headline: 'Senior Software Engineer at Google',
        },
        {
            name: 'Michael Rodriguez',
            email: 'michael.r@alumni.edu',
            password: await bcrypt.hash('password123', 10),
            role: 'alumni',
            college: 'Stanford',
            graduationYear: 2019,
            isEmployed: true,
            company: 'Microsoft',
            jobTitle: 'Product Manager',
            isMentor: true,
            bio: 'Product manager with expertise in AI/ML products. Love mentoring students interested in product management.',
            skills: ['Product Management', 'AI/ML', 'Strategy', 'Data Analysis'],
            karma: 120,
            headline: 'Product Manager at Microsoft',
        },
        {
            name: 'Dr. Emily Watson',
            email: 'emily.watson@university.edu',
            password: await bcrypt.hash('password123', 10),
            role: 'faculty',
            college: 'Harvard University',
            graduationYear: 2015,
            isEmployed: true,
            company: 'Harvard University',
            jobTitle: 'Associate Professor',
            isMentor: true,
            bio: 'Computer Science professor specializing in AI and Machine Learning. Always happy to guide students.',
            skills: ['Machine Learning', 'AI', 'Research', 'Python', 'TensorFlow'],
            karma: 200,
            headline: 'Associate Professor of Computer Science',
        },
        {
            name: 'James Park',
            email: 'james.park@alumni.edu',
            password: await bcrypt.hash('password123', 10),
            role: 'alumni',
            college: 'UC Berkeley',
            graduationYear: 2021,
            isEmployed: true,
            company: 'Meta',
            jobTitle: 'Frontend Engineer',
            isMentor: true,
            bio: 'Frontend specialist with a passion for React and modern web development. Open to mentoring!',
            skills: ['React', 'TypeScript', 'Next.js', 'UI/UX', 'Web Performance'],
            karma: 95,
            headline: 'Frontend Engineer at Meta',
        },
        {
            name: 'Lisa Thompson',
            email: 'lisa.thompson@alumni.edu',
            password: await bcrypt.hash('password123', 10),
            role: 'alumni',
            college: 'Yale University',
            graduationYear: 2018,
            isEmployed: true,
            company: 'Amazon',
            jobTitle: 'Data Scientist',
            isMentor: true,
            bio: 'Data scientist working on recommendation systems. Happy to help students with data science careers.',
            skills: ['Python', 'Machine Learning', 'Data Science', 'SQL', 'Statistics'],
            karma: 110,
            headline: 'Data Scientist at Amazon',
        },
        {
            name: 'Alex Kumar',
            email: 'alex.kumar@student.edu',
            password: await bcrypt.hash('password123', 10),
            role: 'student',
            college: 'MIT',
            graduationYear: 2025,
            isEmployed: false,
            bio: 'Computer Science student passionate about web development and open source.',
            skills: ['JavaScript', 'React', 'Node.js'],
            karma: 25,
            headline: 'CS Student at MIT',
        },
        {
            name: 'Maria Garcia',
            email: 'maria.garcia@student.edu',
            password: await bcrypt.hash('password123', 10),
            role: 'student',
            college: 'Stanford',
            graduationYear: 2026,
            isEmployed: false,
            bio: 'Aspiring product manager and entrepreneur. Love building products that make a difference.',
            skills: ['Product Design', 'Figma', 'Business Strategy'],
            karma: 18,
            headline: 'Business Student at Stanford',
        },
    ];

    // Create users
    const createdUsers = [];
    for (const userData of fakeUsers) {
        const user = users.create(userData);
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.name} (${user._id})`);
    }

    // Create fake posts
    const fakePosts = [
        {
            user: createdUsers[0]._id,
            content: 'Just wrapped up an amazing mentorship session! Remember: consistency beats perfection. Keep building, keep learning! 🚀 #TechMentorship #CareerGrowth',
            type: 'general',
            tags: ['mentorship', 'career', 'tech'],
            likes: [createdUsers[5]._id, createdUsers[6]._id],
            comments: [
                {
                    user: createdUsers[5]._id,
                    content: 'Great advice! Thanks for sharing!',
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                },
            ],
        },
        {
            user: createdUsers[1]._id,
            content: 'Excited to announce that we\'re hiring interns for Summer 2025! If you\'re interested in product management, feel free to reach out. #Opportunities #PM',
            type: 'opportunity',
            tags: ['opportunity', 'internship', 'product-management'],
            likes: [createdUsers[0]._id, createdUsers[5]._id, createdUsers[6]._id],
            comments: [
                {
                    user: createdUsers[6]._id,
                    content: 'This sounds amazing! How can I apply?',
                    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                },
            ],
        },
        {
            user: createdUsers[2]._id,
            content: 'Our research paper on "Advanced Neural Networks" was just accepted! 🎉 Grateful for all the students who contributed. #Research #AI #Achievement',
            type: 'achievement',
            tags: ['research', 'ai', 'achievement'],
            likes: [createdUsers[0]._id, createdUsers[1]._id, createdUsers[3]._id, createdUsers[4]._id],
            comments: [
                {
                    user: createdUsers[3]._id,
                    content: 'Congratulations! This is huge!',
                    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                },
                {
                    user: createdUsers[4]._id,
                    content: 'Amazing work! Would love to learn more about this.',
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                },
            ],
        },
        {
            user: createdUsers[3]._id,
            content: 'Just published a new blog post about React performance optimization. Check it out if you\'re working with large-scale React apps! #React #WebDev #Performance',
            type: 'discussion',
            tags: ['react', 'web-development', 'performance'],
            likes: [createdUsers[0]._id, createdUsers[5]._id],
            comments: [],
        },
        {
            user: createdUsers[4]._id,
            content: 'Campus hackathon coming up next month! Looking for teammates interested in building an AI-powered app. DM me if interested! #Hackathon #AI #TeamUp',
            type: 'event',
            tags: ['hackathon', 'ai', 'team'],
            likes: [createdUsers[5]._id, createdUsers[6]._id],
            comments: [
                {
                    user: createdUsers[5]._id,
                    content: 'I\'m interested! Let\'s connect.',
                    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                },
            ],
        },
    ];

    for (const postData of fakePosts) {
        const post = posts.create(postData);
        console.log(`✅ Created post by ${createdUsers.find(u => u._id === postData.user)?.name}`);
    }

    // Create fake opportunities
    const fakeOpportunities = [
        {
            postedBy: createdUsers[1]._id,
            title: 'Summer Product Management Intern',
            description: 'Join our product team for an exciting summer internship. Work on real products used by millions. Perfect for students interested in product management.',
            type: 'internship',
            company: 'Microsoft',
            location: 'Seattle, WA (Hybrid)',
            skills: ['Product Management', 'Analytics', 'Communication'],
            applicationLink: 'https://careers.microsoft.com/internships',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            applicants: [createdUsers[6]._id],
            isActive: true,
        },
        {
            postedBy: createdUsers[0]._id,
            title: 'Full Stack Developer - Entry Level',
            description: 'Looking for a passionate full-stack developer to join our team. Great opportunity for recent graduates or students graduating soon.',
            type: 'job',
            company: 'Google',
            location: 'Mountain View, CA',
            skills: ['React', 'Node.js', 'Python', 'JavaScript'],
            applicationLink: 'https://careers.google.com/jobs',
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            applicants: [createdUsers[5]._id],
            isActive: true,
        },
        {
            postedBy: createdUsers[2]._id,
            title: 'Research Assistant - AI/ML Lab',
            description: 'Join our AI research lab as a research assistant. Work on cutting-edge machine learning projects. Open to graduate and undergraduate students.',
            type: 'research',
            company: 'Harvard University',
            location: 'Cambridge, MA',
            skills: ['Python', 'Machine Learning', 'TensorFlow', 'Research'],
            applicationLink: 'https://harvard.edu/research/apply',
            deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            applicants: [],
            isActive: true,
        },
        {
            postedBy: createdUsers[3]._id,
            title: 'Frontend Engineering Intern',
            description: 'Summer internship opportunity for frontend developers. Work with React, TypeScript, and modern web technologies.',
            type: 'internship',
            company: 'Meta',
            location: 'Menlo Park, CA',
            skills: ['React', 'TypeScript', 'CSS', 'Web Performance'],
            applicationLink: 'https://www.metacareers.com/internships',
            deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            applicants: [createdUsers[5]._id],
            isActive: true,
        },
        {
            postedBy: createdUsers[4]._id,
            title: 'Data Science Internship',
            description: 'Exciting opportunity to work on recommendation systems and data analytics. Perfect for students with ML/data science background.',
            type: 'internship',
            company: 'Amazon',
            location: 'Seattle, WA',
            skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
            applicationLink: 'https://www.amazon.jobs/en/internships',
            deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
            applicants: [],
            isActive: true,
        },
    ];

    for (const oppData of fakeOpportunities) {
        const opp = opportunities.create(oppData);
        console.log(`✅ Created opportunity: ${opp.title}`);
    }

    // Create fake connections
    const fakeConnections = [
        {
            mentor: createdUsers[0]._id,
            mentorId: createdUsers[0]._id,
            mentee: createdUsers[5]._id,
            menteeId: createdUsers[5]._id,
            student: createdUsers[5]._id,
            studentId: createdUsers[5]._id,
            status: 'accepted',
            sessions: [
                {
                    scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    duration: 60,
                    status: 'scheduled',
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ],
        },
        {
            mentor: createdUsers[1]._id,
            mentorId: createdUsers[1]._id,
            mentee: createdUsers[6]._id,
            menteeId: createdUsers[6]._id,
            student: createdUsers[6]._id,
            studentId: createdUsers[6]._id,
            status: 'pending',
            sessions: [],
        },
    ];

    for (const connData of fakeConnections) {
        const conn = connections.create(connData);
        console.log(`✅ Created connection between mentor and mentee`);
    }

    console.log('✨ Seeding complete!');
    console.log(`📊 Created: ${createdUsers.length} users, ${fakePosts.length} posts, ${fakeOpportunities.length} opportunities, ${fakeConnections.length} connections`);
};

// Run seeder if called directly
if (require.main === module) {
    seedData()
        .then(() => {
            console.log('✅ Database seeded successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Error seeding database:', error);
            process.exit(1);
        });
}

module.exports = seedData;
