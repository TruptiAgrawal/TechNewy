# TechNewy 📰

An AI-powered news summarizer that delivers concise, topic-based insights from global news sources.

## 🚀 Overview
TechNewy leverages Large Language Models (LLMs) to fetch, process, and summarize news articles based on user-defined topics and date ranges. It aims to reduce information overload by providing structured, bulleted summaries with direct citations.

## ✨ Features
- **Smart Fetching:** Integration with leading News APIs (NewsAPI.org/Bing) for real-time data.
- **AI Summarization:** Context-aware summaries using GPT-4o or Claude.
- **Clean UI:** Responsive web interface for seamless topic searching and filtering.
- **Citations:** Every summary point is linked back to its original source.
- **Caching:** Optimized performance using Redis/Local caching for frequent queries.

## 🛠️ Tech Stack
- **Frontend:** React / Next.js (TypeScript)
- **Backend:** Python (FastAPI)
- **AI/ML:** OpenAI GPT-4o-mini / LangChain
- **Database:** MongoDB or PostgreSQL
- **Caching:** Redis

## 🏗️ Architecture & Design
TechNewy is designed for modularity and scalability:
- **News Engine:** Handles abstraction over multiple News APIs and potential scraping fallbacks.
- **Summarization Pipeline:** Implements context-aware prompt engineering to ensure consistent, high-quality bulleted highlights.
- **API Layer:** Fast, asynchronous endpoints designed to handle I/O-bound fetching and CPU-intensive summarization.

### Design Decisions & Trade-offs
- **API over Scraping:** Prioritizes official APIs for reliability and legal compliance, with scrapers reserved for high-value targeted sources.
- **Proprietary LLMs:** Uses GPT-4o/Mini for high-quality zero-shot summarization, allowing for rapid iteration before considering fine-tuned open-source models.
- **Caching Strategy:** Implements a 1–6 hour cache on popular topics to reduce LLM costs and latency.

## 🚦 Getting Started (Development)

### Prerequisites
- Node.js & npm/yarn
- Python 3.9+
- API Keys: OpenAI, NewsAPI.org

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/technewy.git
   cd technewy
   ```

2. **Backend Setup:**
   ```bash
   # Create a virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies (once created)
   # pip install -r requirements.txt
   ```

3. **Frontend Setup:**
   ```bash
   # Install dependencies (once created)
   # npm install
   ```

## 📈 Roadmap
- [ ] Multi-language support and translation.
- [ ] User accounts and saved searches.
- [ ] Trending topic clustering.
- [ ] Mobile application (Flutter/React Native).

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
