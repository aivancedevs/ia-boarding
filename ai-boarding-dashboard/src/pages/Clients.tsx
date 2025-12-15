import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail } from 'lucide-react';
import { Table } from '@/components/common/Table';
import { Modal } from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { getClients, createClient, updateClient, deleteClient } from '@/api/clientsApi';
import { Client, CreateClientDto, UpdateClientDto, TableColumn } from '@/types';
import { getErrorMessage, formatDate } from '@/utils/helpers';

export const Clients = () => {
  const { success, error: showError } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<CreateClientDto>({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      setClients(data);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedClient) {
        await updateClient(selectedClient.id, formData);
        success('Cliente actualizado correctamente');
      } else {
        await createClient(formData);
        success('Cliente creado correctamente');
      }
      setIsModalOpen(false);
      loadClients();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const handleDelete = async (client: Client) => {
    if (!window.confirm(`¿Estás seguro de eliminar al cliente ${client.name}?`)) {
      return;
    }
    try {
      await deleteClient(client.id);
      success('Cliente eliminado correctamente');
      loadClients();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const columns: TableColumn<Client>[] = [
    { key: 'name', label: 'Nombre' },
    {
      key: 'email',
      label: 'Email',
      render: (client) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>{client.email}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Teléfono',
      render: (client) =>
        client.phone ? (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{client.phone}</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (client) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            client.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {client.isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha de Creación',
      render: (client) => formatDate(client.createdAt),
    },
    {
      key: 'id',
      label: 'Acciones',
      render: (client) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(client)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(client)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-2 text-gray-600">Gestiona los clientes del sistema</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={clients} />
      </div>

      {/* Modal Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedClient ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+54 11 1234-5678"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {selectedClient ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};