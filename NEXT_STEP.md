# Meri Apni Udaan — Next Deployment Step

## What is already working

The following flow has been tested successfully in Razorpay Test Mode:

Quiz → ₹49 CTA → Razorpay Checkout → UPI → successful test payment

The frontend also retains quiz/session state and the brand fixes.

## What remains

The remaining major step is to deploy the **dynamic report generator**.

The function is already included here:

`supabase-functions/generate-report/index.ts`

It is designed to:

1. Read the user's `quiz_sessions` row.
2. Read the user's `quiz_answers`.
3. Score career paths and select the Top 3.
4. Create a recommendation record.
5. Generate a personalized PDF.
6. Upload that PDF to a private Supabase Storage bucket.
7. Return a signed PDF URL to the website.

## Supabase dashboard steps

### Step 1 — Create the Storage bucket

Go to:

**Supabase → Storage → New bucket**

Create:

`reports`

Set it to **Private**.

### Step 2 — Create the Edge Function

Go to:

**Supabase → Edge Functions → New Function**

Name:

`generate-report`

Open the function's **Code** tab and replace the default `index.ts` with:

`supabase-functions/generate-report/index.ts`

### Step 3 — Function settings

Open:

**Settings**

Turn **Verify JWT with legacy secret** OFF.

Save.

### Step 4 — Deploy

Return to **Code** and click:

**Deploy updates**

Wait for successful deployment.

### Step 5 — Deploy the frontend

Upload the `index.html` from this package to the GitHub repository used by Vercel.

Vercel will redeploy the website.

## Important

Do not change or delete:

- `submit-quiz`
- `create-razorpay-order`
- `verify-razorpay-payment`
- existing tables
- the Razorpay Test credentials currently working

## Final end-to-end test

After `generate-report` is deployed:

1. Complete the quiz.
2. Reach the result screen.
3. Click the ₹49 CTA.
4. Complete a Razorpay Test payment.
5. The site should call `generate-report`.
6. The personalized report should be generated from that user's quiz answers.
7. The final download link should open the generated PDF.

### Current limitation

The dynamic report function has not yet been executed against the live Supabase schema in this turn. After deployment, the first test should confirm that the existing `recommendations` and `reports` columns match the function's expected fields. If Supabase reports a column/schema mismatch, fix that before going live.
