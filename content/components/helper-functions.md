+++
title = "Backend helper functions"

comptitle = "Cache, send email, etc"
compsub = "Access a growing list of common web application helper functions."
submenu = "helper"
+++

Common backend utilities built-in and ready to use. Send emails, cache data, resize images, and generate PDFs without managing external services.

These helpers are available in your server-side functions or via API calls, giving you powerful backend capabilities without the infrastructure complexity.

### Available helpers

**Send emails** - Transactional emails without managing SMTP servers:

```javascript
// Send a welcome email
await backend.sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to our app',
  body: 'Thanks for signing up!'
});
```

Perfect for confirmations, notifications, password resets, and receipts.

**Cache data** - Store temporary data for fast access:

```javascript
// Cache API responses or session data
await backend.cacheSet('user-session-123', userData, 3600); // 1 hour

// Retrieve cached data
const data = await backend.cacheGet('user-session-123');
```

Great for rate limiting, temporary state, API response caching, and external integrations.

**Resize images** - Automatically resize uploaded images:

```javascript
// Resize to max width of 800px (maintains aspect ratio)
const resized = await backend.resizeImage(file, { maxWidth: 800 });
// Returns: { url: 'https://...', width: 800, height: 600 }
```

Optimize profile pictures, thumbnails, and user-uploaded images automatically.

**Generate PDFs** - Convert web pages to PDF documents:

```javascript
// Convert a URL to PDF
const pdf = await backend.urlToPDF('https://myapp.com/invoice/123');
// Returns: { url: 'https://cdn.../invoice.pdf' }
```

Create invoices, reports, certificates, and downloadable documents from HTML.

**Generate screenshots** - Capture web pages as images:

```javascript
// Convert a URL to PNG screenshot
const screenshot = await backend.urlToPNG('https://myapp.com/dashboard');
// Returns: { url: 'https://cdn.../screenshot.png' }
```

Generate preview images, social media cards, or visual reports.

**Send SMS** - Text message notifications (requires Twilio account):

```javascript
// Send SMS notification
await backend.sendSMS({
  to: '+1234567890',
  message: 'Your verification code is 123456'
});
```

Two-factor authentication, delivery notifications, and urgent alerts.

### How to use

**In server-side functions:**
All helpers are available directly in your functions:

```javascript
function onUserRegistered(event) {
  // Send welcome email
  backend.sendEmail({
    to: event.user.email,
    subject: 'Welcome!',
    body: 'Thanks for joining!'
  });
}
```

**From your frontend (via API):**
Some helpers can be called from your frontend code:

```javascript
// Resize image on upload
const file = input.files[0];
const resized = await backend.resizeImage(file, { maxWidth: 1200 });
```

**Security note:** Sensitive operations (like sending emails) should be called from server-side functions to protect API keys and prevent abuse.

### Growing library

We're continuously adding new helpers based on common needs. Currently planned:

- Payment processing helpers (Stripe integration)
- Image filters and transformations
- CSV/Excel generation
- QR code generation
- Geolocation utilities

Need something specific? [Let us know](/contact) - we prioritize features our users need most.

→ [View helper functions documentation](/docs/helpers) for detailed API reference and examples.

Next component is [forms](/components/forms).