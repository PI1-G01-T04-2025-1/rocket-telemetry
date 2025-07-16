import { NextResponse } from 'next/server';
import http from 'http';
import https from 'https';

export async function GET() {
  const url = 'http://localhost:8080/data.json'; // Alterar para http://192.168.4.1/data.json
  const isHttps = url.startsWith('https://');
  const client = isHttps ? https : http;

  return new Promise((resolve) => {
    const req = client.get(url, (res) => {
      let data = Buffer.alloc(0);

      res.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
      });

      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data.toString());
        } catch (e) {
        }
        resolve(
          NextResponse.json({
            success: true,
            message: 'Dados recebidos',
            data: parsed || data.toString(),
            raw: data.toString(),
            length: data.length,
            timestamp: new Date().toISOString(),
          })
        );
      });

      res.on('error', (err) => {
        resolve(
          NextResponse.json({
            success: false,
            message: 'Erro ao receber dados',
            error: err.message,
            length: data.length,
            partial: data.toString(),
            timestamp: new Date().toISOString(),
          })
        );
      });
    });

    req.on('error', (err) => {
      resolve(
        NextResponse.json({
          success: false,
          message: 'Erro na requisição',
          error: err.message,
          timestamp: new Date().toISOString(),
        })
      );
    });
  });
}
