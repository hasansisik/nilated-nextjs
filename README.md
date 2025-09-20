# WordPress Clone with Drag-and-Drop Home Page Builder

A modern WordPress-style CMS built with Next.js, featuring a powerful drag-and-drop home page builder that allows you to create beautiful pages without writing code.

## Features

- **Drag-and-Drop Page Builder**: Easily build your home page by adding and rearranging sections
- **Multiple Component Options**: Choose from a variety of Hero, CTA, FAQ, Features, and Services sections
- **Header & Footer Styles**: Select from different header and footer styles
- **Live Code Preview**: See the generated code for your page as you build
- **Instant Updates**: Changes are automatically applied to your site when saved

## Home Page Builder

The home page builder allows you to:

1. **Add Sections**: Choose from various pre-built sections to add to your page
2. **Rearrange Sections**: Drag and drop to reorder sections
3. **Change Header/Footer**: Select different styles for your header and footer
4. **Preview Code**: See the actual Next.js code being generated for your page
5. **Instant Preview**: View your page as you build it

### Available Sections

- **Hero Sections**: Eye-catching headers for your page
- **CTA Sections**: Call-to-action components with various layouts
- **FAQ Sections**: Accordion-style FAQ layouts
- **Feature Sections**: Showcase your features in different grid layouts
- **Service Sections**: Display your services with icons and descriptions

## Getting Started

1. Visit the dashboard at `/dashboard/page/home` to access the page builder
2. Add sections from the right sidebar by clicking on them
3. Drag and drop sections to rearrange them
4. Select your preferred header and footer styles
5. Save your changes to update the live site

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.
Visit [http://localhost:3000/dashboard/page/home](http://localhost:3000/dashboard/page/home) to use the page builder.

## Technologies Used

- Next.js
- React
- @dnd-kit (for drag and drop functionality)
- TypeScript
- Tailwind CSS