const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const defaultPasswordHash = bcrypt.hashSync('password123', salt);

const users = [
  {
    _id: 'user_emp_1',
    name: 'Sarah Jenkins',
    email: 'sarah@stripe.com',
    password: defaultPasswordHash,
    role: 'employer',
    headline: 'VP of Engineering @ Stripe',
    bio: 'Building global economic infrastructure. Hiring high-caliber systems and full-stack builders.',
    skills: ['Hiring', 'System Architecture', 'Fintech', 'Leadership'],
    createdAt: new Date('2026-01-15T08:00:00Z'),
    updatedAt: new Date('2026-01-15T08:00:00Z'),
  },
  {
    _id: 'user_emp_2',
    name: 'David Marcus',
    email: 'david@linear.app',
    password: defaultPasswordHash,
    role: 'employer',
    headline: 'Head of Product Engineering @ Linear',
    bio: 'Crafting the tool for software projects. Obsessed with speed, keyboard workflows, and design craftsmanship.',
    skills: ['Product Design', 'React', 'TypeScript', 'Engineering Management'],
    createdAt: new Date('2026-01-18T09:00:00Z'),
    updatedAt: new Date('2026-01-18T09:00:00Z'),
  },
  {
    _id: 'user_emp_3',
    name: 'Elena Rostova',
    email: 'elena@airbnb.com',
    password: defaultPasswordHash,
    role: 'employer',
    headline: 'Staff Design Director @ Airbnb',
    bio: 'Leading design systems and international guest trip experiences across web & mobile.',
    skills: ['Design Systems', 'Figma', 'UX Research', 'Frontend Strategy'],
    createdAt: new Date('2026-01-20T10:00:00Z'),
    updatedAt: new Date('2026-01-20T10:00:00Z'),
  },
  {
    _id: 'user_emp_4',
    name: 'Marcus Vance',
    email: 'marcus@vercel.com',
    password: defaultPasswordHash,
    role: 'employer',
    headline: 'Director of Cloud Platform @ Vercel',
    bio: 'Empowering web developers with ultra-fast edge infrastructure and serverless execution.',
    skills: ['Cloud Infrastructure', 'Kubernetes', 'Next.js', 'DevOps'],
    createdAt: new Date('2026-01-22T11:00:00Z'),
    updatedAt: new Date('2026-01-22T11:00:00Z'),
  },

  // Candidates
  {
    _id: 'user_cand_1',
    name: 'Alex Chen',
    email: 'alex.chen@smarthire.io',
    password: defaultPasswordHash,
    role: 'candidate',
    headline: 'Senior Full Stack Engineer (React, Node, TS)',
    bio: '7+ years building enterprise SaaS platforms and real-time distributed web apps.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Tailwind CSS'],
    createdAt: new Date('2026-01-20T10:00:00Z'),
    updatedAt: new Date('2026-01-20T10:00:00Z'),
  },
  {
    _id: 'user_cand_2',
    name: 'Maya Patel',
    email: 'maya.patel@smarthire.io',
    password: defaultPasswordHash,
    role: 'candidate',
    headline: 'Frontend Architect & UI Specialist',
    bio: 'Passionate about micro-interactions, web performance, and accessible UI component systems.',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Vite', 'CSS Architecture', 'Figma'],
    createdAt: new Date('2026-01-22T14:00:00Z'),
    updatedAt: new Date('2026-01-22T14:00:00Z'),
  },
  {
    _id: 'user_cand_3',
    name: 'James Wilson',
    email: 'james.wilson@smarthire.io',
    password: defaultPasswordHash,
    role: 'candidate',
    headline: 'Backend & Distributed Systems Engineer',
    bio: 'Specialist in high-throughput microservices, Redis caching, and database query optimizations.',
    skills: ['Node.js', 'Express', 'Go', 'MongoDB', 'PostgreSQL', 'Kafka', 'Docker'],
    createdAt: new Date('2026-01-24T12:00:00Z'),
    updatedAt: new Date('2026-01-24T12:00:00Z'),
  },
  {
    _id: 'user_cand_4',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@smarthire.io',
    password: defaultPasswordHash,
    role: 'candidate',
    headline: 'Product Designer (UI/UX) & Prototyper',
    bio: 'Designing user-first workflows from user journey maps to high-fidelity clickable Figma designs.',
    skills: ['UI/UX', 'Figma', 'Prototyping', 'Design Systems', 'User Research'],
    createdAt: new Date('2026-01-25T15:00:00Z'),
    updatedAt: new Date('2026-01-25T15:00:00Z'),
  },
  {
    _id: 'user_cand_5',
    name: 'Liam O’Connor',
    email: 'liam.dev@smarthire.io',
    password: defaultPasswordHash,
    role: 'candidate',
    headline: 'DevOps & Site Reliability Engineer',
    bio: 'Automating multi-region cloud deployments, Kubernetes orchestration, and zero-downtime CI/CD.',
    skills: ['Kubernetes', 'Docker', 'AWS', 'GCP', 'Terraform', 'GitHub Actions', 'Prometheus'],
    createdAt: new Date('2026-01-26T09:00:00Z'),
    updatedAt: new Date('2026-01-26T09:00:00Z'),
  },
  {
    _id: 'user_cand_6',
    name: 'Chloe Dubois',
    email: 'chloe.dubois@smarthire.io',
    password: defaultPasswordHash,
    role: 'candidate',
    headline: 'Cross-Platform Mobile Engineer',
    bio: 'Building native-feel iOS & Android apps with React Native, offline caching, and biometric auth.',
    skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Redux Toolkit'],
    createdAt: new Date('2026-01-28T16:00:00Z'),
    updatedAt: new Date('2026-01-28T16:00:00Z'),
  },
  {
    _id: 'user_cand_7',
    name: 'Ryan Tanaka',
    email: 'ryan.tanaka@smarthire.io',
    password: defaultPasswordHash,
    role: 'candidate',
    headline: 'Junior Full Stack Developer',
    bio: 'Curious, fast-learning developer eager to contribute to modern full-stack web products.',
    skills: ['JavaScript', 'React', 'Node.js', 'HTML/CSS', 'Git', 'REST APIs'],
    createdAt: new Date('2026-01-30T11:00:00Z'),
    updatedAt: new Date('2026-01-30T11:00:00Z'),
  },
];

