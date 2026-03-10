"use client";

import React, { useState } from "react";
import { X, Edit, Save, Plus, Trash2 } from "lucide-react";

interface BusinessInfo {
  businessName: string;
  businessType: string;
  registrationNumber: string;
  gstNumber: string;
  panNumber: string;
  businessEmail: string;
  businessPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  logo: string;
  website: string;
  socialMediaLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface ManageBusinessProps {
  onClose?: () => void;
  onSave?: (businessData: BusinessInfo) => void;
}

const ManageBusiness: React.FC<ManageBusinessProps> = ({ onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessInfo>({
    businessName: "Your Business Name",
    businessType: "Retail",
    registrationNumber: "REG123456",
    gstNumber: "27AABCU9603R1Z5",
    panNumber: "ABCDE1234A",
    businessEmail: "business@example.com",
    businessPhone: "+91-9876543210",
    address: "123 Business Street",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560001",
    country: "India",
    logo: "",
    website: "www.yourbusiness.com",
    socialMediaLinks: {
      instagram: "instagram.com/yourbusiness",
      facebook: "facebook.com/yourbusiness",
      twitter: "twitter.com/yourbusiness",
      linkedin: "linkedin.com/company/yourbusiness",
    },
  });

  const [tempData, setTempData] = useState(businessData);

  const handleInputChange = (field: string, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setTempData((prev) => ({
      ...prev,
      socialMediaLinks: { ...prev.socialMediaLinks, [platform]: value },
    }));
  };

  const handleSave = () => {
    setBusinessData(tempData);
    setIsEditing(false);
    onSave?.(tempData);
  };

  const handleCancel = () => {
    setTempData(businessData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Business Management
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-6">
          {/* Business Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {businessData.logo && (
                <div className="md:col-span-1 flex justify-center">
                  <img
                    src={businessData.logo}
                    alt="Business Logo"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
              )}
              <div
                className={
                  businessData.logo ? "md:col-span-2" : "md:col-span-3"
                }
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {businessData.businessName}
                </h3>
                <p className="text-gray-600 mb-4">
                  {businessData.businessType}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-semibold">
                      {businessData.businessEmail}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-semibold">
                      {businessData.businessPhone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">
                Company Information
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">GST Number:</span>
                  <p className="font-semibold">{businessData.gstNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">PAN Number:</span>
                  <p className="font-semibold">{businessData.panNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">Registration:</span>
                  <p className="font-semibold">
                    {businessData.registrationNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Address</h4>
              <div className="text-sm space-y-1">
                <p className="font-semibold">{businessData.address}</p>
                <p className="text-gray-600">
                  {businessData.city}, {businessData.state}{" "}
                  {businessData.zipCode}
                </p>
                <p className="text-gray-600">{businessData.country}</p>
              </div>
            </div>
          </div>

          {/* Online Presence */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">
              Online Presence
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Website:</span>
                <p className="font-semibold text-blue-600">
                  {businessData.website}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Instagram:</span>
                <p className="font-semibold text-blue-600">
                  {businessData.socialMediaLinks.instagram}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Facebook:</span>
                <p className="font-semibold text-blue-600">
                  {businessData.socialMediaLinks.facebook}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Twitter:</span>
                <p className="font-semibold text-blue-600">
                  {businessData.socialMediaLinks.twitter}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setTempData(businessData);
              setIsEditing(true);
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors"
          >
            <Edit size={20} /> Edit Business Information
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Edit Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={tempData.businessName}
                onChange={(e) =>
                  handleInputChange("businessName", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Type
              </label>
              <input
                type="text"
                value={tempData.businessType}
                onChange={(e) =>
                  handleInputChange("businessType", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Email
              </label>
              <input
                type="email"
                value={tempData.businessEmail}
                onChange={(e) =>
                  handleInputChange("businessEmail", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Phone
              </label>
              <input
                type="tel"
                value={tempData.businessPhone}
                onChange={(e) =>
                  handleInputChange("businessPhone", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                GST Number
              </label>
              <input
                type="text"
                value={tempData.gstNumber}
                onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PAN Number
              </label>
              <input
                type="text"
                value={tempData.panNumber}
                onChange={(e) => handleInputChange("panNumber", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={tempData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={tempData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={tempData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                value={tempData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={tempData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 border-t pt-6 mt-6">
              <h4 className="font-semibold text-gray-800 mb-4">
                Social Media Links
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(tempData.socialMediaLinks).map(
                  ([platform, url]) => (
                    <div key={platform}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                        {platform}
                      </label>
                      <input
                        type="url"
                        value={url || ""}
                        onChange={(e) =>
                          handleSocialMediaChange(platform, e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`https://${platform}.com/yourprofile`}
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors"
            >
              <Save size={20} /> Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBusiness;
