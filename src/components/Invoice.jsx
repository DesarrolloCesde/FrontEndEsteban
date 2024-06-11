import PropTypes from 'prop-types';
import {useState} from 'react';

const Invoice = ({ invoice, onClose, onUpdateStatus }) => {
  
  const [newStatus, SetNewStatus] = useState(invoice.orderStatus);

  const handlePrint = () => {
    try {
      const printContent = document.getElementById("invoice-content");
      const WinPrint = window.open("", "", "width=900,height=650");
      WinPrint.document.write(printContent.innerHTML);
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    } catch (error) {
      console.error("Error al imprimir la factura:", error);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    SetNewStatus(newStatus);
    onUpdateStatus(invoice.orderId, newStatus);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="invoice-modal">
      <div className="invoice-content" id="invoice-content">
        <button onClick={handleClose} className="close-button">
          &times;
        </button>
        <h2>Factura para {invoice.orderName}</h2>
        <ul>
          {invoice.items.map((item, index) => (
            <li key={index}>
              {item.Cantidad} x {item.Producto} - ${item.Precio.toFixed(2)} COP = $
              {item.TotalBruto.toFixed(2)} COP
            </li>
          ))}
        </ul>
        <p>Subtotal: ${invoice.subtotal.toFixed(2)} COP</p>
        <p>IVA (19%): ${invoice.iva.toFixed(2)} COP</p>
        <p>Total: ${invoice.total.toFixed(2)} COP</p>
        <div className="status-update">
          <label htmlFor="newStatus">Actualizar Estado:</label>
          <select
            id="newStatus"
            value={newStatus}
            onChange={handleStatusChange}
          >
            <option value="Pending">Pendiente</option>
            <option value="In Progress">En Progreso</option>
            <option value="Completed">Completado</option>
          </select>
        </div>
        <button onClick={handlePrint} className="invoice-button">Imprimir</button>
      </div>
    </div>
  );
};

Invoice.propTypes = {
  invoice: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    orderName: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        Producto: PropTypes.string.isRequired,
        Cantidad: PropTypes.number.isRequired,
        Precio: PropTypes.number.isRequired,
        TotalBruto: PropTypes.number.isRequired,
      })
    ).isRequired,
    subtotal: PropTypes.number.isRequired,
    iva: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    orderStatus: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
};

export default Invoice;
