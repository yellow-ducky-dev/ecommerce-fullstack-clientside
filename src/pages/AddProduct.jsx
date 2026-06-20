import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, Save } from "lucide-react";
import { productService } from "../api/services";
import { showToast } from "../helper/toast";

const CATEGORIES = [
  "Automobiles", "Clothes and wear", "Home interiors", "Computer and tech",
  "Tools, equipments", "Sports and outdoor", "Animal and pets", "Machinery",
];

const inputStyle = {
  width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb",
  borderRadius: 10, fontSize: 13, outline: "none", color: "#333",
  boxSizing: "border-box", transition: "border-color 0.15s", background: "#fff",
};

/* ── Defined OUTSIDE to prevent remount on every render ── */
const Field = ({ label, value, onChange, type = "text", placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af",
      textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
    <input type={type} value={value} placeholder={placeholder} onChange={onChange}
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = "#2563eb"}
      onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
  </div>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages]       = useState([]); // single source of truth for images
  const [form, setForm] = useState({
    name: "", price: "", originalPrice: "", category: CATEGORIES[0],
    brand: "", stock: "", description: "", image: "", featured: false, tags: "",
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  /* ── Compress + convert to base64 ── */
  const compressFile = (file) => new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX) { height = (height * MAX) / width; width = MAX; }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.src = url;
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const base64Arr = await Promise.all(files.map(compressFile));
      setImages(prev => {
        const updated = [...prev, ...base64Arr];
        set("image", updated[0]); // always keep main image in sync
        return updated;
      });
    } catch { showToast.error("Image processing failed"); }
    finally { setUploading(false); }
  };

  const removeImage = (i) => {
    setImages(prev => {
      const updated = prev.filter((_, idx) => idx !== i);
      set("image", updated[0] || "");
      return updated;
    });
  };

  const handleSubmit = async () => {
    const mainImage = images[0] || form.image;
    if (!form.name || !form.price || !mainImage)
      return showToast.warning("Name, price and at least one image are required");
    setSaving(true);
    try {
      await productService.createProduct({
        name:          form.name,
        brand:         form.brand,
        price:         Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock:         Number(form.stock) || 0,
        category:      form.category,
        description:   form.description,
        featured:      form.featured,
        image:         mainImage,
        images:        images.length > 0 ? images : [mainImage],
        tags:          form.tags.split(",").map(t => t.trim()).filter(Boolean),
      });
      showToast.success("Product Created Successfuly")
      navigate("/admin");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to create product");
    } finally { setSaving(false); }
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px",
      display: "flex", flexDirection: "column", gap: 20 }}>

      <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af" }}>
        <Link to="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link>
        <ChevronRight size={12} />
        <Link to="/admin" style={{ color: "#9ca3af", textDecoration: "none" }}>Admin</Link>
        <ChevronRight size={12} />
        <span style={{ color: "#374151", fontWeight: 500 }}>Add Product</span>
      </nav>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16,
        padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 24 }}>Add New Product</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>

          <Field label="Product Name" value={form.name}
            onChange={e => set("name", e.target.value)} placeholder="e.g. iPhone 15 Pro" />

          <Field label="Brand" value={form.brand}
            onChange={e => set("brand", e.target.value)} placeholder="e.g. Apple" />

          <Field label="Price ($)" type="number" value={form.price}
            onChange={e => set("price", e.target.value)} placeholder="99.99" />

          <Field label="Original Price ($)" type="number" value={form.originalPrice}
            onChange={e => set("originalPrice", e.target.value)} placeholder="129.99 (optional)" />

          <Field label="Stock" type="number" value={form.stock}
            onChange={e => set("stock", e.target.value)} placeholder="100" />

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: "0.06em" }}>Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* ── Images ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: "0.06em" }}>Product Images</label>

            {/* Upload area */}
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 20px", borderRadius: 10, border: "2px dashed #e5e7eb",
                background: "#f9fafb", cursor: uploading ? "not-allowed" : "pointer",
                fontSize: 13, fontWeight: 600, color: "#555", width: "fit-content",
                transition: "border-color 0.15s, background 0.15s",
                opacity: uploading ? 0.6 : 1 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.background = "#eff6ff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}>
              {uploading ? "Processing…" : "+ Upload Images"}
              <input type="file" multiple accept="image/*"
                style={{ display: "none" }} disabled={uploading}
                onChange={handleImageUpload} />
            </label>

            <p style={{ fontSize: 11, color: "#aaa", marginTop: -4 }}>
              First image is the main product image. Compressed to 800px / 75% quality. Max 5 recommended.
            </p>

            {/* Previews */}
            {images.length > 0 && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {images.map((url, i) => (
                  <div key={i} style={{ position: "relative", width: 90, height: 90 }}>
                    <div style={{ width: 90, height: 90, background: "#f9fafb", borderRadius: 10,
                      border: i === 0 ? "2px solid #2563eb" : "1px solid #f0f0f0",
                      overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={url} alt={`img-${i}`}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: 6 }} />
                    </div>
                    {i === 0 && (
                      <span style={{ position: "absolute", bottom: 4, left: 4, fontSize: 9,
                        fontWeight: 700, background: "#2563eb", color: "#fff",
                        padding: "1px 5px", borderRadius: 4 }}>MAIN</span>
                    )}
                    <button onClick={() => removeImage(i)}
                      style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20,
                        borderRadius: "50%", background: "#ef4444", color: "#fff", border: "none",
                        cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex",
                        alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* URL fallback */}
            <div>
              <p style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>Or paste a URL instead:</p>
              <input value={form.image}
                onChange={e => {
                  set("image", e.target.value);
                  if (images.length === 0 && e.target.value)
                    setImages([e.target.value]);
                }}
                placeholder="https://images.unsplash.com/..."
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: "0.06em" }}>Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Product description..." rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: "0.06em" }}>Tags (comma separated)</label>
            <input value={form.tags} onChange={e => set("tags", e.target.value)}
              placeholder="e.g. phone, apple, ios" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
          </div>

          {/* Featured */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="featured" checked={form.featured}
              onChange={e => set("featured", e.target.checked)}
              style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }} />
            <label htmlFor="featured" style={{ fontSize: 13, fontWeight: 600,
              color: "#374151", cursor: "pointer" }}>Mark as Featured</label>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          <button onClick={handleSubmit} disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px",
              borderRadius: 10, border: "none", background: saving ? "#93c5fd" : "#2563eb",
              color: "#fff", fontWeight: 700, fontSize: 13,
              cursor: saving ? "not-allowed" : "pointer", transition: "background 0.15s" }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#1d4ed8"; }}
            onMouseLeave={e => { if (!saving) e.currentTarget.style.background = "#2563eb"; }}>
            <Save size={15} /> {saving ? "Saving…" : "Create Product"}
          </button>
          <button onClick={() => navigate("/admin")}
            style={{ padding: "11px 24px", borderRadius: 10, border: "1px solid #e5e7eb",
              background: "#fff", color: "#555", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
};

export default AddProduct;