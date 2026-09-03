import { supabase } from './supabaseClient';

// --- SCHOOLS ---
export const fetchSchools = async (searchQuery = '') => {
  let query = supabase.from('schools').select('*');
  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const fetchSchoolById = async (schoolId) => {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('id', schoolId)
    .single();
  if (error) throw error;
  return data;
};

export const createSchoolRequest = async (schoolData) => {
  const { data, error } = await supabase
    .from('school_requests')
    .insert([schoolData]);
  if (error) throw error;
  return data;
};

// --- REVIEWS & RUBRICS ---
export const fetchSchoolReviews = async (schoolId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const submitSchoolRating = async (ratingPayload) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([ratingPayload]);
  if (error) throw error;
  return data;
};

// --- VERIFICATION REQUESTS ---
export const submitTeacherVerification = async (verificationData) => {
  const { data, error } = await supabase
    .from('verification_requests')
    .insert([verificationData]);
  if (error) throw error;
  return data;
};
