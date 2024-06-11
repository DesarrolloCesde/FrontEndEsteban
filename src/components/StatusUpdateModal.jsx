import PropTypes from 'prop-types';
import { useState } from 'react';

const StatusUpdateModal = ({ order, onUpdateStatus, onClose }) => {
  const [newStatus, setNewStatus] = useState(order.progress);

  const handleUpdate = () => {
    onUpdateStatus(order._id, newStatus);
    onClose();
  };

  return (
    <div className="status-update-modal">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">
          &times;
        </button>
        <h2>Actualizar Estado del Pedido</h2>
        <p>Mesa: {order.tableName}</p>
        <p>Estado Actual: {order.progress}</p>
        <label htmlFor="newStatus">Nuevo Estado:</label>
        <select
          id="newStatus"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="Pending">Pendiente</option>
          <option value="In Progress">En Progreso</option>
          <option value="Completed">Completado</option>
        </select>
        <button onClick={handleUpdate} className="update-button">
          Actualizar
        </button>
      </div>
    </div>
  );
};

StatusUpdateModal.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    tableName: PropTypes.string.isRequired,
    progress: PropTypes.string.isRequired,
  }).isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StatusUpdateModal;