const jobs = [
  {
    _id: 'job_1',
    title: 'Senior Full Stack Engineer',
    company: 'Stripe',
    location: 'Remote / San Francisco',
    salary: '$150,000 - $190,000',
    description: 'Build next-generation payment interfaces and treasury ledger workflows using React, TypeScript, and high-reliability Node.js microservices.',
    requirements: ['5+ years full-stack experience', 'React 18+ & TypeScript', 'RESTful / gRPC APIs', 'PostgreSQL or MongoDB'],
    jobType: 'Full-time',
    employer_id: 'user_emp_1',
    createdAt: new Date('2026-02-01T09:00:00Z'),
    updatedAt: new Date('2026-02-01T09:00:00Z'),
  },
  {
    _id: 'job_2',
    title: 'Staff Backend Systems Architect',
    company: 'Stripe',
    location: 'San Francisco, CA',
    salary: '$180,000 - $225,000',
    description: 'Lead the architecture for high-throughput idempotency keys, fraud detection pipelines, and global clearing settlements.',
    requirements: ['Distributed systems expertise', 'High-concurrency database design', 'Fault-tolerant message queues', 'Security compliance'],
    jobType: 'Full-time',
    employer_id: 'user_emp_1',
    createdAt: new Date('2026-02-03T11:00:00Z'),
    updatedAt: new Date('2026-02-03T11:00:00Z'),
  },
  {
    _id: 'job_3',
    title: 'Fintech Solutions Intern',
    company: 'Stripe',
    location: 'New York, NY',
    salary: '$80,000 - $95,000',
    description: 'Join our developer developer-platform team for a 3-month summer internship building SDK tooling and documentation experiences.',
    requirements: ['Enrolled in Computer Science or self-taught portfolio', 'JavaScript/TypeScript proficiency', 'Strong problem solving skills'],
    jobType: 'Internship',
    employer_id: 'user_emp_1',
    createdAt: new Date('2026-02-04T15:00:00Z'),
    updatedAt: new Date('2026-02-04T15:00:00Z'),
  },
  {
    _id: 'job_4',
    title: 'Frontend React Specialist',
    company: 'Linear',
    location: 'Remote',
    salary: '$135,000 - $170,000',
    description: 'Help build the world’s most delightful project management software with 60fps animations, instant offline sync, and keyboard command menus.',
    requirements: ['Mastery of modern React & State machines', 'Deep understanding of DOM rendering & Canvas', 'Tailwind CSS / CSS Modules', 'Eye for detail'],
    jobType: 'Full-time',
    employer_id: 'user_emp_2',
    createdAt: new Date('2026-02-05T11:30:00Z'),
    updatedAt: new Date('2026-02-05T11:30:00Z'),
  },
  {
    _id: 'job_5',
    title: 'Contract UI Systems Engineer',
    company: 'Linear',
    location: 'Remote',
    salary: '$90 - $120 / hour',
    description: '6-month contract role to refactor our design token ecosystem and standardize component accessibility across dark and light themes.',
    requirements: ['WCAG AA compliance knowledge', 'Design system token architecture', 'React component library maintenance'],
    jobType: 'Contract',
    employer_id: 'user_emp_2',
    createdAt: new Date('2026-02-06T14:00:00Z'),
    updatedAt: new Date('2026-02-06T14:00:00Z'),
  },
  {
    _id: 'job_6',
    title: 'Desktop Client Engineer (Electron)',
    company: 'Linear',
    location: 'Remote / London',
    salary: '$140,000 - $175,000',
    description: 'Optimize our macOS and Windows desktop applications for ultra-fast startup times and native system tray integrations.',
    requirements: ['Electron / Node.js native bindings', 'macOS & Windows OS APIs', 'Memory profiling and optimization'],
    jobType: 'Full-time',
    employer_id: 'user_emp_2',
    createdAt: new Date('2026-02-07T10:00:00Z'),
    updatedAt: new Date('2026-02-07T10:00:00Z'),
  },
  {
    _id: 'job_7',
    title: 'Staff Product Designer',
    company: 'Airbnb',
    location: 'San Francisco, CA',
    salary: '$160,000 - $205,000',
    description: 'Lead visual design and spatial booking concepts for next-generation guest itineraries and host co-hosting experiences.',
    requirements: ['8+ years product design experience', 'Figma mastery & Design Systems', 'Cross-functional leadership', 'Portfolio demonstrating end-to-end craft'],
    jobType: 'Full-time',
    employer_id: 'user_emp_3',
    createdAt: new Date('2026-02-08T13:00:00Z'),
    updatedAt: new Date('2026-02-08T13:00:00Z'),
  },
  {
    _id: 'job_8',
    title: 'UX Researcher & Prototyper',
    company: 'Airbnb',
    location: 'New York, NY',
    salary: '$120,000 - $150,000',
    description: 'Conduct qualitative host interviews and prototype interactive micro-flows for international traveler discovery.',
    requirements: ['Qualitative & quantitative user research methods', 'Figma / Principle / Framer prototyping', 'Data-informed storytelling'],
    jobType: 'Full-time',
    employer_id: 'user_emp_3',
    createdAt: new Date('2026-02-09T09:30:00Z'),
    updatedAt: new Date('2026-02-09T09:30:00Z'),
  },
  {
    _id: 'job_9',
    title: 'Part-Time Brand & Visual Designer',
    company: 'Airbnb',
    location: 'Remote',
    salary: '$60 - $80 / hour',
    description: '20 hours/week crafting seasonal marketing launch assets, editorial illustrations, and social media component kits.',
    requirements: ['Graphic design & Typography', 'Figma / Illustrator', 'Ability to produce high-impact campaign graphics on tight deadlines'],
    jobType: 'Part-time',
    employer_id: 'user_emp_3',
    createdAt: new Date('2026-02-10T14:15:00Z'),
    updatedAt: new Date('2026-02-10T14:15:00Z'),
  },
  {
    _id: 'job_10',
    title: 'Cloud Infrastructure & SRE Lead',
    company: 'Vercel',
    location: 'Remote',
    salary: '$165,000 - $210,000',
    description: 'Architect multi-cloud serverless routing, Anycast DNS resolvers, and edge compute execution workers handling billions of monthly requests.',
    requirements: ['Kubernetes & Docker', 'Terraform / IaC', 'AWS / GCP / Cloud Run', 'Distributed systems telemetry (Datadog, Prometheus)'],
    jobType: 'Full-time',
    employer_id: 'user_emp_4',
    createdAt: new Date('2026-02-11T16:00:00Z'),
    updatedAt: new Date('2026-02-11T16:00:00Z'),
  },
  {
    _id: 'job_11',
    title: 'Developer Experience Engineer',
    company: 'Vercel',
    location: 'Remote / Seattle',
    salary: '$130,000 - $165,000',
    description: 'Improve the Vercel CLI, open source Next.js starter templates, and build pipeline feedback messages for millions of developers worldwide.',
    requirements: ['Node.js CLI development', 'Next.js & React expertise', 'Open source community contributions', 'Technical writing'],
    jobType: 'Full-time',
    employer_id: 'user_emp_4',
    createdAt: new Date('2026-02-12T10:00:00Z'),
    updatedAt: new Date('2026-02-12T10:00:00Z'),
  },
  {
    _id: 'job_12',
    title: 'Junior Platform DevOps Intern',
    company: 'Vercel',
    location: 'Austin, TX',
    salary: '$75,000 - $90,000',
    description: 'Learn and contribute to automated CI/CD runners, container security scanning, and internal developer tooling.',
    requirements: ['Basic Linux command line knowledge', 'Familiarity with GitHub Actions or CI/CD pipelines', 'Eagerness to learn cloud architectures'],
    jobType: 'Internship',
    employer_id: 'user_emp_4',
    createdAt: new Date('2026-02-13T11:00:00Z'),
    updatedAt: new Date('2026-02-13T11:00:00Z'),
  },
  {
    _id: 'job_13',
    title: 'AI Integration Engineer',
    company: 'OpenAI Ecosystem Partner',
    location: 'San Francisco, CA',
    salary: '$170,000 - $215,000',
    description: 'Design agentic workflows, embeddings search pipelines, and function calling middleware for enterprise customer support bots.',
    requirements: ['LLM APIs & Prompt engineering', 'Node.js / Python', 'Vector databases (Pinecone/pgvector)', 'Streaming web responses'],
    jobType: 'Full-time',
    employer_id: 'user_emp_1',
    createdAt: new Date('2026-02-14T09:00:00Z'),
    updatedAt: new Date('2026-02-14T09:00:00Z'),
  },
  {
    _id: 'job_14',
    title: 'Contract React Native Mobile Developer',
    company: 'Notion Labs',
    location: 'Remote',
    salary: '$85 - $110 / hour',
    description: '3-month contract building offline caching synchronization and block editor performance improvements on Android.',
    requirements: ['React Native & TypeScript', 'Android performance profiling', 'Offline-first database architecture'],
    jobType: 'Contract',
    employer_id: 'user_emp_2',
    createdAt: new Date('2026-02-15T10:00:00Z'),
    updatedAt: new Date('2026-02-15T10:00:00Z'),
  },
  {
    _id: 'job_15',
    title: 'Part-Time Technical Content Writer',
    company: 'Datadog Partner',
    location: 'Remote',
    salary: '$45 - $65 / hour',
    description: 'Produce in-depth developer tutorials, architectural teardowns, and sample code repositories for cloud monitoring best practices.',
    requirements: ['Clear technical writing style', 'Familiarity with modern web stacks (Node.js, Express, React)', 'Markdown & Git'],
    jobType: 'Part-time',
    employer_id: 'user_emp_4',
    createdAt: new Date('2026-02-15T15:00:00Z'),
    updatedAt: new Date('2026-02-15T15:00:00Z'),
  },
];

