const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      next(); 
    } else {
      return res.status(401).json({ message: 'Musisz być zalogowany, aby uzyskać dostęp' });
    }
  };
  
  const isAuthorized = (req, res, next) => {
    const userIdParam = parseInt(req.params.userId, 10);
    const userIdSession = req.session.user?.id_user;
  
    if (userIdParam !== userIdSession) {
      return res.status(403).json({ message: 'Nie masz uprawnień do tego zasobu' });
    }
    next();
  };
  export {isAuthenticated, isAuthorized};