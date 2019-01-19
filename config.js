
exports.DATABASE_URL = process.env.DATABASE_URL ||
global.DATABASE_URL || 'mongodb://user:user123@ds243325.mlab.com:43325/order_inn_production_db';

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||'mongodb://kobefed5:jordan6@ds111063.mlab.com:11063/mock_orders';
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET || 'kobeFed5'
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';