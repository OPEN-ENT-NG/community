-- Create the community schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS community;

-- Create the community table
CREATE TABLE community.community (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

-- Create the member table
CREATE TABLE community.member (
    id SERIAL PRIMARY KEY,
    ent_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

-- Create the community_member table (join table)
CREATE TABLE community.community_member (
    id SERIAL PRIMARY KEY,
    community_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (community_id) REFERENCES community.community(id),
    FOREIGN KEY (member_id) REFERENCES community.member(id)
);

-- Create the community_invitation table
CREATE TABLE community.community_invitation (
    id SERIAL PRIMARY KEY,
    community_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    refused_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('joined', 'refused', 'pending')),
    FOREIGN KEY (community_id) REFERENCES community.community(id),
    FOREIGN KEY (member_id) REFERENCES community.member(id)
);

-- Add indexes for foreign keys to improve query performance
CREATE INDEX idx_community_member_community_id ON community.community_member(community_id);
CREATE INDEX idx_community_member_member_id ON community.community_member(member_id);
CREATE INDEX idx_community_invitation_community_id ON community.community_invitation(community_id);
CREATE INDEX idx_community_invitation_member_id ON community.community_invitation(member_id);