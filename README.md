# Global Tracker

This application allows you to keep track of the total money you have across different places (cash, bank accounts, other platforms), consolidating all your financial information in one place.

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Firebase (Authentication & Firestore)

## Installation and Running

```bash
git clone <YOUR_REPO_URL>
cd <PROJECT_NAME>
npm install
npm run dev
```

## Firebase Setup

This application uses Firebase for authentication and data storage. To use your own Firebase account, create a `.env.local` file in the project root with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Purpose

With this app, you can add your balances by specifying an account name and the corresponding amount. The app displays the total of all your funds, making it easy to track your personal finances.

## Credits

Codebase initially generated with Lovable.
