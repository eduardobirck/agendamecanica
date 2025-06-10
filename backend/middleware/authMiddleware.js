const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de Proteção (Autenticação)
exports.protect = async (req, res, next) => {
  let token;

  // 1. Verifica se o token está no cabeçalho de autorização e se começa com "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extrai o token do cabeçalho (ex: "Bearer <token>" -> "<token>")
    token = req.headers.authorization.split(' ')[1];
  }
  
  // 2. Se não houver token, retorna um erro de não autorizado
  if (!token) {
    return res.status(401).json({ success: false, message: 'Acesso negado, nenhum token fornecido' });
  }

  try {
    // 3. Verifica se o token é válido usando o segredo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Se for válido, pega o ID do usuário do token, busca o usuário no banco
    // e anexa o objeto do usuário (sem a senha) ao objeto da requisição (req)
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
    // Este middleware deve rodar DEPOIS do 'protect', então ele terá acesso a req.user
    if (!roles.includes(req.user.role)) {
      // Se o papel do usuário não está na lista de papéis permitidos...
      return res.status(403).json({ 
        success: false, 
        message: `O papel '${req.user.role}' não tem permissão para acessar esta rota` 
      });
    }
    next();
  };
};