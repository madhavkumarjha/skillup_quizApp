import imagekit, { deleteMedia } from "../utils/imageKit.js";

export const getAuthParams = (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.json(authParams);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const { folderName } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Validate MIME type
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ success: false, message: "Only image files are allowed" });
    }

    const result = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: `/skillUp/courses/${folderName}`,
    });

    res.status(201).json({
      success: true,
      url: result.url,
      fileId: result.fileId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadMedia = async (req, res) => {
  try {
    const { folderName } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const result = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
        folder: `/skillUp/courses/${folderName}`,
    });

    res.status(201).json({
        success: true,
        url: result.url,
        fileId: result.fileId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourseMedia = async (courseDetails) => {
  try {
    const fileIds = [];

    // Thumbnail (stored in /thumbnails folder)
    if (courseDetails?.thumbnail?.fileId) {
      fileIds.push(courseDetails.thumbnail.fileId);
    }

    // Resources inside lessons
    courseDetails?.chapters?.forEach((chapter) => {
      chapter.lessons?.forEach((lesson) => {
        lesson.resources?.forEach((res) => {
          if (res.fileId) fileIds.push(res.fileId);
        });
      });
    });

    // Delete all files in parallel for speed
    await Promise.all(fileIds.map((id) => deleteMedia(id)));

    console.log(
      `Deleted ${fileIds.length} media files (resources + thumbnail) for course ${courseDetails.title}`
    );
  } catch (error) {
    console.error("Error deleting course media:", error.message);
  }
};
