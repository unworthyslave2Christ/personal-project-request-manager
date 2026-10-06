# Library boundaries

`project-request-types.ts` contains browser-safe types and status metadata.

`project-requests.ts` contains server-side Firestore operations and imports Firebase Admin. Keep it out of Client Components.

`firebase-admin.ts` initializes the Firebase Admin SDK and must remain server-only by import graph.
