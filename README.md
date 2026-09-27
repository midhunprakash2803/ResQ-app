RoadResQ 🛞
“Help when your vehicle stops.”

Smart roadside assistance, when you need it.

RoadResQ is a production-quality, AI-powered roadside assistance platform designed to seamlessly connect stranded drivers with verified service providers. Built with a focus on safety, real-time tracking, and intelligent problem classification, RoadResQ goes beyond generic booking apps to offer a complete, localized, and context-aware emergency transportation solution.

🌟 Key Features
🧠 ResQ AI Assistant
Natural Language Processing: Understands emergency descriptions in English, Tamil, Hindi, and Tanglish.

Smart Problem Classification: Automatically categorizes issues (Fuel, Tyre, Battery, Mechanical, Towing, Emergency) and determines urgency levels.

Voice Integration: Built-in speech-to-text allowing users to describe their problems hands-free.

Intelligent Provider Matching: Matches users based on service compatibility, ETA, provider rating, and distance—not just proximity.

Safety First: Detects high-risk situations, suggests moving to safe locations, and prevents unsafe instructions (e.g., hazardous fuel handling).

📱 Multi-Role Ecosystem
Customer App: Manage vehicles, request assistance via AI or manual forms, track providers live on a map, process payments, and leave ratings.

Provider App: Toggle online/offline status, receive job requests, navigate to stranded users, update job statuses in real-time, and track earnings.

Admin Dashboard: Comprehensive oversight of users, provider verifications, active requests, complaints, and platform revenue analytics.

🌍 Localization & Accessibility
Deep Multi-language System: Full UI and AI translation architecture supporting English, Tamil, and Hindi.

Design System: Professional, startup-grade UI avoiding generic AI gradients. Includes accessible, deeply integrated Light, Dark, and System-default themes.

📍 Real-Time Location & SOS
Live Tracking: Real-time map updates from request to arrival.

SOS Workflow: Immediate access to emergency contacts, live location sharing, and nearby safe havens (police stations, hospitals, fuel stations).

🛠 Tech Stack
Frontend: React, TypeScript, Tailwind CSS, Lucide Icons, React Router

Backend: Firebase (Authentication, Cloud Firestore, Storage, Cloud Functions)

AI Engine: Secure server-side AI API integration

Maps/Location: Google Maps API (or equivalent Maps provider)

Deployment: Vercel (Frontend), Firebase (Backend/Functions)

Version Control: GitHub

📂 Project Architecture
The codebase follows a scalable, modular architecture separating business logic from UI components.

Plaintext
src/
├── components/       # Reusable UI components (Buttons, Modals, Cards)
├── pages/            # Route components (Home, Dashboard, Tracking)
├── layouts/          # Page layouts (CustomerLayout, ProviderLayout, AdminLayout)
├── features/         # Domain-specific logic
│   ├── customer/
│   ├── provider/
│   ├── admin/
│   ├── ai/
│   ├── assistance/
│   ├── vehicles/
│   └── services/
├── firebase/         # Firebase initialization and service wrappers
├── hooks/            # Custom React hooks
├── contexts/         # React Context providers (Auth, Theme, Language)
├── utils/            # Helpers, formatters, and constants
├── types/            # TypeScript interfaces and type definitions
├── i18n/             # Translation files and i18n configuration
└── theme/            # CSS tokens, Tailwind config, theme switchers
🚀 Getting Started
1. Prerequisites
Node.js (v18+ recommended)

npm or yarn

A Firebase account

API keys for your AI Provider and Maps service

2. Firebase Setup
Create a new project in the Firebase Console.

Enable Authentication (Email/Password & Phone).

Enable Firestore Database and create the following core collections: users, vehicles, providers, services, assistanceRequests, requestEvents.

Enable Firebase Storage (for user/vehicle profiles and provider documents).

Initialize Firebase Cloud Functions (Requires Blaze plan) for secure server-side logic (AI calls, matching algorithms).

3. Environment Variables
Create a .env.local file in the root directory based on the .env.example file.

Code snippet
# PUBLIC VARIABLES (Safe for frontend)
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
VITE_MAPS_API_KEY="your_maps_api_key_restricted_to_url"

# SERVER-SIDE ONLY VARIABLES (Set these in Firebase Cloud Functions / Vercel only)
AI_PROVIDER_API_KEY="your_secret_ai_key"
PAYMENT_GATEWAY_SECRET="your_secret_payment_key"
Note: Never expose AI or Payment secret keys in the Vite/React frontend environment variables.

4. Installation & Local Development
Bash
# Clone the repository
git clone https://github.com/yourusername/RoadResQ.git
cd RoadResQ

# Install dependencies
npm install

# Start the development server
npm run dev

🔒 Security & Firestore Rules
Ensure your Firestore and Storage rules are strictly properly configured before deployment.

Customers can only read/write their own profiles, vehicles, and active requests.

Providers can only view requests assigned to them or broadcasted to their area.

Only Admins have global read/write access.

Verification documents in Storage must be isolated from public read access.

🌐 Deployment (Vercel)
RoadResQ is optimized for Vercel deployment as a Single Page Application (SPA).

Push your code to GitHub.

Import the project into Vercel.

Add all VITE_ prefixed environment variables in the Vercel dashboard.

Ensure the Build Command is npm run build and the Output Directory is dist.

Deploy.

Ensure Firebase Cloud functions are deployed separately via Firebase CLI: firebase deploy --only functions.

🤝 Contributing
Contributions are welcome. Please ensure that UI additions adhere strictly to the design system (No generic neon/AI aesthetics; maintain professional startup navy, white, and safety orange colors).

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
