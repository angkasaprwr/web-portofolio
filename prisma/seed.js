const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'Admin@123456',
    12
  );

  const admin = await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@sukma.dev' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@sukma.dev',
      password: hashedPassword,
      name: process.env.ADMIN_NAME || 'Sukma Admin',
    },
  });
  console.log('✅ Admin created:', admin.email);

  await prisma.about.deleteMany();
  await prisma.about.create({
    data: {
      fullName: 'Rr Sukma Ayu Dwi Wulandari',
      shortName: 'Sukma',
      profession: 'UI/UX Designer',
      headline: 'Desain yang Indah, Pengalaman yang Berkesan',
      bio: 'Saya adalah UI/UX Designer yang berfokus pada menciptakan pengalaman digital yang elegan, intuitif, dan bermakna. Dengan perpaduan kreativitas dan pemikiran analitis, saya merancang antarmuka yang tidak hanya indah dipandang, tetapi juga mudah digunakan.',
      shortBio:
        'Passionate UI/UX Designer yang menghadirkan desain elegan dan pengalaman pengguna yang berkesan.',
      story:
        'Perjalanan saya di dunia desain dimulai dari rasa ingin tahu terhadap bagaimana teknologi dapat menyentuh kehidupan manusia. Melalui setiap proyek, saya belajar bahwa desain yang baik lahir dari empati, riset, dan ketelitian terhadap detail.\n\nSaya percaya setiap pixel memiliki tujuan, dan setiap interaksi harus terasa natural. Hingga saat ini, saya terus mengembangkan keterampilan dalam UI Design, Web Development, dan Data Analysis untuk menciptakan solusi yang holistik.',
      quote:
        'Desain bukan hanya tentang tampilan, tapi tentang bagaimana ia bekerja dan memberi makna bagi penggunanya.',
      birthDate: new Date('2001-12-21'),
      education: 'Teknik Informatika - UHN',
      yearsExperience: 2,
      projectsCount: 10,
      clientsCount: 5,
      commitment: '100%',
      hobbies: [
        { name: 'Desain', icon: 'palette' },
        { name: 'Fotografi', icon: 'camera' },
        { name: 'Musik', icon: 'music' },
        { name: 'Traveling', icon: 'plane' },
        { name: 'Ngoding', icon: 'code' },
        { name: 'Belajar Hal Baru', icon: 'book' },
      ],
      educationTimeline: [
        {
          institution: 'Universitas Harapan Nusantara',
          degree: 'Teknik Informatika',
          period: '2021 - Sekarang',
          detail: 'Semester 8',
        },
        {
          institution: 'SMA Negeri 1 Tegal',
          degree: 'IPA',
          period: '2018 - 2021',
          detail: 'Nilai Akhir: 89',
        },
        {
          institution: 'SMP Negeri 2 Tegal',
          degree: 'SMP',
          period: '2015 - 2018',
          detail: 'Lulus',
        },
      ],
      isActive: true,
    },
  });
  console.log('✅ About seeded');

  await prisma.skill.deleteMany();
  const skills = [
    { name: 'User Interface Design', category: 'UI Design', level: 95, icon: 'figma', isFeatured: true, order: 1 },
    { name: 'Wireframing & Prototyping', category: 'UI Design', level: 90, icon: 'layout', isFeatured: true, order: 2 },
    { name: 'Design System', category: 'UI Design', level: 88, icon: 'layers', isFeatured: true, order: 3 },
    { name: 'Responsive Design', category: 'UI Design', level: 92, icon: 'smartphone', isFeatured: true, order: 4 },
    { name: 'HTML', category: 'Website Development', level: 90, icon: 'html', order: 5 },
    { name: 'CSS', category: 'Website Development', level: 90, icon: 'css', order: 6 },
    { name: 'JavaScript', category: 'Website Development', level: 85, icon: 'javascript', order: 7 },
    { name: 'React.js', category: 'Website Development', level: 85, icon: 'react', isFeatured: true, order: 8 },
    { name: 'Tailwind CSS', category: 'Website Development', level: 88, icon: 'tailwind', order: 9 },
    { name: 'Node.js', category: 'Website Development', level: 75, icon: 'nodejs', order: 10 },
    { name: 'Express', category: 'Website Development', level: 75, icon: 'express', order: 11 },
    { name: 'PostgreSQL', category: 'Website Development', level: 70, icon: 'database', order: 12 },
    { name: 'Prisma', category: 'Website Development', level: 70, icon: 'prisma', order: 13 },
    { name: 'Data Cleaning', category: 'Data Analysis', level: 80, icon: 'filter', order: 14 },
    { name: 'Exploratory Data Analysis', category: 'Data Analysis', level: 78, icon: 'chart', order: 15 },
    { name: 'Data Visualization', category: 'Data Analysis', level: 82, icon: 'pie', isFeatured: true, order: 16 },
    { name: 'Insight & Reporting', category: 'Data Analysis', level: 80, icon: 'file', order: 17 },
    { name: 'Figma', category: 'Tools', level: 95, icon: 'figma', isFeatured: true, order: 18 },
    { name: 'Adobe XD', category: 'Tools', level: 85, icon: 'xd', order: 19 },
    { name: 'Photoshop', category: 'Tools', level: 80, icon: 'ps', order: 20 },
    { name: 'Illustrator', category: 'Tools', level: 78, icon: 'ai', order: 21 },
    { name: 'Git & GitHub', category: 'Tools', level: 85, icon: 'github', order: 22 },
    { name: 'Excel', category: 'Tools', level: 88, icon: 'excel', order: 23 },
    { name: 'Power BI', category: 'Tools', level: 75, icon: 'powerbi', order: 24 },
    { name: 'Python', category: 'Tools', level: 70, icon: 'python', order: 25 },
    { name: 'Tableau', category: 'Tools', level: 72, icon: 'tableau', order: 26 },
 cursor/portfolio-website-980a
    { name: 'UI/UX Design', category: 'Proficiency', level: 95, order: 27, icon: 'palette', description: 'Merancang antarmuka dan pengalaman pengguna yang intuitif, estetis, dan berorientasi pada kebutuhan pengguna.', tools: ['Figma', 'Adobe XD', 'Prototyping'] },
    { name: 'Frontend Development', category: 'Proficiency', level: 85, order: 28, icon: 'code', description: 'Membangun antarmuka web responsif dan interaktif dengan teknologi modern.', tools: ['React', 'JavaScript', 'Tailwind CSS', 'HTML/CSS'] },
    { name: 'Problem Solving', category: 'Proficiency', level: 90, order: 29, icon: 'target', description: 'Menganalisis masalah secara sistematis dan menemukan solusi yang efektif dan efisien.', tools: ['Analisis Data', 'Critical Thinking', 'Research'] },

    { name: 'UI/UX Design', category: 'Proficiency', level: 95, order: 27 },
    { name: 'Frontend Development', category: 'Proficiency', level: 85, order: 28 },
    { name: 'Problem Solving', category: 'Proficiency', level: 90, order: 29 },
 main
    { name: 'Prototyping', category: 'Tools', level: 90, icon: 'prototype', isFeatured: true, order: 30 },
  ];
  await prisma.skill.createMany({ data: skills });
  console.log('✅ Skills seeded');

  await prisma.education.deleteMany();
  await prisma.education.createMany({
    data: [
      {
        institution: 'Universitas Harkat Negeri Tegal',
        degree: 'Teknik Informatika',
        field: 'Teknik Informatika',
        level: 'S1',
        gpa: '3.72',
        description:
          'Mempelajari berbagai bidang dalam ilmu komputer, termasuk pemrograman, basis data, jaringan, kecerdasan buatan, dan rekayasa perangkat lunak.',
        startYear: '2022',
        endYear: null,
        isCurrent: true,
        status: 'active',
        order: 1,
      },
      {
        institution: 'SMA Negeri 1 Jatibarang',
        degree: 'Jurusan IPA',
        field: 'IPA',
        level: 'SMA',
        gpa: null,
        description: 'Nilai Akhir: 82,13',
        startYear: '2019',
        endYear: '2022',
        isCurrent: false,
        status: 'active',
        order: 2,
      },
      {
        institution: 'SMP Negeri 1 Jatibarang',
        degree: 'SMP',
        field: 'SMP',
        level: 'SMP',
        gpa: null,
        description: 'Lulus dengan baik',
        startYear: '2016',
        endYear: '2019',
        isCurrent: false,
        status: 'graduated',
        order: 3,
      },
    ],
  });
  console.log('✅ Educations seeded');

  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  const projects = [
    {
      title: 'BeautyCare App',
      slug: 'beautycare-app',
      category: 'UI Design',
      description:
        'Aplikasi mobile untuk booking treatment kecantikan dengan pengalaman pengguna yang elegan dan intuitif. Desain fokusokus pada visual yang soft, navigasi yang mudah, dan alur booking yang efisien.',
      shortDesc: 'Aplikasi mobile booking treatment kecantikan dengan UI elegan.',
      techStack: ['Figma', 'UI/UX', 'Prototyping'],
      role: 'UI/UX Designer',
      status: 'completed',
      featured: true,
      order: 1,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-01'),
      githubUrl: 'https://github.com',
      demoUrl: 'https://example.com',
    },
    {
      title: 'Pospay Dashboard',
      slug: 'pospay-dashboard',
      category: 'Website',
      description:
        'Dashboard admin untuk sistem pembayaran digital dengan visualisasi data real-time, manajemen transaksi, dan laporan keuangan yang komprehensif.',
      shortDesc: 'Dashboard admin sistem pembayaran digital.',
      techStack: ['React', 'Tailwind CSS', 'Node.js', 'Chart.js'],
      role: 'UI Designer & Frontend',
      status: 'completed',
      featured: true,
      order: 2,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-05-01'),
      githubUrl: 'https://github.com',
      demoUrl: 'https://example.com',
    },
    {
      title: 'Florist Landing Page',
      slug: 'florist-landing-page',
      category: 'Website',
      description:
        'Landing page elegan untuk toko bunga online dengan animasi soft, katalog produk, dan CTA yang menarik untuk meningkatkan konversi.',
      shortDesc: 'Landing page elegan untuk toko bunga online.',
      techStack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
      role: 'UI/UX & Frontend Developer',
      status: 'completed',
      featured: true,
      order: 3,
      startDate: new Date('2023-11-01'),
      endDate: new Date('2023-12-15'),
      githubUrl: 'https://github.com',
      demoUrl: 'https://example.com',
    },
    {
      title: 'Sales Analytics Dashboard',
      slug: 'sales-analytics-dashboard',
      category: 'Data Analysis',
      description:
        'Dashboard analisis penjualan dengan visualisasi interaktif untuk membantu pengambilan keputusan bisnis berbasis data.',
      shortDesc: 'Dashboard analisis penjualan berbasis data.',
      techStack: ['Python', 'Tableau', 'Excel', 'Power BI'],
      role: 'Data Analyst',
      status: 'completed',
      featured: false,
      order: 4,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-04-30'),
    },
    {
      title: 'EduLearn Mobile',
      slug: 'edulearn-mobile',
      category: 'UI Design',
      description:
        'Desain aplikasi e-learning dengan fokus pada aksesibilitas dan pengalaman belajar yang menyenangkan.',
      shortDesc: 'UI design aplikasi e-learning modern.',
      techStack: ['Figma', 'Adobe XD', 'Prototyping'],
      role: 'UI/UX Designer',
      status: 'completed',
      featured: false,
      order: 5,
      startDate: new Date('2023-08-01'),
      endDate: new Date('2023-10-01'),
    },
    {
      title: 'Portfolio Website',
      slug: 'portfolio-website',
      category: 'Website',
      description:
        'Website portfolio personal dengan desain premium, animasi modern, dan CMS admin untuk mengelola konten.',
      shortDesc: 'Website portfolio personal dengan CMS admin.',
      techStack: ['React', 'Express', 'PostgreSQL', 'Prisma', 'Tailwind'],
      role: 'Full Stack Designer',
      status: 'completed',
      featured: true,
      order: 6,
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-07-01'),
      githubUrl: 'https://github.com',
    },
    {
      title: 'Customer Insight Report',
      slug: 'customer-insight-report',
      category: 'Data Analysis',
      description:
        'Analisis perilaku pelanggan dan laporan insight untuk strategi pemasaran yang lebih efektif.',
      shortDesc: 'Analisis perilaku pelanggan & insight report.',
      techStack: ['Python', 'Excel', 'Tableau'],
      role: 'Data Analyst',
      status: 'completed',
      featured: false,
      order: 7,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-28'),
    },
    {
      title: 'FinTech App Redesign',
      slug: 'fintech-app-redesign',
      category: 'UI Design',
      description:
        'Redesign aplikasi fintech dengan fokus pada keamanan visual, kemudahan transaksi, dan kepercayaan pengguna.',
      shortDesc: 'Redesign UI aplikasi fintech modern.',
      techStack: ['Figma', 'Design System', 'Prototyping'],
      role: 'UI/UX Designer',
      status: 'completed',
      featured: false,
      order: 8,
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-09-01'),
    },
  ];
  for (const p of projects) {
    await prisma.project.create({ data: p });
  }
  console.log('✅ Projects seeded');

  await prisma.experienceImage.deleteMany();
  await prisma.experience.deleteMany();
  const experiences = [
    {
      title: 'UI/UX Design Intern',
      company: 'TechNova Creative',
      location: 'Remote',
      type: 'Formal',
      category: 'Magang',
      description:
        'Bertanggung jawab merancang antarmuka aplikasi mobile dan website. Melakukan user research, wireframing, prototyping, dan presentasi desain kepada stakeholder.',
      shortDesc: 'Internship UI/UX Design di TechNova Creative.',
      skills: ['Figma', 'UI Design', 'Prototyping', 'User Research'],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-04-30'),
      order: 1,
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Studio ID',
      location: 'Hybrid',
      type: 'Formal',
      category: 'Jobdesk',
      description:
        'Mengembangkan antarmuka website responsif menggunakan React dan Tailwind CSS. Berkolaborasi dengan desainer untuk mengimplementasikan design system.',
      shortDesc: 'Frontend development untuk berbagai klien.',
      skills: ['React', 'Tailwind CSS', 'JavaScript', 'Git'],
      startDate: new Date('2024-05-01'),
      endDate: null,
      isCurrent: true,
      order: 2,
    },
    {
      title: 'Ketua Divisi Desain',
      company: 'Himpunan Mahasiswa Informatika',
      location: 'Kampus',
      type: 'Informal',
      category: 'Organisasi',
      description:
        'Memimpin divisi desain dalam berbagai event kampus. Mengelola branding, poster, dan media sosial organisasi.',
      shortDesc: 'Memimpin divisi desain HIMATI.',
      skills: ['Leadership', 'Branding', 'Photoshop', 'Illustrator'],
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      order: 3,
    },
    {
      title: 'Aplikasi Inventaris Kampus',
      company: 'Tim Capstone Project',
      location: 'Kampus',
      type: 'Informal',
      category: 'Proyek Kelompok',
      description:
        'Merancang UI/UX dan mengembangkan frontend aplikasi inventaris barang kampus bersama tim 4 orang.',
      shortDesc: 'Capstone project aplikasi inventaris.',
      skills: ['Figma', 'React', 'Teamwork', 'UI/UX'],
      startDate: new Date('2023-09-01'),
      endDate: new Date('2024-01-15'),
      order: 4,
    },
    {
      title: 'Google UX Design Certificate',
      company: 'Google / Coursera',
      location: 'Online',
      type: 'Informal',
      category: 'Sertifikat & Kursus',
      description:
        'Menyelesaikan sertifikasi Google UX Design covering empati, wireframe, prototype, dan usability testing.',
      shortDesc: 'Sertifikasi Google UX Design.',
      skills: ['UX Research', 'Wireframing', 'Prototyping'],
      startDate: new Date('2023-03-01'),
      endDate: new Date('2023-06-01'),
      order: 5,
    },
  ];
  for (const e of experiences) {
    await prisma.experience.create({ data: e });
  }
  console.log('✅ Experiences seeded');

  await prisma.certificate.deleteMany();
  await prisma.certificate.createMany({
    data: [
      {
        title: 'Google UX Design Certificate',
        issuer: 'Google / Coursera',
        description: 'Professional certificate in UX Design',
        issueDate: new Date('2023-06-01'),
        order: 1,
      },
      {
        title: 'Frontend Development Bootcamp',
        issuer: 'Dicoding',
        description: 'React dan modern frontend development',
        issueDate: new Date('2023-10-01'),
        order: 2,
      },
      {
        title: 'Data Analysis with Python',
        issuer: 'Coursera',
        description: 'Data cleaning, EDA, and visualization',
        issueDate: new Date('2024-02-01'),
        order: 3,
      },
    ],
  });
  console.log('✅ Certificates seeded');

  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      {
        platform: 'whatsapp',
        label: 'WhatsApp',
 cursor/portfolio-website-980a
        url: 'https://wa.me/6289683825678',

        url: 'https://wa.me/6280000000000',
 main
        icon: 'whatsapp',
        order: 1,
      },
      {
        platform: 'email',
        label: 'Email',
        url: 'mailto:sukmaayu21@gmail.com',
        icon: 'email',
        order: 2,
      },
      {
        platform: 'github',
        label: 'GitHub',
        url: 'https://github.com/angkasaprwr',
        icon: 'github',
        order: 3,
      },
      {
        platform: 'linkedin',
        label: 'LinkedIn',
 cursor/portfolio-website-980a
        url: 'https://www.linkedin.com/in/sukmaayu-dwiwulandari/',

        url: 'https://linkedin.com/in/sukmaayu',
 main
        icon: 'linkedin',
        order: 4,
      },
      {
        platform: 'instagram',
        label: 'Instagram',
        url: 'https://instagram.com/sukmaayu',
        icon: 'instagram',
        order: 5,
      },
      {
        platform: 'dribbble',
        label: 'Dribbble',
        url: 'https://dribbble.com/sukmaayu',
        icon: 'dribbble',
        order: 6,
      },
    ],
  });
  console.log('✅ Social links seeded');

  await prisma.setting.deleteMany();
  await prisma.setting.createMany({
    data: [
      {
        key: 'site',
        value: {
          siteName: 'Sukma.',
          tagline: 'UI/UX Designer',
          description:
            'Portfolio personal Rr Sukma Ayu Dwi Wulandari — UI/UX Designer yang menciptakan pengalaman digital elegan dan bermakna.',
          keywords: ['UI/UX Designer', 'Portfolio', 'Sukma', 'Web Design'],
        },
      },
      {
        key: 'theme',
        value: {
          primaryColor: '#F857A6',
          softPink: '#FFD6E8',
          lightPink: '#FFF3F8',
          gold: '#D4AF37',
          defaultMode: 'light',
        },
      },
      {
        key: 'stats',
        value: {
          projectsCompleted: '10+',
          happyClients: '5+',
          yearsExperience: '2+',
          commitment: '100%',
        },
      },
      {
        key: 'contact',
        value: {
          ctaTitle: 'Punya proyek menarik? Mari wujudkan bersama!',
          ctaSubtitle: 'Tertarik untuk bekerja sama?',
          showPhone: false,
          showEmail: false,
          showAddress: false,
        },
      },
    ],
  });
  console.log('✅ Settings seeded');

  await prisma.activityLog.create({
    data: {
      adminId: admin.id,
      action: 'SEED',
      entity: 'system',
      details: { message: 'Database seeded successfully' },
    },
  });

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
