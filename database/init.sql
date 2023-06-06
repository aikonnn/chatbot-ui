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