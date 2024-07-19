import express from 'express'
import { LoginUser, RegisterUser } from '../controllers/userController.js'
import { createCustomer, deleteCustomerById, getAllCustomers, getAllCustomersNumber, getCustomerByid, updateById } from '../controllers/customerController.js'
import { addProduct, countProducts, deleteProduct, getAllProducts, updateProductById } from '../controllers/productController.js'
import { UpdateByid, addCompanyDetails, getCompanyById, showDetails } from '../controllers/companyController.js'
import { DeleteById, UpdateOrder, addOrder, countAllOrders,  countOrders, findUnpaidCustomerBill, getAllOrders, getOrderById } from '../controllers/orderController.js'
import { addTempOrder, deleteTempOrderById, getAllTempInvoices, getTempById, updateTempOrder } from '../controllers/tempOrderController.js'
import { addPayment, deletePaymentById, findAllPaymnets, findPaymentById } from '../controllers/paymentController.js'

const router = express.Router()

// -------------  THE ADMIN ROUTES ----------
router.post("/register", RegisterUser)
router.post("/login", LoginUser)

// --------------- CUSTOMER ROUTES----------------
router.post('/customer/create', createCustomer)
router.get('/customer/getall', getAllCustomers)
router.get('/customer/findByid/:id', getCustomerByid)
router.get('/customer/countall', getAllCustomersNumber)
router.delete('/customer/deletebyid/:id', deleteCustomerById)
router.put('/customer/updatebyid/:id', updateById)
    
// ------------------- PRODCUT ROUTES--------------------
router.post('/product/add', addProduct)
router.get('/product/getall', getAllProducts)
router.get('/product/countall', countProducts)
router.delete('/product/delete/:id', deleteProduct)
router.put('/product/update/:id', updateProductById)

// ----------------- COMPANY ROUTES ----------------------
router.post('/company/add', addCompanyDetails)
router.put('/company/update/:id', UpdateByid)
router.get('/company/get', showDetails)
router.get('/company/getbyid/:id', getCompanyById)

// ------------ ORDER ROUTES ---------------
router.post('/order/add', addOrder)
router.get('/order/getall', getAllOrders)
router.get('/order/countall', countOrders)
router.get('/order/countInvoice', countAllOrders)
router.get('/order/getbyid/:id', getOrderById)
router.delete('/order/deletebyid/:id', DeleteById)
router.put('/order/updateorder/:id', UpdateOrder)
router.get('/order/customerUnpaid/:id', findUnpaidCustomerBill)


// ------------------ TEMPORARY INVOICES
router.post('/order/temp', addTempOrder)
router.get('/order/getby-id/:id', getTempById)
router.get('/order/get-all', getAllTempInvoices)
router.put('/order/update-temp/:id', updateTempOrder)
router.delete('/order/delete-temp/:id', deleteTempOrderById)


// ------------------------ PAYMENT METHOD
router.post('/order/add-payment', addPayment)
router.get('/order/find-payment/:id', findPaymentById)
router.get('/order/all-payments', findAllPaymnets)
router.delete('/order/delete-payment/:id', deletePaymentById)

export default router
