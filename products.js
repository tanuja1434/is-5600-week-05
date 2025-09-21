// products.js
const mongoose = require('./db')

// Keep tags compatible with your JSON shape: { title: String }
const TagSchema = new mongoose.Schema(
  { title: { type: String, trim: true, required: true } },
  { _id: false }
)

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number },
    image: { type: String, trim: true },
    // array of { title }
    tags: { type: [TagSchema], default: [] },
  },
  { timestamps: true }
)

const Product = mongoose.model('Product', ProductSchema)

/** Create */
async function create(fields = {}) {
  const doc = await Product.create(fields)
  return doc.toObject()
}

/** List with offset/limit and optional tag */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const query = tag ? { tags: { $elemMatch: { title: tag } } } : {}

  const docs = await Product.find(query)
    .sort({ _id: 1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean()

  return docs
}

/** Get by _id */
async function get(id) {
  if (!mongoose.isValidObjectId(id)) return null
  const doc = await Product.findById(id).lean()
  return doc || null
}

/** Edit (partial update) by _id */
async function edit(id, change = {}) {
  if (!mongoose.isValidObjectId(id)) return null
  const doc = await Product.findById(id)
  if (!doc) return null

  Object.assign(doc, change)
  await doc.save()
  return doc.toObject()
}

/** Delete by _id */
async function destroy(id) {
  if (!mongoose.isValidObjectId(id)) return false
  const res = await Product.deleteOne({ _id: id })
  return res.deletedCount > 0
}

module.exports = { create, list, get, edit, destroy }
