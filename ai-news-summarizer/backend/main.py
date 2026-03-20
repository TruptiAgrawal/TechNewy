import os
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import asyncio
from typing import List, Optional

# Load environment variables
load_dotenv()

app = FastAPI()

# allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Simplified for testing
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

client = Groq(api_key=GROQ_API_KEY)

class SummaryRequest(BaseModel):
    topic: str
    article_count: int = 5

@app.get("/")
def home():
    return {"message": "AI News Summarizer API (Groq Powered)"}

async def fetch_news(topic: str, count: int):
    url = f"https://newsapi.org/v2/everything?q={topic}&pageSize={count}&apiKey={NEWS_API_KEY}&language=en&sortBy=publishedAt"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch news from NewsAPI")
        data = response.json()
        return data.get("articles", [])

async def generate_summary(topic: str, articles: List[dict]):
    if not articles:
        return "No articles found to summarize."
    
    context = "\n\n".join([
        f"Title: {a['title']}\nSource: {a['source']['name']}\nDescription: {a['description']}"
        for a in articles if a.get('title') and a.get('description')
    ])
    
    prompt = f"""
    You are an expert news analyst. Provide a concise, high-level overall summary of the following news articles related to the topic: '{topic}'.
    Focus on key themes, trends, and significant developments.
    
    Articles:
    {context}
    
    Summary:
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes news concisely."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=500,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Groq Error: {e}")
        return "Summary generation failed."

async def generate_article_summary(article: dict):
    prompt = f"Summarize this article in one short sentence: {article['title']}. Content: {article.get('description', '')}"
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=100,
        )
        return completion.choices[0].message.content
    except:
        return article.get('description', 'No summary available.')

@app.post("/summarize")
async def summarize(req: SummaryRequest):
    try:
        # 1. Fetch real news
        raw_articles = await fetch_news(req.topic, req.article_count)
        
        if not raw_articles:
             return {
                "topic": req.topic,
                "articles": [],
                "overall_summary": "No recent articles found for this topic."
            }

        # 2. Prepare individual article data
        articles = []
        for a in raw_articles:
            articles.append({
                "title": a["title"],
                "url": a["url"],
                "publishedAt": a["publishedAt"][:10],
                "source": a["source"]["name"],
                "summary": a.get("description", "") # Use description as fallback
            })
        
        # 3. Generate overall summary using Groq
        overall_summary = await generate_summary(req.topic, raw_articles)
        
        return {
            "topic": req.topic,
            "articles": articles,
            "overall_summary": overall_summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
