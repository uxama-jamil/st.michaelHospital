# MyEndo Admin Panel

A modern React-based admin panel built with Vite, TypeScript, and Ant Design for managing MyEndo platform operations.

## 🚀 Features

- **Modern Stack**: Built with React 19, TypeScript, and Vite
- **UI Components**: Ant Design for consistent and professional UI
- **Document Processing**: Support for PDF, DOCX, PPTX, and Excel files
- **Drag & Drop**: Sortable interfaces with @dnd-kit
- **Form Management**: Formik for robust form handling
- **Authentication**: JWT-based authentication system
- **Infinite Scroll**: Optimized data loading for large datasets
- **Multi-Environment**: Support for development, QA, staging, and production environments

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (version 20 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://bitbucket.org/folio3/webadmin-myendo.git
   cd webadmin-myendo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Environment Setup**

   Copy the example environment file and configure your environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   VITE_API_BASE_URL=https://your-api-base-url
   VITE_ENV=development
   ```

## 🏃‍♂️ Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment-Specific Development

Run the application in different environments:

- **QA Environment**:

  ```bash
  npm run dev:qa
  ```

- **Staging Environment**:

  ```bash
  npm run dev:staging
  ```

- **Production Environment**:
  ```bash
  npm run dev:prod
  ```

## 🔨 Building for Production

### Build Commands

Build the application for different environments:

- **Development Build**:

  ```bash
  npm run build
  ```

- **QA Build**:

  ```bash
  npm run build:qa
  ```

- **Staging Build**:

  ```bash
  npm run build:staging
  ```

- **Production Build**:
  ```bash
  npm run build:prod
  ```

### Preview Built Application

After building, you can preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```bash
├── dist/                  # Production build output
├── src/
│   ├── assets/            # Static assets
│   │   ├── images/        # Image files
│   │   ├── scss/          # SCSS / global styles
│   │   └── svg/           # SVG icons
│   ├── components/        # Shared components
│   ├── context/           # Global context providers
│   ├── pages/             # Application pages
│   ├── services/          # API and service logic
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
├── .env.example           # Sample environment variables
├── package.json           # Project metadata and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

## 🧪 Code Quality

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

Fix linting issues automatically:

```bash
npm run lint:fix
```

### Code Formatting

Format code with Prettier:

```bash
npm run format
```

## 🔧 Key Dependencies

### Production Dependencies

- **React 19**: Latest React version with enhanced features
- **Ant Design**: Enterprise-grade UI design language
- **React Router DOM**: Declarative routing for React
- **Axios**: Promise-based HTTP client
- **Formik**: Form library for React
- **JWT Decode**: JWT token decoding utility
- **Document Processing**:
  - `mammoth`: DOCX to HTML conversion
  - `pdfjs-dist`: PDF processing
  - `pptx-parser`: PowerPoint file parsing
  - `xlsx`: Excel file processing

### Development Dependencies

- **Vite**: Next-generation frontend tooling
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🌍 Environment Configuration

The application supports multiple environments through Vite modes:

- **Development**: Local development environment
- **QA**: Quality assurance environment
- **Staging**: Pre-production environment
- **Production**: Live production environment

Each environment can have its own configuration by creating corresponding `.env` files:

- `.env.development`
- `.env.qa`
- `.env.staging`
- `.env.production`

## 🔐 Authentication

The application uses JWT-based authentication. Ensure your API endpoints are configured to handle JWT tokens for secure access.

## 📊 Document Processing Features

The admin panel supports various document formats:

- **PDF**: View and process PDF documents
- **DOCX**: Convert Word documents to HTML
- **PPTX**: Parse PowerPoint presentations
- **Excel**: Process spreadsheet data (XLS/XLSX)

## 🚀 Deployment

1. **Build the application** for your target environment:

   ```bash
   npm run build:prod
   ```

2. **Deploy the `dist` folder** to your hosting service (Netlify, Vercel, AWS S3, etc.)

3. **Configure environment variables** on your hosting platform

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `vite.config.ts` or kill the process using the port
2. **Environment variables not loading**: Ensure your `.env` file is in the root directory and variables are prefixed with `VITE_`
3. **Build errors**: Check for TypeScript errors and ensure all dependencies are installed

### Debug Mode

Enable debug mode by setting:

```env
VITE_DEBUG=true
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Happy coding! 🎉**
