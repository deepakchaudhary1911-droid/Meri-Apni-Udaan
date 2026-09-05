# FINAL DEPLOYMENT PACKAGE

Upload the contents of this ZIP to the GitHub repository root. Do not upload this ZIP file inside GitHub.

## Included

- `index.html` — final bilingual website, quiz navigation, Razorpay flow, and browser-side 7-page PDF generation.
- Policy pages: privacy, terms, refunds, delivery, pricing, contact.
- `supabase-functions/generate-report/index.ts` — lightweight personalized recommendation function.
- `vercel.json` — static Vercel configuration.

## Supabase

The existing `submit-quiz`, `create-razorpay-order`, and `verify-razorpay-payment` Edge Functions remain the deployed payment/quiz functions.

For `generate-report`, keep legacy JWT verification OFF and deploy the included file.

## Final customer journey

1. Landing page
2. Quiz Q1–Q10
3. Back navigation / refresh persistence
4. Result page
5. Razorpay ₹49 payment
6. Payment verification
7. Personalized recommendation generation
8. 7-page browser-rendered PDF
9. Hindi or English download based on selected language

## Final test

Test on both desktop and mobile before ads: start fresh from Home, complete all 10 questions including City (Q5), go back one question, continue forward again, complete the quiz, use Razorpay Test Mode, and download the PDF in Hindi. Repeat once in English.
