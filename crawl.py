import os
import requests
from bs4 import BeautifulSoup

TARGET_URL = (
    "https://www.i-boss.co.kr/insiter.php"
    "?design_file=1957.php&search_value=%EC%9D%B8%ED%94%8C%EB%A3%A8%EC%96%B8%EC%84%9C"
)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

SLACK_WEBHOOK_URL = os.environ.get("SLACK_WEBHOOK_URL", "")


def send_slack(message: str) -> None:
    if not SLACK_WEBHOOK_URL:
        return
    try:
        requests.post(SLACK_WEBHOOK_URL, json={"text": message}, timeout=10)
    except Exception:
        pass


def fetch_listings() -> list[dict]:
    try:
        resp = requests.get(TARGET_URL, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except requests.exceptions.ConnectTimeout:
        print("Connection timed out while fetching listings.")
        send_slack("crawl.py: Connection to i-boss.co.kr timed out. Skipping this run.")
        return []
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        send_slack(f"crawl.py: Request failed — {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    listings = []

    for item in soup.select(".list_item, .board_list tr, article"):
        title_el = item.select_one("a, .title, h2, h3")
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        link = title_el.get("href", "")
        if link and not link.startswith("http"):
            link = "https://www.i-boss.co.kr" + link
        if title:
            listings.append({"title": title, "link": link})

    return listings


def format_slack_message(listings: list[dict]) -> str:
    if not listings:
        return "크롤링 결과: 새로운 인플루언서 공고가 없습니다."
    lines = ["*[인플루언서 공고 업데이트]*"]
    for item in listings:
        line = f"• {item['title']}"
        if item["link"]:
            line += f" — {item['link']}"
        lines.append(line)
    return "\n".join(lines)


if __name__ == "__main__":
    listings = fetch_listings()
    print(f"Found {len(listings)} listings.")
    for item in listings:
        print(f"  - {item['title']} ({item['link']})")

    message = format_slack_message(listings)
    send_slack(message)
    print("Done.")
