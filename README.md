# mk.js — Trabalho Individual GCES 2026-1

Jogo de luta estilo Mortal Kombat com Node.js/Express + HTML5 Canvas, modernizado com pipeline DevOps completo.

---

## Ambiente de Desenvolvimento

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose instalados

### Subir o ambiente

```bash
git clone https://github.com/kauan2872/projetoindividual-main.git
cd projetoindividual-main

docker compose up --build
```

Acesse: **http://localhost:55555**

O servidor usa **nodemon** — edições em `server/` refletem automaticamente sem rebuild.

### Verificar banco de dados

```bash
docker compose exec db psql -U mkjs -d mkjsdb -c "SELECT * FROM matches;"
```

### Rodar testes localmente

```bash
cd server && npm install
npm run lint    # ESLint
npm test        # Jest + cobertura
npm run fuzz    # Testes de fuzzing
```

### Derrubar

```bash
docker compose down
```

---

## Ambiente de Produção

```bash
echo "DB_PASSWORD=suasenhaaqui" > .env
docker compose -f docker-compose.prod.yml up --build
```

O **Nginx** serve o frontend na porta **80** e faz proxy do WebSocket para o backend. O backend não é exposto diretamente.

### Deploy em Kubernetes

```bash
kubectl apply -f k8s/
kubectl get pods -n mkjs
```

> Substitua `mkjs.example.com` em `k8s/ingress.yaml` pelo seu domínio antes do deploy.

---

## Modos de Jogo

| Modo | Descrição |
|---|---|
| **Single Player** | Joga contra a IA (setas + A/S/D/Z/X/C) |
| **Local Multiplayer** | Dois jogadores no mesmo teclado |
| **Network** | Dois jogadores via servidor (um cria a sala, outro entra) |
| **Webcam Input** | Controle por gestos com a câmera |

---

## Fases Implementadas

| Fase | Descrição | Artefatos |
|---|---|---|
| 1 | Containerização DEV + hot-reload | `server/Dockerfile.dev` |
| 2 | Docker Compose + PostgreSQL | `docker-compose.yml`, `server/db.js` |
| 3 | CI — Build & Lint | `.github/workflows/ci.yml`, `.eslintrc.json` |
| 4 | CI — Testes Unitários | `server/tests/games.test.js` |
| 5 | CI — Testes de Fuzzing | `server/tests/fuzz.test.js` |
| 6 | Segurança — CodeQL (SAST) + npm audit (SCA) | `.github/workflows/security.yml` |
| 7 | Qualidade — SonarCloud | `sonar-project.properties`, `.github/workflows/sonar.yml` |
| 8 | Containerização PROD — multi-stage + Nginx | `server/Dockerfile.prod`, `nginx/` |
| 9 | Infraestrutura — Kubernetes | `k8s/` |
| 10 | CD + HTTPS via Cert Manager | `.github/workflows/cd.yml`, `k8s/cluster-issuer.yaml` |

---

## Requisitos Originais da Disciplina

<details>
<summary>Ver rubrica original</summary>

O trabalho está dividido em 10 etapas, cada uma valendo **1,0 ponto**.

| Fase | Descrição Técnica | Nota |
|---|---|---|
| 1. **Containerização (DEV)** | Dockerfile para dev com hot-reload | 0–10% |
| 2. **Docker Compose (DEV)** | docker-compose com app + PostgreSQL + persistência | 10–20% |
| 3. **CI - Build & Lint** | GitHub Actions com lint obrigatório | 20–30% |
| 4. **CI - Testes Unitários** | Testes com sequência commit quebrado → passando | 30–40% |
| 5. **CI - Testes de Fuzzing** | Fuzzing nas entradas do servidor | 40–50% |
| 6. **Segurança - SAST & SCA** | CodeQL + npm audit | 50–60% |
| 7. **Qualidade de Código** | SonarCloud com quality gate | 60–70% |
| 8. **Containerização (PROD)** | Multi-stage Alpine + Nginx | 70–80% |
| 9. **Infraestrutura (K8s)** | Manifestos Kubernetes | 80–90% |
| 10. **CD & Segurança de Rede** | Deploy contínuo + HTTPS Cert Manager | 90–100% |

</details>
