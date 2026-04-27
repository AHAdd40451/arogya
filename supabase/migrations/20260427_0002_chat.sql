-- Arogya: Provider <-> Patient Chat (Supabase Realtime)
-- Adds:
-- - public.conversations
-- - public.messages
-- - RLS policies so only conversation participants can read/write
-- - Triggers to keep conversation last_message fields in sync

create extension if not exists "pgcrypto";

-- Enums
do $$
begin
  create type public.chat_message_type as enum ('text', 'file', 'system');
exception
  when duplicate_object then null;
end $$;

-- Conversations (1 per provider/patient pair)
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  provider_user_id uuid not null,
  patient_user_id uuid not null,
  status text not null default 'active',
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_provider_user_fk
    foreign key (provider_user_id) references public.profiles(user_id) on delete cascade,
  constraint conversations_patient_user_fk
    foreign key (patient_user_id) references public.profiles(user_id) on delete cascade,
  constraint conversations_distinct_participants check (provider_user_id <> patient_user_id)
);

create unique index if not exists conversations_provider_patient_unique
  on public.conversations(provider_user_id, patient_user_id);
create index if not exists conversations_provider_idx on public.conversations(provider_user_id);
create index if not exists conversations_patient_idx on public.conversations(patient_user_id);
create index if not exists conversations_last_message_at_idx
  on public.conversations(last_message_at desc nulls last);

-- updated_at
drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

-- Prevent changing participants after creation (avoids partner swapping).
create or replace function public.conversations_participants_immutable()
returns trigger
language plpgsql
as $$
begin
  if new.provider_user_id is distinct from old.provider_user_id
     or new.patient_user_id is distinct from old.patient_user_id then
    raise exception 'conversation participants are immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists conversations_participants_immutable on public.conversations;
create trigger conversations_participants_immutable
before update of provider_user_id, patient_user_id on public.conversations
for each row execute function public.conversations_participants_immutable();

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  sender_user_id uuid not null,
  message_type public.chat_message_type not null default 'text',
  message text,
  file_url text,
  seen boolean not null default false,
  seen_at timestamptz,
  seen_by_user_id uuid,
  created_at timestamptz not null default now(),
  constraint messages_conversation_fk
    foreign key (conversation_id) references public.conversations(id) on delete cascade,
  constraint messages_sender_fk
    foreign key (sender_user_id) references public.profiles(user_id) on delete cascade,
  constraint messages_seen_by_fk
    foreign key (seen_by_user_id) references public.profiles(user_id) on delete set null,
  constraint messages_payload_valid check (
    (message_type = 'text' and message is not null and btrim(message) <> '')
    or (message_type = 'file' and file_url is not null and btrim(file_url) <> '')
    or (message_type = 'system' and message is not null)
  )
);

create index if not exists messages_conversation_created_at_idx
  on public.messages(conversation_id, created_at);
create index if not exists messages_sender_idx
  on public.messages(sender_user_id);
create index if not exists messages_seen_idx
  on public.messages(conversation_id, seen) where seen = false;

-- Prevent editing message content after insert (only allow seen-related fields to change).
create or replace function public.messages_only_seen_mutable()
returns trigger
language plpgsql
as $$
begin
  if new.conversation_id is distinct from old.conversation_id
     or new.sender_user_id is distinct from old.sender_user_id
     or new.message_type is distinct from old.message_type
     or new.message is distinct from old.message
     or new.file_url is distinct from old.file_url
     or new.created_at is distinct from old.created_at then
    raise exception 'message content is immutable; only seen fields can be updated';
  end if;
  return new;
end;
$$;

drop trigger if exists messages_only_seen_mutable on public.messages;
create trigger messages_only_seen_mutable
before update on public.messages
for each row execute function public.messages_only_seen_mutable();

-- Keep conversation "last message" in sync.
create or replace function public.chat_handle_message_insert()
returns trigger
language plpgsql
as $$
declare
  preview text;
begin
  preview :=
    case
      when new.message_type = 'file' then '[File]'
      when new.message_type = 'system' then coalesce(new.message, '[System]')
      else new.message
    end;

  update public.conversations c
  set
    last_message = preview,
    last_message_at = new.created_at
  where c.id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists messages_after_insert_update_conversation on public.messages;
create trigger messages_after_insert_update_conversation
after insert on public.messages
for each row execute function public.chat_handle_message_insert();

-- RLS
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Conversations: only participants can read/write.
drop policy if exists conversations_select_participant on public.conversations;
create policy conversations_select_participant
on public.conversations
for select
using (auth.uid() = provider_user_id or auth.uid() = patient_user_id);

drop policy if exists conversations_insert_participant on public.conversations;
create policy conversations_insert_participant
on public.conversations
for insert
with check (
  (auth.uid() = provider_user_id or auth.uid() = patient_user_id)
  and exists (
    select 1 from public.profiles p
    where p.user_id = provider_user_id and p.role = 'provider'
  )
  and exists (
    select 1 from public.profiles p
    where p.user_id = patient_user_id and p.role = 'patient'
  )
);

-- Needed so the message insert trigger can update last_message fields.
drop policy if exists conversations_update_participant on public.conversations;
create policy conversations_update_participant
on public.conversations
for update
using (auth.uid() = provider_user_id or auth.uid() = patient_user_id)
with check (auth.uid() = provider_user_id or auth.uid() = patient_user_id);

-- Messages: only participants can read/send.
drop policy if exists messages_select_participant on public.messages;
create policy messages_select_participant
on public.messages
for select
using (
  exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
      and (auth.uid() = c.provider_user_id or auth.uid() = c.patient_user_id)
  )
);

drop policy if exists messages_insert_participant on public.messages;
create policy messages_insert_participant
on public.messages
for insert
with check (
  auth.uid() = sender_user_id
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (auth.uid() = c.provider_user_id or auth.uid() = c.patient_user_id)
  )
);

-- Messages: allow recipients to mark as seen.
drop policy if exists messages_update_seen_by_recipient on public.messages;
create policy messages_update_seen_by_recipient
on public.messages
for update
using (
  sender_user_id <> auth.uid()
  and exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
      and (auth.uid() = c.provider_user_id or auth.uid() = c.patient_user_id)
  )
)
with check (
  sender_user_id <> auth.uid()
  and seen = true
  and seen_at is not null
  and seen_by_user_id = auth.uid()
  and exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
      and (auth.uid() = c.provider_user_id or auth.uid() = c.patient_user_id)
  )
);

-- Profiles: allow chat participants to read each other's profile row.
-- IMPORTANT: the frontend's fetchMyProfile() should always filter by user_id.
drop policy if exists profiles_select_chat_participants on public.profiles;
create policy profiles_select_chat_participants
on public.profiles
for select
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.conversations c
    where (c.provider_user_id = auth.uid() and c.patient_user_id = profiles.user_id)
       or (c.patient_user_id = auth.uid() and c.provider_user_id = profiles.user_id)
  )
);

-- Realtime publication (best-effort: not all environments expose this publication).
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.conversations;
    exception when duplicate_object then null;
    end;

    begin
      alter publication supabase_realtime add table public.messages;
    exception when duplicate_object then null;
    end;
  end if;
end $$;
