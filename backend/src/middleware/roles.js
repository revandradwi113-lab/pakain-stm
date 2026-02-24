function requireRole(...roles) {
  return (req, res, next) => {
    // Support both single role string and multiple roles
    const allowedRoles = roles.length === 1 && typeof roles[0] === 'string' 
      ? [roles[0]] 
      : roles;
    
    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  };
}

module.exports = { requireRole };
