+++
title = "Social/external logins"

docsub = "Sign in with [insert OAuth provider here]"
submenu = "social-logins"
+++

**In Beta**: Let your users create their account and sign-in via OAuth 
providers.

While in beta only three external OAuth providers are  
supported: Google, Twitter, and Facebook.

## Required steps

1. You'll need to create an application on the provider's developer portal.
2. You'll need to fill in your OAuth credetnials (key and secret) in your 
StaticBackend dashboard.

Here's the proposed API to start the sign-in/sign-up process.

```
// this will open the authorization window at the provider
const user = await backend.socialLogin("google");
console.log(user);
// prints
/*
{
  token: "your SB user's session token",
  email: "user's email",
  name: "user's full name",
  first: "user's first name",
  last: "user's last name",
  avatarUrl: "user's avatar URL"
}
*/
```

### Authentication flow

1. Calling the client-side `socialLogin` function with a supported provider 
triggers the authorization process opening a new tab asking the user to approve 
the request.
2. The client-side application will wait until the OAuth process is completed 
and the user profile is fetched from the provider.
3. Your application receives the user profile once everything is completed.

There's a maximum number of time this process will wait for the user to complete 
the authentication flow.

