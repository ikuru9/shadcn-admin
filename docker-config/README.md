# Docker 배포 가이드

Shadcn Admin 애플리케이션을 Docker를 사용하여 Nginx로 배포하는 방법을 설명합니다.

## 전제 조건

- Docker Engine 20.10 이상
- Docker Compose v2.0 이상
- pnpm 10.26.2 이상 (자동 설치됨)
- `.env` 파일 또는 `NODE_ENV` 환경변수 설정

## 디렉토리 구조

```
root/
├── .env.development   # 개발 환경 변수
├── .env.test         # 테스트 환경 변수
├── .env.production  # 프로덕션 환경 변수
└── docker-config/
    ├── Dockerfile              # 환경 변수 기반 Dockerfile
    ├── docker-compose.dev.yml   # 개발 환경용 Compose 파일
    ├── docker-compose.test.yml  # 테스트 환경용 Compose 파일
    ├── docker-compose.prod.yml  # 프로덕션 환경용 Compose 파일
    ├── nginx.conf             # Nginx 설정 파일
    └── README.md             # 배포 가이드
```

## 환경별 배포

### 개요

단일 Dockerfile을 사용하며, `ENV_MODE` 빌드 인자를 통해 환경을 구분합니다.

| 환경 | ENV_MODE | NODE_ENV | SSL 처리 | Docker Compose | .env 파일 |
|--------|-----------|-----------|----------------|-----------------|
| **dev** | `development` | `development` | 자동 생성 (self-signed) | `docker-compose.dev.yml` | `.env.development` |
| **test** | `test` | `test` | 파일 마운트 | `docker-compose.test.yml` | `.env.test` |
| **prod** | `production` | `production` | 파일 마운트 | `docker-compose.prod.yml` | `.env.production` |

### Development 환경

개발 환경에서는 OpenSSL을 사용하여 자동으로 self-signed SSL 인증서를 생성합니다.

**특징:**
- SSL 인증서 자동 생성 (OpenSSL)
- 별도의 인증서 파일 필요 없음
- 바로 실행 가능

**환경 변수 파일:** `.env.development`

**실행 명령어:**

```bash
# .env.development 파일 수정 없이 바로 실행 가능
cd docker-config
docker compose -f docker-compose.dev.yml up -d --build

# .env.development 파일에서 API_SERVER_URL 수정 후 실행
cd docker-config
docker compose -f docker-compose.dev.yml up -d --build
```

### Test 환경

테스트 환경에서는 호스트의 SSL 인증서 파일을 컨테이너에 마운트합니다.

**특징:**
- SSL 인증서 파일 마운트 필요
- 테스트용 SSL 인증서 사용

**환경 변수 파일:** `.env.test`

**실행 명령어:**

```bash
# .env.test 파일 수정 없이 바로 실행 가능
cd docker-config
docker compose -f docker-compose.test.yml up -d --build

# .env.test 파일에서 API_SERVER_URL 수정 후 실행
cd docker-config
docker compose -f docker-compose.test.yml up -d --build
```

### Production 환경

프로덕션 환경에서는 유효한 SSL 인증서를 호스트 경로에서 마운트합니다.

**특징:**
- 유효한 SSL 인증서 파일 마운트 필요
- 프로덕션용 SSL 인증서 사용

**환경 변수 파일:** `.env.production`

**실행 명령어:**

```bash
# .env.production 파일 수정 없이 바로 실행 가능
cd docker-config
docker compose -f docker-compose.prod.yml up -d --build

# .env.production 파일에서 API_SERVER_URL 수정 후 실행
cd docker-config
docker compose -f docker-compose.prod.yml up -d --build
```

## 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `ENV_MODE` | 빌드 환경 모드 (development/test/production) | `development` |
| `NGINX_HOST` | Nginx 서버 호스트 이름 | `localhost` |
| `NGINX_PORT` | Nginx HTTP 포트 | `80` |
| `API_SERVER_URL` | 백엔드 API 서버 주소 | `http://backend-api:8080` |

## API 프록시 설정

`/api`로 시작되는 요청은 `API_SERVER_URL` 환경변수로 지정된 백엔드 서버로 프록시됩니다.

**Vite 설정:**

```typescript
const serverUrl = process.env.API_SERVER_URL || "";
const nodeEnv = process.env.NODE_ENV || "development";

// ENV_MODE에 따라 NODE_ENV 값 설정 (Vite에서 이미 mode 파라미터로 제공됨)
// development: Vite mode, test: Vite mode, production: Vite mode

server: {
  proxy: serverUrl ? {
      "/api": {
        target: serverUrl,
        changeOrigin: true,
        secure: false,
      },
    } : undefined,
  },
}
```

**환경 변수 파일:**

`.env.development`, `.env.test`, `.env.prod` 파일에 `API_SERVER_URL`을 설정하여 사용합니다.

**Docker Compose 설정:**

Docker Compose에서 `env_file` 옵션을 사용하여 `.env` 파일을 컨테이너에 로드합니다.

```yaml
services:
  web:
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
    env_file:
      - .env.dev  # 개발 환경
      # - .env.test  # 테스트 환경
      # - .env.prod  # 프로덕션 환경
```

**사용 예시:**

```bash
# 개발 환경 (.env.dev 수정 후 실행)
API_SERVER_URL=http://localhost:8080 docker compose -f docker-compose.dev.yml up -d --build

# 테스트 환경 (.env.test 수정 후 실행)
API_SERVER_URL=http://backend-api:8080 docker compose -f docker-compose.test.yml up -d --build

# 프로덕션 환경 (.env.prod 수정 후 실행)
API_SERVER_URL=http://api.example.com docker compose -f docker-compose.prod.yml up -d --build
```

**Docker Compose 설정:**

