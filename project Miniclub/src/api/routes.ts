import express from 'express';
import { validateApiKey } from './middleware';
import { useAttendanceStore } from '../store/attendanceStore';
import { students } from '../data/students';
import type { Student } from '../types/student';

const router = express.Router();

// Middleware d'authentification pour toutes les routes
router.use(validateApiKey);

// Récupérer la liste des élèves
router.get('/students', (req, res) => {
  res.json({ students });
});

// Récupérer les présences
router.get('/attendance', (req, res) => {
  const { attendanceHistory } = useAttendanceStore.getState();
  res.json({ attendance: attendanceHistory });
});

// Marquer un élève présent
router.post('/attendance', async (req, res) => {
  const { studentId, date } = req.body;

  if (!studentId || !date) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'studentId and date are required'
    });
  }

  const student = students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Student not found'
    });
  }

  const { addStudent } = useAttendanceStore.getState();
  await addStudent(student);

  res.json({
    success: true,
    message: 'Attendance marked successfully'
  });
});

// Statut de synchronisation
router.get('/sync/status', (req, res) => {
  const { attendanceHistory } = useAttendanceStore.getState();
  
  res.json({
    lastSync: new Date().toISOString(),
    totalRecords: attendanceHistory.length,
    status: 'success'
  });
});

export default router;