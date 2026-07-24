import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

import AdminLayout from '../../components/layout/AdminLayout';
import Modal from '../../components/ui/Modal';

import { useTenant } from '../../contexts/TenantContext';
import {
  subscribeToCars,
  addCar,
  updateCar,
  deleteCar,
} from '../../firebase/firestore';
import { seedInitialCars } from '../../firebase/seedData';
import { formatCurrency } from '../../utils/formatCurrency';

export default function AdminCars() {
  const { tenantId } = useTenant();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const initialFormState = {
    name: '',
    brand: '',
    category: 'hatchback',
    imagesText: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    transmission: 'manual',
    fuelType: 'petrol',
    seats: 5,
    pricePerHour: 99,
    pricePerDay: 1499,
    pricePerMonth: 28000,
    securityDeposit: 2000,
    features: ['Air Conditioner', 'Bluetooth Music', 'ABS Brakes'],
    citiesAvailable: ['Mumbai', 'Delhi NCR', 'Bangalore'],
    isActive: true,
    rating: 4.8,
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToCars(tenantId, (data) => {
      setCars(data);
      setLoading(false);
    });
    return () => unsub();
  }, [tenantId]);

  const handleOpenAdd = () => {
    setEditingCar(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (car) => {
    setEditingCar(car);
    setFormData({
      ...car,
      imagesText: (car.images || []).join('\n'),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (carId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteCar(tenantId, carId);
      toast.success('Car removed from fleet');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete car');
    }
  };

  const handleToggleActive = async (car) => {
    try {
      await updateCar(tenantId, car.id, { isActive: !car.isActive });
      toast.success(`${car.name} status updated`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const imageUrls = formData.imagesText
      .split('\n')
      .map(url => url.trim())
      .filter(Boolean);

    const carDataPayload = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      images: imageUrls.length > 0 ? imageUrls : [initialFormState.imagesText],
      transmission: formData.transmission,
      fuelType: formData.fuelType,
      seats: Number(formData.seats),
      pricePerHour: Number(formData.pricePerHour),
      pricePerDay: Number(formData.pricePerDay),
      pricePerMonth: Number(formData.pricePerMonth),
      securityDeposit: Number(formData.securityDeposit),
      features: formData.features,
      citiesAvailable: formData.citiesAvailable,
      isActive: Boolean(formData.isActive),
      rating: Number(formData.rating) || 4.8,
      description: formData.description,
    };

    try {
      if (editingCar) {
        await updateCar(tenantId, editingCar.id, carDataPayload);
        toast.success('Car updated successfully');
      } else {
        await addCar(tenantId, carDataPayload);
        toast.success('New car added to fleet');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save car');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeed = async () => {
    try {
      const res = await seedInitialCars(tenantId);
      if (res.seeded) {
        toast.success(`Seeded ${res.count} sample cars!`);
      } else {
        toast.info('Fleet already contains cars.');
      }
    } catch (err) {
      toast.error('Failed to seed sample cars');
    }
  };

  const filteredCars = cars.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, margin: 0, color: 'var(--color-text)' }}>Fleet Management</h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-2)', marginTop: 2 }}>
              Scope: <strong>{tenantId}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSeed} className="btn btn-secondary btn-sm">
              <FiRefreshCw /> Seed Cars
            </button>
            <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
              <FiPlus /> Add Vehicle
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="glass-card" style={{ padding: 14, background: '#FFFFFF' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: 11, color: 'var(--color-text-3)' }} />
            <input
              type="text"
              placeholder="Search by vehicle name, brand, category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 36, height: 38 }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ padding: 20, background: '#FFFFFF' }}>
          {loading ? (
            <p style={{ color: 'var(--color-text-2)', fontSize: 13 }}>Loading fleet...</p>
          ) : filteredCars.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏎️</div>
              <div className="empty-state-title">No vehicles found</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Category</th>
                    <th>Transmission / Fuel</th>
                    <th>Hourly / Daily</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={c.images?.[0] || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'}
                            alt=""
                            style={{ width: 44, height: 32, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                          />
                          <div>
                            <strong style={{ color: 'var(--color-text)', display: 'block' }}>{c.name}</strong>
                            <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{c.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${c.category === 'suv' ? 'badge-warning' : c.category === 'premium' ? 'badge-success' : 'badge-accent'}`}>
                          {c.category ? c.category.toUpperCase() : 'CAR'}
                        </span>
                      </td>
                      <td>
                        <span style={{ textTransform: 'capitalize', fontSize: 13 }}>{c.transmission} • {c.fuelType}</span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--color-accent)' }}>{formatCurrency(c.pricePerDay)}/day</strong>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleActive(c)}
                          className={`badge ${c.isActive !== false ? 'badge-success' : 'badge-error'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          {c.isActive !== false ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-icon" onClick={() => handleOpenEdit(c)}>
                            <FiEdit2 size={13} />
                          </button>
                          <button className="btn-icon" onClick={() => handleDelete(c.id, c.name)} style={{ color: 'var(--color-error)' }}>
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCar ? `Edit ${editingCar.name}` : 'Add New Vehicle'}
        maxWidth={640}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="grid-2" style={{ gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Car Model Name *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brand *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-3" style={{ gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="hatchback">Hatchback</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV & 4x4</option>
                <option value="premium">Luxury & Sports</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transmission</label>
              <select
                className="form-select"
                value={formData.transmission}
                onChange={e => setFormData({ ...formData, transmission: e.target.value })}
              >
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fuel Type</label>
              <select
                className="form-select"
                value={formData.fuelType}
                onChange={e => setFormData({ ...formData, fuelType: e.target.value })}
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="cng">CNG</option>
              </select>
            </div>
          </div>

          <div className="grid-3" style={{ gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Hourly (₹)</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.pricePerHour}
                onChange={e => setFormData({ ...formData, pricePerHour: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Daily (₹)</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.pricePerDay}
                onChange={e => setFormData({ ...formData, pricePerDay: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deposit (₹)</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.securityDeposit}
                onChange={e => setFormData({ ...formData, securityDeposit: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URLs (One per line)</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={formData.imagesText}
              onChange={e => setFormData({ ...formData, imagesText: e.target.value })}
            />
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
            {submitting ? 'Saving...' : editingCar ? 'Update Vehicle' : 'Add Vehicle to Fleet'}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
}
