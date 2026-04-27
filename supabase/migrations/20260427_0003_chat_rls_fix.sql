-- Arogya: Fix conversations insert RLS
-- Root cause: conversations insert policy validated roles via public.profiles,
-- but profiles RLS prevented reading the "other" participant before the
-- conversation existed, causing inserts to fail with 42501.

-- Allow inserts based only on participant membership, and validate roles via a
-- trigger that runs as a SECURITY DEFINER (bypasses profiles RLS safely).

create or replace function public.chat_assert_profile_role(target_user_id uuid, expected_role public.user_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actual public.user_role;
begin
  select p.role into actual
  from public.profiles p
  where p.user_id = target_user_id;

  if actual is distinct from expected_role then
    raise exception 'Invalid participant role: expected %, got % (user_id=%)', expected_role, actual, target_user_id;
  end if;
end;
$$;

revoke all on function public.chat_assert_profile_role(uuid, public.user_role) from public;
grant execute on function public.chat_assert_profile_role(uuid, public.user_role) to authenticated;

-- Validate provider/patient role pairing on insert.
create or replace function public.chat_validate_conversation_participants()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.chat_assert_profile_role(new.provider_user_id, 'provider');
  perform public.chat_assert_profile_role(new.patient_user_id, 'patient');
  return new;
end;
$$;

revoke all on function public.chat_validate_conversation_participants() from public;
grant execute on function public.chat_validate_conversation_participants() to authenticated;

drop trigger if exists conversations_validate_participants on public.conversations;
create trigger conversations_validate_participants
before insert on public.conversations
for each row execute function public.chat_validate_conversation_participants();

-- Replace the insert policy to avoid profiles lookups (which were blocked by RLS).
drop policy if exists conversations_insert_participant on public.conversations;
create policy conversations_insert_participant
on public.conversations
for insert
with check (auth.uid() = provider_user_id or auth.uid() = patient_user_id);
