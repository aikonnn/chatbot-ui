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
    convid uuid,
    ts timestamp default CURRENT_TIMESTAMP,
    role text,
    content text
);

create table if not exists openaimodels(
    id text,
    name text,
    maxlength integer,
    tokenlimit integer
);

INSERT INTO openaimodels(id, name, maxlength, tokenlimit) values('gpt-3.5-turbo', 'GPT-3.5', 12000, 4000);
INSERT INTO openaimodels(id, name, maxlength, tokenlimit) values('gpt-35-turbo', 'GPT-3.5', 12000, 4000);
INSERT INTO openaimodels(id, name, maxlength, tokenlimit) values('gpt-4', 'GPT-4', 24000, 8000);
INSERT INTO openaimodels(id, name, maxlength, tokenlimit) values('gpt-4-32k', 'GPT-4-32K', 96000, 32000);