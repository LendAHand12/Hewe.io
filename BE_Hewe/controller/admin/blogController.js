const BLOG = require("../../model/blogModel");
const error = require("../../utils/error");
const { error_400, success, error_500 } = require("../../utils/error");

exports.createBlog = async (req, res) => {
  try {
    const { title, shortDescription, longDescription, authorName, bannerImage, keywords, tableContent } = req.body;
    const refData = {
      title: title,
      shortDescription: shortDescription,
      longDescription: longDescription,
      authorName: authorName,
      bannerImage: bannerImage,
      keywords: keywords,
      tableContent: tableContent,
    };
    const createBlog = await BLOG.create(refData);
    if (createBlog) {
      return res.status(error.status.OK).send({
        message: "Blog create Successfully.",
        status: error.status.OK,
        data: createBlog,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const find = await BLOG.findOneAndDelete({ _id: req.params.id });
    return res.status(error.status.OK).send({
      message: "Blog delete Successfully.",
      status: error.status.OK,
    });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const find = await BLOG.find();
    if (find.length >= 0) {
      return res.status(error.status.OK).json({
        message: "Blogs get Successfully.",
        data: find,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.editBlog = async (req, res) => {
  try {
    const arrayOfEditKeys = [
      "title",
      "shortDescription",
      "longDescription",
      "authorName",
      "bannerImage",
      "keywords",
      "tableContent",
    ];
    const objectUpdate = {};
    for (const key of arrayOfEditKeys) {
      if (req.body[key] != null) {
        objectUpdate[key] = req.body[key];
      }
    }
    const update = await BLOG.findByIdAndUpdate({ _id: req.params.id }, objectUpdate, { new: true });
    if (update) {
      return res.status(error.status.OK).json({
        message: "Blog updated Successfully!",
        data: update,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const find = await BLOG.findOne({ _id: req.params.id });
    if (find) {
      const updateView = await BLOG.updateOne({ _id: req.params.id }, { $inc: { view: +1 } });
      return res.status(error.status.OK).json({
        message: "Blog get Successfully.",
        data: find,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.uploadImg = async (req, res) => {
  try {
    let img = req.file;
    if (!img) {
      return error_400(res, "Please upload an image");
    }
    success(res, "OK", { img });
  } catch (e) {
    console.log(e);
    error_500(res, error);
  }
};