const applications = [
  {
    _id: 'app_1',
    job_id: 'job_1',
    candidate_id: 'user_cand_1',
    status: 'Shortlisted',
    applied_at: new Date('2026-02-10T10:00:00Z'),
    createdAt: new Date('2026-02-10T10:00:00Z'),
    updatedAt: new Date('2026-02-10T10:00:00Z'),
  },
  {
    _id: 'app_2',
    job_id: 'job_1',
    candidate_id: 'user_cand_2',
    status: 'Applied',
    applied_at: new Date('2026-02-12T14:30:00Z'),
    createdAt: new Date('2026-02-12T14:30:00Z'),
    updatedAt: new Date('2026-02-12T14:30:00Z'),
  },
  {
    _id: 'app_3',
    job_id: 'job_1',
    candidate_id: 'user_cand_7',
    status: 'Rejected',
    applied_at: new Date('2026-02-08T09:15:00Z'),
    createdAt: new Date('2026-02-08T09:15:00Z'),
    updatedAt: new Date('2026-02-08T09:15:00Z'),
  },
  {
    _id: 'app_4',
    job_id: 'job_4',
    candidate_id: 'user_cand_2',
    status: 'Shortlisted',
    applied_at: new Date('2026-02-11T11:00:00Z'),
    createdAt: new Date('2026-02-11T11:00:00Z'),
    updatedAt: new Date('2026-02-11T11:00:00Z'),
  },
  {
    _id: 'app_5',
    job_id: 'job_4',
    candidate_id: 'user_cand_1',
    status: 'Applied',
    applied_at: new Date('2026-02-14T16:20:00Z'),
    createdAt: new Date('2026-02-14T16:20:00Z'),
    updatedAt: new Date('2026-02-14T16:20:00Z'),
  },
  {
    _id: 'app_6',
    job_id: 'job_7',
    candidate_id: 'user_cand_4',
    status: 'Shortlisted',
    applied_at: new Date('2026-02-09T13:45:00Z'),
    createdAt: new Date('2026-02-09T13:45:00Z'),
    updatedAt: new Date('2026-02-09T13:45:00Z'),
  },
  {
    _id: 'app_7',
    job_id: 'job_10',
    candidate_id: 'user_cand_5',
    status: 'Shortlisted',
    applied_at: new Date('2026-02-13T10:10:00Z'),
    createdAt: new Date('2026-02-13T10:10:00Z'),
    updatedAt: new Date('2026-02-13T10:10:00Z'),
  },
  {
    _id: 'app_8',
    job_id: 'job_10',
    candidate_id: 'user_cand_3',
    status: 'Applied',
    applied_at: new Date('2026-02-15T15:00:00Z'),
    createdAt: new Date('2026-02-15T15:00:00Z'),
    updatedAt: new Date('2026-02-15T15:00:00Z'),
  },
  {
    _id: 'app_9',
    job_id: 'job_3',
    candidate_id: 'user_cand_7',
    status: 'Applied',
    applied_at: new Date('2026-02-16T12:00:00Z'),
    createdAt: new Date('2026-02-16T12:00:00Z'),
    updatedAt: new Date('2026-02-16T12:00:00Z'),
  },
  {
    _id: 'app_10',
    job_id: 'job_5',
    candidate_id: 'user_cand_2',
    status: 'Applied',
    applied_at: new Date('2026-02-14T08:30:00Z'),
    createdAt: new Date('2026-02-14T08:30:00Z'),
    updatedAt: new Date('2026-02-14T08:30:00Z'),
  },
  {
    _id: 'app_11',
    job_id: 'job_14',
    candidate_id: 'user_cand_6',
    status: 'Shortlisted',
    applied_at: new Date('2026-02-12T17:00:00Z'),
    createdAt: new Date('2026-02-12T17:00:00Z'),
    updatedAt: new Date('2026-02-12T17:00:00Z'),
  },
  {
    _id: 'app_12',
    job_id: 'job_15',
    candidate_id: 'user_cand_7',
    status: 'Applied',
    applied_at: new Date('2026-02-15T09:00:00Z'),
    createdAt: new Date('2026-02-15T09:00:00Z'),
    updatedAt: new Date('2026-02-15T09:00:00Z'),
  },
  {
    _id: 'app_13',
    job_id: 'job_8',
    candidate_id: 'user_cand_4',
    status: 'Applied',
    applied_at: new Date('2026-02-11T14:20:00Z'),
    createdAt: new Date('2026-02-11T14:20:00Z'),
    updatedAt: new Date('2026-02-11T14:20:00Z'),
  },
  {
    _id: 'app_14',
    job_id: 'job_9',
    candidate_id: 'user_cand_4',
    status: 'Shortlisted',
    applied_at: new Date('2026-02-13T16:45:00Z'),
    createdAt: new Date('2026-02-13T16:45:00Z'),
    updatedAt: new Date('2026-02-13T16:45:00Z'),
  },
  {
    _id: 'app_15',
    job_id: 'job_7',
    candidate_id: 'user_cand_2',
    status: 'Rejected',
    applied_at: new Date('2026-02-10T08:00:00Z'),
    createdAt: new Date('2026-02-10T08:00:00Z'),
    updatedAt: new Date('2026-02-10T08:00:00Z'),
  },
  {
    _id: 'app_16',
    job_id: 'job_11',
    candidate_id: 'user_cand_1',
    status: 'Shortlisted',
    applied_at: new Date('2026-02-14T11:15:00Z'),
    createdAt: new Date('2026-02-14T11:15:00Z'),
    updatedAt: new Date('2026-02-14T11:15:00Z'),
  },
  {
    _id: 'app_17',
    job_id: 'job_13',
    candidate_id: 'user_cand_3',
    status: 'Shortlisted',
    applied_at: new Date('2026-02-16T10:30:00Z'),
    createdAt: new Date('2026-02-16T10:30:00Z'),
    updatedAt: new Date('2026-02-16T10:30:00Z'),
  },
];

