import { supabase } from './supabaseClient';

// --- AUTH ---
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

// --- STUDENTS ---
export async function createStudent(data: any) {
  return supabase.from('students').insert([data]);
}

export async function getStudents() {
  return supabase.from('students').select('*');
}

export async function updateStudent(id: string, data: any) {
  return supabase.from('students').update(data).eq('id', id);
}

export async function deleteStudent(id: string) {
  return supabase.from('students').delete().eq('id', id);
}

// --- SESSIONS ---
export async function createSession(data: any) {
  return supabase.from('sessions').insert([data]);
}

export async function getSessions() {
  return supabase.from('sessions').select('*');
}

export async function updateSession(id: string, data: any) {
  return supabase.from('sessions').update(data).eq('id', id);
}

export async function deleteSession(id: string) {
  return supabase.from('sessions').delete().eq('id', id);
}

// --- NOTES ---
export async function createNote(data: any) {
  return supabase.from('notes').insert([data]);
}

export async function getNotes() {
  return supabase.from('notes').select('*');
}

export async function updateNote(id: string, data: any) {
  return supabase.from('notes').update(data).eq('id', id);
}

export async function deleteNote(id: string) {
  return supabase.from('notes').delete().eq('id', id);
}

// --- TUTORS ---
export async function createTutor(data: any) {
  return supabase.from('tutors').insert([data]);
}

export async function getTutors() {
  return supabase.from('tutors').select('*');
}

export async function updateTutor(id: string, data: any) {
  return supabase.from('tutors').update(data).eq('id', id);
}

export async function deleteTutor(id: string) {
  return supabase.from('tutors').delete().eq('id', id);
}

// --- USERS ---
export async function getUsers() {
  return supabase.from('users').select('*');
}

export async function updateUser(id: string, data: any) {
  return supabase.from('users').update(data).eq('id', id);
}

export async function deleteUser(id: string) {
  return supabase.from('users').delete().eq('id', id);
} 