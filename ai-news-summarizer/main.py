import sys

def main():
    print("Welcome to AI News Summarizer!")
    print("\nTo run the backend:")
    print("  uv run uvicorn backend.main:app --reload --port 8000")
    print("\nTo run the frontend:")
    print("  cd frontend && npm install && npm run dev")
    print("\nMake sure to set your API keys in ai-news-summarizer/backend/.env")

if __name__ == "__main__":
    main()
