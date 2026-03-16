---
title: Docker per SysAdmin: La Guida che Avrei Voluto
date: 2026-02-10
author: Valerio Simeraro
tags: [docker, containers, linux, devops]
---

# Docker per SysAdmin: La Guida che Avrei Voluto

Prima di capire Docker, mi chiedevo sempre: _"Ma non bastano le VM?"_. Risposta: dipende. Ma i container hanno rivoluzionato la distribuzione del software per buoni motivi.

---

## Container vs VM: la differenza pratica

| | VM | Container |
|---|---|---|
| Overhead | Alto (OS completo) | Basso (condivide kernel) |
| Boot time | Minuti | Secondi |
| Dimensione | GB | MB |
| Isolamento | Completo | A livello di processo |

I container **non rimpiazzano le VM**: le affiancano. Usi le VM per isolamento hardware, usi i container per applicazioni.

---

## Installazione e Primo Container

```bash
# Installazione su Ubuntu/Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Test immediato
docker run hello-world

# Nginx in 10 secondi
docker run -d -p 80:80 --name web nginx
```

---

## Il Dockerfile: il Cuore del Sistema

```dockerfile
FROM debian:bookworm-slim

LABEL maintainer="valerio@example.com"

# Installa dipendenze
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Directory di lavoro
WORKDIR /app

# Copia dipendenze prima (ottimizza il caching dei layer)
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copia il codice
COPY . .

# Utente non-root per sicurezza
RUN useradd -m appuser && chown -R appuser /app
USER appuser

EXPOSE 8000
CMD ["python3", "app.py"]
```

---

## Networking e Volumi

```bash
# Crea una rete bridge isolata
docker network create myapp-net

# Container collegati alla stessa rete si trovano per nome
docker run -d --name db --network myapp-net postgres:16
docker run -d --name api --network myapp-net -e DB_HOST=db myapp:latest

# Volumi: persistenza dei dati
docker volume create pgdata
docker run -d -v pgdata:/var/lib/postgresql/data postgres:16
```

---

## Docker Compose: Orchestrazione Locale

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: mydb
      POSTGRES_PASSWORD_FILE: /run/secrets/db_pass
    secrets:
      - db_pass

  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    restart: unless-stopped

volumes:
  pgdata:

secrets:
  db_pass:
    file: ./secrets/db_pass.txt
```

```bash
docker compose up -d
docker compose logs -f
docker compose down
```

---

## Tips di Sicurezza

1. **Mai root nel container**: usa `USER nonroot`.
2. **Immagini base slim/alpine**: superficie di attacco ridotta.
3. **Scan delle immagini**: `docker scout cves myimage:tag`.
4. **Secrets management**: mai variabili d'ambiente per le password. Usa Docker Secrets o un vault.
5. **Read-only filesystem**: `docker run --read-only ...` dove possibile.
