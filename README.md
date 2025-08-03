# Circlo.in - Rent, Lend, Connect

A modern peer-to-peer rental platform built with React and TypeScript, designed to facilitate item sharing and community connections.

## 🚀 Features

### Core Functionality
- **Item Listings**: Browse and search through various categories of rentable items
- **User Authentication**: Secure login and registration system
- **Booking System**: Easy booking and reservation management
- **Chat System**: Built-in messaging for renters and lenders
- **Dashboard**: Personal dashboard for managing listings and bookings
- **Cultural Vault**: Specialized cultural item sharing
- **Admin Panel**: Administrative tools for platform management

### Categories
- Electronics
- Fashion & Clothing
- Tools & Equipment
- Toys & Baby Items
- Auto Accessories
- Sports & Fitness
- Books & Media
- Home & Furniture

### Advanced Features
- **AI-Powered Analysis**: Image analysis and item recommendations
- **Aadhaar Verification**: Secure identity verification system
- **Karma Points**: Community reputation system
- **Review System**: User reviews and ratings
- **Payment Integration**: Modern payment processing
- **Location Services**: Location-based item discovery
- **Availability Calendar**: Real-time availability tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router DOM** - Client-side routing

### UI/UX Libraries
- **Headless UI** - Accessible UI components
- **Lucide React** - Beautiful icons
- **Lenis** - Smooth scrolling
- **CLSX** - Conditional class names

### AI Integration
- **Google Generative AI** - AI-powered features and analysis

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm, yarn, or pnpm

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── GlassComponents.tsx    # Glass morphism components
│   ├── Header.tsx            # Navigation header
│   ├── Footer.tsx            # Site footer
│   ├── ChatWidget.tsx        # Chat functionality
│   └── ...
├── pages/              # Page components
│   ├── HomePage.tsx          # Landing page
│   ├── ListingsPage.tsx      # Item listings
│   ├── ProductDetailPage.tsx # Item details
│   ├── DashboardPage.tsx     # User dashboard
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx       # Authentication state
│   └── AppContext.tsx        # Application state
├── services/           # API and external services
│   └── geminiService.ts      # Google AI integration
└── assets/            # Static assets
    └── ...
```

## 🎨 Key Components

### Glass Components
Custom glass morphism UI components for a modern, translucent design:
- `GlassCard` - Glass effect cards
- `GlassButton` - Styled buttons
- `GlassCounter` - Animated counters
- `GlassCategoryTile` - Category display tiles

### Authentication
- Secure user registration and login
- JWT token management
- Protected routes

### Chat System
- Real-time messaging between users
- Thread-based conversations
- Chat hub for managing conversations

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
VITE_GOOGLE_AI_KEY=your_google_ai_key_here
```

### Tailwind Configuration
The project uses Tailwind CSS with custom configurations in `tailwind.config.js`.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced AI recommendations
- [ ] Blockchain integration for secure transactions
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social features and community building

---

**Circlo.in** - Building communities through shared resources. 🌟 