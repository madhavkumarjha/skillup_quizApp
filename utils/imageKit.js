import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;

/**
 * Delete a media file from ImageKit by fileId
 * @param {string} fileId - The ImageKit fileId to delete
 * @returns {Promise<void>}
 */

export const deleteMedia = async (fileId) => {
  if (!fileId) return;

  try {
    await imagekit.deleteFile(fileId);
    console.log(`Media with fileId ${fileId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting media with fileId ${fileId}:`, error.message);
  }
};

export const listProjectMediaGrouped = async () => {
  try {
    const subfolders = ["courses", "profile"]; // define your known folders

    const folderFetches = await Promise.all(
      subfolders.map(async (folder) => {
        const files = await imagekit.listFiles({
          path: `/quizHub/${folder}`,
          limit: 100,
        });
        return { folder, files };
      })
    );

    return folderFetches;
  } catch (error) {
    console.error("Error listing project media:", error.message);
    throw error;
  }
};

export const listCoursesMediaGrouped = async () => {
  try {
    // Get all files under /quizHub/courses
    const files = await imagekit.listFiles({
      path: "/quizHub/courses",
      limit: 100,
    });

    // Extract unique course names (3rd segment in path)
    const courseNames = [
      ...new Set(files.map((f) => f.filePath.split("/")[3])),
    ];

    // Group files by course name
    const grouped = courseNames.map((course) => ({
      course,
      files: files.filter((f) =>
        f.filePath.includes(`/quizHub/courses/${course}/`)
      ),
    }));

    return grouped;
  } catch (error) {
    console.error("Error listing courses media:", error.message);
    throw error;
  }
};

export const uploadMedia = async (fileBuffer, originalName, folderPath) => {
  try {
    const result = await imagekit.upload({
      file: fileBuffer.toString("base64"),
      fileName: originalName,
      folder: folderPath,
    });
    return result;
  } catch (error) {
    console.error("Error uploading media:", error.message);
    throw error;
  }
};
