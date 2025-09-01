# AI Tutorial - Next.js Application

A Next.js application featuring AI-powered sentiment analysis and chat functionality. This project demonstrates integration with both HuggingFace models for text classification and local Ollama models for conversational AI.

## Features

### 🎯 Sentiment Analysis (Home Page)
- Real-time text sentiment analysis using HuggingFace's DistilBERT model
- Live sentiment scoring with confidence percentages
- Visual progress bars and color-coded sentiment indicators
- Debounced input for efficient API calls

### 💬 Chat Interface (Chat Page)
- Interactive chat interface powered by local Ollama Llama 3.1:8b model
- Real-time message streaming
- Message history with timestamps
- Error handling and connection status feedback

## Tech Stack

- **Framework**: Next.js 15.1.4 with App Router
- **Styling**: Tailwind CSS with custom UI components
- **AI Models**: 
  - HuggingFace DistilBERT for sentiment analysis
  - Local Ollama Llama 3.1:8b for chat
- **UI Components**: Custom components built with Radix UI primitives
- **Icons**: Lucide React

## Prerequisites

### For Sentiment Analysis
1. HuggingFace API token
2. Set up your environment variables (see `.env.local.example`)

### For Chat Functionality  
1. Install [Ollama](https://ollama.ai/)
2. Download the Llama 3.1:8b model:
   ```bash
   ollama pull llama3.1:8b
   ```
3. Start the Ollama server:
   ```bash
   ollama serve
   ```

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Add your HuggingFace token to .env.local
   ```

3. **Run the development server**:
   ```bash
   pnpm run dev
   ```

4. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.js                 # Sentiment analysis home page
│   ├── chat/page.js           # Chat interface
│   ├── api/
│   │   ├── chat/route.js      # Ollama chat API endpoint
│   │   └── text-classification/route.js  # HuggingFace sentiment API
│   └── layout.js              # Root layout
├── components/ui/             # Reusable UI components
│   ├── badge.jsx
│   ├── button.jsx
│   ├── card.jsx
│   ├── input.jsx
│   ├── progress.jsx
│   ├── scroll-area.jsx
│   └── textarea.jsx
├── lib/
│   └── utils.js               # Utility functions
└── utils/
    └── huggingFace.js         # HuggingFace client setup
```

## API Endpoints

### `/api/text-classification`
- **Method**: POST
- **Purpose**: Analyze text sentiment using HuggingFace DistilBERT
- **Parameters**: 
  - `prompt` (required): Text to analyze
  - `max_length` (optional): Maximum response length
  - `temperature` (optional): Model temperature

### `/api/chat`  
- **Method**: POST
- **Purpose**: Chat with local Ollama Llama model
- **Parameters**:
  - `prompt` (required): User message

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file with:
```bash
HF_TOKEN=your_huggingface_token_here
```

## Error Handling

The application includes comprehensive error handling for:
- Missing API tokens
- Ollama server connection issues
- Model availability checks
- Network timeouts and failures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
