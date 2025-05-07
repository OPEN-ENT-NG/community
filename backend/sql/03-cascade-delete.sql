-- Add ON DELETE CASCADE to membership foreign key
ALTER TABLE community.membership DROP CONSTRAINT IF EXISTS membership_community_id_fkey;
ALTER TABLE community.membership ADD CONSTRAINT membership_community_id_fkey
    FOREIGN KEY (community_id) REFERENCES community.community(id) ON DELETE CASCADE;

-- Add ON DELETE CASCADE to invitation foreign key
ALTER TABLE community.invitation DROP CONSTRAINT IF EXISTS invitation_community_id_fkey;
ALTER TABLE community.invitation ADD CONSTRAINT invitation_community_id_fkey
    FOREIGN KEY (community_id) REFERENCES community.community(id) ON DELETE CASCADE;