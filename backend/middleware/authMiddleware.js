const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de Proteção (Autenticação)
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Acesso negado, nenhum token fornecido' });
  }

  try {
    // 3. Verifica se o token é válido usando o segredo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.user.id).select('-password');
    
    // 5. Passa para o próximo middleware ou para a rota final
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Acesso negado, token inválido' });
  }
};


// Middleware de Autorização (Controle de Acesso por Papel)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `O papel '${req.user.role}' não tem permissão para acessar esta rota` 
      });
    }
    next();
  };
};