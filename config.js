
export const DATABASE_URL = process.env.DATABASE_URL ||
global.DATABASE_URL || 'mongodb://user:user123@ds243325.mlab.com:43325/order_inn_production_db';

export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||'mongodb://kobefed5:jordan6@ds111063.mlab.com:11063/mock_orders';
export const PORT = process.env.PORT || 8080;

export const JWT_SECRET = process.env.JWT_SECRET || 'kobeFed5'
export const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';