import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Building2 } from 'lucide-react';
import { Table } from '@/components/common/Table';
import { Modal } from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/api/projectsApi';
import { getClients } from '@/api/clientsApi';
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  TableColumn,
  Client,
} from '@/types';
import { getErrorMessage, formatDate } from '@/utils/helpers';
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '@/utils/constants';

// ============================================================================
// INITIAL FORM STATE
// ============================================================================

const getInitialFormData = (clientId?: number): CreateProjectDto => ({
  name: '',
  description: '',
  clientId: clientId || 0,
  status: 'PENDING',
  startDate: '',
  endDate: '',
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Projects = () => {
  const { success, error: showError } = useToast();

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<CreateProjectDto>(getInitialFormData());

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, clientsData] = await Promise.all([
        getProjects(),
        getClients(),
      ]);
      setProjects(projectsData);
      setClients(clientsData);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // MODAL HANDLERS
  // ============================================================================

  const openCreateModal = () => {
    setSelectedProject(null);
    setFormData(getInitialFormData(clients[0]?.id));
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      clientId: project.clientId,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setFormData(getInitialFormData());
  };

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.clientId || formData.clientId === 0) {
      showError('Debes seleccionar un cliente');
      return;
    }

    try {
      if (selectedProject) {
        await updateProject(selectedProject.id, formData);
        success('Proyecto actualizado correctamente');
      } else {
        await createProject(formData);
        success('Proyecto creado correctamente');
      }
      closeModal();
      await loadData();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el proyecto "${project.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      await deleteProject(project.id);
      success('Proyecto eliminado correctamente');
      await loadData();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  // ============================================================================
  // TABLE COLUMNS CONFIGURATION
  // ============================================================================

  const columns: TableColumn<Project>[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (project) => (
        <span className="font-medium text-gray-900">{project.name}</span>
      ),
    },
    {
      key: 'clientName',
      label: 'Cliente',
      render: (project) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{project.clientName || '-'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (project) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            PROJECT_STATUS_COLORS[project.status]
          }`}
        >
          {PROJECT_STATUS_LABELS[project.status]}
        </span>
      ),
    },
    {
      key: 'startDate',
      label: 'Fecha de Inicio',
      render: (project) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(project.startDate)}</span>
        </div>
      ),
    },
    {
      key: 'endDate',
      label: 'Fecha de Fin',
      render: (project) =>
        project.endDate ? (
          <span className="text-gray-600">{formatDate(project.endDate)}</span>
        ) : (
          <span className="text-gray-400 italic">Sin definir</span>
        ),
    },
    {
      key: 'id',
      label: 'Acciones',
      render: (project) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(project)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar proyecto"
            aria-label="Editar proyecto"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(project)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar proyecto"
            aria-label="Eliminar proyecto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
          <p className="mt-2 text-gray-600">
            Gestiona los proyectos del sistema ({projects.length} total
            {projects.length !== 1 ? 'es' : ''})
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={clients.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={clients.length === 0 ? 'Primero debes crear un cliente' : 'Crear nuevo proyecto'}
        >
          <Plus className="w-5 h-5" />
          Nuevo Proyecto
        </button>
      </div>

      {/* No clients warning */}
      {clients.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>Atención:</strong> No hay clientes disponibles. Debes crear al menos un cliente antes de crear proyectos.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          columns={columns}
          data={projects}
          emptyMessage="No hay proyectos disponibles. ¡Crea tu primer proyecto!"
        />
      </div>

      {/* Modal Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      >
        <ProjectForm
          formData={formData}
          setFormData={setFormData}
          clients={clients}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isEditing={!!selectedProject}
        />
      </Modal>
    </div>
  );
};

// ============================================================================
// PROJECT FORM COMPONENT
// ============================================================================

interface ProjectFormProps {
  formData: CreateProjectDto;
  setFormData: (data: CreateProjectDto) => void;
  clients: Client[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const ProjectForm = ({
  formData,
  setFormData,
  clients,
  onSubmit,
  onCancel,
  isEditing,
}: ProjectFormProps) => {
  const handleChange = (
    field: keyof CreateProjectDto,
    value: string | number
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Project Name */}
      <div>
        <label
          htmlFor="project-name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nombre del Proyecto <span className="text-red-500">*</span>
        </label>
        <input
          id="project-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Ej: Sistema de Gestión"
          required
          maxLength={100}
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="project-description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Descripción
        </label>
        <textarea
          id="project-description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          placeholder="Describe brevemente el proyecto..."
          rows={3}
          maxLength={500}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.description?.length || 0}/500 caracteres
        </p>
      </div>

      {/* Client */}
      <div>
        <label
          htmlFor="project-client"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Cliente <span className="text-red-500">*</span>
        </label>
        <select
          id="project-client"
          value={formData.clientId}
          onChange={(e) => handleChange('clientId', Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
        >
          <option value="">-- Seleccionar cliente --</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="project-status"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Estado <span className="text-red-500">*</span>
        </label>
        <select
          id="project-status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
        >
          {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="project-start-date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de Inicio <span className="text-red-500">*</span>
          </label>
          <input
            id="project-start-date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label
            htmlFor="project-end-date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de Fin
          </label>
          <input
            id="project-end-date"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            min={formData.startDate}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </button>
      </div>
    </form>
  );
};