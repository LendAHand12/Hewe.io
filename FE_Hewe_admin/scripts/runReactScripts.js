// Chạy react-scripts (start/build) và chỉ set NODE_OPTIONS=--openssl-legacy-provider
// khi cần thiết. Flag này chỉ tồn tại/được Node chấp nhận từ Node 17+ (OpenSSL 3.0),
// còn trên Node <= 16 (OpenSSL 1.1.1, ví dụ server production) flag này không hợp lệ
// và khiến node thoát ngay với lỗi "not allowed in NODE_OPTIONS".
// Viết bằng Node thuần (không dùng cross-env) nên chạy được cả trên Windows lẫn Linux.

const { spawnSync } = require("child_process");

const nodeMajor = parseInt(process.versions.node.split(".")[0], 10);

const env = { ...process.env };
if (nodeMajor >= 17) {
  env.NODE_OPTIONS = [env.NODE_OPTIONS, "--openssl-legacy-provider"].filter(Boolean).join(" ");
}

const reactScriptsBin = require.resolve("react-scripts/bin/react-scripts.js");
const args = process.argv.slice(2);

const result = spawnSync(process.execPath, [reactScriptsBin, ...args], {
  stdio: "inherit",
  env,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
