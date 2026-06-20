import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Truck, ShieldCheck, ChevronRight, MapPin, User, Mail, Phone, Lock, Check, Package } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { showToast } from "../helper/toast";

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3C/svg%3E";
const onImgError = (e) => {
  e.target.onerror = null;
  e.target.src = FALLBACK;
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px 11px 40px",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  fontSize: 13,
  outline: "none",
  color: "#333",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
  background: "#fff",
};

const inputPlain = {
  ...inputStyle,
  paddingLeft: 14,
};

const InputWrap = ({ icon: Icon, children }) => (
  <div style={{ position: "relative" }}>
    {Icon && (
      <Icon size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }} />
    )}
    {children}
  </div>
);

const STEPS = ["Shipping", "Payment", "Review"];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { convert, symbol } = useCurrency();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Pakistan",
  });

  const [payment, setPayment] = useState({
    method: "card",
    cardNum: "",
    expiry: "",
    cvv: "",
    name: user?.name || "",
  });

  const subtotal = cartTotal;
  const shipping_fee = subtotal > 100 ? 0 : subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping_fee + tax;

  const setS = (k, v) => setShipping((p) => ({ ...p, [k]: v }));
  const setP = (k, v) => setPayment((p) => ({ ...p, [k]: v }));

  const focusStyle = (e) => (e.target.style.borderColor = "#2563eb");
  const blurStyle = (e) => (e.target.style.borderColor = "#e5e7eb");

  const [finalTotal, setFinalTotal] = useState(0);
  const handlePlace = async () => {
  setFinalTotal(total);
  setPlacing(true);
  try {
    const orderData = {
      orderItems: cart.map(item => ({
        name:      item.name,
        qty:       item.qty,
        image:     item.image,
        price:     item.price,
        product:   item._id,
      })),
      shippingAddress: {
        address:  shipping.address,
        city:     shipping.city,
        state:    shipping.state,
        zip:      shipping.zip,
        country:  shipping.country,
      },
      paymentMethod: payment.method === 'card' ? 'Credit Card' : 'Cash on Delivery',
      itemsPrice:    subtotal,
      taxPrice:      tax,
      shippingPrice: shipping_fee,
      totalPrice:    total,
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${user?.token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Order failed');

    showToast.success("Payment Successful")
    clearCart();
    setDone(true);
  } catch (err) {
    showToast.error(err.message || 'Failed to place order. Please try again.');
  } finally {
    setPlacing(false);
  }
};

  /* ── Order placed ── */
  if (done)
    return (
      <main style={{ minHeight: "calc(100vh - 160px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 40,
            textAlign: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              background: "#f0fdf4",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Check size={36} color="#16a34a" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 8 }}>Order Placed!</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8, lineHeight: 1.6 }}>
            Thank you for your purchase. A confirmation email will be sent to <strong style={{ color: "#555" }}>{shipping.email}</strong>.
          </p>
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #f0f0f0",
              borderRadius: 10,
              padding: "12px 16px",
              margin: "20px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>Order Total</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>
              {symbol} {convert(finalTotal)}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/products"
              style={{
                background: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                padding: "11px 24px",
                borderRadius: 10,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              style={{
                background: "#f9fafb",
                color: "#555",
                fontWeight: 600,
                fontSize: 13,
                padding: "11px 24px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f9fafb")}
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    );

  /* ── Empty cart ── */
  if (cart.length === 0)
    return (
      <main style={{ minHeight: "calc(100vh - 160px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div
          style={{
            maxWidth: 400,
            width: "100%",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 40,
            textAlign: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: "#f3f4f6",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Package size={28} color="#9ca3af" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 8 }}>Your cart is empty</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>Add items to your cart before checking out.</p>
          <Link
            to="/products"
            style={{
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              padding: "11px 24px",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Browse Products
          </Link>
        </div>
      </main>
    );

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 16px" }}>
      {/* Breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af", marginBottom: 20, flexWrap: "wrap" }}>
        <Link
          to="/"
          style={{ color: "#9ca3af", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          to="/cart"
          style={{ color: "#9ca3af", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          Cart
        </Link>
        <ChevronRight size={12} />
        <span style={{ color: "#374151", fontWeight: 500 }}>Checkout</span>
      </nav>

      {/* Step indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          marginBottom: 28,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "14px 24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          flexWrap: "wrap",
        }}
      >
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 12,
                  background: i < step ? "#16a34a" : i === step ? "#2563eb" : "#f3f4f6",
                  color: i <= step ? "#fff" : "#9ca3af",
                  flexShrink: 0,
                }}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: i === step ? 700 : 500, color: i === step ? "#111" : i < step ? "#16a34a" : "#9ca3af" }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: i < step ? "#16a34a" : "#f0f0f0",
                  margin: "0 12px",
                  minWidth: 24,
                  transition: "background 0.3s",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "flex-start" }}>
        {/* ── Left: form ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* STEP 0 — Shipping */}
          {step === 0 && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "#eff6ff",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Truck size={18} color="#2563eb" />
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>Shipping Information</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <InputWrap icon={User}>
                    <input
                      style={inputStyle}
                      placeholder="First name"
                      value={shipping.firstName}
                      onChange={(e) => setS("firstName", e.target.value)}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </InputWrap>
                  <div>
                    <input
                      style={inputPlain}
                      placeholder="Last name"
                      value={shipping.lastName}
                      onChange={(e) => setS("lastName", e.target.value)}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>
                </div>

                <InputWrap icon={Mail}>
                  <input
                    style={inputStyle}
                    type="email"
                    placeholder="Email address"
                    value={shipping.email}
                    onChange={(e) => setS("email", e.target.value)}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </InputWrap>

                <InputWrap icon={Phone}>
                  <input
                    style={inputStyle}
                    placeholder="Phone number"
                    value={shipping.phone}
                    onChange={(e) => setS("phone", e.target.value)}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </InputWrap>

                <InputWrap icon={MapPin}>
                  <input
                    style={inputStyle}
                    placeholder="Street address"
                    value={shipping.address}
                    onChange={(e) => setS("address", e.target.value)}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </InputWrap>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input
                    style={inputPlain}
                    placeholder="City"
                    value={shipping.city}
                    onChange={(e) => setS("city", e.target.value)}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                  <input
                    style={inputPlain}
                    placeholder="State / Province"
                    value={shipping.state}
                    onChange={(e) => setS("state", e.target.value)}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input
                    style={inputPlain}
                    placeholder="ZIP / Postal code"
                    value={shipping.zip}
                    onChange={(e) => setS("zip", e.target.value)}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                  <select
                    style={{ ...inputPlain, cursor: "pointer" }}
                    value={shipping.country}
                    onChange={(e) => setS("country", e.target.value)}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  >
                    {["Pakistan", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "UAE"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={!shipping.firstName || !shipping.email || !shipping.address}
                  style={{
                    width: "100%",
                    background: "#2563eb",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    padding: "12px",
                    borderRadius: 10,
                    border: "none",
                    cursor: !shipping.firstName || !shipping.email || !shipping.address ? "not-allowed" : "pointer",
                    opacity: !shipping.firstName || !shipping.email || !shipping.address ? 0.6 : 1,
                    marginTop: 4,
                    transition: "background 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    if (shipping.firstName && shipping.email) e.currentTarget.style.background = "#1d4ed8";
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
                >
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 1 — Payment */}
          {step === 1 && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "#eff6ff",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CreditCard size={18} color="#2563eb" />
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>Payment Method</h2>
              </div>

              {/* Method selector */}
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                {[
                  { id: "card", label: "Credit / Debit Card" },
                  { id: "cod", label: "Cash on Delivery" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setP("method", m.id)}
                    style={{
                      flex: 1,
                      padding: "10px 8px",
                      borderRadius: 10,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 700,
                      transition: "all 0.15s",
                      border: payment.method === m.id ? "2px solid #2563eb" : "2px solid #e5e7eb",
                      background: payment.method === m.id ? "#eff6ff" : "#fff",
                      color: payment.method === m.id ? "#2563eb" : "#555",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {payment.method === "card" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <InputWrap icon={User}>
                    <input
                      style={inputStyle}
                      placeholder="Cardholder name"
                      value={payment.name}
                      onChange={(e) => setP("name", e.target.value)}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </InputWrap>
                  <InputWrap icon={CreditCard}>
                    <input
                      style={inputStyle}
                      placeholder="Card number (1234 5678 9012 3456)"
                      value={payment.cardNum}
                      maxLength={19}
                      onChange={(e) =>
                        setP(
                          "cardNum",
                          e.target.value
                            .replace(/\D/g, "")
                            .replace(/(.{4})/g, "$1 ")
                            .trim(),
                        )
                      }
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </InputWrap>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <input
                      style={inputPlain}
                      placeholder="MM / YY"
                      value={payment.expiry}
                      maxLength={5}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setP("expiry", v);
                      }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                    <InputWrap icon={Lock}>
                      <input
                        style={inputStyle}
                        placeholder="CVV"
                        value={payment.cvv}
                        maxLength={4}
                        onChange={(e) => setP("cvv", e.target.value.replace(/\D/g, ""))}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </InputWrap>
                  </div>

                  {/* Security note */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: 8,
                      padding: "8px 12px",
                    }}
                  >
                    <ShieldCheck size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "#15803d", fontWeight: 600 }}>Your payment info is encrypted and secure.</span>
                  </div>
                </div>
              )}

              {payment.method === "cod" && (
                <div
                  style={{
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: 10,
                    padding: 16,
                    fontSize: 13,
                    color: "#92400e",
                    lineHeight: 1.6,
                  }}
                >
                  Pay in cash when your order arrives. Our delivery partner will collect the payment at your door.
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => setStep(0)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    color: "#555",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  Back
                </button>
                <button
                  onClick={() => {setStep(2); showToast.success("Payment Added")}}
                  style={{
                    flex: 2,
                    padding: "12px",
                    borderRadius: 10,
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "background 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
                >
                  Review Order <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Review */}
          {step === 2 && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "#eff6ff",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={18} color="#2563eb" />
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>Review Your Order</h2>
              </div>

              {/* Shipping summary */}
              <div style={{ background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Shipping To
                  </span>
                  <button
                    onClick={() => setStep(0)}
                    style={{ fontSize: 11, color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Edit
                  </button>
                </div>
                <p style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
                  {shipping.firstName} {shipping.lastName}
                </p>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>
                  {shipping.address}, {shipping.city}, {shipping.country}
                </p>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>
                  {shipping.email} · {shipping.phone}
                </p>
              </div>

              {/* Payment summary */}
              <div style={{ background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 10, padding: 14, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Payment
                  </span>
                  <button
                    onClick={() => setStep(1)}
                    style={{ fontSize: 11, color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Edit
                  </button>
                </div>
                <p style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
                  {payment.method === "card" ? `Card ending in ${payment.cardNum.slice(-4) || "????"}` : "Cash on Delivery"}
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    color: "#555",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  Back
                </button>
                <button
                  onClick={handlePlace}
                  disabled={placing}
                  style={{
                    flex: 2,
                    padding: "12px",
                    borderRadius: 10,
                    border: "none",
                    background: placing ? "#93c5fd" : "#2563eb",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: placing ? "not-allowed" : "pointer",
                    transition: "background 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    if (!placing) e.currentTarget.style.background = "#1d4ed8";
                  }}
                  onMouseLeave={(e) => {
                    if (!placing) e.currentTarget.style.background = "#2563eb";
                  }}
                >
                  <CreditCard size={15} />
                  {placing ? "Placing Order…" : `Place Order · ${symbol}${convert(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: order summary ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#1f2937", borderRadius: 16, padding: 24, boxShadow: "0 8px 30px rgba(0,0,0,0.2)", position: "sticky", top: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Order Summary</h3>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {cart.map((item) => (
                <div key={item._id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "#fff",
                      borderRadius: 8,
                      overflow: "hidden",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={onImgError}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: 4 }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#fff",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Qty: {item.qty}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    {symbol}
                    {convert(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "16px 0" }} />

            {/* Totals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Subtotal", value: `${symbol}${convert(subtotal)}` },
                { label: "Shipping", value: shipping_fee === 0 ? "FREE" : `${symbol}${convert(shipping_fee)}`, green: shipping_fee === 0 },
                { label: "Tax (8%)", value: `${symbol}${convert(tax)}` },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
                  >
                    {row.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: row.green ? "#4ade80" : "#fff" }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 16 }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Total
              </span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>
                {symbol}
                {convert(total)}
              </span>
            </div>

            {/* Trust */}
            <div
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {[
                { icon: <ShieldCheck size={13} color="#4ade80" />, text: "SSL encrypted checkout" },
                { icon: <Truck size={13} color="#60a5fa" />, text: "Free shipping over $100" },
                { icon: <Check size={13} color="#facc15" />, text: "30-day easy returns" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {t.icon}
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
