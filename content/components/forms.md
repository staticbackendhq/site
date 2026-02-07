+++
title = "HTML forms"

comptitle = "HTML forms"
compsub = "Let visitors submit forms."
submenu = "form"
+++

Capture form submissions from your marketing site or landing pages. Perfect for contact forms, email signups, waitlists, and feedback—without managing form backends.

No spam, no database setup, no email service to configure. Just point your form at StaticBackend and start collecting responses.

### Add a form in 30 seconds

```html
<!-- Simple contact form -->
<form action="https://your-backend.staticbackend.com/forms/contact" method="POST">
  <input type="email" name="email" placeholder="Your email" required>
  <textarea name="message" placeholder="Your message" required></textarea>
  <button type="submit">Send</button>
</form>
```

That's it. Submissions are stored and accessible via your dashboard or CLI.

### What you can build

- **Contact forms** - Customer inquiries and support requests
- **Email signups** - Newsletter subscriptions and lead capture
- **Waitlists** - Early access signups for product launches
- **Feedback forms** - Customer feedback and feature requests
- **Event registration** - RSVP forms and event signups
- **Survey responses** - Simple polls and questionnaires

### How it works

1. Create a form ID in your StaticBackend dashboard (e.g., `contact`, `newsletter`)
2. Point your HTML form to the endpoint
3. Submissions are stored automatically
4. View responses in your dashboard or via CLI

**No JavaScript required** - Works with standard HTML forms. Perfect for static sites, landing pages, and marketing sites.

### View submissions

**Dashboard** - See all form submissions in your web dashboard with filtering and export.

**CLI** - View and manage submissions from the command line:

```bash
# View all contact form submissions
staticbackend forms list contact

# Export to CSV
staticbackend forms export contact --format csv

# Delete old entries
staticbackend forms delete contact --older-than 30d
```

### Spam protection

Built-in spam filtering and rate limiting protect your forms from abuse. No CAPTCHA required for most use cases.

### Works everywhere

- Static site generators (Hugo, Jekyll, Next.js)
- WordPress and other CMS platforms
- Plain HTML websites
- Marketing landing pages
- Email signature forms

Great for capturing leads before your full app is ready, or for simple contact forms that don't need a full backend.

→ [View forms documentation](/docs/forms) for detailed API reference and advanced features.

Need something we don't have yet? Check if it's [missing](/components/missing).