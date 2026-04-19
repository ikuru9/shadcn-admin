import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (import.meta.env?.CI) {
  process.exit(0);
}

const marker = path.join(path.dirname(fileURLToPath(import.meta.url)), ".postinstall-ran");

if (fs.existsSync(marker)) {
  process.exit(0);
}

// Windows / Mac / Linux 공통
const cmd = process.platform === "win32" ? "cmd" : "bash";
const mswArgs =
  process.platform === "win32" ? ["/c", "pnpx msw init ./public --save"] : ["-c", "pnpx msw init ./public --save"];

const lefthookArgs = process.platform === "win32" ? ["/c", "pnpx lefthook install"] : ["-c", "pnpx lefthook install"];

const vitestArgs =
  process.platform === "win32"
    ? ["/c", "pnpm exec playwright install chromium"]
    : ["-c", "pnpm exec playwright install chromium"];

function runProcess(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("close", (code) => {
      console.log(`- process exited with code ${code}`);

      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`postinstall command failed with exit code ${code}`));
    });
  });
}

try {
  await Promise.all([runProcess(mswArgs), runProcess(lefthookArgs), runProcess(vitestArgs)]);
  fs.writeFileSync(marker, new Date().toISOString());
  console.log("🚀 필수 설치 완료");
} catch (error) {
  console.error(error);
  process.exit(1);
}
