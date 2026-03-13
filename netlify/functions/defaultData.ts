import type { Motive, Status, Context } from '../../src/types'

export const defaultMotives: Motive[] = [
  { id: 'kitchen', name: 'Kitchen', order: 1 },
  { id: 'domestic_grind', name: 'Domestic grind', order: 2 },
  { id: 'family', name: 'Family', order: 3 },
  { id: 'bathroom', name: 'Bathroom', order: 4 },
  { id: 'badges', name: 'Badges', order: 5 },
]

export const defaultStatuses: Status[] = [
  // Kitchen
  { id: 'cooked_a_meal', label: 'Healthy, home cooked meal 🧑‍🍳', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false, status_category: 'task' },
  { id: 'dishwasher_loaded', label: 'Dishwasher loaded 💦', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false, status_category: 'task' },
  { id: 'dishwasher_unloaded', label: 'Dishwasher unloaded 🍽️', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false, status_category: 'task' },
  { id: 'surfaces_cleaned', label: 'Surfaces cleaned 🧽', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false, status_category: 'task' },
  { id: 'bins', label: 'Bins 🗑️', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false, status_category: 'task' },

  // Domestic grind
  { id: 'laundry_loaded', label: 'Laundry loaded 🧺', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false, status_category: 'task' },
  { id: 'laundry_cranked', label: 'Laundry cranked ⚙️', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false, status_category: 'task' },
  { id: 'laundry_put_away', label: 'Laundry put away 🧦', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false, status_category: 'task' },
  { id: 'tidied_to_zero', label: 'Tidied to zero 🧹', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false, status_category: 'task' },
  { id: 'kelvin_run', label: 'Kelvin run 🤖', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false, status_category: 'task' },
  { id: 'bedsheets', label: 'Bedsheets 🛏️', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 6, pinned: false, status_category: 'task' },
  { id: 'towels', label: 'Towels 🧖‍♀️', motive_id: 'domestic_grind', type: 'simple', unit: null, default_value: null, enabled: true, order: 7, pinned: false, status_category: 'task' },

  // Food and Drink (statuses)
  { id: 'drank_coffee', label: 'Coffee ☕️', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 6, pinned: false, status_category: 'task' },
  { id: 'drank_tea', label: 'Tea 🫖', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 7, pinned: false, status_category: 'task' },
  { id: 'snack', label: 'Snack 🍪', motive_id: 'kitchen', type: 'simple', unit: null, default_value: null, enabled: true, order: 8, pinned: false, status_category: 'task' },

  // Family
  { id: 'online_grocery_shop', label: 'Big shop 🛒', motive_id: 'family', type: 'value', unit: '£', default_value: 80, enabled: true, order: 1, pinned: false, status_category: 'task' },
  { id: 'top_up_shop', label: 'Top up shop 🛒', motive_id: 'family', type: 'value', unit: '£', default_value: 20, enabled: true, order: 2, pinned: false, status_category: 'task' },
  { id: 'lazy_cafe', label: 'Eating out 🥣', motive_id: 'family', type: 'value', unit: '£', default_value: 25, enabled: true, order: 3, pinned: false, status_category: 'task' },
  { id: 'default_delivery', label: 'Takeaway 🍕', motive_id: 'family', type: 'value', unit: '£', default_value: 25, enabled: true, order: 4, pinned: false, status_category: 'task' },

  // Bathroom
  { id: 'teeth', label: 'Teeth 🦷', motive_id: 'bathroom', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false, status_category: 'task' },
  { id: 'wash', label: 'Wash 🛀', motive_id: 'bathroom', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false, status_category: 'task' },

  // Badges
  { id: 'badge_up_and_out', label: 'Up and out ⏰', motive_id: 'badges', type: 'simple', unit: null, default_value: null, enabled: true, order: 1, pinned: false, status_category: 'badge', criteria: 'Out of the house before 8.20', valence: 'positive' },
  { id: 'badge_robo_ready', label: 'Robo-ready 🤖', motive_id: 'badges', type: 'simple', unit: null, default_value: null, enabled: true, order: 2, pinned: false, status_category: 'badge', criteria: 'Starting Kelvin on the up and out', valence: 'positive' },
  { id: 'badge_home_cooked', label: 'Home cooked 🥗', motive_id: 'badges', type: 'simple', unit: null, default_value: null, enabled: true, order: 3, pinned: false, status_category: 'badge', criteria: '3 healthy home cooked meals', valence: 'positive' },
  { id: 'badge_big_napper', label: 'Big napper 👩‍🍼', motive_id: 'badges', type: 'simple', unit: null, default_value: null, enabled: true, order: 4, pinned: false, status_category: 'badge', criteria: 'Nap off at least 2 hours', valence: 'positive' },
  { id: 'badge_good_lad', label: 'Good lad ⭐', motive_id: 'badges', type: 'simple', unit: null, default_value: null, enabled: true, order: 5, pinned: false, status_category: 'badge', criteria: 'Attitude star', valence: 'positive' },
  { id: 'badge_golden_bedtime', label: 'Golden bedtime 🛌', motive_id: 'badges', type: 'simple', unit: null, default_value: null, enabled: true, order: 6, pinned: false, status_category: 'badge', criteria: 'Down by 8.35', valence: 'positive' },
  { id: 'badge_street_picnic', label: 'Street Picnic 🥪', motive_id: 'badges', type: 'simple', unit: null, default_value: null, enabled: true, order: 7, pinned: false, status_category: 'badge', criteria: 'Lunch off a meal deal', valence: 'negative' },
  { id: 'badge_lazy_cafe', label: 'Lazy Cafe 🍟', motive_id: 'badges', type: 'simple', unit: null, default_value: null, enabled: true, order: 8, pinned: false, status_category: 'badge', criteria: 'Eat out through laziness', valence: 'negative' },
  { id: 'badge_default_delivery', label: 'Default delivery 🍕', motive_id: 'badges', type: 'simple', unit: null, default_value: null, enabled: true, order: 9, pinned: false, status_category: 'badge', criteria: 'Get take out', valence: 'negative' },

]

