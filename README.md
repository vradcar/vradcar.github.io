# Modern Portfolio Website

A professional portfolio website built with React, TypeScript, and Material-UI, featuring smooth animations, interactive elements, and a responsive design.

## Technologies Used

- React 18
- TypeScript
- Material-UI (MUI)
- Framer Motion
- React Particles
- Styled Components
- Three.js
- Node.js/Express (for backend API)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Build for production:
```bash
npm run build
# or
yarn build
```

## 📁 Project Structure

```
portfolio-website/
├── public/
│   ├── images/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Hero/
│   │   ├── About/
│   │   ├── Research/
│   │   ├── Experience/
│   │   ├── Projects/
│   │   └── Contact/
│   ├── theme/
│   ├── utils/
│   ├── hooks/
│   ├── types/
│   └── App.tsx
├── server/
│   ├── routes/
│   └── index.ts
└── package.json
```

## 🎨 Customization

1. Theme Configuration:
   - Edit colors and typography in `src/theme/theme.ts`
   - Modify component styles in respective component files

2. Content Updates:
   - Update personal information in `src/data/content.ts`
   - Modify project details in `src/data/projects.ts`
   - Update experience information in `src/data/experience.ts`

3. Images and Assets:
   - Place custom images in `public/images/`
   - Update image references in component files

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px and above)
- Tablet (768px to 1199px)
- Mobile (below 768px)

## ✨ Features

- Interactive particle background
- Smooth scroll animations
- Dark mode support
- SEO optimized
- Contact form with validation
- Project filtering and sorting
- Lazy loading images
- Progressive Web App (PWA) support

## 🚀 Deployment

### Vercel Deployment
```bash
npm i -g vercel
vercel login
vercel
```

### Netlify Deployment
```bash
npm i -g netlify-cli
netlify login
netlify deploy
```

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
