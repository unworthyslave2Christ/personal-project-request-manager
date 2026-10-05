# Client Project Portal

A production-style Next.js capstone for authenticated project intake and client request management.

## Architecture

- **Next.js + Auth.js (NextAuth)** remains the application's required authentication/session layer.
- **Google OAuth** is handled by Auth.js.
- **Firebase Web SDK** handles Firebase Authentication and Cloud Firestore access from the browser.
- **Firestore Security Rules** enforce per-user ownership for `projectRequests`.
- **Firebase Admin SDK is not used.** No service-account credentials are required.
- The original **Server Actions are preserved** in `app/actions/project.ts` for validation/revalidation compatibility. Firestore CRUD itself is deliberately performed by the Web SDK so requests carry Firebase Auth context and are evaluated by Firestore Security Rules.

## Why the two authentication layers?

NextAuth is required by the Next.js application and remains responsible for the Next.js session (`auth()` on the server and `useSession()` on the client).

Firebase Web Auth is established with the same Google sign-in flow so the Firestore Web SDK has a Firebase-authenticated user. The Firestore owner ID is therefore the Firebase `user.uid`.

This avoids using the Admin SDK's privileged server access and keeps Firestore authorization in Security Rules.

## Environment

Copy `.env.example` to `.env.local` and provide:

```text
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

There are intentionally no `FIREBASE_CLIENT_EMAIL` or `FIREBASE_PRIVATE_KEY` variables.

## Firestore

Deploy the included rules with:

```bash
firebase deploy --only firestore:rules
```

The rules allow users to read, create, update, and delete only documents whose `ownerId` matches the authenticated Firebase user's UID.

## Run

```bash
npm install
npm run dev
```

The development script uses Webpack rather than Turbopack.
