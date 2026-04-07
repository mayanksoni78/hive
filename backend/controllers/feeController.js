import { supabase } from '../supabase.js';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/fee/create
// Student submits a fee payment request
// Body: { enroll_id, hostel_id, fees_paid, due_date }
// ─────────────────────────────────────────────────────────────────────────────
export const createFees = async (req, res) => {
  try {
    const { enroll_id, hostel_id, fees_paid, due_date } = req.body;

    if (!enroll_id || !hostel_id || !fees_paid || !due_date) {
      return res.json({ error: 'enroll_id, hostel_id, fees_paid and due_date are required' });
    }

    // Verify student exists
    const { data: student, error: studentError } = await supabase
      .from('student')
      .select('enroll_id, name')
      .eq('enroll_id', enroll_id)
      .single();

    if (studentError || !student) {
      return res.json({ error: 'Student not found' });
    }

    // ✅ Don't insert fee_id — it's auto-generated (gen_random_uuid)
    // ✅ Don't insert paid_date — only set when admin marks as paid
    // ✅ status defaults to 'unpaid' but we explicitly set 'pending' to mean "submitted by student, awaiting confirmation"
    const { data, error } = await supabase
      .from('fee')
      .insert([{
        enroll_id,
        hostel_id:  String(hostel_id), // fee table has hostel_id as text
        amount:     Number(fees_paid),
        due_date,
        status:     'pending',         // pending = student submitted, admin hasn't confirmed yet
      }])
      .select();

    if (error) throw error;

    res.json({ message: 'Fee request submitted. Admin will confirm receipt.', data });
  } catch (error) {
    console.error('Create Fee Error:', error);
    res.json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/fee/status?enroll_id=101
// Student views their own fee records
// ─────────────────────────────────────────────────────────────────────────────
export const getFeeStatus = async (req, res) => {
  try {
    const { enroll_id } = req.query;

    if (!enroll_id) {
      return res.json({ error: 'enroll_id is required' });
    }

    const { data: fees, error } = await supabase
      .from('fee')
      .select('*')
      .eq('enroll_id', enroll_id)
      .order('due_date', { ascending: false });

    if (error) throw error;

    // ✅ Fixed: correct status values are 'paid', 'pending', 'unpaid'
    const totalPaid = (fees || [])
      .filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + Number(f.amount), 0);

    const totalDue = (fees || [])
      .filter(f => f.status !== 'paid')
      .reduce((sum, f) => sum + Number(f.amount), 0);

    res.json({ payments: fees || [], totalPaid, totalDue });
  } catch (error) {
    console.error('Get Fee Error:', error);
    res.json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/fee/update
// Admin only — updates fee status to 'paid' or 'unpaid'
// Body: { fee_id, status }
// ─────────────────────────────────────────────────────────────────────────────
export const updateFeeStatus = async (req, res) => {
  try {
    const { fee_id, status } = req.body;

    if (!fee_id || !status) {
      return res.json({ error: 'fee_id and status are required' });
    }

    // ✅ Only allow valid status values from DB constraint
    const validStatuses = ['pending', 'paid', 'unpaid'];
    if (!validStatuses.includes(status)) {
      return res.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updateData = { status };

    // Set paid_date only when marking as paid
    if (status === 'paid') {
      updateData.paid_date = new Date().toISOString().split('T')[0];
    } else {
      updateData.paid_date = null; // clear if reverting
    }

    const { data, error } = await supabase
      .from('fee')
      .update(updateData)
      .eq('fee_id', fee_id)
      .select();

    if (error) throw error;

    res.json({ message: `Fee status updated to '${status}'`, data });
  } catch (error) {
    console.error('Update Fee Error:', error);
    res.json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/fee/receipt/:fee_id
// Returns downloadable HTML receipt — only if status is 'paid'
// ─────────────────────────────────────────────────────────────────────────────
export const downloadReceipt = async (req, res) => {
  try {
    const { fee_id } = req.params;

    const { data: fee, error } = await supabase
      .from('fee')
      .select('*, student(name, email, year, gender)')
      .eq('fee_id', fee_id)
      .single();

    if (error || !fee) {
      return res.json({ error: 'Fee record not found' });
    }

    if (fee.status !== 'paid') {
      return res.json({ error: 'Receipt only available for paid fees' });
    }

    const studentName  = fee.student?.name  || fee.enroll_id;
    const studentEmail = fee.student?.email || '—';
    const paidDate     = fee.paid_date
      ? new Date(fee.paid_date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
      : '—';
    const dueDate      = new Date(fee.due_date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
    const amount       = Number(fee.amount).toLocaleString('en-IN');
    const receiptNo    = fee.fee_id.slice(0, 8).toUpperCase();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Fee Receipt - ${receiptNo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 40px 20px; color: #1a1a1a; }
    .receipt { max-width: 620px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; padding: 36px 40px; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
    .logo span { color: #4ecca3; }
    .receipt-label { text-align: right; }
    .receipt-label p { font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }
    .receipt-label h3 { font-size: 20px; font-weight: 600; margin-top: 2px; }
    .receipt-no { margin-top: 20px; font-size: 13px; color: rgba(255,255,255,0.6); }
    .receipt-no span { color: #4ecca3; font-weight: 600; }
    .paid-badge { display: inline-flex; align-items: center; gap: 6px; background: #4ecca3; color: #1a1a2e; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 100px; margin-top: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
    .body { padding: 36px 40px; }
    .section-title { font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
    .info-item label { font-size: 11px; color: #999; display: block; margin-bottom: 3px; }
    .info-item p { font-size: 14px; font-weight: 500; color: #1a1a1a; }
    .divider { height: 1px; background: #f0f0f0; margin: 24px 0; }
    .amount-box { background: #f8fffe; border: 1.5px solid #4ecca3; border-radius: 10px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
    .amount-box .label { font-size: 13px; color: #555; }
    .amount-box .value { font-size: 28px; font-weight: 700; color: #1a1a2e; }
    .amount-box .value span { font-size: 16px; }
    .footer { background: #fafafa; border-top: 1px solid #f0f0f0; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
    .footer p { font-size: 12px; color: #bbb; }
    .print-btn { background: #1a1a2e; color: #fff; border: none; padding: 10px 22px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; }
    @media print { .print-btn { display: none; } body { background: #fff; padding: 0; } .receipt { box-shadow: none; border-radius: 0; } }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div class="header-top">
        <div class="logo">H<span>IVE</span></div>
        <div class="receipt-label">
          <p>Payment Receipt</p>
          <h3>Fee Receipt</h3>
        </div>
      </div>
      <p class="receipt-no">Receipt No: <span>#${receiptNo}</span></p>
      <div class="paid-badge">✓ Paid</div>
    </div>

    <div class="body">
      <p class="section-title">Student Information</p>
      <div class="info-grid">
        <div class="info-item">
          <label>Full Name</label>
          <p>${studentName}</p>
        </div>
        <div class="info-item">
          <label>Enrollment ID</label>
          <p>${fee.enroll_id}</p>
        </div>
        <div class="info-item">
          <label>Email</label>
          <p>${studentEmail}</p>
        </div>
        <div class="info-item">
          <label>Hostel ID</label>
          <p>${fee.hostel_id}</p>
        </div>
      </div>

      <div class="divider"></div>

      <p class="section-title">Payment Details</p>
      <div class="info-grid">
        <div class="info-item">
          <label>Due Date</label>
          <p>${dueDate}</p>
        </div>
        <div class="info-item">
          <label>Payment Date</label>
          <p>${paidDate}</p>
        </div>
        <div class="info-item">
          <label>Payment Status</label>
          <p style="color:#16a34a; font-weight:600;">Paid</p>
        </div>
        <div class="info-item">
          <label>Payment ID</label>
          <p style="font-size:12px; color:#999;">${fee.fee_id}</p>
        </div>
      </div>

      <div class="divider"></div>

      <div class="amount-box">
        <div>
          <p class="label">Total Amount Paid</p>
          <p style="font-size:12px; color:#999; margin-top:2px;">Hostel fee payment</p>
        </div>
        <div class="value"><span>₹</span>${amount}</div>
      </div>

      <p style="font-size:12px; color:#999; line-height:1.6;">
        This is a computer-generated receipt and is valid without a physical signature.
        Please keep this for your records.
      </p>
    </div>

    <div class="footer">
      <p>Generated on ${new Date().toLocaleDateString('en-IN')}</p>
      <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
    </div>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${receiptNo}.html`);
    res.send(html);
  } catch (error) {
    console.error('Receipt Error:', error);
    res.json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/fee/all
// Admin — get all fee records with student name joined
// ─────────────────────────────────────────────────────────────────────────────
export const getAllFees = async (req, res) => {
  try {
    const { status } = req.query;
    const hostel_id = req.hostel_id; // ✅ from token
  
console.log("Hostel ID from token:", hostel_id);
    let query = supabase
      .from('fee')
      .select(`
        *,
        student ( name )
      `)
      .eq('hostel_id', hostel_id) // ✅ FILTER HERE
      .order('due_date', { ascending: false });


    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    const fees = (data || []).map(f => ({
      ...f,
      student_name: f.student?.name || f.enroll_id,
    }));

    res.json({ fees });

  } catch (error) {
    console.error('Get All Fees Error:', error);
    res.json({ error: error.message });
  }
};