// Local verification server for the exported files; this does not publish a website.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root = resolve('.next-static');
const port = Number(process.env.STATIC_PREVIEW_PORT || 3100);
const types = { '.html':'text/html; charset=utf-8', '.js':'application/javascript', '.css':'text/css', '.webp':'image/webp', '.svg':'image/svg+xml', '.txt':'text/plain; charset=utf-8', '.json':'application/json' };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://localhost');
    let file = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (file !== root && !file.startsWith(root + '/')) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith('/')) { response.writeHead(301, { Location:url.pathname + '/' + url.search }).end(); return; }
      file += '/index.html';
    }
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type':types[extname(file)] || 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch {
    response.writeHead(404, { 'Content-Type':'text/html; charset=utf-8' });
    response.end(await readFile(resolve(root,'404.html')).catch(() => '未找到页面'));
  }
}).listen(port,'127.0.0.1',()=>console.log(`静态导出验证服务已启动，端口 ${port}`));
