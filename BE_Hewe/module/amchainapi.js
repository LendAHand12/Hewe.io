const { default: axios } = require("axios");
const RANDOMSTRING = "GgcSnRFiZ8WDXtQ";
const RESTRICT = require("../model/restrictModel");

const checkIfRestricted = async (address) => {
  // kiểm tra address có bị khoá không // trả về true nếu bị khoá // false nếu không bị khoá
  try {
    let res = await axios.get(`http://api.amchain.net:3007/hewe/is-restricted?user=${address}`);
    return res.data.isRestricted;
  } catch (error) {
    console.log(error);
  }
};

const unblockAddress = async (address) => {
  // check xem address có bị khoá không, nếu hàm check true -> đang bị khoá -> mở khoá
  // mở khoá địa chỉ ví
  // mở khoá thành công thì lưu lại database mongo để 1 phút sau tự động khoá lại
  try {
    let isisRestricted = await checkIfRestricted(address);
    if (isisRestricted === true) {
      await axios.post("http://api.amchain.net:3007/hewe/unrestrict", {
        user: address,
        code: RANDOMSTRING,
      });

      // nếu api thành công là đã mở khoá thành công
      await RESTRICT.create({ address });
    }
  } catch (error) {
    console.log(error);
  }
};

const blockAddress = async (address) => {
  try {
    let isisRestricted = await checkIfRestricted(address);
    if (isisRestricted === false) {
      await axios.post("http://api.amchain.net:3007/hewe/restrict", {
        user: address,
        code: RANDOMSTRING,
      });

      // khoá xong rồi thì xoá trong database
      await RESTRICT.deleteOne({ address });
    }
  } catch (error) {
    console.log(error);
  }
};

const cronBlockAddress = async () => {
  // lấy tất cả các address đã mở khoá nhiều hơn 1 phút trong db -> khoá lại
  try {
    let now = Date.now();
    let oneMinuteAgo = now - 60000;
    let oneMinuteAgoDate = new Date(oneMinuteAgo);

    let listAddress = await RESTRICT.find({
      createdAt: { $lt: oneMinuteAgoDate },
    });

    for (let address of listAddress) {
      await blockAddress(address.address);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { unblockAddress, cronBlockAddress, blockAddress };
