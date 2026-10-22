import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import userService, { UserProfile } from '../../services/user.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import ImageUploader from '../../components/ImageUploader';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [photoUploading, setPhotoUploading] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        street: data.address?.street || '',
        city: data.address?.city || '',
        state: data.address?.state || '',
        pincode: data.address?.pincode || '',
      });
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      setSaving(true);
      const updated = await userService.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
      });
      setProfile(updated);
      setSuccessMessage('Your profile information has been saved successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPhoto = async (file: File) => {
    setPhotoUploading(true);
    setErrorMessage(null);
    try {
      const result = await userService.uploadPhoto(file);
      if (profile) {
        setProfile({ ...profile, photo: result.photo });
      }
      setIsPhotoModalOpen(false);
      setSuccessMessage('Profile photo updated successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to upload photo.');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    setPhotoUploading(true);
    setErrorMessage(null);
    try {
      await userService.deletePhoto();
      if (profile) {
        setProfile({ ...profile, photo: null });
      }
      setIsPhotoModalOpen(false);
      setSuccessMessage('Profile photo removed.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to remove photo.');
    } finally {
      setPhotoUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[#7C3AED]">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="font-medium text-sm">Loading your profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#1E293B]">Profile Settings</h1>
        <p className="text-sm text-[#475569] mt-1">
          Manage your personal information, contact address, and account avatar.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Overview Card with Avatar */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#7C3AED]/30 shadow-md bg-[#EDE9FE] flex items-center justify-center">
              {profile?.photo?.url ? (
                <img
                  src={profile.photo.url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-heading font-black text-[#7C3AED]">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="absolute -bottom-1 -right-1 p-2 bg-[#7C3AED] text-white rounded-xl shadow-lg hover:bg-[#6D28D9] transition-transform active:scale-95"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h2 className="text-xl font-heading font-bold text-[#1E293B]">
                {profile?.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDE9FE] text-[#7C3AED] w-fit mx-auto sm:mx-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                {profile?.role || 'Citizen'}
              </span>
            </div>
            <p className="text-sm text-[#64748B] mt-1">{profile?.email}</p>
            <p className="text-xs text-[#475569] mt-2">
              Member since{' '}
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
                    month: 'long',
                    year: 'numeric',
                  })
                : '2026'}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPhotoModalOpen(true)}
            leftIcon={<Camera className="w-4 h-4" />}
          >
            Update Photo
          </Button>
        </div>
      </Card>

      {/* Main Details Form */}
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Contact Info */}
        <Card className="p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E8F0] mb-5">
            <User className="w-5 h-5 text-[#7C3AED]" />
            <div>
              <h3 className="font-heading font-bold text-base text-[#1E293B]">
                Personal & Contact Information
              </h3>
              <p className="text-xs text-[#64748B]">
                Primary contact credentials for notifications and task coordination.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Ananya Sharma"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full px-3 py-2 bg-[#F8F7FC] border border-[#E2E8F0] rounded-lg text-sm text-[#64748B] cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Email cannot be modified directly. Contact administrative support for changes.
              </p>
            </div>

            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              placeholder="10-digit mobile number"
              leftIcon={<Phone className="w-4 h-4 text-[#64748B]" />}
              required
            />

            <div className="flex flex-col justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1.5 py-2.5"
              >
                <KeyRound className="w-4 h-4" />
                Change or reset password
              </Link>
            </div>
          </div>
        </Card>

        {/* Address Details */}
        <Card className="p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E8F0] mb-5">
            <MapPin className="w-5 h-5 text-[#7C3AED]" />
            <div>
              <h3 className="font-heading font-bold text-base text-[#1E293B]">
                Residential / Service Address
              </h3>
              <p className="text-xs text-[#64748B]">
                Default address used when submitting civic reports in your neighborhood.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Street Address / Building"
                value={formData.street}
                onChange={(e) => setFormData((p) => ({ ...p, street: e.target.value }))}
                placeholder="Flat / House No., Street, Landmark"
                required
              />
            </div>

            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
              placeholder="City / Municipality"
              required
            />

            <Input
              label="State"
              value={formData.state}
              onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
              placeholder="State / Union Territory"
              required
            />

            <Input
              label="Pincode"
              value={formData.pincode}
              onChange={(e) => setFormData((p) => ({ ...p, pincode: e.target.value }))}
              placeholder="6-digit PIN"
              required
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={saving}
            leftIcon={<Save className="w-4 h-4" />}
            className="px-6 shadow-sm"
          >
            Save Profile Details
          </Button>
        </div>
      </form>

      {/* Photo Upload Modal */}
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title="Update Profile Photo"
        description="Choose a clear headshot or avatar image (JPEG, PNG, or WebP up to 5MB)."
      >
        <div className="py-2">
          <ImageUploader
            currentImageUrl={profile?.photo?.url}
            onUpload={handleUploadPhoto}
            onRemove={handleDeletePhoto}
            isLoading={photoUploading}
            maxSizeMB={5}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
