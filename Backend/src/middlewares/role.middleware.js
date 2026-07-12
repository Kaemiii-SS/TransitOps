import { ApiError } from "../utils/ApiError.js";

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, "Forbidden: you do not have permission to perform this action");
  }

  next();
};

export { authorizeRoles };