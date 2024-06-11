import { useState, useEffect } from "react";
import axios from "axios";
import Invoice from "./Invoice";
import StatusUpdateModal from "./StatusUpdateModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);

  useEffect(() => {
    axios
      .get("https://practica-restaurante.vercel.app/api/orders")
      .then((res) => {
        setOrders(res.data);
        setFilteredOrders(res.data);
      })
      .catch((err) => {
        console.log("Error fetching orders: ", err);
      });
  }, []);

  useEffect(() => {
    const results = orders.filter(
      (order) =>
        order.tableName.toLowerCase().includes(search.toLowerCase()) ||
        order.progress.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(results);
  }, [search, orders]);

  const generateInvoice = (order) => {
    const subtotal = order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;

    const invoice = {
      orderName: order.tableName,
      userName: order.username,
      date: order.date,
      time: order.time,
      items: order.items.map((item) => ({
        Producto: item.product,
        Cantidad: item.quantity,
        Precio: item.price,
        TotalBruto: item.quantity * item.price,
      })),
      subtotal,
      iva,
      total,
      orderStatus: order.progress,
    };

    return invoice;
  };

  const handleInvoice = (order) => {
    const invoice = generateInvoice(order);
    setSelectedInvoice(invoice);
    setShowStatusModal(true);
    setOrderToUpdate(order);
  };

  const handleCloseInvoice = () => {
    setSelectedInvoice(null);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order._id === orderId ? { ...order, progress: newStatus } : order
    );
    setOrders(updatedOrders);
    setShowStatusModal(false);
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
  };

  return (
    <div className="container">
      <h1>Órdenes</h1>
      <input
        type="text"
        placeholder="Buscar por la mesa o estado"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="cards">
        {filteredOrders.map((order) => (
          <div
            className={`card ${order.progress === "Completed" ? "completed" : ""}`}
            key={order._id}
          >
            <h2>{order.tableName}</h2>
            <p>Fecha: {order.date}</p>
            <p>Hora: {order.time}</p>
            <p>Usuario: {order.username}</p>
            <p>Estado: {order.progress}</p>
            <p>Total: ${order.totalValue} COP</p>
            <h3>Productos:</h3>
            <ul>
              {order.items.map((item) => (
                <li key={item._id}>
                  {item.quantity} x {item.product} - ${item.price} COP
                </li>
              ))}
            </ul>
            <button className="invoice-button" onClick={() => handleInvoice(order)}>Facturar</button>
          </div>
        ))}
      </div>
      {selectedInvoice && (
        <Invoice invoice={selectedInvoice} onClose={handleCloseInvoice} />
      )}
      {showStatusModal && orderToUpdate && (
        <StatusUpdateModal
          order={orderToUpdate}
          onUpdateStatus={handleUpdateStatus}
          onClose={handleCloseStatusModal}
        />
      )}
    </div>
  );
};

export default Orders;
