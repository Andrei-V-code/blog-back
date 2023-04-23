import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    console.log(posts);

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        new: true,
      }
    ).populate("user");
    if (!updatedPost) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось найти статью" });
  }
};

export const remove = async (req, res) => {
  const postId = req.params.id;

  PostModel.findOneAndDelete({
    _id: postId,
  })
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена",
        });
      }
      res.json({
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Не удалось получить статьи" });
    });
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(","),
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};
