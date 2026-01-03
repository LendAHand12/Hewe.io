// Tạo một job chạy định kỳ với khoảng thời gian ngẫu nhiên giữa các lần chạy
// VD: chạy mỗi 45-75 phút một lần thì minMinutes = 45, maxMinutes = 75

class RandomIntervalJob {
  constructor(options) {
    this.minMs = options.minMinutes * 60 * 1000;
    this.maxMs = options.maxMinutes * 60 * 1000;
    this.task = options.task;
    this.timeoutId = null;
  }

  getRandomDelay() {
    return Math.floor(Math.random() * (this.maxMs - this.minMs + 1)) + this.minMs;
  }

  async run() {
    try {
      await this.task();
    } catch (err) {
      console.error("❌ [Job] Lỗi khi chạy RandomIntervalJob:", err);
    } finally {
      const delay = this.getRandomDelay();
      this.timeoutId = setTimeout(() => this.run(), delay);
    }
  }

  start() {
    this.run();
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
      console.log("🛑 [Job] Đã dừng job.");
    }
  }
}

module.exports = RandomIntervalJob;
