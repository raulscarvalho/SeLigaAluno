function verificarLogin(req, res, next) {
  console.log('Middleware verificarLogin:', req.session.usuario);
  if (!req.session.usuario) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
    }
    return res.redirect('/login');
  }
  next();
}

module.exports = verificarLogin;
