// backend/routes/api.js - Complete API for Circlo Rental
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { getConnection } = require('../hana');

// Mock data for development (fallback when database is not available)
const mockData = {
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+919876543210',
      karma_points: 150,
      joined_date: '2024-01-01'
    }
  ],
  items: [
    {
      id: '1',
      title: 'Canon EOS R5 Camera',
      description: 'Professional mirrorless camera with 45MP full-frame sensor.',
      category: 'Electronics',
      price: 85,
      price_unit: 'day',
      location: 'Manhattan, NY',
      owner_id: '1',
      owner_name: 'John Doe',
      rating: 4.9,
      review_count: 127,
      created_at: '2024-01-10'
    },
    {
      id: '2',
      title: 'Vintage Leica M6 Film Camera',
      description: 'Legendary 35mm rangefinder camera from 1984.',
      category: 'Electronics',
      price: 120,
      price_unit: 'day',
      location: 'Brooklyn, NY',
      owner_id: '1',
      owner_name: 'John Doe',
      rating: 5.0,
      review_count: 89,
      is_vault_item: true,
      vault_story: 'This particular Leica M6 belonged to renowned street photographer Henri Cartier-Bresson.',
      created_at: '2024-01-08'
    }
  ],
  bookings: [],
  reviews: [],
  chats: []
};

