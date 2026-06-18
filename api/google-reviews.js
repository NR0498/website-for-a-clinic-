const GOOGLE_PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places";
const DEFAULT_GOOGLE_PLACE_ID = "ChIJlypth8n9CjkRvuFcoXk0sKw";
const GOOGLE_PLACES_API_KEY="GOOGLE_PLACES_API_KEY";
module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID || DEFAULT_GOOGLE_PLACE_ID;

  if (!apiKey) {
    return response.status(501).json({
      error: "Google reviews are not configured.",
      requiredEnv: ["GOOGLE_PLACES_API_KEY"],
    });
  }

  try {
    const googleResponse = await fetch(`${GOOGLE_PLACES_DETAILS_URL}/${encodeURIComponent(placeId)}`, {
      headers: {
        Accept: "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri",
      },
    });

    const payload = await googleResponse.json();

    if (!googleResponse.ok) {
      return response.status(502).json({
        error: "Could not load Google reviews.",
        status: googleResponse.status,
        message: payload.error?.message,
      });
    }

    const reviews = Array.isArray(payload.reviews)
      ? payload.reviews.map((review) => ({
          author_name: review.authorAttribution?.displayName,
          author_url: review.authorAttribution?.uri,
          language: review.text?.languageCode,
          profile_photo_url: review.authorAttribution?.photoUri,
          rating: review.rating,
          relative_time_description: review.relativePublishTimeDescription,
          text: review.text?.text || review.originalText?.text,
          time: review.publishTime,
        }))
      : [];

    response.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    return response.status(200).json({
      name: payload.displayName?.text,
      rating: payload.rating,
      user_ratings_total: payload.userRatingCount,
      url: payload.googleMapsUri,
      reviews,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Unexpected Google reviews error.",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
