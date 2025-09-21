 const express = require('express')
 const api = require('./api')
 const middleware = require('./middleware')
 const bodyParser = require('body-parser')

 // Set the port
 const port = process.env.PORT || 3000
 // Boot the app
 const app = express()
 // Register the public directory
 app.use(express.static(__dirname + '/public'));
 // register the routes
 app.use(bodyParser.json())
 app.use(middleware.cors)
 app.get('/', api.handleRoot)

 // Products
 app.get('/products', api.listProducts)
 app.get('/products/:id', api.getProduct)
 app.put('/products/:id', api.editProduct)
 app.delete('/products/:id', api.deleteProduct)
 app.post('/products', api.createProduct)

+// Orders (add these)
+app.get('/orders', api.listOrders)        // list all orders
+app.post('/orders', api.createOrder)      // create a new order
+app.get('/orders/:id', api.getOrder)      // fetch a single order
+app.put('/orders/:id', api.editOrder)     // update an order
+app.delete('/orders/:id', api.deleteOrder) // delete an order
+
 // Boot the server
 app.listen(port, () => console.log(`Server listening on port ${port}`))
 // app.js
app.get('/health', (req, res) => res.json({ ok: true }))
// JSON error handler (keep as the last middleware)
app.use((err, req, res, next) => {
  console.error('[api error]', err); // prints full stack to your server console
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});
// JSON error handler (must be after routes)
app.use((err, req, res, next) => {
  console.error('[api error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});