class UserInstance {
  constructor(data) {
    Object.assign(this, data);
  }

  get id() {
    return this._id;
  }

  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  async save() {
    const idx = users.findIndex((u) => u._id === this._id);
    if (idx !== -1) {
      users[idx] = { ...this, updatedAt: new Date() };
    }
    return this;
  }
}

class JobInstance {
  constructor(data) {
    Object.assign(this, data);
  }

  get id() {
    return this._id;
  }

  async deleteOne() {
    const idx = jobs.findIndex((j) => j._id === this._id);
    if (idx !== -1) {
      jobs.splice(idx, 1);
    }
    // Also remove associated applications
    for (let i = applications.length - 1; i >= 0; i--) {
      if (String(applications[i].job_id) === String(this._id)) {
        applications.splice(i, 1);
      }
    }
    return { acknowledged: true, deletedCount: 1 };
  }

  async save() {
    const idx = jobs.findIndex((j) => j._id === this._id);
    if (idx !== -1) {
      jobs[idx] = { ...this, updatedAt: new Date() };
    }
    return this;
  }
}

class ApplicationInstance {
  constructor(data) {
    Object.assign(this, data);
  }

  get id() {
    return this._id;
  }

  async save() {
    const idx = applications.findIndex((a) => a._id === this._id);
    if (idx !== -1) {
      applications[idx] = { ...this, updatedAt: new Date() };
    }
    return this;
  }
}

