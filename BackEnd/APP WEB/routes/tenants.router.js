// routes/tenants.router.js
const express = require('express');

function tenantsRouterFactory(service) {
  const router = express.Router();

  // GET /tenants
  router.get('/', async (req, res) => {
    try {
      const result = await service.findAll();
      res.status(result.status).json(result.body);
    } catch (e) {
      res.status(500).json({ ok: false, message: 'Error interno', error: e.message });
    }
  });

  // GET /tenants/:id
  router.get('/:id', async (req, res) => {
    try {
      const result = await service.findById(Number(req.params.id));
      res.status(result.status).json(result.body);
    } catch (e) {
      res.status(500).json({ ok: false, message: 'Error interno', error: e.message });
    }
  });

  // POST /tenants
  router.post('/', async (req, res) => {
    try {
      const result = await service.create(req.body);
      res.status(result.status).json(result.body);
    } catch (e) {
      res.status(500).json({ ok: false, message: 'Error interno', error: e.message });
    }
  });

  // PUT /tenants/:id
  router.put('/:id', async (req, res) => {
    try {
      const result = await service.update(Number(req.params.id), req.body);
      res.status(result.status).json(result.body);
    } catch (e) {
      res.status(500).json({ ok: false, message: 'Error interno', error: e.message });
    }
  });

  // DELETE /tenants/:id
  router.delete('/:id', async (req, res) => {
    try {
      const result = await service.remove(Number(req.params.id));
      res.status(result.status).json(result.body);
    } catch (e) {
      res.status(500).json({ ok: false, message: 'Error interno', error: e.message });
    }
  });

  return router;
}

module.exports = tenantsRouterFactory;
