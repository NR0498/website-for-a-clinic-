# Arogyam Ayurved and Naturopathy Centre Website

Static website for Arogyam Ayurved and Naturopathy Centre / Dr Raj Pathak MD(AM), including:

- Landing page with hero portrait area
- Homepage about preview plus full `about-me.html` page
- Services section
- Homepage gallery slideshow plus full `gallery.html` page
- Google reviews showcase section
- Consultation booking page for offline, video, and call appointments
- Contact section with email, call, Instagram, and Facebook links
- Separate service detail pages for Ayurvedic consultation, customized diet plans, and yoga therapy

## Design resources

The current design uses the local Stitch resource folder:

```text
stitch_holistic_ayurvedic_wellness_portal/
```

It follows the Stitch botanical wellness palette, typography, soft card treatment, shader motion, and service catalog structure.

## Doctor photograph

The site uses:

```text
assets/dr-raj-pathak_placeholder.png
```

## Contact details

Update these placeholders before publishing:

- In `index.html`: phone link, email link, Instagram URL, and Facebook URL in the contact section
- In `script.js`: `clinicConfig.email`, `clinicConfig.phone`, `clinicConfig.instagram`, `clinicConfig.facebook`, `clinicConfig.appointmentEndpoint`, and `clinicConfig.contactEndpoint`

Current placeholders are:

- Phone: `+91 00000 00000`
- Email: `clinic@example.com`
- Instagram: `https://www.instagram.com/`
- Facebook: `https://www.facebook.com/`

## Gallery photos

The homepage and `gallery.html` currently use local placeholder assets:

```text
assets/gallery-reception.svg
assets/gallery-consultation.svg
assets/gallery-patient-care.svg
assets/gallery-wellness.svg
```

When you upload real clinic photos, place them in a folder such as:

```text
assets/gallery/
```

Then replace or duplicate the gallery `<figure>` blocks in `index.html` and `gallery.html`, changing the `src` to the new file path, for example:

```html
<img src="assets/gallery/reception.jpg" alt="Arogyam Ayurved reception area" />
```

The slideshow uses every `.slide` inside an element marked with `data-slideshow`.

## Google reviews

The homepage now tries to load live reviews from:

```text
/api/google-reviews
```

That endpoint is implemented in:

```text
api/google-reviews.js
```

It uses Google Places Details server-side, because the Google API key should not be placed in browser JavaScript. Google documents Places web services as server APIs, and the Place Details response can include `rating`, `reviews`, and `user_ratings_total` when requested in the `fields` parameter.

To connect your own Google Business Profile:

1. The Arogyam Ayurved and Naturopathy Centre Place ID is already configured as `ChIJlypth8n9CjkRvuFcoXk0sKw`.
2. Create a Google Cloud API key with Places API enabled.
3. Deploy the site somewhere that supports serverless functions, such as Vercel.
4. Add this environment variable in the hosting dashboard:

```text
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

Never place the real API key in `api/google-reviews.js`, `script.js`, HTML, README files, or source control. For local development, copy `.env.example` to `.env.local` and put the replacement key there. Environment files are excluded by `.gitignore`.

The optional `GOOGLE_PLACE_ID` environment variable can still override the configured Place ID later.

5. Open `/api/google-reviews` after deployment. If configured correctly, it should return JSON with `rating`, `user_ratings_total`, and `reviews`.

Notes:

- Google may return only a limited set of reviews.
- The endpoint caches responses for one hour on hosts that support `s-maxage`.
- The homepage keeps fallback review cards visible if the API is not configured yet.

References:

- Google Place Details supports place details including user rating and reviews, and requires a `place_id`.
- Google marks `rating`, `reviews`, and `user_ratings_total` as Atmosphere fields.
- Google warns that omitting the `fields` parameter can return all fields and bill accordingly, so the endpoint requests only the needed fields.

## Booking behavior

The booking and contact forms now use FormSubmit as the free clinic-side email backend. FormSubmit emails submissions to your address and requires no custom backend. On first use, FormSubmit sends a confirmation email that must be accepted before future messages are delivered.

Update this block in `script.js`:

```js
const clinicConfig = {
  email: "yourclinic@example.com",
  appointmentEndpoint: "https://formsubmit.co/ajax/yourclinic@example.com",
  contactEndpoint: "https://formsubmit.co/ajax/yourclinic@example.com",
};
```

After that:

1. Publish the site.
2. Submit one appointment form.
3. Check the clinic email inbox and confirm the FormSubmit activation email.
4. Submit again to confirm real appointment requests arrive in the inbox.

Appointment requests are also saved in the visitor's browser as a backup, then the page prepares:

- an email draft to the address in `script.js` (`clinicConfig.email`)
- a downloadable calendar `.ics` file

For fuller appointment management later, connect the form to one of these:

- Google Calendar appointment schedules
- A form service such as Formspree, Getform, Basin, or Netlify Forms
- A backend endpoint that emails the clinic and stores the request
- A booking tool such as Calendly or a clinic management system

The current implementation uses FormSubmit because it has a free setup path and works well for static sites.
