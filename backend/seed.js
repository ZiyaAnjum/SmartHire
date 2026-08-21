const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const seedData = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/job_portal';
    console.log('Connecting to database for seeding...');

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI);
    }

    console.log('Connected to MongoDB. Purging old records...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    console.log('Generating password hashes...');
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    console.log('Creating 4 Employers...');
    const employers = await User.create([
      {
        name: 'Sarah Jenkins',
        email: 'employer@demo.com',
        password: defaultPassword,
        role: 'employer',
        headline: 'VP of Engineering @ Stripe',
        bio: 'Building global economic infrastructure. Hiring high-caliber systems and full-stack builders.',
        skills: ['Hiring', 'System Architecture', 'Fintech', 'Leadership'],
      },
      {
        name: 'David Marcus',
        email: 'david@linear.app',
        password: defaultPassword,
        role: 'employer',
        headline: 'Head of Product Engineering @ Linear',
        bio: 'Crafting the tool for software projects. Obsessed with speed, keyboard workflows, and design craftsmanship.',
        skills: ['Product Design', 'React', 'TypeScript', 'Engineering Management'],
      },
      {
        name: 'Elena Rostova',
        email: 'elena@airbnb.com',
        password: defaultPassword,
        role: 'employer',
        headline: 'Staff Design Director @ Airbnb',
        bio: 'Leading design systems and international guest trip experiences across web & mobile.',
        skills: ['Design Systems', 'Figma', 'UX Research', 'Frontend Strategy'],
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@vercel.com',
        password: defaultPassword,
        role: 'employer',
        headline: 'Director of Cloud Platform @ Vercel',
        bio: 'Empowering web developers with ultra-fast edge infrastructure and serverless execution.',
        skills: ['Cloud Infrastructure', 'Kubernetes', 'Next.js', 'DevOps'],
      },
    ]);

    console.log('Creating 7 Candidates...');
    const candidates = await User.create([
      {
        name: 'Alex Chen',
        email: 'candidate@demo.com',
        password: defaultPassword,
        role: 'candidate',
        headline: 'Senior Full Stack Engineer (React, Node, TS)',
        bio: '7+ years building enterprise SaaS platforms and real-time distributed web apps.',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Tailwind CSS'],
      },
      {
        name: 'Maya Patel',
        email: 'maya.patel@demo.com',
        password: defaultPassword,
        role: 'candidate',
        headline: 'Frontend Architect & UI Specialist',
        bio: 'Passionate about micro-interactions, web performance, and accessible UI component systems.',
        skills: ['React', 'Next.js', 'Tailwind CSS', 'Vite', 'CSS Architecture', 'Figma'],
      },
      {
        name: 'James Wilson',
        email: 'james.w@demo.com',
        password: defaultPassword,
        role: 'candidate',
        headline: 'Backend & Distributed Systems Engineer',
        bio: 'Specialist in high-throughput microservices, Redis caching, and database query optimizations.',
        skills: ['Node.js', 'Express', 'Go', 'MongoDB', 'PostgreSQL', 'Kafka', 'Docker'],
      },
      {
        name: 'Sophia Martinez',
        email: 'sophia.m@demo.com',
        password: defaultPassword,
        role: 'candidate',
        headline: 'Product Designer (UI/UX) & Prototyper',
        bio: 'Designing user-first workflows from user journey maps to high-fidelity clickable Figma designs.',
        skills: ['UI/UX', 'Figma', 'Prototyping', 'Design Systems', 'User Research'],
      },
      {
        name: 'Liam O’Connor',
        email: 'liam.dev@demo.com',
        password: defaultPassword,
        role: 'candidate',
        headline: 'DevOps & Site Reliability Engineer',
        bio: 'Automating multi-region cloud deployments, Kubernetes orchestration, and zero-downtime CI/CD.',
        skills: ['Kubernetes', 'Docker', 'AWS', 'GCP', 'Terraform', 'GitHub Actions', 'Prometheus'],
      },
      {
        name: 'Chloe Dubois',
        email: 'chloe.d@demo.com',
        password: defaultPassword,
        role: 'candidate',
        headline: 'Cross-Platform Mobile Engineer',
        bio: 'Building native-feel iOS & Android apps with React Native, offline caching, and biometric auth.',
        skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Redux Toolkit'],
      },
      {
        name: 'Ryan Tanaka',
        email: 'ryan.t@demo.com',
        password: defaultPassword,
        role: 'candidate',
        headline: 'Junior Full Stack Developer',
        bio: 'Curious, fast-learning developer eager to contribute to modern full-stack web products.',
        skills: ['JavaScript', 'React', 'Node.js', 'HTML/CSS', 'Git', 'REST APIs'],
      },
    ]);

    console.log('Creating 15 Jobs across companies, locations, and types...');
    const jobs = await Job.create([
      {
        title: 'Senior Full Stack Engineer',
        company: 'Stripe',
        location: 'Remote / San Francisco',
        salary: '$150,000 - $190,000',
        description: 'Build next-generation payment interfaces and treasury ledger workflows using React, TypeScript, and high-reliability Node.js microservices.',
        requirements: ['5+ years full-stack experience', 'React 18+ & TypeScript', 'RESTful / gRPC APIs', 'PostgreSQL or MongoDB'],
        jobType: 'Full-time',
        employer_id: employers[0]._id,
      },
      {
        title: 'Staff Backend Systems Architect',
        company: 'Stripe',
        location: 'San Francisco, CA',
        salary: '$180,000 - $225,000',
        description: 'Lead the architecture for high-throughput idempotency keys, fraud detection pipelines, and global clearing settlements.',
        requirements: ['Distributed systems expertise', 'High-concurrency database design', 'Fault-tolerant message queues', 'Security compliance'],
        jobType: 'Full-time',
        employer_id: employers[0]._id,
      },
      {
        title: 'Fintech Solutions Intern',
        company: 'Stripe',
        location: 'New York, NY',
        salary: '$80,000 - $95,000',
        description: 'Join our developer developer-platform team for a 3-month summer internship building SDK tooling and documentation experiences.',
        requirements: ['Enrolled in Computer Science or self-taught portfolio', 'JavaScript/TypeScript proficiency', 'Strong problem solving skills'],
        jobType: 'Internship',
        employer_id: employers[0]._id,
      },
      {
        title: 'Frontend React Specialist',
        company: 'Linear',
        location: 'Remote',
        salary: '$135,000 - $170,000',
        description: 'Help build the world’s most delightful project management software with 60fps animations, instant offline sync, and keyboard command menus.',
        requirements: ['Mastery of modern React & State machines', 'Deep understanding of DOM rendering & Canvas', 'Tailwind CSS / CSS Modules', 'Eye for detail'],
        jobType: 'Full-time',
        employer_id: employers[1]._id,
      },
      {
        title: 'Contract UI Systems Engineer',
        company: 'Linear',
        location: 'Remote',
        salary: '$90 - $120 / hour',
        description: '6-month contract role to refactor our design token ecosystem and standardize component accessibility across dark and light themes.',
        requirements: ['WCAG AA compliance knowledge', 'Design system token architecture', 'React component library maintenance'],
        jobType: 'Contract',
        employer_id: employers[1]._id,
      },
      {
        title: 'Desktop Client Engineer (Electron)',
        company: 'Linear',
        location: 'Remote / London',
        salary: '$140,000 - $175,000',
        description: 'Optimize our macOS and Windows desktop applications for ultra-fast startup times and native system tray integrations.',
        requirements: ['Electron / Node.js native bindings', 'macOS & Windows OS APIs', 'Memory profiling and optimization'],
        jobType: 'Full-time',
        employer_id: employers[1]._id,
      },
      {
        title: 'Staff Product Designer',
        company: 'Airbnb',
        location: 'San Francisco, CA',
        salary: '$160,000 - $205,000',
        description: 'Lead visual design and spatial booking concepts for next-generation guest itineraries and host co-hosting experiences.',
        requirements: ['8+ years product design experience', 'Figma mastery & Design Systems', 'Cross-functional leadership', 'Portfolio demonstrating end-to-end craft'],
        jobType: 'Full-time',
        employer_id: employers[2]._id,
      },
      {
        title: 'UX Researcher & Prototyper',
        company: 'Airbnb',
        location: 'New York, NY',
        salary: '$120,000 - $150,000',
        description: 'Conduct qualitative host interviews and prototype interactive micro-flows for international traveler discovery.',
        requirements: ['Qualitative & quantitative user research methods', 'Figma / Principle / Framer prototyping', 'Data-informed storytelling'],
        jobType: 'Full-time',
        employer_id: employers[2]._id,
      },
      {
        title: 'Part-Time Brand & Visual Designer',
        company: 'Airbnb',
        location: 'Remote',
        salary: '$60 - $80 / hour',
        description: '20 hours/week crafting seasonal marketing launch assets, editorial illustrations, and social media component kits.',
        requirements: ['Graphic design & Typography', 'Figma / Illustrator', 'Ability to produce high-impact campaign graphics on tight deadlines'],
        jobType: 'Part-time',
        employer_id: employers[2]._id,
      },
      {
        title: 'Cloud Infrastructure & SRE Lead',
        company: 'Vercel',
        location: 'Remote',
        salary: '$165,000 - $210,000',
        description: 'Architect multi-cloud serverless routing, Anycast DNS resolvers, and edge compute execution workers handling billions of monthly requests.',
        requirements: ['Kubernetes & Docker', 'Terraform / IaC', 'AWS / GCP / Cloud Run', 'Distributed systems telemetry (Datadog, Prometheus)'],
        jobType: 'Full-time',
        employer_id: employers[3]._id,
      },
      {
        title: 'Developer Experience Engineer',
        company: 'Vercel',
        location: 'Remote / Seattle',
        salary: '$130,000 - $165,000',
        description: 'Improve the Vercel CLI, open source Next.js starter templates, and build pipeline feedback messages for millions of developers worldwide.',
        requirements: ['Node.js CLI development', 'Next.js & React expertise', 'Open source community contributions', 'Technical writing'],
        jobType: 'Full-time',
        employer_id: employers[3]._id,
      },
      {
        title: 'Junior Platform DevOps Intern',
        company: 'Vercel',
        location: 'Austin, TX',
        salary: '$75,000 - $90,000',
        description: 'Learn and contribute to automated CI/CD runners, container security scanning, and internal developer tooling.',
        requirements: ['Basic Linux command line knowledge', 'Familiarity with GitHub Actions or CI/CD pipelines', 'Eagerness to learn cloud architectures'],
        jobType: 'Internship',
        employer_id: employers[3]._id,
      },
      {
        title: 'AI Integration Engineer',
        company: 'OpenAI Ecosystem Partner',
        location: 'San Francisco, CA',
        salary: '$170,000 - $215,000',
        description: 'Design agentic workflows, embeddings search pipelines, and function calling middleware for enterprise customer support bots.',
        requirements: ['LLM APIs & Prompt engineering', 'Node.js / Python', 'Vector databases (Pinecone/pgvector)', 'Streaming web responses'],
        jobType: 'Full-time',
        employer_id: employers[0]._id,
      },
      {
        title: 'Contract React Native Mobile Developer',
        company: 'Notion Labs',
        location: 'Remote',
        salary: '$85 - $110 / hour',
        description: '3-month contract building offline caching synchronization and block editor performance improvements on Android.',
        requirements: ['React Native & TypeScript', 'Android performance profiling', 'Offline-first database architecture'],
        jobType: 'Contract',
        employer_id: employers[1]._id,
      },
      {
        title: 'Part-Time Technical Content Writer',
        company: 'Datadog Partner',
        location: 'Remote',
        salary: '$45 - $65 / hour',
        description: 'Produce in-depth developer tutorials, architectural teardowns, and sample code repositories for cloud monitoring best practices.',
        requirements: ['Clear technical writing style', 'Familiarity with modern web stacks (Node.js, Express, React)', 'Markdown & Git'],
        jobType: 'Part-time',
        employer_id: employers[3]._id,
      },
    ]);

    console.log('Creating 12 Applications across candidates, jobs, and statuses...');
    await Application.create([
      // Applications for Stripe Senior Full Stack (Job 0)
      {
        job_id: jobs[0]._id,
        candidate_id: candidates[0]._id, // Alex Chen
        status: 'Shortlisted',
        applied_at: new Date('2026-02-10T10:00:00Z'),
      },
      {
        job_id: jobs[0]._id,
        candidate_id: candidates[1]._id, // Maya Patel
        status: 'Applied',
        applied_at: new Date('2026-02-12T14:30:00Z'),
      },
      {
        job_id: jobs[0]._id,
        candidate_id: candidates[6]._id, // Ryan Tanaka
        status: 'Rejected',
        applied_at: new Date('2026-02-08T09:15:00Z'),
      },

      // Applications for Linear Frontend Specialist (Job 3)
      {
        job_id: jobs[3]._id,
        candidate_id: candidates[1]._id, // Maya Patel
        status: 'Shortlisted',
        applied_at: new Date('2026-02-11T11:00:00Z'),
      },
      {
        job_id: jobs[3]._id,
        candidate_id: candidates[0]._id, // Alex Chen
        status: 'Applied',
        applied_at: new Date('2026-02-14T16:20:00Z'),
      },

      // Applications for Airbnb Staff Product Designer (Job 6)
      {
        job_id: jobs[6]._id,
        candidate_id: candidates[3]._id, // Sophia Martinez
        status: 'Shortlisted',
        applied_at: new Date('2026-02-09T13:45:00Z'),
      },

      // Applications for Vercel SRE Lead (Job 9)
      {
        job_id: jobs[9]._id,
        candidate_id: candidates[4]._id, // Liam O'Connor
        status: 'Shortlisted',
        applied_at: new Date('2026-02-13T10:10:00Z'),
      },
      {
        job_id: jobs[9]._id,
        candidate_id: candidates[2]._id, // James Wilson
        status: 'Applied',
        applied_at: new Date('2026-02-15T15:00:00Z'),
      },

      // Applications for Stripe Fintech Intern (Job 2)
      {
        job_id: jobs[2]._id,
        candidate_id: candidates[6]._id, // Ryan Tanaka
        status: 'Applied',
        applied_at: new Date('2026-02-16T12:00:00Z'),
      },

      // Applications for Linear Contract UI (Job 4)
      {
        job_id: jobs[4]._id,
        candidate_id: candidates[1]._id, // Maya Patel
        status: 'Applied',
        applied_at: new Date('2026-02-14T08:30:00Z'),
      },

      // Applications for Notion Contract Mobile (Job 13)
      {
        job_id: jobs[13]._id,
        candidate_id: candidates[5]._id, // Chloe Dubois
        status: 'Shortlisted',
        applied_at: new Date('2026-02-12T17:00:00Z'),
      },

      // Applications for Datadog Part-Time Writer (Job 14)
      {
        job_id: jobs[14]._id,
        candidate_id: candidates[6]._id, // Ryan Tanaka
        status: 'Applied',
        applied_at: new Date('2026-02-15T09:00:00Z'),
      },
    ]);

    console.log('✅ Seed process completed successfully!');
    console.log(`Generated: ${employers.length} Employers, ${candidates.length} Candidates, ${jobs.length} Jobs, 12 Applications.`);
    
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
