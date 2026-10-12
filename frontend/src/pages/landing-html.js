export const landingHtml = `<header class="fixed w-full z-50 glass-nav border-b border-gray-200/60 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center gap-2">
                    <div class="w-9 h-9">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" class="text-primary">
    <!-- Abstract Hexagon/Wallet Shape -->
    <path d="M20 2L35.5885 11V29L20 38L4.41154 29V11L20 2Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    
    <!-- Stylized 'E' / Checkmark Vault Internal -->
    <path d="M12 14H24M12 20H20M12 26H28" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    </div>
                    <a href="/" class="text-xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition flex items-center gap-1 brand-title">
                        Expense<span class="text-primary">Cap.io</span>
                    </a>
                </div>
                
                
                <!-- Desktop Nav -->
                <nav class="hidden md:flex items-center space-x-8">
                    <a href="/" class="text-sm font-medium text-gray-700 hover:text-primary transition">Home</a>
                    <a href="#features" class="text-sm font-medium text-gray-700 hover:text-primary transition">Features</a>
                    <a href="#testimonials" class="text-sm font-medium text-gray-700 hover:text-primary transition">Testimonials</a>
                    <a href="#pricing" class="text-sm font-medium text-gray-700 hover:text-primary transition">Pricing</a>
                    <a href="#faq" class="text-sm font-medium text-gray-700 hover:text-primary transition">FAQ</a>
                </nav>

                <div class="hidden md:flex items-center space-x-4">
                    <a href="/accounts/login/" class="text-sm font-medium text-gray-700 hover:text-primary transition">Sign In</a>
                    <a href="/accounts/signup/" class="group relative px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
                        <span class="relative z-10">Get Started</span>
                        <div class="absolute inset-0 h-full w-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-1 transition-opacity duration-200"></div>
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button id="mobile-menu-btn" aria-label="Toggle Menu" class="md:hidden p-2 text-gray-700 hover:text-gray-900">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></path></svg>
                </button>
                
            </div>

            <!-- Mobile Menu -->
            <div id="mobile-menu-dropdown" class="md:hidden absolute top-20 left-0 w-full glass-nav-mobile border-b border-gray-200/80 shadow-xl py-4 px-4 flex flex-col space-y-4 hidden">
                
                <a href="/" class="text-base font-medium text-gray-700 hover:text-primary">Home</a>
                <a href="#features" class="text-base font-medium text-gray-700 hover:text-primary">Features</a>
                <a href="#testimonials" class="text-base font-medium text-gray-700 hover:text-primary">Testimonials</a>
                <a href="#pricing" class="text-base font-medium text-gray-700 hover:text-primary">Pricing</a>
                <a href="#faq" class="text-base font-medium text-gray-700 hover:text-primary">FAQ</a>
                
                <div class="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                    <a href="/accounts/login/" class="w-full text-center py-2.5 text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition">Sign In</a>
                    <a href="/accounts/signup/" class="w-full text-center py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/30">Get Started</a>
                </div>
            </div>
        </div>
    </header>

    <div id="smooth-wrapper">
        <div id="smooth-content">
            <main class="pt-20 relative">
        <!-- Toast / Messages -->
        

        
<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ExpenseCap",
  "operatingSystem": "Web, iOS, Android",
  "applicationCategory": "FinanceApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250"
  },
  "description": "A completely free, privacy-focused personal finance tracker. Track expenses, manage budgets, and visualize your financial health without paywalls."
}
</script>

<!--  Advanced GSAP Implementation - High Interactivity V3 + Ticker Redesign -->

<style>
    .perspective-2000 { perspective: 2000px; }
    .transform-style-3d { transform-style: preserve-3d; }
    .gsap-3d-card { backface-visibility: hidden; }
    
    /* Horizontal Scroll Section Styles */
    .horizontal-outer { overflow: hidden; }
    .horizontal-inner { display: flex; flex-wrap: nowrap; height: 100vh; width: 300%; } /* 3 panels = 300% */
    .horizontal-panel { width: 100vw; height: 100%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    
    /* Marquee Styles */
    .marquee-container { overflow: hidden; position: relative; }
    .marquee-track { display: flex; gap: 2rem; width: max-content; }
    
    /* Ticker Text Outline */
    .text-outline {
        -webkit-text-stroke: 2px transparent;
        color: transparent;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-stroke: 2px #ffffff;
    }
    .dark .text-outline {
        -webkit-text-stroke: 2px #ffffff;
    }
</style>

<!-- Hero Section -->
<section class="relative min-h-screen flex items-start pt-6 md:pt-10 lg:pt-12 overflow-hidden bg-gray-50 dark:bg-gray-900" id="hero-section">
    <!-- Background Gradients -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] gsap-bg-blob" data-speed="2"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] gsap-bg-blob" data-speed="-1.5"></div>
        <div class="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] gsap-bg-blob" data-speed="1"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full ">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <!-- Left: Text Content -->
            <div class="text-center lg:text-left order-2 lg:order-1">
                 <!-- Badge -->
                 <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm mb-8 opacity-0 gsap-hero-text">
                    <span class="relative flex h-2.5 w-2.5">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">v2.0 Now Available</span>
                </div>

                <h1 class="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1] overflow-hidden">
                    <div class="gsap-split-text-wrapper">Master Your</div>
                    <div class="h-[1.3em] inline-flex items-center flex-wrap">
                        <span id="typewriter-text" class="hero-gradient-text text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Your Finance</span>
                         <span class="typewriter-cursor"></span>
                    </div>
                </h1>
                
                <p class="mt-4 text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-0 gsap-hero-text">
                    Stop guessing where your money goes. Gain total clarity over your 
                    Income, Loans, Saving Goals, and Fixed Costs in one beautiful dashboard.
                </p>

                <div class="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4 opacity-0 gsap-hero-text">
                    <a href="/accounts/signup/" class="px-8 py-4 bg-primary text-white text-lg font-bold rounded-full bg-indigo-700 hover: transition 
                    shadow-xl shadow-primary/25 hover:-translate-y-1 transform flex items-center justify-center gap-2 group">
                        Get Started Free
                        <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" 
                        viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></path></svg>
                    </a>
                </div>
            </div>

            <!-- Right: 3D Dashboard -->
            <div class="lg:h-[600px] w-full relative perspective-2000 order-1 lg:order-2 flex items-center justify-center">
                <!-- Main Dashboard Card -->
                <div class="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden relative z-10 gsap-3d-card transform-style-3d opacity-0">
                    <!-- Glass Header -->
                    <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md flex justify-between items-center">
                        <div class="flex gap-2">
                             <div class="w-3 h-3 rounded-full bg-red-400"></div>
                             <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                             <div class="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div class="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    
                    <!-- Dashboard Content Mock -->
                    <div class="p-6 space-y-6">
                        <div class="flex justify-between items-end">
                            <div>
                                <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Balance</p>
                                <h3 class="text-3xl font-black text-gray-900 dark:text-white mt-1">৳124,500</h3>
                            </div>
                            <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></path></svg>
                            </div>
                        </div>
                        
                        <!-- Chart Area -->
                        <div class="h-36 flex items-end justify-between gap-2.5 px-3 pt-4 pb-2 bg-slate-50/80 dark:bg-gray-900/50 rounded-2xl border border-slate-200/80 dark:border-gray-700/60 shadow-inner">
                             <div class="w-full bg-indigo-200/90 dark:bg-indigo-800/60 rounded-t-md h-[30%] hover:bg-indigo-300 transition-all cursor-pointer"></div>
                             <div class="w-full bg-indigo-200/90 dark:bg-indigo-800/60 rounded-t-md h-[50%] hover:bg-indigo-300 transition-all cursor-pointer"></div>
                             <div class="w-full bg-indigo-200/90 dark:bg-indigo-800/60 rounded-t-md h-[40%] hover:bg-indigo-300 transition-all cursor-pointer"></div>
                             <div class="w-full bg-indigo-200/90 dark:bg-indigo-800/60 rounded-t-md h-[70%] hover:bg-indigo-300 transition-all cursor-pointer"></div>
                             <div class="w-full bg-gradient-to-t from-indigo-600 via-indigo-600 to-indigo-500 rounded-t-md h-[90%] relative shadow-[0_4px_20px_rgba(79,70,229,0.45)] ring-2 ring-indigo-400/40 cursor-pointer"></div>
                             <div class="w-full bg-indigo-200/90 dark:bg-indigo-800/60 rounded-t-md h-[60%] hover:bg-indigo-300 transition-all cursor-pointer"></div>
                             <div class="w-full bg-indigo-200/90 dark:bg-indigo-800/60 rounded-t-md h-[40%] hover:bg-indigo-300 transition-all cursor-pointer"></div>
                        </div>

                        <!-- List Items -->
                        <div class="space-y-3">
                            <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                                <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-lg">🍔</div>
                                <div class="flex-1">
                                    <p class="font-bold text-sm text-gray-900 dark:text-white">Food & Dining</p>
                                    <p class="text-xs text-gray-500">Today, 2:30 PM</p>
                                </div>
                                <span class="font-bold text-sm text-red-500">-৳450</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Floating Elements (Parallax) -->
                <div class="absolute -right-8 top-20 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 w-48 gsap-float-element" data-depth="0.2">
                    <p class="text-xs text-gray-500 mb-1">Savings Goal</p>
                    <div class="flex justify-between items-end mb-2">
                        <span class="font-bold text-gray-900 dark:text-white">MacBook Pro</span>
                        <span class="text-xs font-bold text-primary">85%</span>
                    </div>
                    <div class="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div class="h-full bg-primary w-[85%]"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Stats Ticker (Redesigned) -->
<section class="py-12 bg-gray-900 dark:bg-black overflow-hidden relative z-20 -skew-y-2 transform origin-left border-y-4 border-primary">
    <div class="flex gap-16 items-center whitespace-nowrap" id="stats-ticker">
         <div class="flex gap-16 items-center text-6xl md:text-8xl font-black uppercase tracking-tighter text-white">
            <span class="flex items-center gap-8">
                <span class="text-outline">100% Free</span>
                <span class="text-primary text-4xl">✦</span>
                <span class="">Free</span>
                <span class="text-primary text-4xl">✦</span>
                <span class="text-outline">No Limitations</span>
                <span class="text-primary text-4xl">✦</span>
            </span>
             <span class="flex items-center gap-8">
                <span class="text-outline">100% Free</span>
                <span class="text-primary text-4xl">✦</span>
                <span class="">Free</span>
                <span class="text-primary text-4xl">✦</span>
                <span class="text-outline">No Limitations</span>
                <span class="text-primary text-4xl">✦</span>
            </span>
        </div>
        <!-- Duplicate for loop -->
        <div class="flex gap-16 items-center text-6xl md:text-8xl font-black uppercase tracking-tighter text-white">
            <span class="flex items-center gap-8">
                <span class="text-outline">100% Free</span>
                <span class="text-primary text-4xl">✦</span>
                <span class="">Free</span>
                <span class="text-primary text-4xl">✦</span>
                <span class="text-outline">No Limitations</span>
                <span class="text-primary text-4xl">✦</span>
            </span>
             <span class="flex items-center gap-8">
                <span class="text-outline">100% Free</span>
                <span class="text-primary text-4xl">✦</span>
                <span class="">Free</span>
                <span class="text-primary text-4xl">✦</span>
                <span class="text-outline">No Limitations</span>
                <span class="text-primary text-4xl">✦</span>
            </span>
        </div>
    </div>
</section>

<!-- How It Works (Horizontal Scroll Journey) -->
<!-- Outer container for pinning -->
<section id="how-it-works-pin" class="horizontal-outer relative bg-gray-50 dark:bg-gray-900">
    <div class="horizontal-inner">
        
        <!-- Panel 1: Create Account (Emerald Theme) -->
        <div class="horizontal-panel relative bg-gradient-to-br from-teal-50 to-emerald-100 dark:from-teal-950 dark:to-emerald-950/50">
            <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 grayscale"></div>
            
            <div class="max-w-xl w-full mx-4 text-center relative z-10 p-10 rounded-3xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl">
                <span class="text-9xl font-black text-emerald-900/10 dark:text-white/5 absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 selection:bg-none pointer-events-none">01</span>
                
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-bold mb-8 shadow-lg shadow-emerald-500/30">
                    ⚡ No Credit Card Needed
                </div>
                
                <h2 class="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Create Account</h2>
                <p class="text-xl text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    Join in <span class="text-emerald-600 dark:text-emerald-400 font-bold">10 seconds</span>. We literally just need your email to secure your data.
                </p>
                
                <div class="mt-10 transform hover:scale-110 transition-transform duration-300">
                     <span class="text-7xl drop-shadow-2xl">🔓</span>
                </div>
            </div>
        </div>

        <!-- Panel 2: Add Wallets (Blue/Indigo Theme) -->
        <div class="horizontal-panel relative bg-gradient-to-bl from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950/50">
            <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 grayscale"></div>

             <div class="max-w-xl w-full mx-4 text-center relative z-10 p-10 rounded-3xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl">
                 <span class="text-9xl font-black text-blue-900/10 dark:text-white/5 absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 selection:bg-none pointer-events-none">02</span>
                
                <h2 class="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Add Wallets</h2>
                <p class="text-xl text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    Map your real life to the app. Create wallets for <span class="text-blue-600 dark:text-blue-400 font-bold">Cash, Bank, or Mobile Banking</span>.
                </p>
                
                <div class="mt-10 flex justify-center gap-6">
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl transform -rotate-6 hover:rotate-0 transition-transform border border-gray-100 dark:border-gray-700">
                        <span class="text-4xl block mb-2">💵</span>
                        <span class="font-bold text-gray-900 dark:text-white">Cash</span>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl transform rotate-6 hover:rotate-0 transition-transform border border-gray-100 dark:border-gray-700">
                        <span class="text-4xl block mb-2">🏦</span>
                        <span class="font-bold text-gray-900 dark:text-white">Bank</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Panel 3: Track & Grow (Purple/Pink Theme) -->
        <div class="horizontal-panel relative bg-gradient-to-tr from-purple-50 to-fuchsia-100 dark:from-purple-950 dark:to-fuchsia-950/50">
             <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 grayscale"></div>

            <div class="max-w-xl w-full mx-4 text-center relative z-10 p-10 rounded-3xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl">
                 <span class="text-9xl font-black text-purple-900/10 dark:text-white/5 absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 selection:bg-none pointer-events-none">03</span>
                
                <h2 class="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Track & Grow</h2>
                <p class="text-xl text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    Log expenses instantly. Watch your <span class="text-purple-600 dark:text-purple-400 font-bold">savings grow</span> with visual goals.
                </p>
                
                <div class="mt-10">
                    <a href="/accounts/signup/" class="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xl font-bold rounded-full hover:scale-110 hover:shadow-purple-500/50 transition-all shadow-2xl inline-flex items-center gap-2">
                        Start Now <span aria-hidden="true">&rarr;</span>
                    </a>
               </div>
            </div>
        </div>

    </div>
</section>

<!-- Features Grid (Holographic / Vibrant) -->
<section class="py-32 relative bg-gray-900 overflow-hidden" id="features">
    <!-- Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
        <div class="text-center mb-24 max-w-3xl mx-auto">
            <h2 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200 mb-6 tracking-tight">
                Everything you need.
            </h2>
            <p class="text-xl text-gray-400 font-medium">Power-packed features wrapped in a stunning interface.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-6 gap-6 stagger-grid">
            
            <!-- Card 1: Expense Tracking (Cyan/Blue) -->
            <div class="col-span-1 md:col-span-4 feature-card group relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 hover:from-cyan-400/40 hover:to-blue-500/40 transition-all duration-500">
                <div class="absolute inset-0 bg-gray-900/90 rounded-[22px] z-10"></div>
                <!-- Inner Content -->
                <div class="relative z-20 h-full p-10 flex flex-col md:flex-row items-center justify-between gap-8 py-14">
                    <div class="text-left">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-cyan-500/30">
                            <span class="text-2xl">📊</span>
                        </div>
                        <h3 class="text-3xl font-bold text-white mb-3">Smart Tracking</h3>
                        <p class="text-gray-400 text-lg">Log expenses in seconds with smart categorization and auto-cleanup.</p>
                    </div>
                    <div class="relative w-full md:w-1/2 h-40 md:h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 overflow-hidden group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                         <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 -rotate-12 scale-150"></div>
                         <span class="text-6xl animate-pulse">⚡️</span>
                    </div>
                </div>
            </div>

            <!-- Card 2: Budgets (Purple/Pink) -->
            <div class="col-span-1 md:col-span-2 feature-card group relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-purple-500/20 to-pink-600/20 hover:from-purple-400/40 hover:to-pink-500/40 transition-all duration-500">
                <div class="absolute inset-0 bg-gray-900/90 rounded-[22px] z-10"></div>
                <div class="relative z-20 h-full p-8 flex flex-col justify-between py-14">
                    <div>
                         <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/30">
                            <span class="text-xl">�</span>
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-2">Budgets</h3>
                        <p class="text-gray-400">Set limits. Save more.</p>
                    </div>
                    <div class="mt-6 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-purple-400 to-pink-500 w-[70%] group-hover:w-[85%] transition-all duration-700 ease-out"></div>
                    </div>
                </div>
            </div>

            <!-- Card 3: Free Forever (Gold/Premium) -->
            <div class="col-span-1 md:col-span-3 feature-card group relative overflow-hidden rounded-3xl p-1" id="pricing">
                <!-- Animated Golden Border -->
                <div class="absolute inset-0 bg-gradient-to-r from-yellow-600 via-amber-200 to-yellow-600 animate-shimmer z-0"></div>
                <div class="absolute inset-[2px] bg-gray-900 rounded-[22px] z-10"></div>
                
                <div class="relative z-20 h-full p-10 flex flex-col justify-center items-center text-center py-14">
                    <span class="inline-block py-1 px-3 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold tracking-wider mb-4 border border-amber-500/30">NO HIDDEN FEES</span>
                    <h3 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-500 mb-4 drop-shadow-sm">100% FREE</h3>
                    <p class="text-gray-300 text-lg max-w-md mx-auto">No free trials. No limitations. Just purely free financial freedom for everyone.</p>
                </div>
            </div>

            <!-- Card 4: Analytics (Green/Emerald) -->
            <div class="col-span-1 md:col-span-3 feature-card group relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-emerald-500/20 to-green-600/20 hover:from-emerald-400/40 hover:to-green-500/40 transition-all duration-500">
                <div class="absolute inset-0 bg-gray-900/90 rounded-[22px] z-10"></div>
                <div class="relative z-20 h-full p-10 flex items-center justify-between overflow-hidden py-14">
                    <div class="relative z-10">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/30">
                            <span class="text-2xl">📈</span>
                        </div>
                        <h3 class="text-3xl font-bold text-white mb-2">Deep Insights</h3>
                        <p class="text-gray-400">Visualize your habits.</p>
                    </div>
                     <!-- Decorative Chart Line -->
                    <div class="absolute right-0 bottom-0 w-1/2 h-full opacity-30 group-hover:opacity-50 transition-opacity">
                         <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full text-emerald-500 fill-current"><path d="M0 100 L0 80 L20 60 L40 70 L60 40 L80 50 L100 20 L100 100 Z" /></svg>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>

<!-- Testimonials (Neon Glass Marquee) -->
<section class="py-20 bg-black overflow-hidden relative" id="testimonials">
   <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

    <div class="text-center mb-16 relative z-10">
        <h2 class="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Loved by users globally.</h2>
    </div>

    <div class="marquee-container relative z-10">
        <!-- Row 1 -->
        <div class="marquee-track flex gap-8 mb-8" style="width: fit-content;" id="marquee-row-1">
             <!-- Item 1 (Blue Glow) -->
             <div class="w-[400px] p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 flex-shrink-0 group">
                <p class="text-gray-200 mb-6 text-lg font-light italic">"Finally, an expense tracker that doesn't feel like a spreadsheet. It's actually fun to use."</p>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/20 group-hover:ring-blue-400 transition-all">JD</div>
                    <div>
                        <div class="font-bold text-white">John Doe</div>
                        <div class="text-xs text-blue-400">Freelancer</div>
                    </div>
                </div>
             </div>
             <!-- Item 2 (Pink Glow) -->
             <div class="w-[400px] p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all duration-300 flex-shrink-0 group">
                <p class="text-gray-200 mb-6 text-lg font-light italic">"The visuals are stunning. Makes tracking money feel less like a chore and more like a game."</p>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/20 group-hover:ring-pink-400 transition-all">SW</div>
                    <div>
                        <div class="font-bold text-white">Sarah Williams</div>
                        <div class="text-xs text-pink-400">Designer</div>
                    </div>
                </div>
             </div>
             <!-- Item 3 (Green Glow) -->
             <div class="w-[400px] p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 flex-shrink-0 group">
                <p class="text-gray-200 mb-6 text-lg font-light italic">"No trial periods, just free access? And it looks this good? Count me in completely."</p>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-green-400 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/20 group-hover:ring-emerald-400 transition-all">MC</div>
                    <div>
                        <div class="font-bold text-white">Michael Chen</div>
                        <div class="text-xs text-emerald-400">Developer</div>
                    </div>
                </div>
             </div>
        </div>

        <!-- Row 2 (Reverse) -->
        <div class="marquee-track flex gap-8" style="width: fit-content;" id="marquee-row-2">
            <!-- Item 4 (Purple Glow) -->
             <div class="w-[400px] p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 flex-shrink-0 group">
                <p class="text-gray-200 mb-6 text-lg font-light italic">"I've tried 10 apps. This is the only one I stuck with. The UI is just superior."</p>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-400 to-violet-400 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/20 group-hover:ring-purple-400 transition-all">AK</div>
                    <div>
                        <div class="font-bold text-white">Alex King</div>
                        <div class="text-xs text-purple-400">Product Manager</div>
                    </div>
                </div>
             </div>
             <!-- Item 5 (Orange Glow) -->
             <div class="w-[400px] p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] transition-all duration-300 flex-shrink-0 group">
                <p class="text-gray-200 mb-6 text-lg font-light italic">"Best free financial tool out there. Period. No ads, no paywalls."</p>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/20 group-hover:ring-orange-400 transition-all">JL</div>
                    <div>
                        <div class="font-bold text-white">Jessica Lee</div>
                        <div class="text-xs text-orange-400">Student</div>
                    </div>
                </div>
             </div>
              <!-- Item 6 (Cyan Glow) -->
             <div class="w-[400px] p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 flex-shrink-0 group">
                <p class="text-gray-200 mb-6 text-lg font-light italic">"Simplicity at its finest. Does exactly what I need without the bloat."</p>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-sky-400 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/20 group-hover:ring-cyan-400 transition-all">DR</div>
                    <div>
                        <div class="font-bold text-white">David Ross</div>
                        <div class="text-xs text-cyan-400">Consultant</div>
                    </div>
                </div>
             </div>
        </div>
    </div>
</section>

<!-- FAQ Section (Spotlight) -->
<section class="py-24 bg-gray-50 dark:bg-gray-950" id="faq">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-black text-center text-gray-900 dark:text-white mb-12">Frequently Asked Questions</h2>
        
        <div class="space-y-4" id="faq-container">
            <!-- FAQ Item 1 -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 cursor-pointer faq-item shadow-sm transition-all duration-300 group">
                <div class="flex justify-between items-center faq-header">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Is it really 100% free?</h3>
                    <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all group-hover:bg-primary/10">
                         <svg class="w-5 h-5 text-gray-500 group-hover:text-primary transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></path></svg>
                    </div>
                </div>
                <div class="faq-content h-0 overflow-hidden opacity-0">
                    <p class="pt-4 text-gray-600 dark:text-gray-300 leading-relaxed">Yes! ExpenseCap is completely free. There are no paywalls, no hidden fees, and no "premium" tier. We believe financial clarity should be accessible to everyone.</p>
                </div>
            </div>

            <!-- FAQ Item 2 -->
             <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 cursor-pointer faq-item shadow-sm transition-all duration-300 group">
                <div class="flex justify-between items-center faq-header">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Is my data secure?</h3>
                     <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all group-hover:bg-primary/10">
                         <svg class="w-5 h-5 text-gray-500 group-hover:text-primary transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></path></svg>
                    </div>
                </div>
                 <div class="faq-content h-0 overflow-hidden opacity-0">
                    <p class="pt-4 text-gray-600 dark:text-gray-300 leading-relaxed">Absolutely. We use industry-standard 256-bit encryption to protect your data in transit and at rest. We do not sell your personal financial data to third parties, ever.</p>
                </div>
            </div>



            <!-- FAQ Item 4 -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 cursor-pointer faq-item shadow-sm transition-all duration-300 group">
                <div class="flex justify-between items-center faq-header">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Does it work on mobile?</h3>
                     <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all group-hover:bg-primary/10">
                         <svg class="w-5 h-5 text-gray-500 group-hover:text-primary transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></path></svg>
                    </div>
                </div>
                 <div class="faq-content h-0 overflow-hidden opacity-0">
                     <p class="pt-4 text-gray-600 dark:text-gray-300 leading-relaxed">ExpenseCap is a fully responsive web app (PWA). It works seamlessly on your iPhone, iPad, or Android device directly from the browser. You can even add it to your home screen for an app-like experience.</p>
                </div>
            </div>

             <!-- FAQ Item 5 -->
             <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 cursor-pointer faq-item shadow-sm transition-all duration-300 group">
                <div class="flex justify-between items-center faq-header">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Can I export my data?</h3>
                     <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all group-hover:bg-primary/10">
                         <svg class="w-5 h-5 text-gray-500 group-hover:text-primary transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></path></svg>
                    </div>
                </div>
                 <div class="faq-content h-0 overflow-hidden opacity-0">
                    <p class="pt-4 text-gray-600 dark:text-gray-300 leading-relaxed">Your data belongs to you. You can export all your transaction history to CSV or Excel formats at any time from the settings menu for your own records or analysis.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="py-32 relative overflow-hidden bg-gray-900 text-white">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[50%] -left-[20%] w-[80%] h-[150%] bg-primary/20 rounded-full blur-[150px] opacity-40"></div>
        <div class="absolute -bottom-[50%] -right-[20%] w-[80%] h-[150%] bg-secondary/20 rounded-full blur-[150px] opacity-40"></div>
    </div>
    
    <div class="relative max-w-4xl mx-auto px-4 text-center z-10">
        <h2 class="text-5xl md:text-7xl font-black mb-8 text-white tracking-tight gsap-cta-title">
            Start Cap'n.
        </h2>
        <p class="text-xl text-gray-400 mb-12 max-w-2xl mx-auto gsap-cta-text">
            Join the community today and take the first step towards financial freedom.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 gsap-cta-btn">
            <a href="/accounts/signup/" class="px-12 py-5 bg-white text-gray-900 text-xl font-bold rounded-full hover:bg-gray-100 transition shadow-2xl hover:scale-105 active:scale-95 transform duration-200">
                Create Free Account
            </a>
        </div>
    </div>
</section>


<script>
    document.addEventListener("DOMContentLoaded", (event) => {
        // Core GSAP Check
        if (window.gsap) {
            
            // --- 1. ScrollSmoother (Optional) ---
            if (window.ScrollSmoother && window.ScrollTrigger) {
                 try {
                     ScrollSmoother.create({
                        content: "#smooth-content",
                        wrapper: "#smooth-wrapper",
                        smooth: 1.5,
                        effects: true,
                        normalizeScroll: true,
                    });
                 } catch (e) { console.warn("ScrollSmoother failed to init", e); }
            }

            // --- 2. Hero Animations ---
            const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
            
            // Text Typewriter (Optional)
            if(window.TextPlugin) {
                gsap.to("#typewriter-text", { duration: 2, text: { value: "Your Finance", delimiter: "" }, ease: "none", delay: 0.5 });
            }

            // SplitText (Optional - Fallback to simple fade if missing)
            if (window.SplitText) {
                const childSplit = new SplitText("h1 .gsap-split-text-wrapper", { type: "lines", linesClass: "overflow-hidden" });
                heroTl.from(childSplit.lines, { duration: 1.5, yPercent: 100, stagger: 0.1, ease: "power4.out" }, 0);
            } else {
                 // Fallback
                 gsap.from("h1 .gsap-split-text-wrapper", { y: 50, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.2 });
            }

            heroTl.to(".gsap-hero-text", { y: 0, opacity: 1, duration: 1, stagger: 0.2 }, 0.5);
            heroTl.fromTo(".gsap-3d-card", { opacity: 0, rotationX: 20, rotationY: -20, z: -500, y: 100 }, { opacity: 1, rotationX: 5, rotationY: -5, z: 0, y: 0, duration: 1.5, ease: "back.out(1.2)" }, 0.2);

            // 3D Mouse Parallax
            document.addEventListener("mousemove", (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                gsap.to(".gsap-3d-card", { rotationY: -5 + x, rotationX: 5 - y, duration: 0.5, ease: "power1.out" });
            });

            // --- 3. Stats Ticker ---
            gsap.to("#stats-ticker", { xPercent: -50, repeat: -1, duration: 12, ease: "linear" });


            // --- 4. Horizontal Scroll (Requires ScrollTrigger) ---
            if (window.ScrollTrigger) {
                const sections = gsap.utils.toArray(".horizontal-panel");
                if (sections.length > 0) {
                     gsap.to(sections, {
                        xPercent: -100 * (sections.length - 1),
                        ease: "none",
                        scrollTrigger: {
                            trigger: ".horizontal-outer",
                            pin: true,
                            scrub: 1,
                            snap: 1 / (sections.length - 1),
                            end: () => "+=" + document.querySelector(".horizontal-outer").offsetWidth
                        }
                    });
                }
            }


            // --- 5. Features 3D Tilt Cards ---
            gsap.utils.toArray(".gsap-tilt-card").forEach(card => {
                card.addEventListener("mousemove", (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -10; 
                    const rotateY = ((x - centerX) / centerX) * 10;

                    gsap.to(card, { duration: 0.5, rotationX: rotateX, rotationY: rotateY, scale: 1.05, ease: "power1.out" });
                });
                card.addEventListener("mouseleave", () => {
                    gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.5 });
                });
            });


            // --- 6. Infinite Marquee Testimonials ---
            const rows = ["#marquee-row-1", "#marquee-row-2"];
            rows.forEach((rowId, index) => {
                const track = document.querySelector(rowId);
                if (track) {
                    const items = track.innerHTML;
                    track.innerHTML += items + items; 
                    const direction = index === 0 ? -1 : 1; 
                    gsap.to(track, {
                        xPercent: direction === -1 ? -50 : 50,
                        repeat: -1,
                        duration: 30,
                        ease: "linear"
                    }).totalProgress(0.5); 
                }
            });


            // --- 7. FAQ Spotlight (Core GSAP only) ---
            const faqs = document.querySelectorAll(".faq-item");
            faqs.forEach(faq => {
                const header = faq.querySelector(".faq-header");
                const content = faq.querySelector(".faq-content");
                const icon = faq.querySelector("svg");
                
                header.addEventListener("click", () => {
                    // Check if open by checking inline height/opacity or class state
                    const isOpen = content.style.height && content.style.height !== "0px";
                    
                    // Spotlight Logic
                    if (!isOpen) {
                        faqs.forEach(otherFaq => {
                            if (otherFaq !== faq) {
                                gsap.to(otherFaq, { opacity: 0.5, scale: 0.98, duration: 0.3 });
                                gsap.to(otherFaq.querySelector(".faq-content"), { height: 0, opacity: 0, duration: 0.3 });
                                gsap.to(otherFaq.querySelector("svg"), { rotation: 0, duration: 0.3 });
                                otherFaq.classList.remove("border-primary", "shadow-[0_0_20px_rgba(79,70,229,0.15)]", "bg-indigo-50", "dark:bg-indigo-900/10");
                                otherFaq.classList.add("bg-white", "dark:bg-gray-900", "border-gray-200", "dark:border-gray-800");
                            }
                        });
                        gsap.to(faq, { opacity: 1, scale: 1.01, duration: 0.3 });
                        faq.classList.remove("bg-white", "dark:bg-gray-900", "border-gray-200", "dark:border-gray-800");
                        faq.classList.add("border-primary", "shadow-[0_0_20px_rgba(79,70,229,0.15)]", "bg-indigo-50", "dark:bg-indigo-900/10");
                    } else {
                        faqs.forEach(otherFaq => {
                            gsap.to(otherFaq, { opacity: 1, scale: 1, duration: 0.3 });
                            otherFaq.classList.remove("border-primary", "shadow-[0_0_20px_rgba(79,70,229,0.15)]", "bg-indigo-50", "dark:bg-indigo-900/10");
                             otherFaq.classList.add("bg-white", "dark:bg-gray-900", "border-gray-200", "dark:border-gray-800");
                        });
                    }

                    // Accordion Logic
                    if (isOpen) {
                        gsap.to(content, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
                        gsap.to(icon, { rotation: 0, duration: 0.3 });
                        content.style.height = "0px"; // Explicitly set for next check
                    } else {
                        // Opening: Animate TO auto height and opacity 1
                        gsap.to(content, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
                        gsap.to(icon, { rotation: 180, duration: 0.3 });
                    }
                });
            });
            
            // --- 8. CTA Reveal ---
            if (window.ScrollTrigger) {
                const ctaTl = gsap.timeline({ scrollTrigger: { trigger: ".gsap-cta-title", start: "top 80%" } });
                ctaTl.from(".gsap-cta-title", { y: 100, opacity: 0, duration: 1, ease: "power4.out" })
                     .from(".gsap-cta-text", { y: 50, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.8")
                     .from(".gsap-cta-btn", { scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6");
            }

        }
    });
</script>

    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-20 pb-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div class="space-y-6">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#10b981] flex items-center justify-center text-white font-bold text-xl">
                           <span class = "drop-shadow-md"> E</span>
                        </div>
                        <span class="text-xl font-bold text-gray-900 dark:text-white">ExpenseCap.io</span>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        Control your financial future with the most intuitive expense tracking platform. Secure, fast, and beautiful.
                    </p>
                    <div class="flex space-x-4">
                        <!-- Social placeholders -->
                        <a href="#" class="text-gray-400 hover:text-primary transition"><span class="sr-only">Twitter</span><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></path></svg></a>
                        <a href="#" class="text-gray-400 hover:text-primary transition"><span class="sr-only">GitHub</span><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></path></svg></a>
                    </div>
                </div>
                
                <div>
                    <h3 class="font-bold text-gray-900 dark:text-white mb-6">Product</h3>
                    <ul class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                        <li><a href="#features" class="hover:text-primary transition">Features</a></li>
                        <li><a href="#pricing" class="hover:text-primary transition">Pricing</a></li>
                        <li><a href="#" class="hover:text-primary transition">Security</a></li>
                        <li><a href="#" class="hover:text-primary transition">Changelog</a></li>
                    </ul>
                </div>

                <div>
                    <h3 class="font-bold text-gray-900 dark:text-white mb-6">Resources</h3>
                    <ul class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                        <li><a href="#" class="hover:text-primary transition">Documentation</a></li>
                        <li><a href="#" class="hover:text-primary transition">API Reference</a></li>
                        <li><a href="#" class="hover:text-primary transition">Blog</a></li>
                        <li><a href="#" class="hover:text-primary transition">Community</a></li>
                    </ul>
                </div>

                <div>
                    <h3 class="font-bold text-gray-900 dark:text-white mb-6">Stay Updated</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Latest features and news delivered to your inbox.</p>
                    <form class="flex gap-2" onsubmit="event.preventDefault(); alert('Subscribed!')">
                        <input type="email" placeholder="Enter email" class="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary">
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                            Go
                        </button>
                    </form>
                </div>
            </div>
            
            <div class="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="flex flex-col gap-2 relative z-10">
                    <p class="text-sm text-gray-400">© 2026 ExpenseCap.io. All rights reserved.</p>
                    <p class="text-sm text-gray-400">
                        ExpenseCap.io is a product of <a href="https://aarsis.com" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium relative z-20">aarsis Solutions</a>.
                    </p>
                </div>
                <div class="flex gap-6 text-sm text-gray-400 relative z-10">
                    <a href="#" class="hover:text-gray-600 dark:hover:text-gray-300 relative z-20">Privacy Policy</a>
                    <a href="#" class="hover:text-gray-600 dark:hover:text-gray-300 relative z-20">Terms of Service</a>
                </div>
            </div>
        </div>
        </div>
    </div>
    <!-- Footer moved inside smooth-content via upper wrapper -->
    </footer>`;
