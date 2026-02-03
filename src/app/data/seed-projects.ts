/**
 * Seed Projects Data - Based on CV
 * Run this via Firebase Admin SDK or paste into Firestore manually
 */

export const seedProjects = [
  {
    title: 'Automotive Software Management Platform',
    description: 'Mission-critical application for managing software updates across Volkswagen, Seat, Porsche, Cupra, and Bentley vehicles.',
    content: `
      <h2>Project Overview</h2>
      <p>Led the front-end development and maintenance of a high-impact application responsible for managing software updates across multiple premium automotive brands including Volkswagen, Porsche, Bentley, Seat, and Cupra.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Real-time software version tracking across vehicle fleets</li>
        <li>Automated update deployment scheduling</li>
        <li>Advanced data grid with filtering, sorting, and export capabilities</li>
        <li>Multi-brand dashboard with customizable views</li>
        <li>Integration with backend systems for seamless data flow</li>
      </ul>
      
      <h2>Technical Highlights</h2>
      <p>Utilized expertise in Ag-Grid, ngx-datatable, Angular Material, and Bootstrap to enhance UI functionality. Worked closely with backend developers and engaged directly with business clients to translate requirements into actionable improvements.</p>
    `,
    techUsed: ['Angular', 'TypeScript', 'Ag-Grid', 'Angular Material', 'Bootstrap', 'RxJS', 'REST APIs'],
    coverImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
    additionalImages: [],
    company: 'MTD Technology',
    year: '2024'
  },
  {
    title: 'Financial Tax Reporting Solution',
    description: 'Enterprise-grade financial application for managing tax reports with NX monorepo architecture.',
    content: `
      <h2>Project Overview</h2>
      <p>Collaborated with backend teams and clients to deliver efficient and scalable financial solutions for tax report management.</p>
      
      <h2>Key Contributions</h2>
      <ul>
        <li>Built robust financial solution for tax report management</li>
        <li>Leveraged NX to manage multiple frontend applications within a monorepo</li>
        <li>Designed reusable Angular Material components and vanilla SCSS</li>
        <li>Created code generation tools for streamlined development</li>
        <li>Applied advanced JSON destructuring and data manipulation</li>
      </ul>
      
      <h2>Architecture</h2>
      <p>Implemented clean, maintainable, and reusable code patterns within a monorepo structure, enabling multiple teams to work efficiently on different applications while sharing common components.</p>
    `,
    techUsed: ['Angular', 'NX Monorepo', 'Angular Material', 'SCSS', 'TypeScript', 'JSON', 'REST APIs'],
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    additionalImages: [],
    company: 'SHE Group',
    year: '2024'
  },
  {
    title: 'Banking Financial Planning Tool',
    description: 'Cutting-edge financial planning application with intelligent PDF generation for a leading Romanian bank.',
    content: `
      <h2>Project Overview</h2>
      <p>Designed and developed innovative financial applications including a comprehensive planning tool and highly efficient PDF generator for banking professionals and investment advisors.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Modern, responsive UI with Angular 17 and Angular Material</li>
        <li>Intuitive drag-and-drop PDF report builder</li>
        <li>Real-time financial calculations and projections</li>
        <li>Multi-format export capabilities</li>
        <li>Client portfolio visualization</li>
      </ul>
      
      <h2>Impact</h2>
      <p>Streamlined report creation for banking clients and investment professionals, significantly reducing the time needed to generate comprehensive financial reports.</p>
    `,
    techUsed: ['Angular 17', 'Angular Material', 'Bootstrap 5', 'TypeScript', 'PDF Generation', 'Drag & Drop', 'RxJS'],
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    additionalImages: [],
    company: 'BeShaping The Future',
    year: '2023-2024'
  },
  {
    title: 'Green Energy Sector Platform',
    description: 'Complex renewable energy management application with real-time monitoring and analytics.',
    content: `
      <h2>Project Overview</h2>
      <p>Led the front-end development of a comprehensive Green Energy Sector application, collaborating with a diverse team to deliver a high-quality, efficient, and user-friendly product.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Real-time energy production monitoring</li>
        <li>Advanced analytics and reporting dashboards</li>
        <li>Asset management for solar/wind installations</li>
        <li>Performance optimization recommendations</li>
        <li>Integration with IoT sensors and devices</li>
      </ul>
      
      <h2>Team Leadership</h2>
      <p>Spearheaded the front-end development within a 10-person team, mentored junior developers, and fostered a supportive growth-oriented environment. Improved client satisfaction through active feedback gathering and efficient implementation.</p>
    `,
    techUsed: ['Angular 8', 'TypeScript', 'Azure DevOps', 'REST APIs', 'Charts/Graphs', 'RxJS', 'SCSS'],
    coverImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
    additionalImages: [],
    company: 'Wirtek Romania / Fabrit Global',
    year: '2021-2023'
  },
  {
    title: 'AOK Plus Medical Insurance App',
    description: 'Healthcare application empowering clients to manage insurance needs and access preventive health measures.',
    content: `
      <h2>Project Overview</h2>
      <p>Developed a medical application for AOK Plus, one of Germany's largest health insurance providers, aimed at empowering clients to effectively manage their insurance needs while promoting preventive health measures.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Insurance plan management and comparison</li>
        <li>Preventive health program tracking</li>
        <li>Digital health records access</li>
        <li>Appointment scheduling with healthcare providers</li>
        <li>Cross-browser compatible responsive design</li>
      </ul>
      
      <h2>Technical Achievements</h2>
      <ul>
        <li>Led migration to the official Spartacus e-commerce framework</li>
        <li>Spearheaded performance optimization efforts</li>
        <li>Ensured cross-browser compatibility (Firefox, Chrome, Safari)</li>
        <li>Enhanced UX through modern styling techniques</li>
      </ul>
    `,
    techUsed: ['Angular 8', 'Spartacus', 'TypeScript', 'SAP Commerce', 'SCSS', 'Responsive Design'],
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    additionalImages: [],
    company: 'msg Systems Romania',
    year: '2017-2020'
  },
  {
    title: 'Retail Stock Management System',
    description: 'SAP-based enterprise application for major retailers managing stock, sales, KPIs, and seasonal predictions.',
    content: `
      <h2>Project Overview</h2>
      <p>Developed an enterprise application for major retailers using SAP technologies, helping them manage stock, sales, KPI calculations, and seasonal trend predictions.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Real-time stock level monitoring</li>
        <li>Sales analytics and KPI dashboards</li>
        <li>Seasonal trend prediction algorithms</li>
        <li>Inventory optimization recommendations</li>
        <li>Multi-location management</li>
      </ul>
      
      <h2>Technical Stack</h2>
      <p>Built with S/4HANA ABAP for backend processing, SAPUI5 and SAP Fiori for a modern responsive frontend. Implemented both front-end and back-end aspects ensuring the solution was functional, user-friendly, and scalable.</p>
    `,
    techUsed: ['S/4HANA ABAP', 'SAPUI5', 'SAP Fiori', 'JavaScript', 'HTML', 'SCSS', 'OData'],
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    additionalImages: [],
    company: 'Draexlmaier',
    year: '2015-2016'
  },
  {
    title: 'Fitness Tracking App',
    description: 'Mobile-first fitness application with workout tracking, PT management, and personalized training programs.',
    content: `
      <h2>Project Overview</h2>
      <p>Personal project - A comprehensive fitness tracking application designed for both personal trainers and their clients, featuring workout management, progress tracking, and personalized training programs.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Multi-role system (Admin, Personal Trainer, User)</li>
        <li>Custom workout builder with exercise library</li>
        <li>Progress tracking with measurements and photos</li>
        <li>PT branding and customization</li>
        <li>Effort rating system with feedback</li>
        <li>Bilingual support (RO/EN)</li>
      </ul>
      
      <h2>Technical Implementation</h2>
      <p>Built with Next.js 16 and React 19 for the web, with native mobile apps planned for iOS (SwiftUI) and Android (Kotlin). Firebase backend with Firestore database and Authentication.</p>
    `,
    techUsed: ['Next.js', 'React 19', 'TypeScript', 'Firebase', 'Firestore', 'Tailwind CSS', 'Framer Motion'],
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    additionalImages: [],
    company: 'Personal Project',
    year: '2024-Present',
    liveUrl: 'https://fitness-prod.tigan.dev'
  },
  {
    title: 'Carnevet - Digital Pet Health Passport',
    description: 'Digital pet health management platform for pet owners and veterinary clinics.',
    content: `
      <h2>Project Overview</h2>
      <p>Personal project - A comprehensive digital health passport for pets, allowing owners to track vaccinations, consultations, and health records while enabling veterinary clinics to manage their patients digitally.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Pet profile management with health history</li>
        <li>Vaccination tracking and reminders</li>
        <li>Consultation history and notes</li>
        <li>Document storage and sharing</li>
        <li>Appointment scheduling</li>
        <li>QR code/NFC sharing for quick access</li>
        <li>Multi-role system (Owner, Vet, Clinic Admin)</li>
      </ul>
      
      <h2>Technical Implementation</h2>
      <p>Built with Next.js 15 and React 19, using Firebase for backend services. Features dark theme with emerald/violet accents and glass-morphism design.</p>
    `,
    techUsed: ['Next.js 15', 'React 19', 'TypeScript', 'Firebase', 'Firestore', 'Tailwind CSS'],
    coverImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    additionalImages: [],
    company: 'Personal Project',
    year: '2024-Present',
    liveUrl: 'https://carnevet.tigan.dev'
  }
];

/**
 * To seed Firestore, you can use Firebase Admin SDK:
 * 
 * import { initializeApp, cert } from 'firebase-admin/app';
 * import { getFirestore } from 'firebase-admin/firestore';
 * 
 * const app = initializeApp({ credential: cert(serviceAccount) });
 * const db = getFirestore(app);
 * 
 * for (const project of seedProjects) {
 *   await db.collection('projects').add({
 *     ...project,
 *     createdAt: new Date(),
 *     updatedAt: new Date()
 *   });
 * }
 */