// Memory query chain helper
class MemoryQuery {
  constructor(executor) {
    this._executor = executor;
    this._populates = [];
    this._selects = [];
  }

  populate(fieldOrOptions, selectFields) {
    if (typeof fieldOrOptions === 'object') {
      this._populates.push(fieldOrOptions);
    } else {
      this._populates.push({ path: fieldOrOptions, select: selectFields });
    }
    return this;
  }

  select(fields) {
    if (Array.isArray(fields)) {
      this._selects.push(...fields);
    } else if (typeof fields === 'string') {
      this._selects.push(...fields.split(' '));
    }
    return this;
  }

  async exec() {
    let result = await this._executor();
    if (!result) return null;

    const applyPopulate = (item) => {
      if (!item) return item;

      let clone;
      if (item instanceof UserInstance) {
        clone = new UserInstance(item);
      } else if (item instanceof JobInstance) {
        clone = new JobInstance(item);
      } else if (item instanceof ApplicationInstance) {
        clone = new ApplicationInstance(item);
      } else if (typeof item === 'object') {
        clone = { ...item };
      } else {
        return item;
      }

      for (const pop of this._populates) {
        const path = pop.path;
        if (path === 'employer_id') {
          const empId = typeof clone.employer_id === 'object' ? clone.employer_id?._id || clone.employer_id?.id : clone.employer_id;
          const emp = users.find((u) => u._id === empId || String(u._id) === String(empId));
          if (emp) {
            clone.employer_id = { _id: emp._id, id: emp._id, name: emp.name, email: emp.email, headline: emp.headline, bio: emp.bio };
          }
        } else if (path === 'job_id') {
          const jId = typeof clone.job_id === 'object' ? clone.job_id?._id || clone.job_id?.id : clone.job_id;
          const j = jobs.find((job) => job._id === jId || String(job._id) === String(jId));
          if (j) {
            clone.job_id = { ...j, id: j._id };
          }
        } else if (path === 'candidate_id') {
          const cId = typeof clone.candidate_id === 'object' ? clone.candidate_id?._id || clone.candidate_id?.id : clone.candidate_id;
          const cand = users.find((u) => u._id === cId || String(u._id) === String(cId));
          if (cand) {
            clone.candidate_id = { _id: cand._id, id: cand._id, name: cand.name, email: cand.email, headline: cand.headline, bio: cand.bio, skills: cand.skills };
          }
        }
      }

      for (const sel of this._selects) {
        if (sel === '-password') {
          delete clone.password;
        }
      }

      return clone;
    };

    if (Array.isArray(result)) {
      return result.map(applyPopulate);
    }
    return applyPopulate(result);
  }

