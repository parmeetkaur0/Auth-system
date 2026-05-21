import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight, X, Save, Menu, LogOut } from 'lucide-react';

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  
  const [viewModal, setViewModal] = useState({ isOpen: false, user: null });
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUsers = localStorage.getItem('dashboardUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const initialUsers = [
        { id: 1, name: 'Michael Holz', dateCreated: '04/10/2013', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Paula Wilson', dateCreated: '05/08/2014', role: 'Publisher', status: 'Active' },
        { id: 3, name: 'Antonio Moreno', dateCreated: '11/05/2015', role: 'Publisher', status: 'Suspended' },
        { id: 4, name: 'Mary Saveley', dateCreated: '06/09/2016', role: 'Reviewer', status: 'Active' },
        { id: 5, name: 'Martin Sommer', dateCreated: '12/08/2017', role: 'Moderator', status: 'Inactive' },
        { id: 6, name: 'John Doe', dateCreated: '03/15/2018', role: 'Admin', status: 'Active' },
        { id: 7, name: 'Jane Smith', dateCreated: '07/22/2019', role: 'Publisher', status: 'Active' },
        { id: 8, name: 'Robert Johnson', dateCreated: '09/10/2020', role: 'Reviewer', status: 'Suspended' },
        { id: 9, name: 'Emily Davis', dateCreated: '01/05/2021', role: 'Moderator', status: 'Active' },
        { id: 10, name: 'David Wilson', dateCreated: '08/30/2022', role: 'Admin', status: 'Inactive' },
        { id: 11, name: 'Sarah Brown', dateCreated: '02/14/2023', role: 'Publisher', status: 'Active' },
        { id: 12, name: 'James Taylor', dateCreated: '10/18/2023', role: 'Reviewer', status: 'Active' }
      ];
      setUsers(initialUsers);
      localStorage.setItem('dashboardUsers', JSON.stringify(initialUsers));
    }
  }, []); 

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('dashboardUsers', JSON.stringify(users));
    }
  }, [users]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleView = (user) => {
    setViewModal({ isOpen: true, user });
  };

  const handleEdit = (user) => {
    setEditModal({ isOpen: true, user: { ...user } });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedUsers = users.map(u => 
      u.id === editModal.user.id ? editModal.user : u
    );
    setUsers(updatedUsers);
    setEditModal({ isOpen: false, user: null });
    showToast('User updated successfully!', 'success');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditModal({
      ...editModal,
      user: { ...editModal.user, [name]: value }
    });
  };

  const handleDelete = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const confirmDelete = () => {
    const updatedUsers = users.filter(u => u.id !== deleteModal.user.id);
    setUsers(updatedUsers);
    setDeleteModal({ isOpen: false, user: null });
    showToast('User deleted successfully!', 'error');
    
    const newTotalPages = Math.ceil(updatedUsers.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const filteredData = users.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-green-100 text-green-800',
      'Suspended': 'bg-red-100 text-red-800',
      'Inactive': 'bg-gray-100 text-gray-800'
    };
    return `inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || styles['Inactive']}`;
  };

  const getStatusDot = (status) => {
    const colors = {
      'Active': 'bg-green-500',
      'Suspended': 'bg-red-500',
      'Inactive': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const ViewModal = () => (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">User Details</h2>
          <button onClick={() => setViewModal({ isOpen: false, user: null })}>
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">ID:</span>
            <span className="text-gray-800">{viewModal.user?.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Name:</span>
            <span className="text-gray-800">{viewModal.user?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Date Created:</span>
            <span className="text-gray-800">{viewModal.user?.dateCreated}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Role:</span>
            <span className="text-gray-800">{viewModal.user?.role}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Status:</span>
            <span className={getStatusBadge(viewModal.user?.status)}>
              <span className={`inline-block w-2 h-2 rounded-full ${getStatusDot(viewModal.user?.status)} mr-1.5`}></span>
              {viewModal.user?.status}
            </span>
          </div>
        </div>
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={() => setViewModal({ isOpen: false, user: null })}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const EditModal = () => (
    <div className="fixed inset-0  backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
          <button onClick={() => setEditModal({ isOpen: false, user: null })}>
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <form onSubmit={handleEditSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={editModal.user?.name || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Created</label>
              <input
                type="text"
                name="dateCreated"
                value={editModal.user?.dateCreated || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={editModal.user?.role || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Admin">Admin</option>
                <option value="Publisher">Publisher</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Moderator">Moderator</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={editModal.user?.status || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="p-6 border-t bg-gray-50 flex gap-3">
            <button
              type="button"
              onClick={() => setEditModal({ isOpen: false, user: null })}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const DeleteModal = () => (
    <div className="fixed inset-0  backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 size={32} className="text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Delete User</h2>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete <span className="font-semibold">{deleteModal.user?.name}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteModal({ isOpen: false, user: null })}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-4 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {toast.message}
          </div>
        </div>
      )}

      {viewModal.isOpen && <ViewModal />}
      {editModal.isOpen && <EditModal />}
      {deleteModal.isOpen && <DeleteModal />}

     <div className="bg-white shadow-md px-4 sm:px-6 py-4">
  <div className="flex lg:items-center lg:justify-between gap-4">
    <div className="flex-1">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
        Welcome, <span className="text-indigo-600">{user.name || 'User'}</span>!
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
        User management dashboard
      </p>
    </div>
    
    <div className="flex items-center gap-2">
      <button
        onClick={handleLogout}
        className="hidden lg:flex md:flex bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg items-center justify-center gap-2"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>

      <div className="relative  sm:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-gray-100 text-gray-700"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {mobileMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50">
            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

      <div className="p-4 sm:p-6 max-w-full mx-auto">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, role, or status..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4b567d] focus:border-[#4b567d] outline-none"
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '500px' }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#4b567d] sticky top-0 z-10"> 
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dateCreated}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(item.status)}>
                        <span className={`inline-block w-2 h-2 rounded-full ${getStatusDot(item.status)} mr-1.5`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleView(item)}
                          className="text-blue-600 hover:text-blue-800 transition" 
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-green-600 hover:text-green-800 transition" 
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-800 transition" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found</p>
              </div>
            )}
          </div>

          {filteredData.length > 0 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredData.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredData.length}</span> results
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                    <span className="sr-only">Previous</span>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                            currentPage === page
                              ? 'bg-[#4b567d] text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                    <span className="sr-only">Next</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Active Users</p>
            <p className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Suspended</p>
            <p className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === 'Suspended').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Admins</p>
            <p className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'Admin').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;