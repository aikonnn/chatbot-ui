CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists users(
    id uuid DEFAULT uuid_generate_v4(), 
    email text, 
    UNIQUE(email)
);

create table if not exists userState(
    userid uuid, --LINK TO convoHistory,folders,prompts,pluginKeys
    apiKey text,
    showChatbar boolean,
    showPromptbar boolean,
    selectedConversation uuid,
    UNIQUE(userid)
);

create table if not exists conversationHistory(
    id uuid DEFAULT uuid_generate_v4(), --link to messages
    userid uuid,
    model text, --key to static table openaimodels
    prompt text,
    temperature number,
    folderId uuid,
)

create table if not exists messages(
    convid uuid,
    ts timestamp default CURRENT_TIMESTAMP(),
    _role text,
    content text,
)