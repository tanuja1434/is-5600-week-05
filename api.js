const path = require('path')
const Products = require('./products')
const Orders = require('./orders')               // <-- add this
const autoCatch = require('./lib/auto-catch')

/** Root */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

/** PRODUCTS */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query
  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })
  res.json(products)
}

async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)
  if (!product) return next()
  res.json(product)
}

async function createProduct(req, res) {
  const created = await Products.create(req.body)
  res.status(201).json(created)
}

async function editProduct(req, res, next) {
  const { id } = req.params
  const updated = await Products.edit(id, req.body)
  if (!updated) return next()
  res.json(updated)
}

async function deleteProduct(req, res) {
  const { id } = req.params
  const ok = await Products.destroy(id)
  res.json({ success: !!ok })
}

/** ORDERS */
async function listOrders(req, res) {
  const { offset = 0, limit = 25 } = req.query
  const orders = await Orders.list({
    offset: Number(offset),
    limit: Number(limit)
  })
  res.json(orders)
}

async function getOrder(req, res, next) {
  const { id } = req.params
  const order = await Orders.get(id)
  if (!order) return next()
  res.json(order)
}

async function createOrder(req, res) {
  const created = await Orders.create(req.body)
  res.status(201).json(created)
}

async function editOrder(req, res, next) {
  const { id } = req.params
  const updated = await Orders.edit(id, req.body)
  if (!updated) return next()
  res.json(updated)
}

async function deleteOrder(req, res) {
  const { id } = req.params
  const ok = await Orders.destroy(id)
  res.json({ success: !!ok })
}

module.exports = autoCatch({
  // root
  handleRoot,

  // products
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,

  // orders
  listOrders,
  getOrder,
  createOrder,
  editOrder,
  deleteOrder
})
