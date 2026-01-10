import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const marker = path.join(path.dirname(fileURLToPath(import.meta.url)), ".postinstall-ran");

if (fs.existsSync(marker)) {
  process.exit(0);
}

// Windows / Mac / Linux 공통
const cmd = process.platform === "win32" ? "cmd" : "bash";
const mswArgs =
  process.platform === "win32"
    ? ["/c", "pnpx msw init ./public --save"]
    : ["-c", "pnpx msw init ./public --save"];

const mswChild = spawn(cmd, mswArgs, {
  stdio: "inherit", // 콘솔에 그대로 출력
});

mswChild.on("close", (code) => {
  console.log(`- process exited with code ${code}`);
});

const lefthookArgs =
  process.platform === "win32" ? ["/c", "pnpx lefthook install"] : ["-c", "pnpx lefthook install"];

const lefthookChild = spawn(cmd, lefthookArgs, {
  stdio: "inherit", // 콘솔에 그대로 출력
});

lefthookChild.on("close", (code) => {
  console.log(`- process exited with code ${code}`);
});

console.log("🚀 필수 설치 완료");

// 실제 실행할 작업
// ex) 설정 파일 생성, 바이너리 다운로드 등
fs.writeFileSync(marker, new Date().toISOString());
