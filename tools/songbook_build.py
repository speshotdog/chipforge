"""曲庫量產工具：每個主題鍛 N 首精選曲，輸出 js/songbook.js 資料模組。

每首曲子 = chipforgeAuto 生成 count 個候選 → director 評分取最高 → 存 shareHash。
不渲染 WAV（skipRender），純作曲，一首約零點幾秒。

用法:
  python tools/songbook_build.py --cats jpop rpg legend boss   # 指定分類
  python tools/songbook_build.py --themes stardrive battle     # 指定主題
  python tools/songbook_build.py --per 10 --count 6 --bars 32  # 參數調整

輸出 js/songbook.js（重跑會整檔重生；已有主題不在本次清單則保留舊資料）。
"""
import argparse
import json
import re
import socket
import threading
from datetime import date
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

CHIPFORGE_DIR = Path(__file__).resolve().parent.parent
OUT_JS = CHIPFORGE_DIR / "js" / "songbook.js"


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def start_server(directory: Path):
    handler = partial(QuietHandler, directory=str(directory))
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        port = s.getsockname()[1]
    srv = ThreadingHTTPServer(("127.0.0.1", port), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, port


def load_existing():
    """重跑時保留不在本次清單的主題（增量更新）"""
    if not OUT_JS.exists():
        return {}
    m = re.search(r"export const SONGBOOK = (\{.*\});", OUT_JS.read_text(encoding="utf-8"), re.S)
    if not m:
        return {}
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return {}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cats", nargs="*", default=None, help="分類 id（見 themes.js CATEGORIES）")
    ap.add_argument("--themes", nargs="*", default=None, help="直接指定主題 id")
    ap.add_argument("--per", type=int, default=10, help="每主題幾首")
    ap.add_argument("--count", type=int, default=6, help="每首的候選數（取最高分）")
    ap.add_argument("--bars", type=int, default=32)
    args = ap.parse_args()

    from playwright.sync_api import sync_playwright
    srv, port = start_server(CHIPFORGE_DIR)
    book = load_existing()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(f"http://127.0.0.1:{port}/auto.html")
            page.wait_for_function("typeof window.chipforgeAuto === 'function'", timeout=15000)

            themes = list(args.themes or [])
            if args.cats:
                cat_themes = page.evaluate(
                    """cats => import('./js/themes.js').then(m =>
                         m.CATEGORIES.filter(c => cats.includes(c.id)).flatMap(c => c.themes))""",
                    args.cats)
                themes += [t for t in cat_themes if t not in themes]
            if not themes:
                print("沒有主題：用 --cats 或 --themes 指定")
                return

            for ti, theme in enumerate(themes, 1):
                songs = []
                for i in range(args.per):
                    r = page.evaluate(
                        "o => window.chipforgeAuto(o)",
                        {"theme": theme, "bars": args.bars, "count": args.count, "skipRender": True})
                    if errors:
                        raise RuntimeError("; ".join(errors))
                    m = r["meta"]
                    songs.append({
                        "seed": m["seed"], "bpm": m["bpm"],
                        "score": m["score"], "tone": m.get("tone"),
                        "hash": m["shareHash"],
                    })
                songs.sort(key=lambda s: -(s["score"] or 0))
                book[theme] = songs
                sz = sum(len(s["hash"]) for s in songs)
                print(f"[{ti:02d}/{len(themes)}] {theme}: {len(songs)} 首  "
                      f"分數 {songs[-1]['score']}~{songs[0]['score']}  hash 共 {sz//1024}KB")
            browser.close()
    finally:
        srv.shutdown()

    payload = json.dumps(book, ensure_ascii=False, separators=(",", ":"))
    OUT_JS.write_text(
        "// 精選曲庫（機器鍛造：每主題 N 首、每首多候選取 director 最高分）\n"
        f"// 由 tools/songbook_build.py 生成於 {date.today()}；手改無意義，重跑工具即可\n"
        f"export const SONGBOOK = {payload};\n",
        encoding="utf-8")
    total = sum(len(v) for v in book.values())
    print(f"\n完成：{len(book)} 主題 / {total} 首 → {OUT_JS}（{OUT_JS.stat().st_size // 1024}KB）")


if __name__ == "__main__":
    main()