```yaml
services:
  web:
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
      - NODE_ENV=development  # .env.development에 따라 설정
    env_file:
      - .env.development  # .env 파일에서 API_SERVER_URL 읽어옴
```

**사용 예시:**

```bash
# 개발 환경
API_SERVER_URL=http://localhost:8080 docker compose -f docker-compose.dev.yml up -d --build

# 백엔드 서버가 다른 주소인 경우
API_SERVER_URL=http://api.example.com docker compose -f docker-compose.dev.yml up -d --build
```

## 포트

| 프로토콜 | 포트 | 설명 |
|---------|------|------|
| HTTP    | 80   | HTTP 트래픽 (HTTPS로 자동 리다이렉트) |
| HTTPS   | 443  | HTTPS 트래픽 (SSL 사용) |

## 사용법

### 서비스 시작

```bash
# 개발 환경
cd docker-config && docker compose -f docker-compose.dev.yml up -d --build

# 테스트 환경
cd docker-config && docker compose -f docker-compose.test.yml up -d --build

# 프로덕션 환경
cd docker-config && docker compose -f docker-compose.prod.yml up -d --build
```

### 로그 확인

```bash
# 전체 로그
docker logs -f shadcn-admin-dev    # 개발 환경
docker logs -f shadcn-admin-test   # 테스트 환경
docker logs -f shadcn-admin-prod  # 프로덕션 환경

# Nginx 로그
docker exec shadcn-admin-dev tail -f /var/log/nginx/access.log
docker exec shadcn-admin-dev tail -f /var/log/nginx/error.log
```

### 서비스 중지

```bash
cd docker-config
docker compose -f docker-compose.dev.yml down      # 개발 환경
docker compose -f docker-compose.test.yml down     # 테스트 환경
docker compose -f docker-compose.prod.yml down    # 프로덕션 환경
```

### 컨테이너 재시작

```bash
docker restart shadcn-admin-dev    # 개발 환경
docker restart shadcn-admin-test   # 테스트 환경
docker restart shadcn-admin-prod  # 프로덕션 환경
```

### 컨테이너 삭제

```bash
cd docker-config
docker compose -f docker-compose.dev.yml down -v    # 볼륨 포함 삭제
docker compose -f docker-compose.test.yml down -v   # 볼륨 포함 삭제
docker compose -f docker-compose.prod.yml down -v  # 볼륨 포함 삭제
```

## 헬스 체크

모든 환경에서 헬스 체크가 구성되어 있습니다.

**헬스 체크 엔드포인트:** `/health`

**확인 방법:**

```bash
# wget 사용
wget --no-check-certificate --quiet --tries=1 --spider https://localhost/health

# curl 사용
curl -k https://localhost/health

# 응답: healthy
```

**헬스 체크 설정:**
- 간격: 30초
- 타임아웃: 10초
- 재시도: 3회
- 시작 대기 시간: 10초

## Nginx 설정

### HTTPS 자동 리다이렉트

모든 HTTP 트래픽(포트 80)이 HTTPS(포트 443)로 자동 리다이렉트됩니다.

```nginx
server {
    listen 80;
    return 301 https://$host$request_uri;
}
```

### Security Headers

보안을 위해 다음 헤더가 설정됩니다:

- `Strict-Transport-Security`: HTTPS 사용 강제 (31536000초)
- `X-Frame-Options`: 클릭재킹 공격 방지 (SAMEORIGIN)
- `X-Content-Type-Options`: MIME 스니핑 방지 (nosniff)
- `X-XSS-Protection`: XSS 공격 방지 (1; mode=block)

### Static Assets 캐싱

정적 리소스(JS, CSS, 이미지, 폰트 등)은 1년간 캐싱됩니다.

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Service Worker 및 Web Manifest

Service Worker와 Web Manifest는 캐싱되지 않습니다.

```nginx
location /sw.js {
    expires 0;
    add_header Cache-Control "no-cache";
}

location /manifest.webmanifest {
    expires 0;
    add_header Cache-Control "no-cache";
}
```

## 문제 해결

### SSL 인증서 오류

**오류 메시지:** `nginx: [emerg] BIO_new_file("/etc/nginx/ssl/key.pem") failed`

**해결 방법:**

**개발 환경:** Dockerfile이 자동으로 인증서를 생성하므로 별도 조치 필요 없음

**테스트 환경:**
```bash
# SSL 파일이 있는지 확인
ls -la docker-config/ssl/
# 없으면 생성
mkdir -p docker-config/ssl
# 인증서 파일 배치
cp /path/to/cert.pem docker-config/ssl/cert.pem
cp /path/to/key.pem docker-config/ssl/key.pem
```

**프로덕션 환경:**
`docker-compose.prod.yml`의 인증서 경로가 올바른지 확인하세요.

### 포트 충돌

**오류 메시지:** `Bind for 0.0.0.0:80 failed: port is already allocated`

**해결 방법:**

```bash
# 사용 중인 포트 확인
lsof -i :80
lsof -i :443

# 다른 서비스 중지 또는 포트 변경
```

### 컨테이너가 정상적으로 시작되지 않음

**해결 방법:**

```bash
# 로그 확인
docker logs shadcn-admin-dev

# Nginx 설정 테스트
docker exec shadcn-admin-dev nginx -t

# 컨테이너 재시작
docker restart shadcn-admin-dev
```

### Self-signed SSL 경고

**증상:** 브라우저에서 "연결이 안전하지 않음" 경고 표시

**해결 방법:**

- **개발 환경:** 경고를 무시하고 진행
- **프로덕션 환경:** 유효한 SSL 인증서(CA 발급) 사용

## 참고 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [Nginx SSL 설정](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [Let's Encrypt](https://letsencrypt.org/)
