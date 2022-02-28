+++
title = "Quickstart guide: React + StaticBackend"

docsub = "Use React and StaticBackend to build great SPA"
submenu = "react"

metadesc = "Learn how to integrate StaticBackend to a React application created from scratch."
cardimg = "https://staticbackend.com/img/blog/react-wiki.png"
+++

**GitHub repository**: 
[https://github.com/staticbackendhq/react-wiki](https://github.com/staticbackendhq/react-wiki)

Let's see how we can use StaticBackend from a React application. In this 
tutorial, we will build a simple wiki web application.

## Setup your development environment

You'll need to have a working development environment for StaticBackend and 
React to follow along.

### StaticBackend

You have three options to get started with StaticBackend. It depends on your 
preferences.

1. [Self-hosted version via Docker or binary](/getting-started/self-hosting/)
2. [CLI - command-line interface](/getting-started/cli/)
3. [Sign-up for a 60-day free trial - (require credit card)](/signup/)

### Create your backend app

You'll have an instance running locally if you go with option one or two.

1. Open a browser to [http://localhost:8099](http://localhost:8099)
2. Enter an email and create your app.

In the terminal that started your StaticBackend server, you'll see an email-like 
output containing your public key, root key, and admin user/password credentials.

If you signed up with option 3, you'd receive this email in your inbox.

Save that information for later.

### Create the React app

We will use [Create React App](https://create-react-app.dev/docs/getting-started/) 
to create a new React application named `react-wiki`.

```shell
$> npx create-react-app react-wiki --template typescript
... lots of npm output ...
$> cd react-wiki
```

### Test your app

Let's test that everything works so far before we jump into adding StaticBackend 
related functionalities. After that, you may start your application via this 
command:

```shell
$> npm start
```

You should see the default page created by `create-react-app`.

### Add StaticBackend

We'll now add StaticBackend's JavaScript library to the React application.

```shell
$> npm install @staticbackend/js
```

We will create a reusable module that will expose the StaticBackend client to 
the rest of the React app.

Creating an instance of the client requires two essential arguments.

1. The public key tells StaticBackend which app to target.
2. The region indicates to the client which API URL to use.

Let's add those two configuration values inside the `.env` file. 
`create-react-app` handles this file and make its variables available to your 
client-side application.

If you're working with multiple developers, they can all have their public key 
on their local development computer. So you'd only need to change those two 
values to go to production.

Let's create the `.env` file:

```
REACT_APP_SB_PUBLUC_KEY=f24cea15-e082-46c5-89f3-52ab44064b12
REACT_APP_SB_REGION=dev
REACT_APP_SB_ROOT_TOKEN=very-long-token-here
```

The variables **must** starts with **REACT_APP_** to be available to your 
application via the `process.env.REACT_APP_XYZ`.

Make sure to change the values from the email printed to the terminal when you 
created your app.

We can now create our reusable module that initializes the StaticBackend 
JavaScript client.

**src/sb.ts**:

```typescript
import {Backend} from "@staticbackend/js"

const pubKey = process.env.REACT_APP_SB_PUBLUC_KEY;
const region = process.env.REACT_APP_SB_REGION;

const bkn = new Backend(pubKey || "public key required", region || "dev");

export const backend = bkn;
```

Our JavaScript library exposes only one item, the `Backend` function. We use it 
to pass our public key and the region. From here, we will be able to import the 
client like this:

```typescript
import {backend} from "./sb";
```

All available functions supported by StaticBackend are accessible via the 
`backend` instance.

## User authentication

Our first step is to handle user authentication. We will use one page containing 
two forms, one for creating an account and one for letting the user log in.

Before we jump in, it might be helpful to understand how StaticBackend handles 
authentication and requests.

Users authenticate themselves in exchange for a session token. You need to 
supply this token for each request you send to StaticBackend.

It might be good to save this session token to the session storage. However, it 
expires after 12 hours.

**src/auth.tsx**:

```typescript
import React, {Component} from "react";
import {backend} from "./sb";

export interface IProps {
  onToken: (token: string) => void;
}

interface IState {
  email: string;
  password: string;
}

export class Auth extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      email: "",
      password: ""
    }
    
  }

  onChanged(field: "email" | "password", e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.currentTarget?.value;

    if (field == "email") {
      this.setState({
        ...this.state,
        email: e.target?.value,
      });
    } else {
      this.setState({
        ...this.state,
        password: e.target?.value
      });
    }
  }

  signup = async () => {
    const {email, password} = this.state;

    const res = await backend.register(email, password);
    if (!res.ok) {
      alert(res.content);
      return;
    }

    this.props.onToken(res.content);
  }

  signin = async () => {
    const {email, password} = this.state;

    const res = await backend.login(email, password);
    if (!res.ok) {
      alert(res.content);
      return;
    }

    this.props.onToken(res.content);    
  }

  render() {
    return (
      <div>
        <h1>User authentication</h1>
        <div>
          <label>Email</label><br />
          <input type="email" required value={this.state.email} onChange={this.onChanged.bind(this, "email")} />
        </div>

        <div>
          <label>Password</label><br />
          <input type="password" required value={this.state.password} onChange={this.onChanged.bind(this, "password")} />
        </div>

        <div>
          <button onClick={this.signup.bind(this)}>Create account</button> 
          <button onClick={this.signin.bind(this)}>Login</button>
        </div>
      </div>
    );
  }
}
```

The main code that's not React boilerplate is the two functions related to 
authentication `signup` and `signin`. We pass the email and password to 
create an account or authenticate the user.

_Notice how we're using an async/await function to call StaticBackend endpoints._

We're using a callback function from the `props` to send the user's session 
token back to the parent.

The following changes were made to the `app.tsx` file.

**src/app.tsx**:

```typescript
import React from 'react';
import logo from './logo.svg';
import './App.css';

import {Auth} from "./auth";

interface IState {
  token: string | null;
}

export class App extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      token: null
    }    
  }

  onToken(token: string) {
    this.setState({token: token});
  }

  render() {
    if (!this.state.token) {
      return <Auth onToken={this.onToken.bind(this)} />;
    }

    return (
      <div>
        <h1>Todo</h1>
      </div>
    )
  }
}
```

If we have no session token, we display our Auth component. Otherwise, we show 
a simple to-do text for now.

## Wiki article CRUD

The core functionality of StaticBackend is its database. Let's see how teams 
manage a wiki by creating, retrieving, updating, and deleting articles.

### Create and save article

Let's create a simple component to create and edit articles. When we create an 
article, we'll ask for the author's name, the title, and the body content.

When we are in edit mode, only the content will be editable.

We cannot build it with the default security model By default, users of the same 
account have read permission but cannot modify a record created by another user 
of the same account. Only the document owner has the write permission using 
the default security model.

We want users of the same account to have write permission for an article 
created across their team members for our wiki.

Custom permissions are set using a suffix of the table name. In our case, we 
will use `articles_770_` instead of `articles` to let users of the same account update 
documents created for their account.

We will use `articles_770_` which means:

* **7**: The owner has read/write permissions.
* **7**: The account users have read/write permissions.
* **0**: Other logged-in users has no permissions.

_Note that the default permission are:_:

* **7**: The owner has read/write.
* **4**: Users of same account has read permission.
* **0**: Other logged-in users has no permissions.

**src/article_edit.tsx**:

```typescript
import React, { FormEventHandler } from "react";
import { backend } from "./sb";

export interface IProps {
  token: string;
  editId: string | null;
  onSave: (article: Article) => void;
}

interface IState {
  article: Article;
  isNew: boolean;
}

export class ArticleEdit extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      article: {
        id: "",
        accountId: "",
        title: "",
        body: "",
        authorName: "",
        created: new Date()
      },
      isNew: props.editId == null
    }
  }

  componentDidMount = async () => {
    if (this.props.editId) {
      const res = await backend.getById(
        this.props.token,
        "articles_770_",
        this.props.editId
      );
      if (!res.ok) {
        alert(res.content);
        return;
      }

      this.setState({
        article: res.content,
        isNew: false
      })
    }
  }

  onChanged(field: "title" | "body" | "authorName", e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const val = e.currentTarget?.value;
    let { article } = this.state;

    article[field] = val;

    this.setState({
      ...this.state,
      article: article,
    });
  }

  save = async (e: any) => {
    e.preventDefault();

    const {token, editId, onSave} = this.props;
    const {isNew, article} = this.state;

    let res = null;
    if (isNew) {
      article.created = new Date();

      res = await backend.create(
        token,
        "articles_770_",
        article
      )
    } else {
      res = await backend.update(
        token,
        "articles_770_",
        editId || "",
        article
      )
    }

    if (!res.ok) {
      alert(res.content);
      return;
    }

    this.props.onSave(res.content);
  }

  renderAuthor() {
    if (this.state.isNew) {
      return (
        <p>
        <input
          type="text"
          value={this.state.article.authorName}
          onChange={this.onChanged.bind(this, "authorName")}
          placeholder="Author name"
          required
        />
        </p>
      )
    } else {
      <p>{this.state.article.authorName}</p>
    }
  }

  render() {
    const { article, isNew } = this.state;

    return (
      <div>
        <h1>{isNew ? "Create new article" : `Editing ${article.title}`}</h1>
        <form onSubmit={this.save.bind(this)}>
          <p>
          <input
            type="text"
            value={article.title}
            onChange={this.onChanged.bind(this, "title")}
            placeholder="Article title"
          />
          </p>
          <p>
          <textarea 
            value={article.body}
            onChange={this.onChanged.bind(this, "body")}>
          </textarea>
          </p>
          {this.renderAuthor()}
          <p>
          <button type="submit">
            {isNew ? "Create article" : "Save changes"}
          </button>
          </p>
        </form>
      </div>
    )
  }
}
```

The things that you should focus on are:

This component receives its token and an indicator if we're editing or creating 
a new article.

```typescript
export interface IProps {
  token: string;
  editId: string | null;
  onSave: (article: Article) => void;
}
```

The state and constructor are straightforward.

Let's look a the `componentDidMount` where we use the `getById` function to grab 
the article via the `id` received in the `props`.

```typescript
const res = await backend.getById(
  this.props.token,
  "articles_770_",
  this.props.editId
);
```

The `save` function make sure to call the `create` or `update` function 
depending if we're creating or updating the article.

Once saved, we call the `onSave` function received in the `props` and return 
the control to the parent component.

### List and delete article

There have been some changes to the `src/apptsx` file to list, react to the 
creation and update, and delete articles.

Here's the part that have changed:

**The state**:

```typescript
interface IState {
  token: string | null;
  articles: Array<Article>;
  isEditing: boolean;
  editId: string | null;
}
```

The callback after a successful account creation or login now fetches the 
articles for that account.

```typescript
onToken(token: string) {
    this.setState({
      ...this.state,
      token: token
    });

    (async () => {
      const res = await backend.list(
        token,
        "articles_770_"
      );
      if (!res.ok) {
        console.error(res.content);
        return;
      }

      let articles = res.content.results;
      if (!articles) {
        articles = [];
      }

      this.setState({
        ...this.state,
        articles: articles
      })
    })();
  }
```

When an article is created or updated we handle the changes in a callback we 
pass via `props` to the `ArticleEdit` component.

```typescript
onArticleSaved(article: Article) {
  let { articles, editId } = this.state;

  if (editId == null) {
    articles.push(article);
  } else {
    let idx = this.findArticle(articles, editId);
    if (idx > -1) {
      articles[idx] = article;
    }
  }

  this.setState({
    ...this.state,
    articles: articles,
    isEditing: false,
    editId: null
  })
}
```

Thie is the deletion of an article:

```typescript
del = async (id: string) => {
  const res = await backend.delete(
    this.state.token || "",
    "articles_770_",
    id || ""
  );
  if (!res.ok) {
    alert(res.content);
    return;
  }

  let { articles } = this.state;

  let idx = this.findArticle(articles, id);
  if (idx > -1) {
    articles.splice(idx, 1);
  }

  this.setState({
    ...this.state,
    articles: articles
  })
}
```

The `render` function:

```typescript
render() {
  if (!this.state.token) {
    return <Auth onToken={this.onToken.bind(this)} />;
  } else if (this.state.isEditing) {
    return <ArticleEdit
      token={this.state.token}
      editId={this.state.editId}
      onSave={this.onArticleSaved.bind(this)}
    />;
  }

  return (
    <div>
      <h1>List articles</h1>
      <button onClick={this.newArticle.bind(this)}>
        Create a new article
      </button>
      <p>
        <strong>Todo list articles</strong>
      </p>
      <ul>
        {this.state.articles.map((a) => this.renderArticle(a))}
      </ul>
    </div>
  )
}
```

Notice how we're passing the callback to the `ArticleEdit`'s `onSave` props.

Finally, the `renderArticle` which render a simple `<li>` with the Edit 
and Delete buttons.

```typescript
renderArticle(a: Article) {
  return (
    <li key={a.id}>
      <h4>{a.title}</h4>
      <p>{a.body}</p>
      <p>By {a.authorName} on {a.created}</p>
      <p>
        <button onClick={this.edit.bind(this, a.id)}>Edit</button>
        <button onClick={this.del.bind(this, a.id)}>Delete</button>
      </p>
    </li>
  )
}
```

## Conclusion

The concept should look familiar if you have built a React application in the 
past. You may use all the [functionalities](/docs/) of StaticBackend via the 
`backend` client.

In this tutorial, we've only covered the [authentication](/docs/users/) and the 
[database](/docs/database/), but there are many more building blocks at 
your disposal.

* [WebSocket](/docs/websocket/) - real-time database and topic-based 
communication. It's not limited to database events.
* [Storage](/docs/storage/) - upload files and serve them via a CDN close to 
your users location.
* [Server-side functions](/docs/functions/) - create secure function when you 
need to run things server-side.
* [Send emails](/docs/sendmail/) - all web/mobile apps need to send emails to 
their users.
* [Cache](/docs/cache/) - cache key data for performance.

