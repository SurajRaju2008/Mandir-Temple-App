-- Run this if you previously enabled the auto-profile trigger.
-- The app now creates profiles on the create-profile screen after signup.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
