# ChipForge dev server: http.server + no-cache headers
# (Chrome caches modules aggressively without Cache-Control; this makes F5 always fresh)
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, *args):
        pass  # 安靜模式，不洗版


# ThreadingHTTPServer 必須用多執行緒版：瀏覽器的閒置預備連線會卡死單執行緒伺服器
class SingleBindServer(ThreadingHTTPServer):
    allow_reuse_address = False  # 禁止兩個伺服器同綁一埠（Windows 上預設 True 會靜默共存）
    daemon_threads = True


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8213
    try:
        srv = SingleBindServer(('', port), NoCacheHandler)
    except OSError:
        print(f'[ERROR] Port {port} is already in use.')
        print('Another ChipForge window is probably open. Close it and try again.')
        sys.exit(1)
    print(f'ChipForge serving on http://localhost:{port} (no-cache)')
    srv.serve_forever()
