-- Add ent_id column to user table (external identifier, could be UUID or other format)
ALTER TABLE community.user ADD COLUMN ent_id TEXT NOT NULL;
ALTER TABLE community.user ADD CONSTRAINT user_ent_id_unique UNIQUE (ent_id);

-- Add inviter_id column to invitation table
ALTER TABLE community.invitation ADD COLUMN inviter_id BIGINT NOT NULL;
ALTER TABLE community.invitation ADD CONSTRAINT fk_invitation_inviter 
    FOREIGN KEY (inviter_id) REFERENCES community.user(id);

-- Add index for better query performance on invitations
CREATE INDEX idx_invitation_inviter ON community.invitation(inviter_id);

-- Add display_name column to user table
ALTER TABLE community.user ADD COLUMN display_name VARCHAR(255);