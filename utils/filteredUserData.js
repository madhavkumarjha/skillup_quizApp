// utils/filterUserData.js
export const filterUserData = (user) => {
  const safeUser = user.toObject ? user.toObject() : user;

  // Remove sensitive fields
  delete safeUser.password;
  delete safeUser.resetPasswordToken;
  delete safeUser.resetPasswordExpire;

  // Role-based filtering
  if (safeUser.role === "admin") {
    delete safeUser.expertise;
    delete safeUser.specializations;
    delete safeUser.bio;
    delete safeUser.totalCourses;
    delete safeUser.ratings;
    delete safeUser.enrolledCourses;
    delete safeUser.quizScores;
    delete safeUser.completedLessons;
    // delete safeUser.avatar;
    delete safeUser.phone;
    return safeUser; // full access
  }

  if (safeUser.role === "instructor") {
    delete safeUser.enrolledCourses;
    delete safeUser.quizScores;
    delete safeUser.completedLessons;
    return safeUser;
  }

  if (safeUser.role === "user") {
    delete safeUser.expertise;
    delete safeUser.bio;
    delete safeUser.specializations;
    delete safeUser.totalCourses;
    delete safeUser.ratings;
    return safeUser;
  }

  return safeUser;
};
