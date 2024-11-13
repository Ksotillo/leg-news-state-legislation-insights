import { supabase } from './supabase';

interface UserPreferences {
  favorite_states?: string[];
  favorite_categories?: string[];
}

export async function createOrGetUser(clerkUserId: string, email?: string, name?: string) {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUserId)
      .single();

    if (existingUser) {
      return existingUser;
    }

    // Create new user if doesn't exist
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          id: Date.now(),
          clerk_id: clerkUserId,
          email,
          name,
          favorite_states: {},
          favorite_categories: {},
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return newUser;
  } catch (error) {
    console.error('Error in createOrGetUser:', error);
    throw error;
  }
}

export async function updateUserPreferences(
  userId: string, 
  preferences: UserPreferences
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(preferences)
      .eq('clerk_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
} 