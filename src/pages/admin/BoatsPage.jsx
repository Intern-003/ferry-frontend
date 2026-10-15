// src/pages/admin/BoatsPage.jsx
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Ship } from "lucide-react";
import toast from "react-hot-toast";

import { adminApi } from "../../api/public.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";

const EMPTY = {
  name: "",
  type: "ferry",
  booking_mode: "seat_based",
  capacity: 20,
  seat_rows: 4,
  seat_columns: 5,
  description: "",
  tagline: "",
  rating: 4.8,
  status: 1,
};

export default function BoatsPage() {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // boat id when editing
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.boats();
      setBoats(res?.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setImageFile(null);
    setOpen(true);
  };

  const openEdit = (boat) => {
    setEditing(boat.id);
    setForm({
      name: boat.name,
      type: boat.type,
      booking_mode: boat.booking_mode,
      capacity: boat.capacity,
      seat_rows: boat.seat_rows,
      seat_columns: boat.seat_columns,
      description: boat.description || "",
      tagline: boat.tagline || "",
      rating: boat.rating || 4.8,
      status: boat.status ? 1 : 0,
    });
    setImageFile(null);
    setOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await adminApi.updateBoat(editing, fd);
        toast.success("Boat updated");
      } else {
        await adminApi.createBoat(fd);
        toast.success("Boat created");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (boat) => {
    if (!confirm(`Delete "${boat.name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteBoat(boat.id);
      toast.success("Boat deleted");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="section-label">Manage</div>
          <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight">Boats</h1>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus size={16} />}>
          Add Boat
        </Button>
      </div>

      {loading ? (
        <Spinner variant="centered" />
      ) : boats.length === 0 ? (
        <div className="card p-16 text-center">
          <Ship size={48} className="mx-auto text-powder mb-3" />
          <p className="text-navy/60 mb-5">No boats yet.</p>
          <Button onClick={openCreate} leftIcon={<Plus size={16} />}>Add Your First Boat</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {boats.map((boat) => (
            <div key={boat.id} className="card overflow-hidden group">
              <div className="relative h-40 bg-mist">
                {boat.image_url ? (
                  <img src={boat.image_url} alt={boat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Ship size={40} className="text-powder" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <Badge variant={boat.status ? "success" : "danger"} size="sm">
                    {boat.status ? "Active" : "Hidden"}
                  </Badge>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-black text-ink text-lg tracking-tight mb-1">{boat.name}</h3>
                <p className="text-xs text-navy/50 mb-3">
                  {boat.type === "ferry" ? "Ferry" : "Private Boat"} • {boat.capacity} seats
                </p>
                {boat.tagline && (
                  <p className="text-sm text-navy/70 line-clamp-2 mb-4">{boat.tagline}</p>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" leftIcon={<Pencil size={14} />} onClick={() => openEdit(boat)} className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" leftIcon={<Trash2 size={14} />} onClick={() => handleDelete(boat)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Boat" : "Add Boat"}
        subtitle="Fill in boat details. Images and seat layout drive the booking flow."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Boat Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              options={[
                { value: "ferry", label: "Ferry" },
                { value: "private_boat", label: "Private Boat" },
              ]}
            />
          </div>

          <Select
            label="Booking Mode"
            value={form.booking_mode}
            onChange={(e) => setForm({ ...form, booking_mode: e.target.value })}
            options={[
              { value: "seat_based", label: "Seat Based (Ferry)" },
              { value: "charter", label: "Charter (Private Boat)" },
            ]}
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            />
            <Input
              label="Seat Rows"
              type="number"
              min="1"
              value={form.seat_rows}
              onChange={(e) => setForm({ ...form, seat_rows: Number(e.target.value) })}
            />
            <Input
              label="Seats Per Row"
              type="number"
              min="1"
              value={form.seat_columns}
              onChange={(e) => setForm({ ...form, seat_columns: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Tagline"
            placeholder="Short marketing line"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />

          <div>
            <label className="block text-[10px] font-bold text-navy/70 uppercase tracking-[0.15em] mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-powder/60 bg-white text-sm focus:border-steel focus:outline-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}
              options={[
                { value: 1, label: "Active (visible)" },
                { value: 0, label: "Hidden" },
              ]}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-navy/70 uppercase tracking-[0.15em] mb-2">
              Boat Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-ink file:text-white file:font-bold file:cursor-pointer hover:file:bg-navy"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={saving} className="flex-1">
              {editing ? "Save Changes" : "Create Boat"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}