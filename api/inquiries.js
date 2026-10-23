const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5uZhC9gdwrec@ep-sparkling-sound-b3s03ara-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { name, email, phone, services, timelineBudget, scope } = req.body || {};

      if (!name || !scope) {
        return res.status(400).json({ success: false, message: 'Name and scope are required' });
      }

      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
      const now = new Date();

      // Insert inquiry
      const insertQuery = `
        INSERT INTO inquiries (name, email, phone, timeline_budget, scope, status, client_ip, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
      `;
      const values = [name, email || null, phone || null, timelineBudget || null, scope, 'NEW', clientIp, now, now];

      const result = await pool.query(insertQuery, values);
      const inquiryId = result.rows[0].id;

      // Insert services
      if (Array.isArray(services) && services.length > 0) {
        for (const svc of services) {
          await pool.query('INSERT INTO inquiry_services (inquiry_id, service_name) VALUES ($1, $2)', [inquiryId, svc]);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Your proposal request has been received successfully',
        data: { id: inquiryId, name, email, scope }
      });
    } catch (err) {
      console.error('Database insertion error:', err);
      return res.status(500).json({ success: false, message: 'Server error saving inquiry: ' + err.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 50;');
      return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
};
