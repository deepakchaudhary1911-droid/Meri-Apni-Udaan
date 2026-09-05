# Meri Apni Udaan

Unified production package for the bilingual Meri Apni Udaan career-roadmap website.

The website supports: landing → 10-question bilingual quiz → personalized result → ₹49 Razorpay payment → personalized recommendation → 7-page Hindi/English browser-rendered PDF.

Navigation is persisted across refresh, the logo returns to Home, quiz Back navigation is available, and the city question (Q5) advances reliably on desktop and mobile.

The browser creates the final PDF so Hindi/Devanagari renders using the browser font engine. Supabase Edge Functions handle quiz submission, Razorpay order/payment verification, and lightweight recommendation scoring.
