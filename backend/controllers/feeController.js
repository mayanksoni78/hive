import { supabase } from '../supabase.js';

// GET /api/fee/status?enroll_id=101
export const getFeeStatus = async (req, res) => {
  try {
    const { enroll_id } = req.query;

    if (!enroll_id) {
      return res.json({ error: 'enroll_id is required' });
    }

    // Get student's fee_id
    const { data: student, error: studentError } = await supabase
      .from('student')
      .select('enroll_id, name, room_id, hostel_id, fee_id, status')
      .eq('enroll_id', enroll_id)
      .single();

    if (studentError || !student) {
      return res.json({ error: 'Student not found' });
    }

    // Get all fee payment records linked to this student's fee_id
    const { data: payments, error: payError } = await supabase
      .from('fee_payments')
      .select('*')
      .eq('fee_id', student.fee_id)
      .order('created_at', { ascending: false });

    if (payError) throw payError;

    const totalPaid = (payments || [])
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const totalDue = (payments || [])
      .filter(p => p.status !== 'Paid')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    res.json({ student, payments: payments || [], totalPaid, totalDue });
  } catch (error) {
    console.error('Fee Controller Error:', error);
    res.json({ error: error.message });
  }
};

// GET /api/fee/receipt/:payment_id?enroll_id=101
export const downloadReceipt = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { enroll_id }  = req.query;

    if (!enroll_id) return res.json({ error: 'enroll_id is required' });

    // Get fee_id from student
    const { data: student } = await supabase
      .from('student')
      .select('fee_id, name, enroll_id')
      .eq('enroll_id', enroll_id)
      .single();

    if (!student) return res.json({ error: 'Student not found' });

    // Make sure this payment belongs to this student
    const { data: payment, error } = await supabase
      .from('fee_payments')
      .select('*')
      .eq('id', payment_id)
      .eq('fee_id', student.fee_id)
      .single();

    if (error || !payment) return res.json({ error: 'Receipt not found' });

    res.json({
      receipt: {
        ...payment,
        student_name: student.name,
        enroll_id:    student.enroll_id,
      }
    });
  } catch (error) {
    console.error('Receipt Error:', error);
    res.json({ error: error.message });
  }
};
