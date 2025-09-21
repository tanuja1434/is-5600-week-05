// db.js
const mongoose = require('mongoose')

const DEFAULT_URI =
  'mongodb://root:example@127.0.0.1:27017/is5600-week05?authSource=admin'
// prefer env if you’re using Atlas or a custom container
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('[mongo] connected'))
  .catch((err) => {
    console.error('[mongo] connection error:', err.message)
  })

module.exports = mongoose
