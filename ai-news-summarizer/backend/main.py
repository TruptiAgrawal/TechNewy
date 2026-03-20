import os
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import asyncio

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

class SummaryRequest(BaseModel):
    topic: str
    article_count: int = 5

@app.get("/")
def home():
    return {"message": "AI News Summarizer API (Mock Mode Active)"}

def get_mock_data(topic: str, count: int):
    """Generates realistic mock data based on the requested topic."""
    articles = []
    sources = ["TechCrunch", "The Verge", "Reuters", "Wired", "Ars Technica", "BBC News"]
    
    for i in range(count):
        articles.append({
            "title": f"The Evolution of {topic.title()}: What to Expect in 2026",
            "url": "https://example.com/article-" + str(i),
            "publishedAt": "2026-03-20",
            "source": sources[i % len(sources)],
            "summary": f"In-depth analysis of how {topic} is disrupting traditional industries. Experts suggest that the rapid growth in this sector will lead to significant regulatory changes by the end of the year."
        })
    
    overall_summary = f"""The latest developments in {topic} indicate a significant shift towards more sustainable and efficient integration. 

Key themes from recent reports include:
1. Increased investment from venture capital firms specializing in emerging technologies.
2. A growing emphasis on user privacy and data security within the {topic} ecosystem.
3. Breakthroughs in performance that allow for wider adoption in consumer markets.

Overall, {topic} continues to be a central point of innovation, with industry leaders predicting a 40% increase in market penetration over the next 18 months."""

    return articles, overall_summary

@app.post("/summarize")
async def summarize(req: SummaryRequest):
    # Simulate a small delay for realistic UI loading states
    await asyncio.sleep(1.5)
    
    try:
        articles, overall_summary = get_mock_data(req.topic, req.article_count)
        
        return {
            "topic": req.topic,
            "articles": articles,
            "overall_summary": overall_summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
