import type { Motive, Status, Context } from '../../src/types'

export const defaultMotives: Motive[] = [
  { id: 'domestic', name: 'Domestic Maintenance', order: 1 },
  { id: 'food', name: 'Food', order: 2 },
  { id: 'shopping', name: 'Shopping', order: 3 },
  { id: 'wellbeing', name: 'Personal Wellbeing', order: 4 },
  { id: 'exercise', name: 'Exercise', order: 5 },
  { id: 'productivity', name: 'Productivity', order: 6 },
  { id: 'reading_media', name: 'Reading & Media', order: 7 },
  { id: 'leisure', name: 'Leisure', order: 8 },
  { id: 'social', name: 'Social', order: 9 },
  { id: 'sleep', name: 'Sleep', order: 10 },
  { id: 'home_admin', name: 'Home Admin', order: 11 },
  { id: 'outdoor', name: 'Outdoor / Errands', order: 12 },
]

export const defaultStatuses: Status[] = [
  // Domestic Maintenance - Kitchen
  { id: 'cleaned_kitchen', label: 'Cleaned kitchen', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'washed_dishes', label: 'Washed dishes', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'loaded_dishwasher', label: 'Loaded dishwasher', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false },
  { id: 'unloaded_dishwasher', label: 'Unloaded dishwasher', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
  { id: 'wiped_surfaces', label: 'Wiped surfaces', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false },
  { id: 'took_bins_out', label: 'Took bins out', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 6, pinned: false },
  // Domestic Maintenance - General
  { id: 'tidied_house', label: 'Tidied house', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 7, pinned: false },
  { id: 'vacuumed', label: 'Vacuumed', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 8, pinned: false },
  { id: 'mopped_floor', label: 'Mopped floor', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 9, pinned: false },
  { id: 'dusted', label: 'Dusted', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 10, pinned: false },
  { id: 'cleaned_bathroom', label: 'Cleaned bathroom', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 11, pinned: false },
  { id: 'cleaned_toilet', label: 'Cleaned toilet', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 12, pinned: false },
  { id: 'cleaned_shower', label: 'Cleaned shower', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 13, pinned: false },
  { id: 'changed_bedding', label: 'Changed bedding', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 14, pinned: false },
  // Domestic Maintenance - Laundry
  { id: 'started_laundry', label: 'Started laundry', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 15, pinned: false },
  { id: 'hung_laundry', label: 'Hung laundry', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 16, pinned: false },
  { id: 'folded_laundry', label: 'Folded laundry', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 17, pinned: false },
  { id: 'put_laundry_away', label: 'Put laundry away', motive_id: 'domestic', type: 'simple', unit: null, default_value: null, enabled: true, order: 18, pinned: false },

  // Food - Cooking
  { id: 'cooked_breakfast', label: 'Cooked breakfast', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'cooked_lunch', label: 'Cooked lunch', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'cooked_dinner', label: 'Cooked dinner', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false },
  { id: 'prepared_snack', label: 'Prepared snack', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
  { id: 'baked', label: 'Baked', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false },
  { id: 'meal_prep', label: 'Meal prep', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 6, pinned: false },
  // Food - Eating
  { id: 'ate_breakfast', label: 'Ate breakfast', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 7, pinned: false },
  { id: 'ate_lunch', label: 'Ate lunch', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 8, pinned: false },
  { id: 'ate_dinner', label: 'Ate dinner', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 9, pinned: false },
  { id: 'ate_snack', label: 'Ate snack', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 10, pinned: false },
  { id: 'takeaway_meal', label: 'Takeaway meal', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 11, pinned: false },
  { id: 'restaurant_meal', label: 'Restaurant meal', motive_id: 'food', type: 'simple', unit: null, default_value: null, enabled: true, order: 12, pinned: false },
  // Food - Drinks
  { id: 'water', label: 'Water', motive_id: 'food', type: 'value', unit: 'ml', default_value: 250, enabled: true, order: 13, pinned: false },
  { id: 'milk', label: 'Milk', motive_id: 'food', type: 'value', unit: 'ml', default_value: 150, enabled: true, order: 14, pinned: false },
  { id: 'juice', label: 'Juice', motive_id: 'food', type: 'value', unit: 'ml', default_value: 200, enabled: true, order: 15, pinned: false },
  { id: 'tea', label: 'Tea', motive_id: 'food', type: 'value', unit: 'cups', default_value: 1, enabled: true, order: 16, pinned: false },
  { id: 'coffee', label: 'Coffee', motive_id: 'food', type: 'value', unit: 'cups', default_value: 1, enabled: true, order: 17, pinned: false },
  { id: 'alcohol', label: 'Alcohol', motive_id: 'food', type: 'value', unit: 'units', default_value: 1, enabled: true, order: 18, pinned: false },

  // Shopping
  { id: 'grocery_shopping', label: 'Grocery shopping', motive_id: 'shopping', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'online_grocery_order', label: 'Online grocery order', motive_id: 'shopping', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'household_supplies_shopping', label: 'Household supplies shopping', motive_id: 'shopping', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false },
  { id: 'pharmacy_visit', label: 'Pharmacy visit', motive_id: 'shopping', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
  { id: 'received_delivery', label: 'Received delivery', motive_id: 'shopping', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false },

  // Personal Wellbeing - Hygiene
  { id: 'showered', label: 'Showered', motive_id: 'wellbeing', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'bath', label: 'Bath', motive_id: 'wellbeing', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'brushed_teeth', label: 'Brushed teeth', motive_id: 'wellbeing', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false },
  { id: 'skincare', label: 'Skincare', motive_id: 'wellbeing', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
  { id: 'hair_wash', label: 'Hair wash', motive_id: 'wellbeing', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false },
  // Personal Wellbeing - Health tracking
  { id: 'weight', label: 'Weight', motive_id: 'wellbeing', type: 'value', unit: 'kg', default_value: 75, enabled: true, order: 6, pinned: false },
  { id: 'steps', label: 'Steps', motive_id: 'wellbeing', type: 'value', unit: 'steps', default_value: 1000, enabled: true, order: 7, pinned: false },
  { id: 'water_intake', label: 'Water intake', motive_id: 'wellbeing', type: 'value', unit: 'ml', default_value: 250, enabled: true, order: 8, pinned: false },

  // Exercise
  { id: 'walk', label: 'Walk', motive_id: 'exercise', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 1, pinned: false },
  { id: 'run', label: 'Run', motive_id: 'exercise', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 2, pinned: false },
  { id: 'cycle', label: 'Cycle', motive_id: 'exercise', type: 'value', unit: 'mins', default_value: 30, enabled: true, order: 3, pinned: false },
  { id: 'workout', label: 'Workout', motive_id: 'exercise', type: 'value', unit: 'mins', default_value: 30, enabled: true, order: 4, pinned: false },
  { id: 'stretching', label: 'Stretching', motive_id: 'exercise', type: 'value', unit: 'mins', default_value: 10, enabled: true, order: 5, pinned: false },
  { id: 'yoga', label: 'Yoga', motive_id: 'exercise', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 6, pinned: false },
  { id: 'gym_session', label: 'Gym session', motive_id: 'exercise', type: 'simple', unit: null, default_value: null, enabled: true, order: 7, pinned: false },
  { id: 'sports_activity', label: 'Sports activity', motive_id: 'exercise', type: 'value', unit: 'mins', default_value: 45, enabled: true, order: 8, pinned: false },

  // Productivity
  { id: 'worked_on_job', label: 'Worked on job', motive_id: 'productivity', type: 'value', unit: 'mins', default_value: 30, enabled: true, order: 1, pinned: false },
  { id: 'deep_work', label: 'Deep work', motive_id: 'productivity', type: 'value', unit: 'mins', default_value: 30, enabled: true, order: 2, pinned: false },
  { id: 'admin_tasks', label: 'Admin tasks', motive_id: 'productivity', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 3, pinned: false },
  { id: 'emails', label: 'Emails', motive_id: 'productivity', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
  { id: 'planning', label: 'Planning', motive_id: 'productivity', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false },
  { id: 'studied', label: 'Studied', motive_id: 'productivity', type: 'value', unit: 'mins', default_value: 30, enabled: true, order: 6, pinned: false },
  { id: 'side_project', label: 'Side project', motive_id: 'productivity', type: 'value', unit: 'mins', default_value: 30, enabled: true, order: 7, pinned: false },
  { id: 'learning', label: 'Learning', motive_id: 'productivity', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 8, pinned: false },

  // Reading & Media
  { id: 'read_book', label: 'Read book', motive_id: 'reading_media', type: 'value', unit: 'mins', default_value: 10, enabled: true, order: 1, pinned: false },
  { id: 'read_article', label: 'Read article', motive_id: 'reading_media', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'news_reading', label: 'News reading', motive_id: 'reading_media', type: 'value', unit: 'mins', default_value: 10, enabled: true, order: 3, pinned: false },
  { id: 'podcast', label: 'Podcast', motive_id: 'reading_media', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 4, pinned: false },
  { id: 'audiobook', label: 'Audiobook', motive_id: 'reading_media', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 5, pinned: false },

  // Leisure
  { id: 'watched_tv', label: 'Watched TV', motive_id: 'leisure', type: 'value', unit: 'mins', default_value: 30, enabled: true, order: 1, pinned: false },
  { id: 'movie', label: 'Movie', motive_id: 'leisure', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'youtube', label: 'YouTube', motive_id: 'leisure', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 3, pinned: false },
  { id: 'video_game', label: 'Video game', motive_id: 'leisure', type: 'value', unit: 'mins', default_value: 30, enabled: true, order: 4, pinned: false },
  { id: 'browsing_internet', label: 'Browsing internet', motive_id: 'leisure', type: 'value', unit: 'mins', default_value: 15, enabled: true, order: 5, pinned: false },
  { id: 'social_media', label: 'Social media', motive_id: 'leisure', type: 'value', unit: 'mins', default_value: 10, enabled: true, order: 6, pinned: false },
  { id: 'music_listening', label: 'Music listening', motive_id: 'leisure', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 7, pinned: false },

  // Social
  { id: 'called_friend', label: 'Called friend', motive_id: 'social', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'called_family', label: 'Called family', motive_id: 'social', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'met_friend', label: 'Met friend', motive_id: 'social', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false },
  { id: 'hosted_guest', label: 'Hosted guest', motive_id: 'social', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
  { id: 'visited_someone', label: 'Visited someone', motive_id: 'social', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false },
  { id: 'event_attended', label: 'Event attended', motive_id: 'social', type: 'simple', unit: null, default_value: null, enabled: true, order: 6, pinned: false },

  // Sleep
  { id: 'went_to_bed', label: 'Went to bed', motive_id: 'sleep', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'woke_up', label: 'Woke up', motive_id: 'sleep', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'sleep', label: 'Sleep', motive_id: 'sleep', type: 'value', unit: 'hours', default_value: 7, enabled: true, order: 3, pinned: false },
  { id: 'nap', label: 'Nap', motive_id: 'sleep', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 4, pinned: false },

  // Home Admin
  { id: 'paid_bill', label: 'Paid bill', motive_id: 'home_admin', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'budgeting', label: 'Budgeting', motive_id: 'home_admin', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'house_admin', label: 'House admin', motive_id: 'home_admin', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 3, pinned: false },
  { id: 'booking_appointment', label: 'Booking appointment', motive_id: 'home_admin', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
  { id: 'maintenance_task', label: 'Maintenance task', motive_id: 'home_admin', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false },

  // Outdoor / Errands
  { id: 'went_outside', label: 'Went outside', motive_id: 'outdoor', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'commute', label: 'Commute', motive_id: 'outdoor', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'walked_outside', label: 'Walked outside', motive_id: 'outdoor', type: 'value', unit: 'mins', default_value: 20, enabled: true, order: 3, pinned: false },
  { id: 'errands_run', label: 'Errands run', motive_id: 'outdoor', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
  { id: 'park_visit', label: 'Park visit', motive_id: 'outdoor', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false },
]

export const defaultContexts: Context[] = [
  {
    id: 'morning_routine',
    name: 'Morning routine',
    order: 1,
    statuses: [
      { status_id: 'woke_up', order: 1 },
      { status_id: 'showered', order: 2 },
      { status_id: 'brushed_teeth', order: 3 },
      { status_id: 'skincare', order: 4 },
      { status_id: 'weight', order: 5 },
      { status_id: 'ate_breakfast', order: 6 },
      { status_id: 'coffee', order: 7 },
      { status_id: 'tea', order: 8 },
    ],
  },
  {
    id: 'in_the_kitchen',
    name: 'In the kitchen',
    order: 2,
    statuses: [
      { status_id: 'cooked_breakfast', order: 1 },
      { status_id: 'cooked_lunch', order: 2 },
      { status_id: 'cooked_dinner', order: 3 },
      { status_id: 'washed_dishes', order: 4 },
      { status_id: 'loaded_dishwasher', order: 5 },
      { status_id: 'unloaded_dishwasher', order: 6 },
      { status_id: 'wiped_surfaces', order: 7 },
      { status_id: 'cleaned_kitchen', order: 8 },
    ],
  },
  {
    id: 'domestic_grind',
    name: 'Domestic grind',
    order: 3,
    statuses: [
      { status_id: 'vacuumed', order: 1 },
      { status_id: 'mopped_floor', order: 2 },
      { status_id: 'dusted', order: 3 },
      { status_id: 'cleaned_bathroom', order: 4 },
      { status_id: 'cleaned_toilet', order: 5 },
      { status_id: 'cleaned_shower', order: 6 },
      { status_id: 'started_laundry', order: 7 },
      { status_id: 'hung_laundry', order: 8 },
      { status_id: 'folded_laundry', order: 9 },
      { status_id: 'put_laundry_away', order: 10 },
      { status_id: 'changed_bedding', order: 11 },
      { status_id: 'took_bins_out', order: 12 },
    ],
  },
  {
    id: 'evening_wind_down',
    name: 'Evening wind-down',
    order: 4,
    statuses: [
      { status_id: 'ate_dinner', order: 1 },
      { status_id: 'brushed_teeth', order: 2 },
      { status_id: 'skincare', order: 3 },
      { status_id: 'went_to_bed', order: 4 },
      { status_id: 'sleep', order: 5 },
    ],
  },
]
