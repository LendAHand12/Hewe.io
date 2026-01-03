const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
let password = process.env.SIB_API_KEY; // dùng SIB_API_KEY có sẵn

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, "salt", 32);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(encryptedText) {
  const parts = encryptedText.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encrypted = Buffer.from(parts.join(":"), "hex");

  const key = crypto.scryptSync(password, "salt", 32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(encrypted, null, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};
