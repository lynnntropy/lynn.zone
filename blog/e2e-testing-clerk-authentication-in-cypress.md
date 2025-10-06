---
title: E2E Testing an App with Clerk Authentication in Cypress
date: 2022-04-21
---

Background: [Clerk](https://clerk.dev/) is a hosted authentication and user management product.

---

I recently started writing E2E tests in Cypress for an app that uses [Clerk](https://clerk.dev/) for authentication, and there wasn’t anything out there to guide me, so here’s what I ended up with after fiddling with it for a bit.

(Note: In my case, this is a Next.js app using Clerk’s Next.js SDK, but my understanding is that this code will work everywhere, because their client SDKs all ultimately use ClerkJS under the hood.)

I wrote a [custom Cypress command](https://docs.cypress.io/api/cypress-api/custom-commands) that waits for Clerk to load, signs the user out if they aren’t signed out already, and then signs in with test credentials (see [here](https://docs.cypress.io/guides/guides/environment-variables) for how you can set these so that they’re accessible via `Cypress.env()`).

```ts
Cypress.Commands.add(`initializeAuth`, () => {
  cy.log(`Initializing auth state.`);

  cy.visit(`/`);

  cy.window()
    .should((window) => {
      expect(window).to.not.have.property(`Clerk`, undefined);
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async (window) => {
      await window.Clerk.signOut();
      await window.Clerk.client.signIn.create({
        identifier: Cypress.env(`TEST_USER_IDENTIFIER`),
        password: Cypress.env(`TEST_USER_PASSWORD`),
      });
    });
});
```

If you’re using TypeScript to write your tests (which I recommend!), you’ll also want to add this command to your [custom command types](https://docs.cypress.io/guides/tooling/typescript-support#Types-for-custom-commands).

```ts
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Initialize auth to a state where you're
       * logged in as the test user.
       *
       * @example cy.initializeAuth()
       */
      initializeAuth(): Chainable<void>;
    }
  }
}
```

Ultimately, you’ll probably want to use this command in a `before` or `beforeEach` hook to reset the auth state before every test, like so:

```ts
describe(`Test Page`, () => {
  beforeEach(() => {
    cy.resetDatabase(); // another custom command
    cy.initializeAuth();
  });

  // ... tests go here
});
```

Happy testing! Please let me know if you run into problems with this approach.
