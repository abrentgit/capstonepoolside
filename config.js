
exports.DATABASE_URL = process.env.DATABASE_URL ||
global.DATABASE_URL || 'mongodb://localhost:27017/poolside_bedside';

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||'mongodb://kobefed5:jordan6@ds111063.mlab.com:11063/mock_orders';
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET || 'kobeFed5'
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';