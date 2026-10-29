<template>
  <footer class="bg-white border-t border-slate-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <!-- Tournament Info -->
        <div class="md:col-span-2 space-y-4">
          <div class="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Punjab Village Cricket Council Logo" 
              class="h-10 sm:h-12 w-auto object-contain shrink-0" 
            />
            <div>
              <h3 class="font-extrabold text-slate-900 tracking-tight text-base">Punjab Village Cricket Council</h3>
              <p class="text-xs text-slate-500 font-medium">Championship Season 35 — Official Portal</p>
            </div>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed max-w-md">
            The premier rural and grassroots cricket tournament council. Dedicated to discovering and promoting regional athletic talent through structured, official cricket competitions.
          </p>
          <div class="flex items-center gap-4 text-xs text-slate-500">
            <span class="inline-flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Registration Open
            </span>
            <span>•</span>
            <span>Venue: District Jhang Ground</span>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900">Tournament Links</h4>
          <ul class="space-y-2 text-xs">
            <li>
              <router-link to="/" class="text-slate-600 hover:text-cricket-700 transition-colors">Tournament Rules</router-link>
            </li>
            <li>
              <router-link to="/register" class="text-slate-600 hover:text-cricket-700 transition-colors">Team Registration</router-link>
            </li>
            <li>
              <router-link to="/teams" class="text-slate-600 hover:text-cricket-700 transition-colors">Enrolled Teams</router-link>
            </li>
            <li>
              <router-link to="/login" class="text-slate-600 hover:text-cricket-700 transition-colors">Captain Portal</router-link>
            </li>
          </ul>
        </div>

        <!-- Official Contact & Verification -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900">Organizing Committee</h4>
          <p class="text-xs text-slate-600">
            For payment confirmation, fixture queries, or tournament support, contact the management desk:
          </p>
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div class="font-semibold text-slate-800">Helpline / WhatsApp</div>
            <div class="text-emerald-700 font-bold">+92 300 1234567</div>
            <div class="text-[11px] text-slate-500">09:00 AM – 09:00 PM (PKT)</div>
          </div>
        </div>

      </div>

      <div class="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Punjab Village Cricket Council. All rights reserved.</p>
        <p class="text-slate-400">Strictly for amateur tournament management. Official registration system.</p>
      </div>
    </div>
  </footer>
</template>
