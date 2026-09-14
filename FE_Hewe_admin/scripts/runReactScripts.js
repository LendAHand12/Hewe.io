// Chạy react-scripts (start/build) và chỉ set NODE_OPTIONS=--openssl-legacy-provider
// khi cần thiết. Flag này chỉ tồn tại/được Node chấp nhận từ Node 17+ (OpenSSL 3.0),
// còn trên Node <= 16 (OpenSSL 1.1.1, ví dụ server production) flag này không hợp lệ
// và khiến node thoát ngay với lỗi "not allowed in NODE_OPTIONS".
// Viết bằng Node thuần (không dùng cross-env) nên chạy được cả trên Windows lẫn Linux.
//
// Khi build còn tăng heap limit (--max-old-space-size) và tắt source map để giảm RAM
// tiêu thụ - webpack build của CRA rất tốn RAM và dễ bị "JavaScript heap out of memory"
// trên server nhỏ. Có thể ghi đè mức heap qua biến môi trường BUILD_MAX_OLD_SPACE_MB.

const { spawnSync } = require("child_process");

const nodeMajor = parseInt(process.versions.node.split(".")[0], 10);
const command = process.argv[2];

const env = { ...process.env };
const nodeOptions = [env.NODE_OPTIONS].filter(Boolean);

if (nodeMajor >= 17) {
  nodeOptions.push("--openssl-legacy-provider");
}

if (command === "build") {
  const maxOldSpaceMb = env.BUILD_MAX_OLD_SPACE_MB || "4096";
  nodeOptions.push(`--max-old-space-size=${maxOldSpaceMb}`);

  if (env.GENERATE_SOURCEMAP === undefined) {
    env.GENERATE_SOURCEMAP = "false";
  }
}

if (nodeOptions.length > 0) {
  env.NODE_OPTIONS = nodeOptions.join(" ");
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
