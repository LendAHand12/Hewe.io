export const editorConfig = {
  height: 400,
  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "help",
    "wordcount",
  ],
  file_picker_types: "image",
  file_picker_callback: (callback, value, meta) => {
    if (meta.filetype === "image") {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.onchange = function () {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function () {
          callback(reader.result, { title: file.name });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  },
  toolbar:
    "undo redo | cut copy paste | blocks | bold italic underline | link image | fullscreen | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist preview",
  content_style: "body { font-family:Arial,sans-serif; font-size:14px }",
  menubar: "edit format table tools",
  entity_encoding: "raw",
  document_base_url: "/",
};
