/**
 * Firebase Configuration for Next Level Tech
 *
 * IMPORTANT: Replace these placeholder values with your actual Firebase project config
 * from the Firebase Console > Project Settings > Your apps > SDK setup and configuration
 *
 * Firestore Collections Structure:
 * ================================
 *
 * 📁 articles (Blog posts)
 *    - id: string (auto-generated)
 *    - title: string
 *    - published: boolean
 *    - content: string (HTML from Quill editor)
 *    - description: string (short excerpt)
 *    - category: string
 *    - createDate: Timestamp
 *    - coverImage: string (URL)
 *    - thumbnail: string (URL)
 *    - additionalImages: Array<{url: string, description: string}>
 *    - tags: string[]
 *    - likes: string[] (user IDs)
 *    - comments: Array<{userId: string, userName: string, comment: string, timestamp: Timestamp}>
 *    - authorId: string (reference to users collection)
 *
 *    Sample articles to add:
 *    - "Getting Started with Angular 19 Standalone Components"
 *    - "Building Responsive UIs with TailwindCSS"
 *    - "Firebase + Angular: A Complete Guide"
 *
 * 📁 projects (Portfolio projects)
 *    - id: string (auto-generated)
 *    - title: string
 *    - content: string (HTML description)
 *    - description: string (short excerpt)
 *    - coverImage: string (URL)
 *    - thumbnail: string (URL)
 *    - additionalImages: Array<{url: string, description: string}>
 *    - techUsed: string[] (e.g., ["Angular", "Firebase", "TailwindCSS"])
 *    - createdAt: Timestamp
 *
 *    Sample projects to add:
 *    - Fitness App: Mobile fitness tracking application with workout plans
 *    - Carnevet: Veterinary clinic management system
 *    - Food Search App: Recipe finder with nutritional information
 *
 * 📁 contacts (Contact form submissions)
 *    - id: string (auto-generated)
 *    - name: string
 *    - email: string
 *    - subject: string
 *    - message: string
 *    - captchaToken: string
 *    - isRead: boolean (default: false)
 *    - createdAt: Timestamp
 *    - updatedAt: Timestamp
 *
 * 📁 users (User profiles - linked to Firebase Auth)
 *    - id: string (same as Firebase Auth UID)
 *    - firstName: string
 *    - lastName: string
 *    - email: string
 *    - avatar: string (URL, optional)
 *    - bio: string (optional)
 *    - role: string ("admin" | "author" | "reader")
 *    - createdAt: Timestamp
 *
 * Firebase Storage Structure:
 * ==========================
 * /avatars/{userId}/{filename}
 * /articles/{articleId}/{filename}
 * /projects/{projectId}/{filename}
 */

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
