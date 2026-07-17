/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: admin@sukma.dev }
 *               password: { type: string, example: Admin@123456 }
 *     responses:
 *       200:
 *         description: Login berhasil
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current admin
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Admin profile
 * /about:
 *   get:
 *     tags: [About]
 *     summary: Get about data
 *     responses:
 *       200:
 *         description: About profile
 * /skills:
 *   get:
 *     tags: [Skills]
 *     summary: List skills
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Skill list
 * /projects:
 *   get:
 *     tags: [Projects]
 *     summary: List projects with filter & pagination
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Project list
 * /experiences:
 *   get:
 *     tags: [Experiences]
 *     summary: List experiences
 *     responses:
 *       200:
 *         description: Experience list
 * /certificates:
 *   get:
 *     tags: [Certificates]
 *     summary: List certificates
 *     responses:
 *       200:
 *         description: Certificate list
 * /social-links:
 *   get:
 *     tags: [Social Links]
 *     summary: List social links
 *     responses:
 *       200:
 *         description: Social links
 * /cv:
 *   get:
 *     tags: [CV]
 *     summary: Get active CV
 *     responses:
 *       200:
 *         description: Active CV file
 * /settings:
 *   get:
 *     tags: [Settings]
 *     summary: Get all settings
 *     responses:
 *       200:
 *         description: Settings object
 * /dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Admin dashboard overview
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
module.exports = {};
