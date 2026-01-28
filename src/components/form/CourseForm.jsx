import { Plus, X } from "lucide-react";
import { useUploadCourseMediaMutation } from "../../redux/features/api/helperApi";
import { toast } from "react-hot-toast";
import sanitizeName from "../../utils/sanitizeName";

function CourseForm({
  courseDetails,
  setCourseDetails,
  handleSubmit,
  isUpdate,
}) {
  const [uploadCourseMedia, isLoading] = useUploadCourseMediaMutation();
  // console.log(courseDetails);

  const handleInputChange = (e) => {
    setCourseDetails({
      ...courseDetails,
      [e.target.name]: e.target.value,
    });
    // console.log(e.target.name, e.target.value);
  };

  const categories = [
    "frontend",
    "backend",
    "database",
    "programming",
    "design",
    "business",
    "marketing",
    "other",
  ];

  const addChapter = () => {
    setCourseDetails({
      ...courseDetails,
      chapters: [
        ...courseDetails.chapters,
        {
          title: "",
          summary: "",
          lessons: [
            {
              lesson_name: "",
              content: "",
              resources: [{ title: "", url: "", fileId: "" }],
            },
          ],
        },
      ],
    });
  };

  const removeChapter = (index) => {
    const updatedChapters = courseDetails.chapters.filter(
      (chapter, i) => i !== index
    );
    setCourseDetails({
      ...courseDetails,
      chapters: updatedChapters,
    });
  };

  const handleChapterChange = (index, e) => {
    const updatedChapters = courseDetails.chapters.map((chapter, i) => {
      if (i === index) {
        return { ...chapter, [e.target.name]: e.target.value };
      }
      return chapter;
    });
    setCourseDetails({
      ...courseDetails,
      chapters: updatedChapters,
    });
  };

  const addLesson = (chapterIndex) => {
    const updatedChapters = [...courseDetails.chapters];
    updatedChapters[chapterIndex].lessons.push({
      lesson_name: "",
      content: "",
      resources: [{ title: "", url: "", fileId: "" }],
    });
    setCourseDetails({ ...courseDetails, chapters: updatedChapters });
  };

  const removeLesson = (chapterIndex, lessonIndex) => {
    const updatedChapters = [...courseDetails.chapters];
    updatedChapters[chapterIndex].lessons = updatedChapters[
      chapterIndex
    ].lessons.filter((lesson, i) => i !== lessonIndex);
    setCourseDetails({
      ...courseDetails,
      chapters: updatedChapters,
    });
  };

  const handleLessonChange = (chapterIndex, lessonIndex, e) => {
    const updatedChapters = [...courseDetails.chapters];
    updatedChapters[chapterIndex].lessons = updatedChapters[
      chapterIndex
    ].lessons.map((lesson, i) => {
      if (i === lessonIndex) {
        return { ...lesson, [e.target.name]: e.target.value };
      }
      return lesson;
    });
    setCourseDetails({
      ...courseDetails,
      chapters: updatedChapters,
    });
  };

  const handleResourceChange = (
    chapterIndex,
    lessonIndex,
    resourceIndex,
    e
  ) => {
    const { name, value } = e.target;
    console.log(name,value);
    
    const updatedChapters = courseDetails.chapters.map((chapter, cIdx) => {
      if (cIdx !== chapterIndex) return chapter;

      return {
        ...chapter,
        lessons: chapter.lessons.map((lesson, lIdx) => {
          if (lIdx !== lessonIndex) return lesson;

          return {
            ...lesson,
            resources: lesson.resources.map((resource, rIdx) => {
              if (rIdx !== resourceIndex) return resource;

              return {
                ...resource,
                [name]: value,
              };
            }),
          };
        }),
      };
    });

    setCourseDetails({ ...courseDetails, chapters: updatedChapters });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUploadThumbnail(file); // store temporarily
    }
  };

  const handleUploadThumbnail = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", "thumbnails");
    try {
      const response = await uploadCourseMedia(formData).unwrap();
      setCourseDetails({
        ...courseDetails,
        thumbnail: { url: response.url, fileId: response.fileId },
      });
      toast.success("Thumbnail uploaded successfully");
      // setThumbnailFile(null);
    } catch (error) {
      console.error("Thumbnail upload failed:", error);
    }
  };

  const textBoxStyle =
    "shadow-md rounded-lg px-4 py-2  focus:outline-none border-b text-gray-600 border-white  w-full";

  const handleResourceFileChange = (
    chapterIndex,
    lessonIndex,
    resourceIndex,
    e
  ) => {
    const file = e.target.files[0];
    if (!file) return;
    if (courseDetails.title === "") {
      toast.error("Please enter course title first to upload file");
      return;
    }
    if (courseDetails.chapters[chapterIndex].title === "") {
      toast.error("Please enter chapter title first to upload file");
      return;
    }
    if (
      courseDetails.chapters[chapterIndex].lessons[lessonIndex].lesson_name ===
      ""
    ) {
      toast.error("Please enter lesson name first to upload file");
      return;
    }
    const folderName = `${sanitizeName(courseDetails.title)}/${sanitizeName(
      courseDetails.chapters[chapterIndex].title
    )}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", folderName);

    uploadCourseMedia(formData)
      .unwrap()
      .then((response) => {
        const updatedChapters = courseDetails.chapters.map((chapter, cIdx) => {
          if (cIdx !== chapterIndex) return chapter;
          return {
            ...chapter,
            lessons: chapter.lessons.map((lesson, lIdx) => {
              if (lIdx !== lessonIndex) return lesson;
              const resources = Array.isArray(lesson.resources)
                ? lesson.resources.map((res, rIdx) => {
                    if (rIdx !== resourceIndex) return res;
                    return {
                      ...res,
                      title: res?.title || "Other",
                      url: response.url,
                      fileId: response.fileId,
                    };
                  })
                : [
                    {
                      title: "Other",
                      url: response.url,
                      fileId: response.fileId,
                    },
                  ];
              return { ...lesson, resources };
            }),
          };
        });
        setCourseDetails({ ...courseDetails, chapters: updatedChapters });
        toast.success("File uploaded successfully");
      })
      .catch((error) => {
        console.error("File upload failed:", error);
        toast.error("File upload failed");
      });
  };

const addResource = (chapterIndex, lessonIndex) => {
  const updatedChapters = courseDetails.chapters.map((chapter, cIdx) => {
    if (cIdx !== chapterIndex) return chapter;

    return {
      ...chapter,
      lessons: chapter.lessons.map((lesson, lIdx) => {
        if (lIdx !== lessonIndex) return lesson;

        const newResource = { title: "", url: "", fileId: "" };

        return {
          ...lesson,
          resources: [...(lesson.resources || []), newResource],
        };
      }),
    };
  });

  setCourseDetails({ ...courseDetails, chapters: updatedChapters });
};


const removeResource = (chapterIndex, lessonIndex, resourceIndex) => {
  const updatedChapters = courseDetails.chapters.map((chapter, cIdx) => {
    if (cIdx !== chapterIndex) return chapter;

    return {
      ...chapter,
      lessons: chapter.lessons.map((lesson, lIdx) => {
        if (lIdx !== lessonIndex) return lesson;

        const filtered = lesson.resources.filter((_, i) => i !== resourceIndex);

        // Ensure at least one empty resource remains
        return {
          ...lesson,
          resources: filtered.length ? filtered : [{ title: "", url: "", fileId: "" }],
        };
      }),
    };
  });

  setCourseDetails({ ...courseDetails, chapters: updatedChapters });
};


  return (
    <div className="flex flex-col gap-4 pl-20 pr-16">
      <h1 className="text-2xl">Course Details</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          placeholder="Course Name"
          type="text"
          name="title"
          value={courseDetails?.title}
          className={`${textBoxStyle}`}
          onChange={handleInputChange}
        />
        <div className="flex my-2 items-center gap-4">
          <input
            type="text"
            name="thumbnail"
            placeholder="Thumbnail URL"
            title="click for thumbnail"
            readOnly
            value={courseDetails?.thumbnail?.url}
            // disabled={isLoading}
            className={`${textBoxStyle} cursor-pointer`}
            onClick={() => {
              if (isLoading) {
                document.getElementById("file-upload-thumbnail").click();
              }
            }}
          />
          <input
            type="file"
            accept="image/*"
            hidden
            id={`file-upload-thumbnail`}
            onChange={handleFileSelect}
          />
        </div>
        <textarea
          name="description"
          placeholder="Course Description"
          value={courseDetails?.description}
          onChange={handleInputChange}
          className={`${textBoxStyle} h-24`}
        />
        {/* <Dropdown/> */}
        <div className="flex flex-col mb-4">
          <select
            name="category"
            value={courseDetails?.category}
            onChange={handleInputChange}
            className={`${textBoxStyle} appearance-none`}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col mb-4">
          <h2 className=" text-gray-700 font-medium mb-2 gap-4">Chapters</h2>
          {courseDetails?.chapters?.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="p-4 rounded-md mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="flex items-center gap-2 font-semibold text-gray-600">
                  Chapter
                  <Plus
                    className="cursor-pointer border-none rounded-md text-white bg-green-500 hover:bg-green-600 hover:text-white"
                    size={20}
                    onClick={addChapter}
                  />
                </h2>
                <button
                  type="button"
                  onClick={() => removeChapter(chapterIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove Chapter
                </button>
              </div>
              <input
                className={`${textBoxStyle}`}
                placeholder="Chapter Title"
                type="text"
                name="title"
                value={chapter.title}
                onChange={(e) => handleChapterChange(chapterIndex, e)}
              />
              <div className="flex flex-col mb-4">
                <textarea
                  placeholder="Chapter Summary"
                  name="summary"
                  value={chapter.summary}
                  onChange={(e) => handleChapterChange(chapterIndex, e)}
                  className={`${textBoxStyle}`}
                />
              </div>
              {chapter?.lessons?.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="px-2">
                  <div className="flex items-center justify-between mt-4 mb-2">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-600">
                      Lesson
                      <Plus
                        className="cursor-pointer border-none rounded-md text-white bg-green-500 hover:bg-green-600 hover:text-white"
                        size={20}
                        onClick={() => addLesson(chapterIndex)}
                      />
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeLesson(chapterIndex, lessonIndex)}
                      className="mt-2 text-red-500 hover:underline"
                    >
                      Remove Lesson
                    </button>
                  </div>
                  <input
                    type="text"
                    name="lesson_name"
                    placeholder="lesson_name"
                    value={lesson?.lesson_name}
                    onChange={(e) =>
                      handleLessonChange(chapterIndex, lessonIndex, e)
                    }
                    className={`${textBoxStyle}`}
                  />
                  <textarea
                    type="text"
                    name="content"
                    placeholder="Content"
                    value={lesson?.content}
                    onChange={(e) =>
                      handleLessonChange(chapterIndex, lessonIndex, e)
                    }
                    className={`${textBoxStyle}`}
                  />

                  {lesson?.resources?.map((resource, resIndex) => (
                    <div className="flex items-center gap-2" key={resIndex}>
                      <select
                        name="title"
                        value={resource.title || ""}
                        onChange={(e) =>
                          handleResourceChange(
                            chapterIndex,
                            lessonIndex,
                            resIndex,
                            e
                          )
                        }
                        className={`${textBoxStyle} appearance-none`}
                      >
                        <option value="" disabled>
                          Select type
                        </option>
                        {["video", "document", "link", "other"].map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="url"
                        placeholder="Resource URL"
                        readOnly={resource.title !== "link" ? true : false}
                        value={resource?.url || ""}
                        className={`${textBoxStyle} ${
                          resource.title === "link"
                            ? " bg-gray-100"
                            : "cursor-pointer"
                        }`}
                        onChange={(e) =>
                          handleResourceChange(
                            chapterIndex,
                            lessonIndex,
                            resIndex,
                            e
                          )
                        }
                        onClick={() => {
                          if (resource.title !== "link")
                            document
                              .getElementById(
                                `file-upload-${chapterIndex}-${lessonIndex}-${resIndex}`
                              )
                              .click();
                        }}
                      />
                      <input
                        type="file"
                        accept="*/*"
                        onChange={(e) =>
                          handleResourceFileChange(
                            chapterIndex,
                            lessonIndex,
                            resIndex,
                            e
                          )
                        }
                        className="hidden"
                        id={`file-upload-${chapterIndex}-${lessonIndex}-${resIndex}`}
                      />
                      <Plus
                        size={60}
                        className="text-green-600 cursor-pointer"
                        onClick={() => addResource(chapterIndex, lessonIndex)}
                      />
                      <X
                        size={60}
                        className=" text-red-600 cursor-pointer"
                        onClick={() =>
                          removeResource(chapterIndex, lessonIndex, resIndex)
                        }
                      />
                    </div>
                  ))}
                  {
                    lesson?.resources?.length === 0 && (
                      <button
                        type="button"
                        onClick={() => addResource(chapterIndex, lessonIndex)}
                        className="mt-2 text-blue-500 hover:underline"
                      >
                        Add Resource
                      </button>
                    )
                  }
                  {/* </div> */}
                </div>
              ))}
            </div>
          ))}
        </div>
        <button
          type="submit"
          // onClick={handleSubmit}
          className="bg-green-500 lg:mx-[45%] md:mx-[30%] mx-[20%] text-white font-medium py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          {isUpdate ? "Update Course" : "Create Course"}
        </button>
      </form>
    </div>
  );
}

export default CourseForm;
