"""動機庫試聽工具（可攜版，隨 chipforge repo 走）：
把候選動機批量渲染成短 demo WAV 給人耳篩選。

流程（Undertale 式 Leitmotif 策略）：
  1. 候選動機寫在 CANDIDATES 清單（或 --json 外部檔）
  2. 每句動機用合適的主題渲染 8 小節 demo（動機出現在主歌/副歌開頭）
  3. 人耳挑「隔天還記得」的句子 → 錄入 js/motifs.js 黃金動機庫

需求：pip install playwright && playwright install chromium

用法:
  python tools/motif_audition.py                    # 渲染內建候選批次
  python tools/motif_audition.py --json batch.json  # 渲染外部候選檔
  python tools/motif_audition.py --out D:\\demo     # 指定輸出資料夾
"""
import argparse
import base64
import json
import re
import socket
import threading
from datetime import datetime
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

CHIPFORGE_DIR = Path(__file__).resolve().parent.parent  # repo 根目錄
DEFAULT_OUT = Path.home() / "Desktop" / f"動機庫試聽_{datetime.now():%Y%m%d}"

# ---- 候選動機（16 步網格；rhythm=起音步位，contour=與第一音的半音差）----
# 設計原則：音域窄、級進為主、單一跳進放在強拍高點（那個跳進就是 hook）
# 2026-07-17 第一批 13 句的裁決見 js/motifs.js 註解；下一批候選寫在這裡
CANDIDATES = [
    # 範例格式：
    # {"id": "my-motif", "name": "動機名", "theme": "bright",
    #  "rhythm": [0, 2, 4, 8], "contour": [0, 2, 4, 7], "note": "設計意圖"},
]


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


def validate(m):
    rh, ct = m["rhythm"], m["contour"]
    if len(rh) != len(ct) or not (3 <= len(rh) <= 8):
        return "音數不對"
    if rh != sorted(set(rh)) or rh[0] != 0 or rh[-1] > 15:
        return "節奏步位不合法"
    if ct[0] != 0 or max(ct) - min(ct) > 12:
        return "音域超過八度"
    leaps = sum(1 for i in range(1, len(ct)) if abs(ct[i] - ct[i - 1]) >= 5)
    if leaps > 1:
        return f"大跳太多({leaps})"
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", default=None, help="外部候選 JSON 檔（陣列）")
    ap.add_argument("--out", default=str(DEFAULT_OUT))
    ap.add_argument("--bars", type=int, default=8)
    ap.add_argument("--count", type=int, default=3, help="每句動機的候選曲數（取最高分）")
    args = ap.parse_args()

    cands = json.loads(Path(args.json).read_text(encoding="utf-8")) if args.json else CANDIDATES
    if not cands:
        print("沒有候選動機：把候選寫進 CANDIDATES 或用 --json 指定檔案")
        return
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    ok, results = [], []
    for m in cands:
        err = validate(m)
        if err:
            print(f"[SKIP] {m['id']}: {err}")
            continue
        ok.append(m)

    from playwright.sync_api import sync_playwright
    srv, port = start_server(CHIPFORGE_DIR)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(f"http://127.0.0.1:{port}/auto.html")
            page.wait_for_function("typeof window.chipforgeAuto === 'function'", timeout=15000)
            for i, m in enumerate(ok, 1):
                opts = {
                    "theme": m.get("theme", "bright"), "bars": args.bars,
                    "count": args.count, "loops": 2,
                    "motif": {"rhythm": m["rhythm"], "contour": m["contour"]},
                    "gen": {"hook": 85, "sequenz": True},
                }
                r = page.evaluate("o => window.chipforgeAuto(o)", opts)
                if errors:
                    raise RuntimeError("; ".join(errors))
                safe = re.sub(r"[^\w\-]", "", m["id"])
                wav = out_dir / f"{i:02d}_{safe}_{m['name']}.wav"
                wav.write_bytes(base64.b64decode(r["wavB64"]))
                meta = r["meta"]
                results.append({**m, "bpm": meta["bpm"], "seed": meta["seed"],
                                "tone": meta.get("tone"), "file": wav.name})
                print(f"[{i:02d}/{len(ok)}] {m['name']} ({m['id']}) -> {wav.name}  "
                      f"bpm={meta['bpm']} tone={meta.get('tone')}")
            browser.close()
    finally:
        srv.shutdown()

    (out_dir / "candidates.json").write_text(
        json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n完成：{len(results)} 句動機 demo 已輸出到 {out_dir}")
    print("試聽重點：前 5 秒的旋律句能不能『隔天還記得』；記得的才是 keeper。")


if __name__ == "__main__":
    main()
