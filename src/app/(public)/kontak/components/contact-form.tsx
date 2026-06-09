"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `Halo Rah-MART, saya ingin menghubungi Anda.\n\nNama: ${formData.name}\nEmail: ${formData.email}\nPesan: ${formData.message}`
    );
    window.open(`https://wa.me/6289643483985?text=${whatsappMessage}`, "_blank");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-[#111111]">Nama</Label>
          <Input
            id="name"
            placeholder="Nama lengkap"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="border-[#111111]/10 bg-white focus:border-[#D92820] focus:ring-[#D92820]/20 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-[#111111]">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@contoh.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="border-[#111111]/10 bg-white focus:border-[#D92820] focus:ring-[#D92820]/20 rounded-xl"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium text-[#111111]">Subjek</Label>
        <Input
          id="subject"
          placeholder="Perihal pesan"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
          className="border-[#111111]/10 bg-white focus:border-[#D92820] focus:ring-[#D92820]/20 rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-[#111111]">Pesan</Label>
        <Textarea
          id="message"
          placeholder="Tulis pesan Anda di sini..."
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          className="border-[#111111]/10 bg-white focus:border-[#D92820] focus:ring-[#D92820]/20 rounded-xl resize-none"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full bg-[#D92820] text-white hover:bg-[#D92820]/90 rounded-xl"
      >
        <Send className="mr-2 h-4 w-4" />
        Kirim Pesan
      </Button>
    </form>
  );
}
