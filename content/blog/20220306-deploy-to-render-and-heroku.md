+++
title				= "Deploy to Render and Heroku buttons"
publishDate	= "2022-03-06"
slug				= "deploy-to-render-heroku-buttons"


metadesc = "StaticBackend can now deploy to Render and Heroku via the one-click button to get quickly up and running with the self-hosted version."
cardimg = "https://staticbackend.com/img/blog/deploy-to-render.png"
+++

![Deploy to Render steps](/img/blog/deploy-to-render.png)

There isn't a much quicker way to get started than a one-click deploy button. 
Those buttons take care of everything for you. You can start using your 
self-hosted StaticBackend instance in 30 seconds.

## What do you need?

A [Heroku](https://heroku.com) or [Render](https://render.com/) account. That's 
the only requirement.

## How to test it?

Go to the 
[GitHub repository README](https://github.com/staticbackendhq/core#get-started-with-the-self-hosted-version) 
and click on the **Deploy to Heroku** or **Deploy to Render** button.

## What are the resources needed?

StaticBackend is now defaulting to PostgreSQL as its database engine. As a result, 
an instance of PostgreSQL will be created and linked to the app.

Another required dependency is Redis. A Redis instance will be provided and 
linked to the backend.

That's it! The last remaining piece is the backend API itself, a Go web 
application. Both providers supports Go natively.

## After setup completes

Once everything is ready, you'll need to configure some aspects for everything 
to work correctly.

### 1. Create your first app

To create your first application, navigate to the web URL of your application.

Before entering your email, open the log streamer to view StaticBackend's 
`stdin` output to grab your credentials.

On **Heroku**, you can access the logs via the top-right More button and the 
"View Logs" option.

On **Render**, you can access logs via the Logs menu option in the left menu bar.

![View logs on Render](/img/blog/render-view-logs.jpg)

When you see the logs, return to your browser and create your application by 
entering your email (any email will do, no actual emails are sent).

You'll need the credentials printed on the terminal from your application. Save 
them for later.

Since you have your `SB_PUBLIC_KEY` and your `ROOT_TOKEN`, you're all set to 
start issuing requests to your instance.

### 2. Configure storage

If you want to use the storage feature, you'll need to provide your Amazon S3 
credentials via new environment variables. Here are the variables you'll need 
to create:

_Please note that by default the local storage implementation is set but this 
uses the /tmp directory and get deleted after a restart._

```
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_SECRET_KEY=your-aws-key
AWS_SES_ENDPOINT=https://email.us-east-1.amazonaws.com
AWS_REGION=us-east-1
AWS_S3_BUCKET=your.bucketname.here
AWS_CDN_URL=https://your.cdnurlhere.com
```

### 3. Sending emails

To be able to send emails, you'll need to provide the above AWS credentials and 
set the email provider variable to `ses`:

```
MAIL_PROVIDER=ses
FROM_EMAIL=you@domain.com
FROM_NAME=your-name
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_SECRET_KEY=your-aws-key
AWS_SES_ENDPOINT=https://email.us-east-1.amazonaws.com
AWS_REGION=us-east-1
AWS_S3_BUCKET=your.bucketname.here
AWS_CDN_URL=https://your.cdnurlhere.com
```

__Please note that only two email providers are available at this time of 
writing, `dev` or `ses`. Feel free to look at the 
[self-hosting documentation](/getting-started/self-hosting/) to find if there 
are new providers available._

That's it! You're all set up and ready to host an infinite number of apps on 
your self-hosted StaticBackend instance.