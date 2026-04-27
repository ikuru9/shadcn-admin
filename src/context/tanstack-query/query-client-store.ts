import type { QueryClient } from "@tanstack/react-query";

// 인증 reset 흐름에서 공유할 활성 QueryClient 인스턴스.
let queryClient: QueryClient | null = null;

// 앱이 QueryClient를 생성한 뒤 한 번 등록한다.
export function registerQueryClient(client: QueryClient) {
  queryClient = client;
}

// 현재 등록된 QueryClient를 필요할 때 꺼내 쓴다.
export function getQueryClient() {
  return queryClient;
}

// 로그아웃이나 세션 만료 후, auth reset 용도로 전체 캐시를 비운다.
export function clearQueryClientCache() {
  queryClient?.clear();
}
