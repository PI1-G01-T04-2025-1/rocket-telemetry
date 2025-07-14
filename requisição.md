Tem um mock pra fazer o teste. Basta rodar o comando:

```bash
python3 scripts/mock-esp-server.py
```

Ai você pode testar via API:

```bash
# Verificar status do ESP
curl http://localhost:3000/api/esp/status

# Buscar dados do ESP
curl http://localhost:3000/api/esp/data
```

E tabém testar via web

`http://localhost:3000/esp-test`
