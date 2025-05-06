-- Add ent_id column to users table (unique UUID identifier)
ALTER TABLE users ADD COLUMN ent_id UUID NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_ent_id_unique UNIQUE (ent_id);
-- Add inviter_id column to invitation table
ALTER TABLE invitation ADD COLUMN inviter_id BIGINT NOT NULL;
ALTER TABLE invitation ADD CONSTRAINT fk_invitation_inviter FOREIGN KEY (inviter_id) REFERENCES users(id);
-- Add index for better query performance on invitations
CREATE INDEX idx_invitation_inviter ON invitation(inviter_id);
-- Add display_name column to users table
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);