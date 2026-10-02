<template>
  <figure class="relative w-fit">
    <!-- Card decorativo do Hero no formato de um arquivo de código. O destaque de
         sintaxe é estático: o trecho é fixo, não precisa do highlighter do servidor. -->
    <!-- Segundo card atrás do principal, oscilando em loop. -->
    <div
      class="absolute inset-0 rounded-2xl bg-linear-to-tr from-blue-700/20 to-blue-700/5 blur-[1px] motion-safe:animate-hero-sway"
      aria-hidden="true" />

    <div
      class="relative rounded-2xl border-3 border-white/10 bg-[#0d111f] p-6 text-left shadow-[0_0_30px_rgba(59,130,246,0.1)] backdrop-blur-sm transition-[translate,box-shadow] duration-200 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_0_40px_rgba(59,130,246,0.15)] motion-safe:hover:-translate-y-1.25">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex gap-2" aria-hidden="true">
          <span class="size-3 rounded-full bg-red-500" />
          <span class="size-3 rounded-full bg-yellow-500" />
          <span class="size-3 rounded-full bg-green-500" />
        </div>
        <figcaption class="text-xs text-slate-400">
          developer.js
        </figcaption>
      </div>

      <!-- Uma linha por bloco para que as propriedades possam entrar uma a uma. -->
      <code class="block space-y-2 whitespace-nowrap font-mono text-xs text-slate-400 xl:text-sm">
        <span class="block">// Full-Stack Developer</span>
        <span class="block"><span class="text-pink-400">const</span> <span class="text-blue-400">developer</span> = <span class="text-orange-400">{</span></span>
        <span class="block pl-6 motion-safe:animate-hero-line-in motion-safe:[animation-delay:1.4s]"><span class="text-purple-400">nickname</span>: <span class="text-green-400">'Shin'</span>,</span>
        <span class="block pl-6 motion-safe:animate-hero-line-in motion-safe:[animation-delay:1.6s]"><span class="text-purple-400">keySkills</span>: <span class="text-orange-400">[</span><span class="text-green-400">'Node.js'</span>, <span class="text-green-400">'Vue'</span>, <span class="text-green-400">'React'</span>, <span class="text-green-400">'TypeScript'</span><span class="text-orange-400">]</span>,</span>
        <span class="block pl-6 motion-safe:animate-hero-line-in motion-safe:[animation-delay:1.8s]"><span class="text-purple-400">focuses</span>: <span class="text-orange-400">[</span><span class="text-green-400">'Full-Stack'</span>, <span class="text-green-400">'UI/UX'</span>, <span class="text-green-400">'IA'</span><span class="text-orange-400">]</span>,</span>

        <span class="block pl-6 motion-safe:animate-hero-line-in motion-safe:[animation-delay:1.8s]"><span class="text-purple-400">hobby</span>: <span class="text-orange-400">[</span><span class="text-green-400">'Music'</span>,<span class="text-green-400">'Rebuilding things'</span><span class="text-orange-400">]</span>,</span>

        <span class="block pl-6 motion-safe:animate-hero-line-in motion-safe:[animation-delay:2s]"><span class="text-purple-400">learning</span>: <span class="text-green-400">'Constantly'</span></span>
        <span class="block"><span class="text-orange-400">}</span>;</span>
      </code>
    </div>
  </figure>
</template>
