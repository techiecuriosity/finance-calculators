from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class SPAHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # If the request is for a file that exists, serve it
        if os.path.exists(self.translate_path(self.path)):
            return SimpleHTTPRequestHandler.do_GET(self)
        
        # Otherwise, serve index.html
        self.path = '/index.html'
        return SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    server_address = ('', 3002)
    httpd = HTTPServer(server_address, SPAHandler)
    print('Server running at http://localhost:3002/')
    httpd.serve_forever() 