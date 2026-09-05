# Meri Apni Udaan — Final Production Setup

This package uses:
- Supabase for quiz answers, payment verification and recommendation scoring.
- Browser-side PDF generation for the final report. Chrome/Safari render Hindi/English first, then html2canvas + jsPDF create the downloadable PDF.
- No PDF generation library runs inside the Supabase Edge Function, avoiding Devanagari font issues and Edge worker resource limits.

## Final deployment

1. Replace the files in the GitHub repository with the contents of this package.
2. In Supabase Edge Functions, open `generate-report` and replace its code with:
   `supabase-functions/generate-report/index.ts`
3. Keep `Verify JWT with legacy secret` OFF for `generate-report` and deploy.
4. Deploy the updated GitHub repo to Vercel.
5. Run one end-to-end Test Mode purchase:
   Quiz → ₹49 Razorpay Test payment → report generation → PDF download.

The final browser-generated PDF is created from the same personalized Top 3 recommendation returned by `generate-report`, and it supports both Hindi and English.
