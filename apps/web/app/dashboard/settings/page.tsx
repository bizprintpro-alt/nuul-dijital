"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Mail, Lock, Bell, Shield, Trash2, Check, Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";

interface Profile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { domains: number; orders: number; subscriptions: number };
}

export default function UserSettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [tab, setTab] = useState<"profile" | "password" | "email" | "notifications" | "danger">("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Profile fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Password fields
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  // Email fields
  const [newEmail, setNewEmail] = useState("");
  const [emailPwd, setEmailPwd] = useState("");

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deletePwd, setDeletePwd] = useState("");

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setProfile(d.user);
          setName(d.user.name || "");
          setPhone(d.user.phone || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function showMsg(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleUpdateProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_profile", name, phone }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg("success", "Профайл амжилттай шинэчлэгдлээ");
        updateSession({ name });
      } else {
        showMsg("error", data.error);
      }
    } catch {
      showMsg("error", "Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (newPwd !== confirmPwd) {
      showMsg("error", "Шинэ нууц үг таарахгүй байна");
      return;
    }
    if (newPwd.length < 8) {
      showMsg("error", "Нууц үг хамгийн багадаа 8 тэмдэгт");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg("success", "Нууц үг амжилттай солигдлоо");
        setCurrentPwd("");
        setNewPwd("");
        setConfirmPwd("");
      } else {
        showMsg("error", data.error);
      }
    } catch {
      showMsg("error", "Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangeEmail() {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_email", newEmail, password: emailPwd }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg("success", "Имэйл амжилттай солигдлоо. Дахин нэвтэрнэ үү.");
        setTimeout(() => signOut({ callbackUrl: "/auth/signin" }), 2000);
      } else {
        showMsg("error", data.error);
      }
    } catch {
      showMsg("error", "Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "УСТГАХ") {
      showMsg("error", "Баталгаажуулахын тулд 'УСТГАХ' гэж бичнэ үү");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_account", password: deletePwd, confirm: deleteConfirm }),
      });
      const data = await res.json();
      if (data.success) {
        signOut({ callbackUrl: "/" });
      } else {
        showMsg("error", data.error);
      }
    } catch {
      showMsg("error", "Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  }

  // Password strength
  const pwdStrength = (() => {
    if (!newPwd) return 0;
    let s = 0;
    if (newPwd.length >= 8) s++;
    if (/[A-Z]/.test(newPwd)) s++;
    if (/[0-9]/.test(newPwd)) s++;
    if (/[^A-Za-z0-9]/.test(newPwd)) s++;
    return s;
  })();
  const pwdColors = ["bg-red-500", "bg-red-500", "bg-[#FFB02E]", "bg-t", "bg-t"];
  const pwdLabels = ["", "Сул", "Дунд", "Сайн", "Маш сайн"];

  const tabs = [
    { key: "profile" as const, label: "Профайл", icon: User },
    { key: "password" as const, label: "Нууц үг", icon: Lock },
    { key: "email" as const, label: "Имэйл", icon: Mail },
    { key: "notifications" as const, label: "Мэдэгдэл", icon: Bell },
    { key: "danger" as const, label: "Аюултай бүс", icon: AlertTriangle },
  ];

  if (loading) {
    return (
      <div>
        <h1 className="mb-8 font-syne text-2xl font-bold text-txt">Тохиргоо</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-bg-2" />
          ))}
        </div>
      </div>
    );
  }

  const roleBadge: Record<string, { label: string; cls: string }> = {
    ADMIN: { label: "Админ", cls: "bg-v/15 text-v-soft" },
    CLIENT: { label: "Хэрэглэгч", cls: "bg-t/15 text-t" },
    RESELLER: { label: "Reseller", cls: "bg-[#FFB02E]/15 text-[#FFB02E]" },
  };
  const rb = roleBadge[profile?.role || "CLIENT"] || roleBadge.CLIENT;

  return (
    <div>
      <h1 className="mb-2 font-syne text-2xl font-bold text-txt">Тохиргоо</h1>
      <p className="mb-8 text-[13px] text-txt-3">Хувийн мэдээлэл, нууц үг, мэдэгдлийн тохиргоо</p>

      {/* Message */}
      {message && (
        <div className={`mb-6 flex items-center gap-2 rounded-xl border px-4 py-3 text-[13px] ${
          message.type === "success"
            ? "border-t/20 bg-t/5 text-t"
            : "border-red-500/20 bg-red-500/5 text-red-400"
        }`}>
          {message.type === "success" ? <Check size={15} /> : <AlertTriangle size={15} />}
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tabs - left side */}
        <div className="w-full space-y-1 lg:w-56">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-[13px] font-medium transition ${
                tab === t.key
                  ? "bg-v/10 text-v-soft"
                  : t.key === "danger"
                    ? "text-red-400 hover:bg-red-500/5"
                    : "text-txt-2 hover:bg-white/[0.03]"
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content - right side */}
        <div className="flex-1">
          {/* ─── PROFILE TAB ─── */}
          {tab === "profile" && (
            <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
              <h2 className="mb-1 font-syne text-lg font-bold text-txt">Хувийн мэдээлэл</h2>
              <p className="mb-6 text-[12px] text-txt-3">Нэр, утасны дугаар засах</p>

              {/* Role + join date */}
              <div className="mb-6 flex items-center gap-3">
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${rb.cls}`}>{rb.label}</span>
                <span className="text-[11px] text-txt-3">
                  Бүртгүүлсэн: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("mn-MN") : ""}
                </span>
              </div>

              {/* Stats */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/[0.02] p-3 text-center">
                  <div className="font-syne text-lg font-bold text-txt">{profile?._count.domains ?? 0}</div>
                  <div className="text-[10px] text-txt-3">Домэйн</div>
                </div>
                <div className="rounded-xl bg-white/[0.02] p-3 text-center">
                  <div className="font-syne text-lg font-bold text-txt">{profile?._count.orders ?? 0}</div>
                  <div className="text-[10px] text-txt-3">Захиалга</div>
                </div>
                <div className="rounded-xl bg-white/[0.02] p-3 text-center">
                  <div className="font-syne text-lg font-bold text-txt">{profile?._count.subscriptions ?? 0}</div>
                  <div className="text-[10px] text-txt-3">Захиалга</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-txt-2">Нэр</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-txt outline-none focus:border-v/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-txt-2">Утасны дугаар</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+976 9911-2233" className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-txt outline-none placeholder:text-txt-3 focus:border-v/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-txt-2">Имэйл</label>
                  <input value={profile?.email || ""} disabled className="w-full rounded-lg border border-white/[0.04] bg-white/[0.01] px-4 py-2.5 text-sm text-txt-3 opacity-60" />
                  <p className="mt-1 text-[11px] text-txt-3">Имэйл солих бол "Имэйл" таб руу орно уу</p>
                </div>
              </div>
              <button onClick={handleUpdateProfile} disabled={saving} className="mt-6 flex items-center gap-2 rounded-lg bg-v px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-v-dark disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Хадгалах
              </button>
            </div>
          )}

          {/* ─── PASSWORD TAB ─── */}
          {tab === "password" && (
            <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
              <h2 className="mb-1 font-syne text-lg font-bold text-txt">Нууц үг солих</h2>
              <p className="mb-6 text-[12px] text-txt-3">Аюулгүй байдлын үүднээс нууц үгээ тогтмол солих</p>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-txt-2">Одоогийн нууц үг</label>
                  <div className="relative">
                    <input type={showCurrentPwd ? "text" : "password"} value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 pr-10 text-sm text-txt outline-none focus:border-v/30" />
                    <button onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-3">
                      {showCurrentPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-txt-2">Шинэ нууц үг</label>
                  <div className="relative">
                    <input type={showNewPwd ? "text" : "password"} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 pr-10 text-sm text-txt outline-none focus:border-v/30" />
                    <button onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-3">
                      {showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {newPwd && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${i <= pwdStrength ? pwdColors[pwdStrength] : "bg-white/[0.06]"}`} />
                        ))}
                      </div>
                      <span className="mt-1 text-[10px] text-txt-3">{pwdLabels[pwdStrength]}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-txt-2">Шинэ нууц үг давтах</label>
                  <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-txt outline-none focus:border-v/30" />
                  {confirmPwd && confirmPwd !== newPwd && (
                    <p className="mt-1 text-[11px] text-red-400">Нууц үг таарахгүй байна</p>
                  )}
                </div>
              </div>
              <button onClick={handleChangePassword} disabled={saving || !currentPwd || !newPwd || newPwd !== confirmPwd} className="mt-6 flex items-center gap-2 rounded-lg bg-v px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-v-dark disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                Нууц үг солих
              </button>
            </div>
          )}

          {/* ─── EMAIL TAB ─── */}
          {tab === "email" && (
            <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
              <h2 className="mb-1 font-syne text-lg font-bold text-txt">Имэйл хаяг солих</h2>
              <p className="mb-6 text-[12px] text-txt-3">Имэйл солиход дахин нэвтрэх шаардлагатай</p>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-txt-2">Одоогийн имэйл</label>
                  <input value={profile?.email || ""} disabled className="w-full rounded-lg border border-white/[0.04] bg-white/[0.01] px-4 py-2.5 text-sm text-txt-3 opacity-60" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-txt-2">Шинэ имэйл</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@example.com" className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-txt outline-none placeholder:text-txt-3 focus:border-v/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-txt-2">Нууц үг (баталгаажуулах)</label>
                  <input type="password" value={emailPwd} onChange={(e) => setEmailPwd(e.target.value)} className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-txt outline-none focus:border-v/30" />
                </div>
              </div>
              <button onClick={handleChangeEmail} disabled={saving || !newEmail || !emailPwd} className="mt-6 flex items-center gap-2 rounded-lg bg-v px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-v-dark disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                Имэйл солих
              </button>
            </div>
          )}

          {/* ─── NOTIFICATIONS TAB ─── */}
          {tab === "notifications" && (
            <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
              <h2 className="mb-1 font-syne text-lg font-bold text-txt">Мэдэгдлийн тохиргоо</h2>
              <p className="mb-6 text-[12px] text-txt-3">Ямар мэдэгдэл авахыг тохируулах</p>
              <div className="space-y-4">
                {[
                  { label: "Төлбөрийн мэдэгдэл", desc: "Төлбөр амжилттай болсон, нэхэмжлэх", default: true },
                  { label: "Домэйн мэдэгдэл", desc: "Домэйн дуусах сануулга, шинэчлэл", default: true },
                  { label: "Хостинг мэдэгдэл", desc: "Сервер статус, засвар үйлчилгээ", default: true },
                  { label: "Маркетингийн имэйл", desc: "Шинэ үйлчилгээ, хямдрал, зөвлөмж", default: false },
                  { label: "Тикет хариулт", desc: "Дэмжлэгийн тикетэд хариулт ирсэн", default: true },
                  { label: "Блогийн мэдэгдэл", desc: "Шинэ нийтлэл гарсан үед", default: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
                    <div>
                      <div className="text-[13px] font-medium text-txt">{item.label}</div>
                      <div className="text-[11px] text-txt-3">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked={item.default} className="peer sr-only" />
                      <div className="h-5 w-9 rounded-full bg-white/[0.08] transition peer-checked:bg-v peer-focus:outline-none">
                        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <button className="mt-6 flex items-center gap-2 rounded-lg bg-v px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-v-dark">
                <Check size={14} />
                Хадгалах
              </button>
            </div>
          )}

          {/* ─── DANGER ZONE ─── */}
          {tab === "danger" && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <h2 className="mb-1 font-syne text-lg font-bold text-red-400">Аюултай бүс</h2>
              <p className="mb-6 text-[12px] text-txt-3">Эдгээр үйлдлийг буцааж болохгүй</p>

              <div className="rounded-xl border border-red-500/10 bg-bg-2 p-5">
                <h3 className="mb-2 text-[14px] font-semibold text-red-400">Бүртгэл устгах</h3>
                <p className="mb-4 text-[12px] text-txt-3">
                  Таны бүх өгөгдөл, домэйн, хостинг, захиалга бүгд устгагдана. Энэ үйлдлийг буцааж болохгүй!
                </p>
                <div className="mb-3 max-w-sm space-y-3">
                  <div>
                    <label className="mb-1 block text-[11px] text-txt-3">Нууц үг</label>
                    <input type="password" value={deletePwd} onChange={(e) => setDeletePwd(e.target.value)} className="w-full rounded-lg border border-red-500/20 bg-white/[0.02] px-4 py-2 text-sm text-txt outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-txt-3">Баталгаажуулах — "УСТГАХ" гэж бичнэ үү</label>
                    <input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="УСТГАХ" className="w-full rounded-lg border border-red-500/20 bg-white/[0.02] px-4 py-2 text-sm text-txt outline-none placeholder:text-red-400/30" />
                  </div>
                </div>
                <button onClick={handleDeleteAccount} disabled={saving || deleteConfirm !== "УСТГАХ"} className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Бүртгэл устгах
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