  then(onFulfilled, onRejected) {
    return this.exec().then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.exec().catch(onRejected);
  }
}

const memoryStore = {
  users,
  jobs,
  applications,

  User: {
    findOne: (query) => {
      return new MemoryQuery(() => {
        const user = users.find((u) => {
          if (query.email && u.email.toLowerCase() === query.email.toLowerCase()) return true;
          if (query._id && u._id === query._id) return true;
          return false;
        });
        return user ? new UserInstance(user) : null;
      });
    },

    findById: (id) => {
      return new MemoryQuery(() => {
        const user = users.find((u) => u._id === id || String(u._id) === String(id));
        return user ? new UserInstance(user) : null;
      });
    },

    create: async (data) => {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = {
        _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        headline: data.headline || '',
        bio: data.bio || '',
        skills: data.skills || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(newUser);
      return new UserInstance(newUser);
    },

    findByIdAndUpdate: async (id, updateData, options = {}) => {
      const idx = users.findIndex((u) => u._id === id || String(u._id) === String(id));
      if (idx === -1) return null;
      const updated = {
        ...users[idx],
        ...updateData,
        updatedAt: new Date(),
      };
      users[idx] = updated;
      return new UserInstance(updated);
    },
  },

  Job: {
    find: (filter = {}) => {
      return new MemoryQuery(() => {
        let results = [...jobs];

        if (filter.employer_id) {
          results = results.filter((j) => String(j.employer_id) === String(filter.employer_id));
        }

        if (filter.jobType) {
          results = results.filter((j) => j.jobType === filter.jobType);
        }

        if (filter.location && filter.location.$regex) {
          const locRegex = new RegExp(filter.location.$regex, filter.location.$options || 'i');
          results = results.filter((j) => locRegex.test(j.location));
        }

        if (filter.$or) {
          // Search query in title, company, description, requirements
          const searchRegex = filter.$or[0]?.title?.$regex;
          if (searchRegex) {
            const regex = new RegExp(searchRegex, 'i');
            results = results.filter((j) => {
              const inTitle = regex.test(j.title);
              const inCompany = regex.test(j.company);
              const inDesc = regex.test(j.description);
              const inReqs = Array.isArray(j.requirements) && j.requirements.some((r) => regex.test(r));
              return inTitle || inCompany || inDesc || inReqs;
            });
          }
        }

        return results.map((j) => new JobInstance(j));
      });
    },

    findById: (id) => {
      return new MemoryQuery(() => {
        const job = jobs.find((j) => j._id === id || String(j._id) === String(id));
        return job ? new JobInstance(job) : null;
      });
    },

    create: async (data) => {
      const newJob = {
        _id: 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        title: data.title,
        company: data.company,
        location: data.location,
        salary: data.salary || 'Competitive / Unspecified',
        description: data.description,
        requirements: data.requirements || [],
        jobType: data.jobType,
        employer_id: data.employer_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jobs.unshift(newJob);
      return new JobInstance(newJob);
    },

    findByIdAndUpdate: async (id, updateData, options = {}) => {
      const idx = jobs.findIndex((j) => j._id === id || String(j._id) === String(id));
      if (idx === -1) return null;
      const updated = {
        ...jobs[idx],
        ...updateData,
        updatedAt: new Date(),
      };
      jobs[idx] = updated;
      return new JobInstance(updated);
    },
  },

  Application: {
    findOne: (query) => {
      return new MemoryQuery(() => {
        const app = applications.find((a) => {
          const matchJob = String(a.job_id) === String(query.job_id);
          const matchCand = String(a.candidate_id) === String(query.candidate_id);
          return matchJob && matchCand;
        });
        return app ? new ApplicationInstance(app) : null;
      });
    },

    findById: (id) => {
      return new MemoryQuery(() => {
        const app = applications.find((a) => a._id === id || String(a._id) === String(id));
        return app ? new ApplicationInstance(app) : null;
      });
    },

    find: (filter = {}) => {
      return new MemoryQuery(() => {
        let results = [...applications];
        if (filter.candidate_id) {
          results = results.filter((a) => String(a.candidate_id) === String(filter.candidate_id));
        }
        if (filter.job_id) {
          if (filter.job_id.$in) {
            const strIds = filter.job_id.$in.map(String);
            results = results.filter((a) => strIds.includes(String(a.job_id)));
          } else {
            results = results.filter((a) => String(a.job_id) === String(filter.job_id));
          }
        }
        if (filter.status) {
          results = results.filter((a) => a.status === filter.status);
        }
        return results.map((a) => new ApplicationInstance(a));
      });
    },

    create: async (data) => {
      const newApp = {
        _id: 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        job_id: data.job_id,
        candidate_id: data.candidate_id,
        status: data.status || 'Applied',
        applied_at: data.applied_at || new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      applications.unshift(newApp);
      return new ApplicationInstance(newApp);
    },

    findByIdAndUpdate: async (id, updateData, options = {}) => {
      const idx = applications.findIndex((a) => a._id === id || String(a._id) === String(id));
      if (idx === -1) return null;
      const updated = {
        ...applications[idx],
        ...updateData,
        updatedAt: new Date(),
      };
      applications[idx] = updated;
      return new ApplicationInstance(updated);
    },
  },
};

module.exports = memoryStore;
