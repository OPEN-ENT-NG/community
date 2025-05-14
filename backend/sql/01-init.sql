-- Create schema
CREATE SCHEMA IF NOT EXISTS community;

-- Enum types
CREATE TYPE community.community_type AS ENUM ('CLASS', 'FREE');
CREATE TYPE community.invitation_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
CREATE TYPE community.membership_role AS ENUM ('ADMIN', 'MEMBER');
CREATE TYPE community.resource_type AS ENUM ('IMAGE', 'VIDEO', 'SOUND', 'ENT', 'EXTERNAL_LINK');

-- Table user
CREATE TABLE IF NOT EXISTS community.user (
    id BIGSERIAL PRIMARY KEY
);

-- Table community
CREATE TABLE community.community (
    id BIGSERIAL PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    update_date TIMESTAMP WITH TIME ZONE,
    type community.community_type NOT NULL,
    school_year_start INTEGER,
    school_year_end INTEGER,
    welcome_note TEXT,
    discussion_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    archived_date TIMESTAMP WITH TIME ZONE,
    secret_code VARCHAR(64),
    creator_id BIGINT NOT NULL REFERENCES community.user(id),
    modifier_id BIGINT REFERENCES community.user(id),
    archiver_id BIGINT REFERENCES community.user(id)
);

-- Table invitation
CREATE TABLE community.invitation (
    id BIGSERIAL PRIMARY KEY,
    invitation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    modification_date TIMESTAMP WITH TIME ZONE,
    status community.invitation_status NOT NULL,
    community_id BIGINT NOT NULL REFERENCES community.community(id),
    user_id BIGINT NOT NULL REFERENCES community.user(id)
);

-- Table membership
CREATE TABLE community.membership (
    id BIGSERIAL PRIMARY KEY,
    join_date TIMESTAMP WITH TIME ZONE NOT NULL,
    role community.membership_role NOT NULL,
    last_visit_announcements_date TIMESTAMP WITH TIME ZONE,
    last_visit_resources_date TIMESTAMP WITH TIME ZONE,
    last_visit_wiki_date TIMESTAMP WITH TIME ZONE,
    last_visit_discussions_date TIMESTAMP WITH TIME ZONE,
    community_id BIGINT NOT NULL REFERENCES community.community(id),
    user_id BIGINT NOT NULL REFERENCES community.user(id),
    inviter_id BIGINT REFERENCES community.user(id)
);

-- Table message
CREATE TABLE community.message (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    publication_date TIMESTAMP WITH TIME ZONE NOT NULL,
    author_id BIGINT NOT NULL REFERENCES community.user(id),
    community_id BIGINT NOT NULL REFERENCES community.community(id)
);

-- Table announcement
CREATE TABLE community.announcement (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    publication_date TIMESTAMP WITH TIME ZONE NOT NULL,
    modification_date TIMESTAMP WITH TIME ZONE,
    author_id BIGINT NOT NULL REFERENCES community.user(id),
    community_id BIGINT NOT NULL REFERENCES community.community(id)
);

-- Table course
CREATE TABLE community.course (
    id VARCHAR(255) PRIMARY KEY
);

-- Table resource
CREATE TABLE community.resource (
    id BIGSERIAL PRIMARY KEY,
    type community.resource_type NOT NULL,
    url VARCHAR(1024) NOT NULL,
    title VARCHAR(255) NOT NULL,
    added_date TIMESTAMP WITH TIME ZONE NOT NULL,
    open_in_new_tab BOOLEAN NOT NULL DEFAULT FALSE,
    app_name VARCHAR(128),
    author_id BIGINT NOT NULL REFERENCES community.user(id),
    community_id BIGINT NOT NULL REFERENCES community.community(id)
);

-- Table folder
CREATE TABLE community.folder (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    modification_date TIMESTAMP WITH TIME ZONE,
    is_root BOOLEAN NOT NULL DEFAULT FALSE,
    creator_id BIGINT NOT NULL REFERENCES community.user(id),
    modifier_id BIGINT REFERENCES community.user(id),
    parent_id BIGINT REFERENCES community.folder(id),
    community_id BIGINT NOT NULL REFERENCES community.community(id)
);

