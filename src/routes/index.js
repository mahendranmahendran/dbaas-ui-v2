const express = require('express');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const databaseRoutes = require('./databaseRoutes');
const queryRoutes = require('./queryRoutes');
const billingRoutes = require('./billingRoutes');
const adminRoutes = require('./adminRoutes');
const metricsRoutes = require('./metricsRoutes');
const rbacRoutes = require('./rbacRoutes');
const tableRoutes = require('./tableRoutes');
const backupRoutes = require('./backupRoutes');

function setupRoutes(app) {
  // Mount all routes under /api
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/databases', databaseRoutes);
  app.use('/api/query', queryRoutes);
  app.use('/api/billing', billingRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/metrics', metricsRoutes);
  app.use('/api/rbac', rbacRoutes);
  app.use('/api/tables', tableRoutes);
  app.use('/api/backup', backupRoutes);
}

module.exports = setupRoutes;
