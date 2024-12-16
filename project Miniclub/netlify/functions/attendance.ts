import { Handler } from '@netlify/functions';
import { useAttendanceStore } from '../../src/store/attendanceStore';
import { students } from '../../src/data/students';

const handler: Handler = async (event) => {
  // Vérifier la clé API
  const apiKey = event.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid API key' })
    };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        const { attendanceHistory } = useAttendanceStore.getState();
        return {
          statusCode: 200,
          body: JSON.stringify({ attendance: attendanceHistory })
        };

      case 'POST':
        const { studentId, date } = JSON.parse(event.body || '{}');
        
        if (!studentId || !date) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'studentId and date are required' })
          };
        }

        const student = students.find(s => s.id === studentId);
        if (!student) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Student not found' })
          };
        }

        const { addStudent } = useAttendanceStore.getState();
        await addStudent(student);

        return {
          statusCode: 200,
          body: JSON.stringify({ success: true })
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

export { handler };