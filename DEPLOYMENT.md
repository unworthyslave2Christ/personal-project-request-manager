# Deployment

## Vercel

Set the following environment variables in the Vercel project:

```text
AUTH_SECRET
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

`NEXT_PUBLIC_*` values are Firebase Web App configuration values and are intended for browser use. Do **not** add Firebase service-account credentials.

## Google OAuth

Configure the Google OAuth client used by Auth.js with the production application URL and callback URL required by the Auth.js/Google provider configuration.

## Firebase

Register a Firebase Web App and copy its web configuration into the `NEXT_PUBLIC_FIREBASE_*` variables.

Enable Google sign-in in Firebase Authentication and in the Google provider configuration used by Auth.js.

Deploy Firestore Security Rules:

```bash
firebase deploy --only firestore:rules
```

The application uses Firebase Web SDK access from the browser. Firestore requests therefore pass through Firestore Security Rules rather than using privileged Admin SDK access.

## Server Actions

The original `app/actions/project.ts` Server Actions remain in the project. They continue to perform server-side NextAuth session checks, validation, and cache revalidation. Firestore CRUD is performed by the Firebase Web SDK so the user's Firebase Auth identity is available to Firestore Rules.
