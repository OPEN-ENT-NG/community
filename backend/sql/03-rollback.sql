-- Remove the ON DELETE CASCADE constraints and recreate standard foreign keys

-- Rollback membership foreign key
ALTER TABLE community.membership DROP CONSTRAINT IF EXISTS fk_membership_community;
ALTER TABLE community.membership ADD CONSTRAINT fk_membership_community
    FOREIGN KEY (community_id) REFERENCES community.community(id);

-- Rollback invitation foreign key
ALTER TABLE community.invitation DROP CONSTRAINT IF EXISTS fk_invitation_community;
ALTER TABLE community.invitation ADD CONSTRAINT fk_invitation_community
    FOREIGN KEY (community_id) REFERENCES community.community(id);