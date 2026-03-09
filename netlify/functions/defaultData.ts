import type { Motive, Status, Context } from '../../src/types'

export const defaultMotives: Motive[] = [
  { id: 'kitchen', name: 'Kitchen', order: 1 },
  { id: 'domestic_grind', name: 'Domestic grind', order: 2 },
  { id: 'family', name: 'Family', order: 3 },
  { id: 'bathroom', name: 'Bathroom', order: 4 },
  { id: 'gold_stars', name: 'Gold stars', order: 5 },
]

export const defaultStatuses: Status[] = [
  // Kitchen
  { id: 'cooked_a_meal', label: 'Cooked a meal 🧑‍🍳', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'meal_planned', label: 'Meal Planned 📝', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'tidy_the_kitchen', label: 'Tidy the kitchen 🚰', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false },
  { id: 'dishwasher_loaded', label: 'Dishwasher loaded 💦', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
  { id: 'dishwasher_unloaded', label: 'Dishwasher unloaded 🍽️', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false },
  { id: 'surfaces_cleaned', label: 'Surfaces cleaned 🧽', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 6, pinned: false },
  { id: 'bins', label: 'Bins 🗑️', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 7, pinned: false },
  { id: 'eat_out', label: 'Eat out 🍛', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 8, pinned: false },

  // Domestic grind
  { id: 'laundry_loaded', label: 'Laundry loaded 🧺', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'laundry_cranked', label: 'Laundry cranked ⚙️', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'laundry_put_away', label: 'Laundry put away 🧦', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false },
  { id: 'tidied_to_zero', label: 'Tidied to zero 🧹', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
  { id: 'kelvin_run', label: 'Kelvin run 🤖', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false },

  // Family
  { id: 'supervised_homework', label: 'Supervised homework 📚', motive_id: 'family', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'oversaw_piano_practice', label: 'Oversaw piano practice 🎹', motive_id: 'family', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'drank_coffee', label: 'Drank Coffee ☕️', motive_id: 'family', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false },
  { id: 'drank_tea', label: 'Drank Tea 🫖', motive_id: 'family', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
  { id: 'kid_bath', label: 'Kid bath 🛁', motive_id: 'family', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false },
  { id: 'kid_bedtime', label: 'Kid bedtime 🛏️', motive_id: 'family', type: 'simple', unit: null, default_value: null, enabled: true, order: 6, pinned: false },
  { id: 'online_grocery_shop', label: 'Online grocery shop 📱', motive_id: 'family', type: 'simple', unit: null, default_value: null, enabled: true, order: 7, pinned: false },
  { id: 'top_up_shop', label: 'Top up shop 🛒', motive_id: 'family', type: 'simple', unit: null, default_value: null, enabled: true, order: 8, pinned: false },
  { id: 'put_the_house_to_bed', label: 'Put the house to bed 🌙', motive_id: 'family', type: 'simple', unit: null, default_value: null, enabled: true, order: 9, pinned: false },

  // Bathroom
  { id: 'teeth', label: 'Teeth 🦷', motive_id: 'bathroom', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'wash', label: 'Wash 🛀', motive_id: 'bathroom', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },

  // Gold stars
  { id: 'tidy_a_drawer', label: 'Tidy a drawer ✨', motive_id: 'gold_stars', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false },
  { id: 'prep_an_outbox', label: 'Prep an outbox ⭐', motive_id: 'gold_stars', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false },
  { id: 'empty_outbox', label: 'Empty outbox 🌟', motive_id: 'gold_stars', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false },
  { id: 'sort_your_life_out', label: 'Sort your life out 💫', motive_id: 'gold_stars', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false },
]

export const defaultContexts: Context[] = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    order: 1,
    statuses: [
      { status_id: 'cooked_a_meal', order: 1 },
      { status_id: 'meal_planned', order: 2 },
      { status_id: 'tidy_the_kitchen', order: 3 },
      { status_id: 'dishwasher_loaded', order: 4 },
      { status_id: 'dishwasher_unloaded', order: 5 },
      { status_id: 'surfaces_cleaned', order: 6 },
      { status_id: 'bins', order: 7 },
      { status_id: 'eat_out', order: 8 },
    ],
  },
  {
    id: 'domestic_grind',
    name: 'Domestic grind',
    order: 2,
    statuses: [
      { status_id: 'laundry_loaded', order: 1 },
      { status_id: 'laundry_cranked', order: 2 },
      { status_id: 'laundry_put_away', order: 3 },
      { status_id: 'tidied_to_zero', order: 4 },
      { status_id: 'kelvin_run', order: 5 },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    order: 3,
    statuses: [
      { status_id: 'supervised_homework', order: 1 },
      { status_id: 'oversaw_piano_practice', order: 2 },
      { status_id: 'drank_coffee', order: 3 },
      { status_id: 'drank_tea', order: 4 },
      { status_id: 'kid_bath', order: 5 },
      { status_id: 'kid_bedtime', order: 6 },
      { status_id: 'online_grocery_shop', order: 7 },
      { status_id: 'top_up_shop', order: 8 },
      { status_id: 'put_the_house_to_bed', order: 9 },
    ],
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    order: 4,
    statuses: [
      { status_id: 'teeth', order: 1 },
      { status_id: 'wash', order: 2 },
    ],
  },
  {
    id: 'gold_stars',
    name: 'Gold stars',
    order: 5,
    statuses: [
      { status_id: 'tidy_a_drawer', order: 1 },
      { status_id: 'prep_an_outbox', order: 2 },
      { status_id: 'empty_outbox', order: 3 },
      { status_id: 'sort_your_life_out', order: 4 },
    ],
  },
]
