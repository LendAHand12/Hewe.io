export const convertTime = (string) => {
  const date = new Date(Date.parse(string));
  return date.toLocaleString("vi-VN");
};

export const stringToSlug = (str) => {
  if (!str) return "";

  var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
    to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-");

  return str;
};

export const convertStringToHTML = (str) => {
  let parser = new DOMParser();
  let doc = parser.parseFromString(str, "text/html");
  return doc.body;
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

export const scrollView = (id) => {
  let view = document.getElementById(id);
  let position;
  if (view) {
    position = view.getBoundingClientRect();
    if (window.innerWidth <= 992) {
      window.scrollTo(position.left, position.top + window.scrollY - 80);
      // 70 is the height of the header section (mobile) + 10 more for better display
    } else {
      window.scrollTo(position.left, position.top + window.scrollY - 90);
      // 80 is the height of the header section (desktop) + 10 more for better display
    }
  }
};
