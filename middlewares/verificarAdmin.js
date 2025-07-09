function verificarAdmin(req, res, next) {
  if (req.session.usuario && req.session.usuario.role === 'admin') return next();
  return res.status(403).send('Acesso negado');
}

module.exports = verificarAdmin;
