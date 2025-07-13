# 🐝 Honeybee AI - Banking Assistant

A modern AI-powered banking assistant that helps users analyze their financial data through natural language queries.

## ✨ Features

- **AI-Powered Analysis**: Chat with your bank statements using natural language
- **Financial Insights**: Get instant insights about spending patterns, transactions, and financial health
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **Contact Integration**: Contact form with Google Sheets integration
- **Real-time Chat**: Interactive chatbot with typewriter effects

## 🛠️ Tech Stack

### Frontend
- **React** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Marked** - Markdown parser for bot responses
- **DOMPurify** - XSS protection

### Backend
- **FastAPI** - Modern Python web framework
- **Pandas** - Data analysis and manipulation
- **OpenRouter** - AI model access (Google Gemini 2.5 Flash)
- **CORS** - Cross-origin resource sharing

### Integration
- **Google Apps Script** - Contact form backend
- **Google Sheets** - Contact data storage

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- OpenRouter API account
- Google Account (for contact form)

### 🌐 Live Demo
- **Frontend**: [Deploy to Netlify](https://netlify.com) - See `NETLIFY_DEPLOYMENT.md`
- **Backend**: [Deploy to Render](https://render.com) - Uses environment variables for API keys

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your API keys
   # Get your OpenRouter API key from: https://openrouter.ai/
   ```

4. **Start the backend server**
   ```bash
   python main.py
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables

### Backend (.env)
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
CSV_PATH=simulated_bank_statement.csv
```

### Frontend (.env)
```env
VITE_GOOGLE_SCRIPT_URL=your_google_apps_script_url_here
VITE_API_URL=http://localhost:8000
```

## 📧 Contact Form Setup

The contact form integrates with Google Sheets for data storage:

1. **Create Google Apps Script**
   - Go to [Google Apps Script](https://script.google.com/)
   - Create a new project
   - Use the code from `google-apps-script.gs`

2. **Deploy as Web App**
   - Click "Deploy" → "New deployment"
   - Choose "Web app" type
   - Set execute as "Me" and access to "Anyone"
   - Copy the web app URL

3. **Add to Environment**
   ```env
   VITE_GOOGLE_SCRIPT_URL=your_copied_web_app_url
   ```

For detailed setup instructions, see `FINAL_SETUP_GUIDE.md`.

## 🌐 Deployment

### Frontend (Netlify)
See `NETLIFY_DEPLOYMENT.md` for complete deployment guide.

**Quick Deploy:**
1. Push to GitHub (`.env` stays local)
2. Connect repository to Netlify
3. Add environment variables in Netlify dashboard:
   - `VITE_GOOGLE_SCRIPT_URL`
   - `VITE_API_URL`
4. Deploy automatically

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Add environment variables:
   - `OPENROUTER_API_KEY`
   - `CSV_PATH`
3. Deploy with Python runtime

## 🏗️ Project Structure

```
honeybee-ai/
├── backend/
│   ├── main.py              # FastAPI main application
│   ├── gpt_agent.py         # AI model integration
│   ├── parser.py            # Data processing utilities
│   ├── requirements.txt     # Python dependencies
│   └── simulated_bank_statement.csv
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── App.css          # Custom styles
│   │   └── index.css        # Global styles
│   ├── public/
│   └── package.json
└── README.md
```

## 🤖 AI Model

This project uses **Google Gemini 2.5 Flash (Lite Preview)** via OpenRouter for:
- Fast, lightweight responses
- Real-time financial data understanding
- Cost-effective processing
- Optimized for conversational AI

## 🎨 Features in Detail

### Interactive Chat Interface
- Typewriter effect for realistic conversation
- Markdown support for rich formatting
- Error handling with user-friendly messages
- Loading states with animated indicators

### Financial Analysis
- Spending pattern analysis
- Transaction categorization
- Monthly/yearly summaries
- Custom queries about financial data

### Modern UI/UX
- Glassmorphism design elements
- Smooth animations and transitions
- Responsive design for all devices
- Accessibility considerations

## 🔒 Security

- Environment variables for sensitive data
- CORS configuration for API security
- Input sanitization and validation
- XSS protection with DOMPurify

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email ssandeep2444@gmail.com or create an issue in the repository.

## 🙏 Acknowledgments

- Sample bank statement data from Kaggle
- OpenRouter for AI model access
- Vercel/Render for deployment platforms
- Google Apps Script for contact form backend

---

Made with ❤️ by [Sandeep Sriramula](https://github.com/sandeep-sriramula)
