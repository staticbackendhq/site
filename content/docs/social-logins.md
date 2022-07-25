+++
title = "Social/external logins"

docsub = "Sign in with [insert OAuth provider here]"
submenu = "social-logins"
+++

**In Beta**: Let your users create their account and sign-in via OAuth 
providers.

_This feature is not released yet_. Three external OAuth providers will be 
supported at launch: Google, Twitter, and Facebook.

## Required steps

1. You'll need to create an application on the provider's developer portal.
2. You'll need to fill in your OAuth credetnials (key and secret).

Here's the proposed API to start the sign-in/sign-up process.

```javascript
// this will open the authorization window at the provider
backend.socialLogin("twitter", (sessionToken) => {
	// store the sessionToken just like you'd 
	// from a normal register / login function call.
});
```

We're currently working on having a second parameter to the callback giving 
access to the user's profile like email, name, and avatar.

Join the conversation in Discord if you'd like to be closer to the development 
process.