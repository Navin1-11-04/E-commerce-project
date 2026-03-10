"use client";

import React, { useState } from "react";
import { X, Plus, Edit, Trash2, Copy, Check } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  minPurchaseAmount: number;
  status: "active" | "inactive" | "expired";
  createdAt: string;
}

interface CouponManagementProps {
  onClose?: () => void;
}

const CouponManagement: React.FC<CouponManagementProps> = ({ onClose }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "1",
      code: "SAVE20",
      discountType: "percentage",
      discountValue: 20,
      expiryDate: "2026-05-31",
      usageLimit: 100,
      usageCount: 45,
      minPurchaseAmount: 500,
      status: "active",
      createdAt: "2026-01-15",
    },
    {
      id: "2",
      code: "FLAT500",
      discountType: "fixed",
      discountValue: 500,
      expiryDate: "2026-04-30",
      usageLimit: 50,
      usageCount: 32,
      minPurchaseAmount: 2000,
      status: "active",
      createdAt: "2026-02-01",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as const,
    discountValue: 0,
    expiryDate: "",
    usageLimit: 0,
    minPurchaseAmount: 0,
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCoupon = () => {
    if (!formData.code.trim()) {
      alert("Please enter a coupon code");
      return;
    }

    if (editingId) {
      setCoupons(
        coupons.map((c) =>
          c.id === editingId
            ? {
                ...c,
                code: formData.code,
                discountType: formData.discountType,
                discountValue: formData.discountValue,
                expiryDate: formData.expiryDate,
                usageLimit: formData.usageLimit,
                minPurchaseAmount: formData.minPurchaseAmount,
              }
            : c,
        ),
      );
      setEditingId(null);
    } else {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: formData.code,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        expiryDate: formData.expiryDate,
        usageLimit: formData.usageLimit,
        usageCount: 0,
        minPurchaseAmount: formData.minPurchaseAmount,
        status:
          new Date(formData.expiryDate) > new Date() ? "active" : "expired",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCoupons([...coupons, newCoupon]);
    }

    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      expiryDate: "",
      usageLimit: 0,
      minPurchaseAmount: 0,
    });
    setShowForm(false);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      expiryDate: coupon.expiryDate,
      usageLimit: coupon.usageLimit,
      minPurchaseAmount: coupon.minPurchaseAmount,
    });
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const handleDeleteCoupon = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(coupons.filter((c) => c.id !== id));
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDiscount = (coupon: Coupon) => {
    return coupon.discountType === "percentage"
      ? `${coupon.discountValue}%`
      : `₹${coupon.discountValue}`;
  };

  const usagePercentage = (coupon: Coupon) => {
    return coupon.usageLimit > 0
      ? (coupon.usageCount / coupon.usageLimit) * 100
      : 0;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Coupon Management</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {!showForm ? (
        <>
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            <Plus size={20} /> Create New Coupon
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {coupon.code}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        coupon.status === "active"
                          ? "bg-green-100 text-green-800"
                          : coupon.status === "expired"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {coupon.status.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                  >
                    {copiedCode === coupon.code ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-semibold">
                      {formatDiscount(coupon)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min. Purchase:</span>
                    <span className="font-semibold">
                      ₹{coupon.minPurchaseAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires:</span>
                    <span className="font-semibold">{coupon.expiryDate}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Usage:</span>
                    <span className="font-semibold">
                      {coupon.usageCount}/{coupon.usageLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(usagePercentage(coupon), 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCoupon(coupon)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-semibold"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-semibold"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Coupon" : "Create New Coupon"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Coupon Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  handleInputChange("code", e.target.value.toUpperCase())
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., SAVE20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount Type
              </label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  handleInputChange(
                    "discountType",
                    e.target.value as "percentage" | "fixed",
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount Value
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) =>
                  handleInputChange("discountValue", parseFloat(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) =>
                  handleInputChange("usageLimit", parseInt(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min. Purchase Amount
              </label>
              <input
                type="number"
                value={formData.minPurchaseAmount}
                onChange={(e) =>
                  handleInputChange(
                    "minPurchaseAmount",
                    parseFloat(e.target.value),
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddCoupon}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors"
            >
              {editingId ? "Update Coupon" : "Create Coupon"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({
                  code: "",
                  discountType: "percentage",
                  discountValue: 0,
                  expiryDate: "",
                  usageLimit: 0,
                  minPurchaseAmount: 0,
                });
              }}
              className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
