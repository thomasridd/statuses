  Architecture & Storage                                                                                        
                                                                                                                
  1. Storage backend — The spec mentions "Simple JSON or Netlify database". Which do you want?                  
    - Flat JSON files in Netlify Blobs (serverless object storage)                                              
    - Netlify DB (SQL, currently in beta)
    - A third-party DB like Supabase or PlanetScale
    flat json - for now
  2. Authentication — Is this a single-user private app or multi-user? Does it need a login?
  single-user
    it is a single user app for it's first iteration so lets but an html password on it to prevent prying eyes
  3. Log file growth — logs.json could get very large over time. Is pagination or archiving needed, or is this a personal app where scale isn't a concern?
    lets leave it for now

  Frontend

  4. Framework preference — React, Svelte, or Vue? Or no preference?
    react
  5. Styling — Any preference? (Tailwind, plain CSS, a component library)
    tailwind
  6. Mobile-first? — The "one tap" framing suggests mobile. Should this be a PWA (installable, offline support)?
    mobile

  Logging Behaviour
  7. Value status adjustment — The spec says the value "can optionally be adjusted before saving". How does this
   work?
    - A modal/popup appears before confirming?
    - Inline edit after logging?
    - A separate "log with custom value" button alongside the default?
    let's do a separate button in this iteration
  8. Timestamp — Is the timestamp always "now", or can the user backdate an entry?
    always now
  9. Editing/deleting logs — Can the user delete or correct a log entry after it's saved?
    not in this iteration

  Status Library & Configuration

  10. Where is the status library stored? — Bundled as a static file in the app, or editable at runtime via the UI and stored in the DB?
  editable at runtime
  11. Custom statuses — The spec mentions users can add custom statuses. Is this in scope for v1?
  leave the journey out of v1
  12. Homepage grid — What determines which statuses appear in the grid? Most recently used? Manually pinned? All enabled statuses?
  Order by Manually pinned YES then most recently use.

  Analytics
  13. Date range for analytics — "Weekly totals" implies a fixed 7-day window. Should this be the current week,
  rolling 7 days, or user-selectable?
  current week by default but user-selectable
  14. Analytics page — Is this a separate page/route, or a section on the homepage below recent activity?
  separate page - perhaps with an entry point on the homepage

  Deployment

  15. Netlify account — Do you have one already set up? Is there a site name or existing project to deploy into?
  Yes - it is set up to deploy from github
  16. Domain — Custom domain or the default *.netlify.app URL?
  Default