import type { RequestHandler } from "express";

// Controllers 必须各自包装异常，不允许只在全局错误中间件吞掉错误。
export const asyncHandler = (handler: RequestHandler): RequestHandler => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