export const defaultContexts: Context[] = [
  {
    id: 'food_and_drink',
    name: 'Food and Drink',
    order: 1,
    statuses: [
      { status_id: 'cooked_a_meal', order: 1 },
      { status_id: 'drank_coffee', order: 2 },
      { status_id: 'drank_tea', order: 3 },
      { status_id: 'snack', order: 4 },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    order: 2,
    statuses: [
      { status_id: 'dishwasher_loaded', order: 1 },
      { status_id: 'dishwasher_unloaded', order: 2 },
      { status_id: 'surfaces_cleaned', order: 3 },
      { status_id: 'bins', order: 4 },
    ],
  },
  {
    id: 'domestic_grind',
    name: 'Domestic grind',
    order: 3,
    statuses: [
      { status_id: 'laundry_loaded', order: 1 },
      { status_id: 'laundry_cranked', order: 2 },
      { status_id: 'laundry_put_away', order: 3 },
      { status_id: 'tidied_to_zero', order: 4 },
      { status_id: 'kelvin_run', order: 5 },
      { status_id: 'bedsheets', order: 6 },
      { status_id: 'towels', order: 7 },
    ],
  },
  {
    id: 'family',
    name: 'Money',
    order: 4,
    statuses: [
      { status_id: 'online_grocery_shop', order: 1 },
      { status_id: 'top_up_shop', order: 2 },
      { status_id: 'lazy_cafe', order: 3 },
      { status_id: 'default_delivery', order: 4 },
    ],
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    order: 5,
    statuses: [
      { status_id: 'teeth', order: 1 },
      { status_id: 'wash', order: 2 },
    ],
  },
]
