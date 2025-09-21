// orders.js
const cuid = require('cuid')
const mongoose = require('./db')
const { Schema } = mongoose

// Order._id is a string (cuid); products reference Product ObjectIds
const Order = mongoose.model(
  'Order',
  new Schema(
    {
      _id: { type: String, default: cuid },
      buyerEmail: { type: String, required: true },
      products: [
        { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true }
      ],
      status: {
        type: String,
        index: true,
        default: 'CREATED',
        enum: ['CREATED', 'PENDING', 'COMPLETED'],
      },
    },
    { timestamps: true }
  )
)

/** List orders (optional filters: productId, status) */
async function list(options = {}) {
  const { offset = 0, limit = 25, productId, status } = options
  const query = {
    ...(productId ? { products: productId } : {}),
    ...(status ? { status } : {}),
  }
  const orders = await Order.find(query)
    .sort({ _id: 1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .populate('products')
    .lean()
  return orders
}

/** Get one (populated) */
async function get(_id) {
  const order = await Order.findById(_id).populate('products').lean()
  return order
}

/** Create (then populate for response) */
async function create(fields) {
  const order = await new Order(fields).save()
  await order.populate('products')
  return order.toObject()
}

/** Edit (partial) */
async function edit(_id, change = {}) {
  const order = await Order.findById(_id)
  if (!order) return null
  Object.assign(order, change)
  await order.save()
  await order.populate('products')
  return order.toObject()
}

/** Delete */
async function destroy(_id) {
  const res = await Order.deleteOne({ _id })
  return res.deletedCount > 0
}

module.exports = { list, get, create, edit, destroy }
