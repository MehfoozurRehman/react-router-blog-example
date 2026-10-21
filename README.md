# Blogy

A React Router and MongoDB blog with a public post list, Markdown posts, and an admin area to create, edit and delete posts.

**Status:** Working demo. The public list, the post page and the admin create, edit and delete flows run end to end against MongoDB, but the admin area has no login and the repository has no tests.

## The problem

The code is a small blog. Post details, including the title, description, publish flag and a path to a Markdown file, are stored in MongoDB. The post body is read from a Markdown file in `public/` and rendered on the page. The repository includes one sample Markdown post.

## What it does

- A public home page that lists published posts (`app/routes/_index.tsx`).
- A post page that reads the Markdown file named in the record and renders it with `react-markdown` and GitHub-flavoured Markdown (`app/routes/$blog.tsx`). Unpublished posts show a "not published" message.
- An admin list of all posts, showing whether each is published or a draft, with a delete action (`app/routes/admin.blog._index.tsx`).
- Admin create and edit forms for the title, description, Markdown path and published flag (`admin.blog.create.tsx`, `admin.blog.$blogId.tsx`).

## How it's built

React Router 7 with file-based routes from `@react-router/fs-routes` (`app/routes.ts`), a server build served with `react-router-serve`, and SCSS styles in `styles/`. Mongoose models live in `models/blog.ts`, and `lib/mongoose.ts` caches one database connection. The design keeps metadata in MongoDB and post bodies in Markdown files, so content can be edited as files. The repository includes Dockerfiles for npm, pnpm and bun.

## Running it locally

Set `VITE_DATABASE_URL` in a `.env` file to a MongoDB connection string. It is read through `import.meta.env` in `lib/mongoose.ts`.

```bash
npm install
npm run dev         # React Router dev server
npm run build       # production build
npm start           # serves the build
npm run typecheck   # generates route types and runs tsc
```

## What's left

- The admin routes have no authentication. Anyone who can reach `/admin/blog` can create, edit or delete posts.
- The delete action waits two seconds with `setTimeout` before deleting, which looks like leftover test code.
- `markdownPath` is joined into a file path without validation, so it should be restricted to a fixed folder and plain file names.
- `VITE_DATABASE_URL` is not documented in an example env file.
- There are no tests.
