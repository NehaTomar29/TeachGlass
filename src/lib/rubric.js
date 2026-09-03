export const RUBRIC_CATEGORIES = [
  {
    id: 'autonomy',
    title: '1. Teacher Autonomy and Support',
    items: [
      { id: 'autonomy_planning', label: '1.1 Autonomous classroom planning and management' },
      { id: 'autonomy_support', label: '1.2 Institutional support' },
      { id: 'autonomy_sharing', label: '1.3 Ideas and best practices sharing mechanism' },
    ],
  },
  {
    id: 'leadership',
    title: '2. Leadership and Promotion Opportunities',
    items: [
      { id: 'leadership_promotion', label: '2.1 Chances of promotion' },
      { id: 'leadership_dev', label: '2.2 Professional development' },
      { id: 'leadership_conflict', label: '2.3 Parent teacher conflict support' },
      { id: 'leadership_interaction', label: '2.4 Mechanised interaction with leadership' },
    ],
  },
  {
    id: 'financial',
    title: '3. Financial Transparency and Welfare',
    items: [
      { id: 'financial_salary', label: '3.1 Timed salary' },
      { id: 'financial_payout', label: '3.2 Payout' },
      { id: 'financial_waivers', label: '3.3 Child fee waivers' },
      { id: 'financial_food', label: '3.4 Food allowances/facilities' },
      { id: 'financial_counselling', label: '3.5 Counselling benefits' },
      { id: 'financial_pressure', label: '3.6 Student performance pressure' },
      { id: 'financial_probation', label: '3.7 Probation period' },
      { id: 'financial_leaves', label: '3.8 Paid and maternity leave policy' },
      { id: 'financial_safety', label: '3.9 Teacher safety and POSH' },
    ],
  },
  {
    id: 'worklife',
    title: '4. Work Life Balance',
    items: [
      { id: 'worklife_stayback', label: '4.1 Frequency of stayback' },
      { id: 'worklife_availability', label: '4.2 24/7 availability expectation' },
      { id: 'worklife_workload', label: '4.3 After school hours workload' },
    ],
  },
  {
    id: 'infra',
    title: '5. Infrastructure and Resources',
    items: [
      { id: 'infra_sanitation', label: '5.1 Sanitation facilities' },
      { id: 'infra_staffroom', label: '5.2 Well equipped staffroom and personal spaces' },
      { id: 'infra_transport', label: '5.3 Transport allowance/facilities' },
      { id: 'infra_materials', label: '5.4 Study material support' },
    ],
  },
  {
    id: 'parents',
    title: '6. Student and Parent Support',
    items: [
      { id: 'parents_interaction', label: '6.1 Smooth parent teacher interaction' },
      { id: 'parents_support', label: '6.2 Parent support' },
    ],
  },
];

export const RED_FLAGS = [
  { id: 'rf_documents', label: 'Mandatory original document submission' },
  { id: 'rf_no_sitting', label: 'No sitting in classroom policy' },
  { id: 'rf_surveillance', label: 'Constant surveillance' },
  { id: 'rf_respect', label: 'Lack of compassion and respect from leadership' },
];

/**
 * Calculates category averages and an overall 5-star rating out of subcategory inputs.
 */
export const calculateRubricScores = (subScores = {}) => {
  let totalScore = 0;
  let totalItemsCount = 0;
  const categoryAverages = {};

  RUBRIC_CATEGORIES.forEach((category) => {
    let catSum = 0;
    let catCount = 0;

    category.items.forEach((item) => {
      const val = Number(subScores[item.id]) || 0;
      if (val > 0) {
        catSum += val;
        catCount += 1;
      }
    });

    const catAvg = catCount > 0 ? catSum / catCount : 0;
    categoryAverages[category.id] = Number(catAvg.toFixed(2));

    totalScore += catSum;
    totalItemsCount += catCount;
  });

  const overallRating = totalItemsCount > 0 ? (totalScore / totalItemsCount).toFixed(1) : 0;

  return {
    overallRating: Number(overallRating),
    categoryAverages,
  };
};