-- Table topic
CREATE TABLE community.topic (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    hidden BOOLEAN NOT NULL DEFAULT FALSE,
    theme VARCHAR(128),
    creator_id BIGINT NOT NULL REFERENCES community.user(id),
    community_id BIGINT NOT NULL REFERENCES community.community(id)
);

-- Table topic_message
CREATE TABLE community.topic_message (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    publication_date TIMESTAMP WITH TIME ZONE NOT NULL,
    modification_date TIMESTAMP WITH TIME ZONE,
    author_id BIGINT NOT NULL REFERENCES community.user(id),
    topic_id BIGINT NOT NULL REFERENCES community.topic(id)
);

-- Join Tables M:N
CREATE TABLE community.community_course (
    community_id BIGINT REFERENCES community.community(id),
    course_id VARCHAR(255) REFERENCES community.course(id),
    PRIMARY KEY (community_id, course_id)
);

CREATE TABLE community.resource_folder (
    resource_id BIGINT REFERENCES community.resource(id),
    folder_id BIGINT REFERENCES community.folder(id),
    PRIMARY KEY (resource_id, folder_id)
);

-- Materialized views
CREATE MATERIALIZED VIEW community.community_stats AS
SELECT 
    c.id AS community_id,
    COUNT(m.id) AS total_members,
    COUNT(CASE WHEN m.role = 'MEMBER' THEN 1 ELSE NULL END) AS accepted_members,
    COUNT(CASE WHEN m.role = 'ADMIN' THEN 1 ELSE NULL END) AS total_admins,
    COUNT(CASE WHEN m.role = 'ADMIN' THEN 1 ELSE NULL END) AS accepted_admins
FROM 
    community.community c
LEFT JOIN 
    community.membership m ON c.id = m.community_id
GROUP BY 
    c.id;

CREATE MATERIALIZED VIEW community.folder_stats AS
SELECT 
    f.id AS folder_id,
    COUNT(c.id) AS child_count
FROM 
    community.folder f
LEFT JOIN 
    community.folder c ON f.id = c.parent_id
GROUP BY 
    f.id;

CREATE MATERIALIZED VIEW community.topic_stats AS
SELECT 
    t.id AS topic_id,
    COUNT(m.id) AS message_count,
    MAX(m.publication_date) AS last_message_date,
    string_agg(DISTINCT CAST(m.author_id AS VARCHAR), ',') AS last_five_user_ids
FROM 
    community.topic t
LEFT JOIN 
    community.topic_message m ON t.id = m.topic_id
GROUP BY 
    t.id;

CREATE MATERIALIZED VIEW community.community_activity_stats AS
SELECT 
    c.id AS community_id,
    MAX(a.publication_date) AS last_announcement_update_date,
    MAX(r.added_date) AS last_resource_update_date,
    NULL::TIMESTAMP WITH TIME ZONE AS last_wiki_update_date, -- to be adapted based on your logic
    MAX(tm.publication_date) AS last_discussion_update_date
FROM 
    community.community c
LEFT JOIN 
    community.announcement a ON c.id = a.community_id
LEFT JOIN 
    community.resource r ON c.id = r.community_id
LEFT JOIN 
    community.topic t ON c.id = t.community_id
LEFT JOIN 
    community.topic_message tm ON t.id = tm.topic_id
GROUP BY 
    c.id;

-- Indexes
CREATE INDEX idx_membership_community_id ON community.membership(community_id);
CREATE INDEX idx_membership_user_id ON community.membership(user_id);
CREATE INDEX idx_invitation_community_id ON community.invitation(community_id);
CREATE INDEX idx_invitation_user_id ON community.invitation(user_id);
CREATE INDEX idx_resource_community_id ON community.resource(community_id);
CREATE INDEX idx_folder_community_id ON community.folder(community_id);
CREATE INDEX idx_folder_parent_id ON community.folder(parent_id);
CREATE INDEX idx_topic_community_id ON community.topic(community_id);
CREATE INDEX idx_topic_message_topic_id ON community.topic_message(topic_id);