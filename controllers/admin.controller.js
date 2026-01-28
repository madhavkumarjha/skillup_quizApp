import { User } from '../models/user.models.js';
import { filterUserData } from '../utils/filteredUserData.js';
// import imagekit from "../utils/imageKit.js";

// get admin by id
export const getAdminById = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await User.findOne({ _id: adminId, role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const safeAdmin = filterUserData(admin);
    res.status(200).json({ admin: safeAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// // update admin details
// export const updateAdminDetails = async (req, res) => {
//   try {
//     const { adminId } = req.params;
//     const updates = req.body;
//     const admin = await User.findOneAndUpdate(
//       { _id: adminId, role: "admin" },
//       updates,
//       { new: true }
//     );
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }
//     const safeAdmin = filterUserData(admin);
//     res.status(200).json({ admin: safeAdmin });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// delete an instructor
export const deleteInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const instructor = await User.findOneAndDelete({
      _id: instructorId,
      role: 'instructor',
    });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.status(200).json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a student
export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findOneAndDelete({
      _id: studentId,
      role: 'user',
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
