const { Cashfree, CFEnvironment } = require("cashfree-pg");
const { AppError } = require("../utils/appError");
const appointmentService=require('../services/appointmentService');
const Order = require('../models/orderModel');
const Appointment = require('../models/appointmentModel');
const User =  require('../models/userModel');
const Service =  require('../models/serviceModel');

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

exports.createOrder = async (req, res) => {
  try {
    const user = req.user;
    const { serviceId, staffId, date, startTime } = req.body;

    if (!serviceId || !staffId || !date || !startTime) {
      throw new AppError("Missing booking details", 400);
    }

    const service = await Service.findByPk(serviceId);
    if (!service) throw new AppError("Service not found", 404);

    const orderId =Math.random().toString(36).substring(2, 15);
    await Order.create({
      orderId,
      userId: user.id,
      email:user.email,
      status: "pending",
      serviceId,
      staffId,
      date,
      startTime
    });

    const expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const paymentRequest = {
      order_id: orderId,
      order_amount:1.00,
      order_currency: "INR",
      customer_details: {
        customer_id: String(user.id),
        customer_email: user.email,
        customer_phone: user.phone || "9999999999"
      },
      order_meta: {
        return_url: `http://localhost:2000/payment-success.html?orderId=${orderId}`
      },
      order_expiry_time: expiryDate
    };

    const response = await cashfree.PGCreateOrder(paymentRequest);
    const paymentSessionId = response?.data?.payment_session_id;

    res.status(200).json({ paymentSessionId });
  } catch (err) {
    console.error("Create Order Error:", err);
    throw new AppError(err.message, 500);
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ where: { orderId } });
    if (!order) throw new AppError("Order not found", 404);

    const paymentResponse = await cashfree.PGOrderFetchPayments(orderId);
    const transactions = paymentResponse.data || [];

    let orderStatus = "failed";
    if (transactions.some(t => t.payment_status === "SUCCESS")) {
      orderStatus = "success";
     const existing = await Appointment.findOne({
        where: {
          userId: order.userId,
          serviceId: order.serviceId,
          staffId: order.staffId,
          date: order.date,
          startTime: order.startTime
        }
      });
      if (!existing) {
        const user = await User.findOne({ where: { email: order.email } });
        await appointmentService.finalizeBooking({
          serviceId: order.serviceId,
          staffId: order.staffId,
          date: order.date,
          startTime: order.startTime,
          user
        });
      }

    } else if (transactions.some(t => t.payment_status === "PENDING")) {
      orderStatus = "pending";
    }

    await Order.update({ status: orderStatus }, { where: { orderId } });
    res.status(200).json({ status: orderStatus });
  } catch (err) {
    console.error("Payment Status Error:", err);
    throw new AppError(err.message, 500);
  }
};
