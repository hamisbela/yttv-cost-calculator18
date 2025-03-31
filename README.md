# YouTube TV Cost Calculator

A React application to calculate the cost of YouTube TV subscriptions with various add-ons, plus a blog section with content loaded from Markdown files.

## Features

- YouTube TV subscription cost calculator with different add-on options
- Blog system that loads content from Markdown files
- Support for uploading blog content in zip files that are automatically extracted during build

## Development

```bash
npm install
npm run dev
```

## Blog Content

Blog content can be added in two ways:

1. Individual markdown files in the `blog-content` directory
2. Zip files containing markdown files in the `blog-zips` directory

When you run `npm run build`, the system will:

1. Extract any zip files from `blog-zips` into the `blog-content` directory
2. Include all markdown files in the build

## Deployment

The project is set up to work with Netlify. The build command in `package.json` automatically handles the extraction of blog content zip files before building the site.

```
npm run build
```

## Adding Blog Posts via Zip Files

1. Create your markdown blog posts
2. Zip them up (you can include subdirectories if needed)
3. Place the zip file(s) in the `blog-zips` directory
4. During build, they will be automatically extracted to the `blog-content` directory

This approach allows you to upload many blog posts at once, without hitting GitHub's file limit.