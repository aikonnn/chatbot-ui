CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists users(
    id uuid DEFAULT uuid_generate_v4(), 
    email text, 
    UNIQUE(email)
);

create table if not exists userstate(
    userid uuid, 
    apikey text,
    showchatbar boolean,
    showpromptbar boolean,
    selectedconversation uuid,
    UNIQUE(userid)
);

create table if not exists conversationhistory(
    id uuid DEFAULT uuid_generate_v4(), 
    created_at timestamp default CURRENT_TIMESTAMP,
    userid uuid,
    name text,
    model text, 
    prompt text,
    temperature float,
    folderid uuid
);

create table if not exists messages(
    id uuid DEFAULT uuid_generate_v4(),
    convid uuid,
    ts timestamp default CURRENT_TIMESTAMP,
    role text,
    content text
);

create table if not exists folders(
    id uuid DEFAULT uuid_generate_v4(),
    userid uuid,
    name text,
    type text
);

create table if not exists prompts(
    id uuid DEFAULT uuid_generate_v4(), 
    created_at timestamp default CURRENT_TIMESTAMP,
    userid uuid,
    name text,
    model text, 
    description text,
    content text,
    folderid uuid
);

create table if not exists plugins(
    userid uuid,
    pluginid text
);

create table if not exists googlekeys(
    userid uuid,
    google_api_key text,
    google_cse_id text
);