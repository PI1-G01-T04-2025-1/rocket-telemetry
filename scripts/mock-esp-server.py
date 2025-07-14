#!/usr/bin/env python3

import json
import time
import random
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import os

HOST = '0.0.0.0'
PORT = 8080
DATA_FILE = 'data.json'

class MockESPHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        print(f"[MOCK ESP] Requisição GET: {path}")
        
        if path == '/data.json':
            self.serve_data_json()
        elif path == '/':
            self.serve_info()
        else:
            self.send_error(404, "Endpoint não encontrado")
    
    def serve_data_json(self):
        try:
            if not os.path.exists(DATA_FILE):
                self.send_error(404, "data.json não encontrado")
                return
            
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            time.sleep(random.uniform(0.1, 0.5))
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response_data = json.dumps(data, ensure_ascii=False)
            self.wfile.write(response_data.encode('utf-8'))
            
            print(f"[MOCK ESP] data.json enviado ({len(response_data)} bytes)")
            
        except Exception as e:
            print(f"[MOCK ESP] Erro ao servir data.json: {e}")
            self.send_error(500, f"Erro interno: {str(e)}")
    
    def serve_info(self):
        info = {
            "server": "Mock ESP32 Server",
            "version": "1.0.0",
            "endpoints": {
                "/data.json": "Dados de telemetria",
                "/": "Informações do servidor"
            },
            "timestamp": time.time()
        }
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response_data = json.dumps(info, indent=2)
        self.wfile.write(response_data.encode('utf-8'))
        
        print(f"[MOCK ESP] Informações enviadas")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        print(f"[MOCK ESP] {format % args}")

def main():
    if not os.path.exists(DATA_FILE):
        print(f"Erro: {DATA_FILE} não encontrado!")
        print(f"Certifique-se de que o arquivo {DATA_FILE} está na raiz do projeto")
        return
    
    server = HTTPServer((HOST, PORT), MockESPHandler)
    print(f"Servidor ESP mock iniciado!")
    print(f"Endereço: http://{HOST}:{PORT}")
    print(f"Servindo: {DATA_FILE}")
    print(f"URL completa: http://localhost:{PORT}/data.json")
    print("=" * 50)
    print("Para testar:")
    print(f"   curl http://localhost:{PORT}/data.json")
    print(f"   curl http://localhost:{PORT}/")
    print("=" * 50)
    print("Pressione Ctrl+C para parar o servidor")
    print()
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor parado pelo usuário")
        server.shutdown()

if __name__ == '__main__':
    main() 