// Helper function to execute SQL queries
function executeSQL(conn, sql, params = []) {
  return new Promise((resolve, reject) => {
    conn.exec(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Helper function to get database connection
function getDBConnection() {
  return new Promise((resolve, reject) => {
    try {
      const conn = getConnection();
      setTimeout(() => resolve(conn), 500);
    } catch (err) {
      reject(err);
    }
  });
}

// Helper function to check if database is available
async function isDatabaseAvailable() {
  try {
    const conn = await getDBConnection();
    await executeSQL(conn, 'SELECT 1 FROM DUMMY');
    return true;
  } catch (error) {
    console.log('Database not available, using mock data');
    return false;
  }
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// AUTH ENDPOINTS

// POST /api/auth/register - User registration
router.post('/auth/register', [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, phone, aadhaar } = req.body;

    if (await isDatabaseAvailable()) {
      let conn;
      try {
        conn = await getDBConnection();
        
        // Check if user already exists
        const existingUser = await executeSQL(conn, 'SELECT id FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
          return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Generate user ID
        const userId = uuidv4();

        // Insert new user
        const insertSQL = `
          INSERT INTO Users (id, name, email, password_hash, phone, aadhaar_encrypted, karma_points, joined_date)
          VALUES (?, ?, ?, ?, ?, ?, 0, CURRENT_DATE)
        `;

        await executeSQL(conn, insertSQL, [
          userId, 
          name, 
          email, 
          hashedPassword, 
          phone,
          aadhaar ? Buffer.from(aadhaar).toString('base64') : null
        ]);

        // Create JWT token
        const token = jwt.sign(
          { id: userId, email, name },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: { id: userId, name, email }
        });
      } finally {
        if (conn) conn.disconnect();
      }
    } else {
      // Mock data implementation
      const existingUser = mockData.users.find(user => user.email === email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const userId = uuidv4();

      const newUser = {
        id: userId,
        name,
        email,
        password_hash: hashedPassword,
        phone,
        karma_points: 0,
        joined_date: new Date().toISOString().split('T')[0]
      };

      mockData.users.push(newUser);

      const token = jwt.sign(
        { id: userId, email, name },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: userId, name, email }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login - User login
router.post('/auth/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    if (await isDatabaseAvailable()) {
      let conn;
      try {
        conn = await getDBConnection();
        
        const result = await executeSQL(conn, 'SELECT * FROM Users WHERE email = ?', [email]);
        
        if (result.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, name: user.name },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: { id: user.id, name: user.name, email: user.email }
        });
      } finally {
        if (conn) conn.disconnect();
      }
    } else {
      // Mock data implementation
      const user = mockData.users.find(u => u.email === email);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // For mock data, we'll use a simple password check
      const isValidPassword = password === 'password123'; // Mock password
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ITEMS ENDPOINTS

// GET /api/items - Get all items
router.get('/items', async (req, res) => {
  try {
    const { category, search, location } = req.query;
    
    if (await isDatabaseAvailable()) {
      // Database implementation
      let conn;
      try {
        conn = await getDBConnection();
        
        let sql = 'SELECT * FROM Items WHERE 1=1';
        const params = [];
        
        if (category && category !== 'all') {
          sql += ' AND category = ?';
          params.push(category);
        }
        
        if (search) {
          sql += ' AND (title LIKE ? OR description LIKE ?)';
          params.push(`%${search}%`, `%${search}%`);
        }
        
        if (location) {
          sql += ' AND location LIKE ?';
          params.push(`%${location}%`);
        }
        
        sql += ' ORDER BY created_at DESC';
        
        const result = await executeSQL(conn, sql, params);
        res.json(result);
      } finally {
        if (conn) conn.disconnect();
      }
    } else {
      // Mock data implementation
      let items = [...mockData.items];
      
      if (category && category !== 'all') {
        items = items.filter(item => item.category === category);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        items = items.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (location) {
        const locationLower = location.toLowerCase();
        items = items.filter(item => 
          item.location.toLowerCase().includes(locationLower)
        );
      }
      
      res.json(items);
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET /api/items/:id - Get specific item
router.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (await isDatabaseAvailable()) {
      let conn;
      try {
        conn = await getDBConnection();
        const result = await executeSQL(conn, 'SELECT * FROM Items WHERE id = ?', [id]);
        
        if (result.length === 0) {
          return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json(result[0]);
      } finally {
        if (conn) conn.disconnect();
      }
    } else {
      // Mock data implementation
      const item = mockData.items.find(item => item.id === id);
      
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      res.json(item);
    }
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST /api/items - Create new item
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, price, price_unit, location } = req.body;
    
    if (await isDatabaseAvailable()) {
      let conn;
      try {
        conn = await getDBConnection();
        
        const itemId = uuidv4();
        const insertSQL = `
          INSERT INTO Items (id, title, description, category, price, price_unit, location, owner_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        await executeSQL(conn, insertSQL, [
          itemId, title, description, category, price, price_unit, location, req.user.id
        ]);
        
        res.status(201).json({ 
          message: 'Item created successfully',
          itemId 
        });
      } finally {
        if (conn) conn.disconnect();
      }
    } else {
      // Mock data implementation
      const newItem = {
        id: uuidv4(),
        title,
        description,
        category,
        price: parseFloat(price),
        price_unit,
        location,
        owner_id: req.user.id,
        owner_name: req.user.name,
        rating: 0,
        review_count: 0,
        created_at: new Date().toISOString()
      };
      
      mockData.items.push(newItem);
      res.status(201).json({ 
        message: 'Item created successfully',
        itemId: newItem.id 
      });
    }
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// BOOKING ENDPOINTS

// POST /api/bookings - Create new booking
router.post('/bookings', authenticateToken, [
  body('item_id').isUUID().withMessage('Valid item ID required'),
  body('start_date').isISO8601().withMessage('Valid start date required'),
  body('end_date').isISO8601().withMessage('Valid end date required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let conn;
  try {
    conn = await getDBConnection();
    
    const { item_id, start_date, end_date } = req.body;
    
    // Check if item exists and is not owned by the user
    const itemCheck = await executeSQL(conn, 
      'SELECT owner_id FROM Items WHERE id = ?', 
      [item_id]
    );
    
    if (itemCheck.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (itemCheck[0].OWNER_ID === req.user.userId) {
      return res.status(400).json({ error: 'Cannot book your own item' });
    }

    // Check for overlapping bookings
    const overlapCheck = await executeSQL(conn, `
      SELECT id FROM Bookings 
      WHERE item_id = ? 
      AND status NOT IN ('cancelled', 'rejected')
      AND (
        (start_date <= ? AND end_date >= ?) OR
        (start_date <= ? AND end_date >= ?) OR
        (start_date >= ? AND end_date <= ?)
      )
    `, [item_id, start_date, start_date, end_date, end_date, start_date, end_date]);

    if (overlapCheck.length > 0) {
      return res.status(400).json({ error: 'Item is not available for selected dates' });
    }
    
    const bookingId = uuidv4();
    
    const insertSQL = `
      INSERT INTO Bookings (id, user_id, item_id, start_date, end_date, status, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending', 'unpaid', CURRENT_TIMESTAMP)
    `;
    
    await executeSQL(conn, insertSQL, [
      bookingId,
      req.user.userId,
      item_id,
      start_date,
      end_date
    ]);
    
    res.status(201).json({
      message: 'Booking request created successfully',
      bookingId
    });
    
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// GET /api/bookings - Get user's bookings
router.get('/bookings', authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await getDBConnection();
    
    const { type = 'renter' } = req.query; // 'renter' or 'owner'
    
    let sql;
    if (type === 'owner') {
      // Bookings for items owned by the user
      sql = `
        SELECT b.*, i.title as item_title, i.price, i.price_unit,
               u.name as renter_name, u.phone as renter_phone
        FROM Bookings b
        JOIN Items i ON b.item_id = i.id
        JOIN Users u ON b.user_id = u.id
        WHERE i.owner_id = ?
        ORDER BY b.created_at DESC
      `;
    } else {
      // Bookings made by the user
      sql = `
        SELECT b.*, i.title as item_title, i.price, i.price_unit,
               u.name as owner_name, u.phone as owner_phone
        FROM Bookings b
        JOIN Items i ON b.item_id = i.id
        JOIN Users u ON i.owner_id = u.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
      `;
    }
    
    const bookings = await executeSQL(conn, sql, [req.user.userId]);
    
    res.json({ bookings });
    
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// PUT /api/bookings/:id/status - Update booking status (for owners)
router.put('/bookings/:id/status', authenticateToken, [
  body('status').isIn(['confirmed', 'rejected', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let conn;
  try {
    conn = await getDBConnection();
    
    const { status } = req.body;
    const bookingId = req.params.id;
    
    // Check if user owns the item for this booking
    const ownerCheck = await executeSQL(conn, `
      SELECT b.id FROM Bookings b
      JOIN Items i ON b.item_id = i.id
      WHERE b.id = ? AND i.owner_id = ?
    `, [bookingId, req.user.userId]);
    
    if (ownerCheck.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }
    
    await executeSQL(conn, 
      'UPDATE Bookings SET status = ? WHERE id = ?', 
      [status, bookingId]
    );
    
    res.json({ message: 'Booking status updated successfully' });
    
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// REVIEW ENDPOINTS

// POST /api/reviews - Create review
router.post('/reviews', authenticateToken, [
  body('item_id').isUUID().withMessage('Valid item ID required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').isLength({ min: 10 }).withMessage('Comment must be at least 10 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let conn;
  try {
    conn = await getDBConnection();
    
    const { item_id, rating, comment } = req.body;
    
    // Check if user has a completed booking for this item
    const bookingCheck = await executeSQL(conn, `
      SELECT id FROM Bookings 
      WHERE user_id = ? AND item_id = ? AND status = 'completed'
    `, [req.user.userId, item_id]);
    
    if (bookingCheck.length === 0) {
      return res.status(400).json({ error: 'Can only review items you have rented' });
    }

    // Check if user already reviewed this item
    const existingReview = await executeSQL(conn, 
      'SELECT id FROM Reviews WHERE user_id = ? AND item_id = ?', 
      [req.user.userId, item_id]
    );
    
    if (existingReview.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this item' });
    }
    
    const reviewId = uuidv4();
    
    await executeSQL(conn, `
      INSERT INTO Reviews (id, user_id, item_id, rating, comment, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [reviewId, req.user.userId, item_id, rating, comment]);
    
    res.status(201).json({
      message: 'Review created successfully',
      reviewId
    });
    
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Failed to create review' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// USER PROFILE ENDPOINTS

// GET /api/profile - Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await getDBConnection();
    
    const userSql = `
      SELECT id, name, email, phone, karma_points, joined_date, avatar_url
      FROM Users WHERE id = ?
    `;
    
    const users = await executeSQL(conn, userSql, [req.user.userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's items count
    const itemsCount = await executeSQL(conn, 
      'SELECT COUNT(*) as count FROM Items WHERE owner_id = ?', 
      [req.user.userId]
    );

    // Get user's bookings count
    const bookingsCount = await executeSQL(conn, 
      'SELECT COUNT(*) as count FROM Bookings WHERE user_id = ?', 
      [req.user.userId]
    );

    const user = users[0];
    user.items_count = itemsCount[0].COUNT;
    user.bookings_count = bookingsCount[0].COUNT;
    
    res.json({ user });
    
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// GET /api/categories - Get all categories
router.get('/categories', async (req, res) => {
  let conn;
  try {
    conn = await getDBConnection();
    
    const sql = `
      SELECT DISTINCT category, COUNT(*) as count 
      FROM Items 
      WHERE category IS NOT NULL 
      GROUP BY category 
      ORDER BY count DESC
    `;
    
    const categories = await executeSQL(conn, sql);
    
    res.json({ categories });
    
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  } finally {
    if (conn) conn.disconnect();
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'API is healthy',
    timestamp: new Date().toISOString(),
    database: 'Available (with fallback)'
  });
});

module.exports = router;