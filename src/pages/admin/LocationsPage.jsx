// src/pages/admin/LocationsPage.jsx
import { useEffect, useState } from "react";
import { Plus, Trash2, MapPin, Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { adminApi } from "../../api/public.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";

export default function LocationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", status: 1 });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.locations();
      setItems(res?.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createLocation(form);
      toast.success("Location created");
      setOpen(false);
      setForm({ name: "", status: 1 });
      load();
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach((m) => toast.error(m));
      else toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (loc) => {
    if (!confirm(`Delete "${loc.name}"?`)) return;
    try {
      await adminApi.deleteLocation(loc.id);
      toast.success("Location deleted");
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
          <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight">Locations</h1>
        </div>
        <Button onClick={() => setOpen(true)} leftIcon={<Plus size={16} />}>
          Add Location
        </Button>
      </div>

      {loading ? (
        <Spinner variant="centered" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((loc) => (
            <div key={loc.id} className="card p-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-mist flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-steel" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-ink truncate">{loc.name}</div>
                  <div className="text-[11px] text-navy/50">/{loc.slug}</div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(loc)}
                className="p-2 rounded-lg text-crimson hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Add Location"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Location Name *"
            placeholder="e.g. Port Blair"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={saving} className="flex-1">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}